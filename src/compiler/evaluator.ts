// deno-lint-ignore-file no-prototype-builtins
import { Keyboard } from "../builtins/keyboard.ts";
import { Keys } from "../builtins/keys.ts";
import { Process } from "../builtins/process.ts";
import { Windows } from "../builtins/windows.ts";
import { CompilationUnitSyntax } from "../types/ast/compilation-unit-syntax.ts";
import { AssignmentExpressionSyntax, BinaryExpressionSyntax, CallExpressionSyntax, ExpressionSyntax, FunctionExpressionSyntax, LiteralExpressionSyntax, MemberAccessExpressionSyntax, NameExpressionSyntax, ObjectLiteralExpressionSyntax, ObjectLiteralPropertySyntax, ParenthesizedExpressionSyntax, UnaryExpressionSyntax } from "../types/ast/expressions-syntax.ts";
import { FunctionDeclarationSyntax, ImportDeclarationSyntax } from "../types/ast/member-syntax.ts";
import { BlockStatementSyntax, BreakStatementSyntax, ContinueStatementSyntax, ElseClauseSyntax, ExpressionStatementSyntax, ForStatementSyntax, GlobalStatementSyntax, IfStatementSyntax, ReturnStatementSyntax, StatementSyntax, VariableDeclarationSyntax, WhileStatementSyntax } from "../types/ast/statements-syntax.ts";
import { BuiltInKeyword } from "../types/evaluator/builtin-keywords.ts";
import { CompiledKind } from "../types/evaluator/compiled-kind.ts";
import { CompiledSyntax, CompiledUnitSyntax } from "../types/evaluator/compiled-syntax.ts";
import { RuntimeKind } from "../types/evaluator/runtime-kind.ts";
import { RuntimeBoolean, RuntimeBreak, RuntimeFunction, RuntimeNative, RuntimeNumber, RuntimeObject, RuntimeReturn, RuntimeString, RuntimeValue } from "../types/evaluator/runtime-value.ts";
import { SyntaxKind } from "../types/lexer/syntax-kind.ts";
import { SyntaxNode } from "../types/lexer/syntax-node.ts";
import { SyntaxToken } from "../types/lexer/syntax-token.ts";
import { Diagnostic } from "../utils/diagnostic.ts";
import { Environment } from "./environment.ts";
import { Parser } from "./parser.ts";
import { Runtime } from "./runtime.ts";

export class Evaluator {
  private _result!: CompiledUnitSyntax;

  private _diagnostic  = new Diagnostic();
  private _environment = new Environment();

  constructor(
    private _root: SyntaxNode,
    environment?: Environment,
  ) {
    if (environment) {
      this._environment.merge(environment);
    }

    this._result = {
      kind:   CompiledKind.CompiledUnit,
      body:   [],
    } as CompiledUnitSyntax;
  }

  private addResult(result: CompiledSyntax) {
    this._result.body.push(result);
  }

  public get result() {
    return this._result;
  }

  public get diagnostic() {
    return this._diagnostic;
  }

  public get environment() {
    return this._environment;
  }

  private isBuiltInFunction(name: string) {
    return BuiltInKeyword.hasOwnProperty(name);
  }

  public async evaluate(node = this._root, env = this._environment): Promise<RuntimeValue> {
    let result: RuntimeValue = Runtime.MK_NULL();
    switch (node.kind) {
      case SyntaxKind.CompilationUnit:
        result = await this.evaluateCompilationUnit(node as CompilationUnitSyntax, env);
        break;
      case SyntaxKind.FunctionDeclaration:
        result = await this.evaluateFunctionDeclaration(node as FunctionDeclarationSyntax, env);
        break;
      case SyntaxKind.ImportDeclaration:
        result = await this.evaluateImportDeclaration(node as ImportDeclarationSyntax, env);
        break;
      case SyntaxKind.ExportDeclaration:
        result = await this.evaluateExportDeclaration(node as ImportDeclarationSyntax, env);
        break;
      case SyntaxKind.GlobalStatement:
        result = await this.evaluateGlobalStatement(node as GlobalStatementSyntax, env);
        break;
      default:
        this.diagnostic.reportInvalidNode(node);
    }
    return result;
  }

  private async evaluateCompilationUnit(node: CompilationUnitSyntax, env: Environment): Promise<RuntimeValue> {
    let result: RuntimeValue = Runtime.MK_NULL();
    for (const statement of node.members) {
      result = await this.evaluate(statement, env);
    }
    return result;
  }

  private evaluateFunctionDeclaration(node: FunctionDeclarationSyntax, env: Environment): RuntimeValue {
    const fn = Runtime.MK_FUNCTION(
      node.identifier.text!,
      node.parameters.parameters.map((p) => p.identifier.text!),
      node.body,
      env,
    );

    return env.declareVariable(node.identifier.text!, fn);
  }

  private async evaluateImportDeclaration(node: ImportDeclarationSyntax, env: Environment): Promise<RuntimeValue> {
    switch (node.identifier.kind) {
      case SyntaxKind.NameExpression:
        return await this.evaluateImportDeclarationName(node.identifier as NameExpressionSyntax, env);
      case SyntaxKind.LiteralExpression:
        return await this.evaluateImportDeclarationLiteral(node.identifier as LiteralExpressionSyntax, env);
      default:
        this.diagnostic.reportInvalidImportDeclaration(node);
        return Runtime.MK_NULL();
    }
  }

  private async evaluateImportDeclarationName(node: NameExpressionSyntax, _env: Environment): Promise<RuntimeValue> {
    if (!this.isBuiltInFunction(node.identifier.text!)) {
      this.diagnostic.reportInvalidImportDeclaration(node);
    }

    if (_env.hasVariable(node.identifier.text!)) {
      return _env.resolveVariable(node.identifier.text!)!;
    }

    switch (node.identifier.text) {
      case BuiltInKeyword.Process:
        return _env.declareVariable(node.identifier.text!, Process);
      case BuiltInKeyword.Keyboard:
        _env.declareVariable("Keys", Keys); // Add Keys to the environment
        return _env.declareVariable(node.identifier.text!, Keyboard);
      case BuiltInKeyword.Windows: {
        await this.evaluateImportDeclarationLibrary(node, _env);
        return _env.resolveVariable(node.identifier.text!)!;
      }
      default:
        this.diagnostic.reportInvalidImportDeclaration(node);
        return Runtime.MK_NULL();
    }
  }

  private async evaluateImportDeclarationLibrary(node: NameExpressionSyntax, _env: Environment): Promise<RuntimeValue> {
    const path    = (node.identifier.text! as string);
    console.log(`Importing ${path}`);

    let file = "";
    switch (path) {
      case BuiltInKeyword.Windows:
        file = Windows;
        break;
      default:
        this.diagnostic.reportInvalidImportDeclaration(node);
        return Runtime.MK_NULL();
    }

    const env     = _env.createChild();
    const ast     = new Parser(file).parse();
    const ev      = new Evaluator(ast.root, env); 
    const result  = await ev.evaluate(ast.root, env) as RuntimeValue;

    this.diagnostic.merge(ev.diagnostic);
    this._environment.merge(env);

    return result;
  }

  private async evaluateImportDeclarationLiteral(
    node: LiteralExpressionSyntax, 
    _env: Environment
  ): Promise<RuntimeValue> {
    const path    = (node.literal.value! as string);
    console.log(`Importing ${path}...`);
    console.log(Deno.cwd());

    if (!path.endsWith(".pill")) {
      this.diagnostic.reportInvalidImportDeclaration(node);
      return Runtime.MK_NULL();
    }

    const env     = _env.createChild();
    const file    = await Deno.readTextFile(`${Deno.cwd()}/${path}`)
    const ast     = new Parser(file).parse();
    const ev      = new Evaluator(ast.root, env); 
    const result  = await ev.evaluate(ast.root, env) as RuntimeValue;

    this.diagnostic.merge(ev.diagnostic);
    this._environment.merge(env);

    return result;
  }

  private async evaluateExportDeclaration(
    node: ImportDeclarationSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    switch (node.identifier.kind) {
      case SyntaxKind.VariableDeclaration:
        return await this.evaluateVariableDeclaration(node.identifier as VariableDeclarationSyntax, env, true);
      default:
        this.diagnostic.reportInvalidExportDeclaration(node);
        return Runtime.MK_NULL();
    }
  }

  private async evaluateGlobalStatement(
    node: GlobalStatementSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    return await this.evaluateStatement(node.statement, env);
  }

  private async evaluateStatement(
    node: StatementSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    switch (node.kind) {
      case SyntaxKind.ExpressionStatement:
        return await this.evaluateExpressionStatement(node as ExpressionStatementSyntax, env);
      case SyntaxKind.BlockStatement:
        return await this.evaluateBlockStatement(node as BlockStatementSyntax, env);
      case SyntaxKind.IfStatement:
        return await this.evaluateIfStatement(node as IfStatementSyntax, env);
      case SyntaxKind.ElseClause:
        return await this.evaluateElseClause(node as ElseClauseSyntax, env);  
      case SyntaxKind.WhileStatement:
        return await this.evaluateWhileStatement(node as WhileStatementSyntax, env);
      case SyntaxKind.ForStatement:
        return await this.evaluateForStatement(node as ForStatementSyntax, env);
      case SyntaxKind.ReturnStatement:
        return await this.evaluateReturnStatement(node as ReturnStatementSyntax, env);
      case SyntaxKind.BreakStatement:
        return await this.evaluateBreakStatement(node as BreakStatementSyntax, env);
      case SyntaxKind.ContinueStatement:
        return await this.evaluateContinueStatement(node as ContinueStatementSyntax, env);
      case SyntaxKind.VariableDeclaration:
        return await this.evaluateVariableDeclaration(node as VariableDeclarationSyntax, env);
      default:
        this.diagnostic.reportInvalidStatement(node);
        return Runtime.MK_NULL();
    }
  }

  private async evaluateBlockStatement(
    node: BlockStatementSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    let result: RuntimeValue = Runtime.MK_NULL();
    for (const statement of node.statements) {
      result = await this.evaluateStatement(statement, env);

      if (result.kind === RuntimeKind.Break)  break;
      if (result.kind === RuntimeKind.Return) break;
    }
    return (result as RuntimeReturn).value ?? result;
  }

  private async evaluateIfStatement(
    node: IfStatementSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    let result: RuntimeValue = Runtime.MK_NULL();
    const condition = await this.evaluateExpression(node.condition, env);

    if (condition.kind === RuntimeKind.Boolean && (condition as RuntimeBoolean).value) {
      result = await this.evaluateStatement(node.then, env);
    } else if (node.else) {
      result = await this.evaluateStatement(node.else, env);
    }

    return result;
  }

  private async evaluateElseClause(
    node: ElseClauseSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    return await this.evaluateStatement(node.statement, env);
  }

  private async evaluateWhileStatement(
    node: WhileStatementSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    let result: RuntimeValue = Runtime.MK_NULL();
    while (true) {
      const condition = await this.evaluateExpression(node.condition, env);
      if (condition.kind !== RuntimeKind.Boolean) {
        this.diagnostic.reportInvalidWhileStatement(node);
      }
      if (!(condition as RuntimeBoolean).value) break;

      result = await this.evaluateStatement(node.statement, env);

      if (result.kind === RuntimeKind.Break)  break;
      if (result.kind === RuntimeKind.Return) break;
    }

    return result;
  }

  private async evaluateForStatement(
    node: ForStatementSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    let result: RuntimeValue  = Runtime.MK_NULL();
    const scope               = env.createChild();
    const lowerBound          = await this.evaluateExpression(node.lowerBound, env);
    const upperBound          = await this.evaluateExpression(node.upperBound, env);

    if (lowerBound.kind !== RuntimeKind.Number || upperBound.kind !== RuntimeKind.Number) {
      this.diagnostic.reportInvalidForStatement(node);
    }

    scope.declareVariable(node.identifier.text!, lowerBound);

    while (true) {
      const value = scope.resolveVariable(node.identifier.text!)!;
      if (value.kind !== RuntimeKind.Number) this.diagnostic.reportInvalidForStatement(node);

      if ((value as RuntimeNumber).value >= (upperBound as RuntimeNumber).value) {
        break;
      }

      result = await this.evaluateStatement(node.statement, scope);
      if (result.kind === RuntimeKind.Return) break;

      scope.assignVariable(node.identifier.text!, Runtime.MK_NUMBER((value as RuntimeNumber).value + 1));
    }

    return result;
  }

  private async evaluateReturnStatement(
    node: ReturnStatementSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    return node.expression 
      ? {
          kind:   RuntimeKind.Return,
          value:  await this.evaluateExpression(node.expression, env),
        } as RuntimeReturn
      : Runtime.MK_NULL();
  }

  private evaluateBreakStatement(
    _node: BreakStatementSyntax, 
    _env: Environment
  ): RuntimeBreak {
    return {
      kind:   RuntimeKind.Break,
      value:  null,
    } as RuntimeBreak;
  }

  private evaluateContinueStatement(
    node: ContinueStatementSyntax, 
    _env: Environment
  ): RuntimeValue {
    this.diagnostic.reportNotImplemented(node);
    return Runtime.MK_NULL();
  }

  private async evaluateVariableDeclaration(
    node: VariableDeclarationSyntax, 
    env: Environment, 
    exported = false
  ): Promise<RuntimeValue> {
    let value = Runtime.MK_NULL() as RuntimeValue;

    if (env.resolveVariable(node.identifier.text!)) {
      this.diagnostic.reportVariableAlreadyDeclared(node);
      return Runtime.MK_NULL();
    }

    if (node.initializer) {
      value = await this.evaluateExpression(node.initializer, env);
    }

    if (exported) {
      return env.declareExportedVariable(node.identifier.text!, value, node.constant);
    } else {
      return env.declareVariable(node.identifier.text!, value, node.constant);
    }
  }

  private async evaluateExpressionStatement(
    node: ExpressionStatementSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    return await this.evaluateExpression(node.expression, env);
  }

  private async evaluateExpression(
    node: ExpressionSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    switch (node.kind) {
      case SyntaxKind.NameExpression:
        return await this.evaluateNameExpression((node as NameExpressionSyntax), env);
      case SyntaxKind.LiteralExpression:
        return await this.evaluateLiteralExpression((node as LiteralExpressionSyntax));
      case SyntaxKind.ObjectLiteralExpression:
        return await this.evaluateObjectLiteralExpression((node as ObjectLiteralExpressionSyntax), env);
      case SyntaxKind.CallExpression:
        return await this.evaluateCallExpression((node as CallExpressionSyntax), env);
      case SyntaxKind.BinaryExpression:
        return await this.evaluateBinaryExpression((node as BinaryExpressionSyntax), env);
      case SyntaxKind.UnaryExpression:
        return await this.evaluateUnaryExpression((node as UnaryExpressionSyntax), env);
      case SyntaxKind.AssignmentExpression:
        return await this.evaluateAssignmentExpression((node as AssignmentExpressionSyntax), env);
      case SyntaxKind.MemberAccessExpression:
        return await this.evaluateMemberAccessExpression((node as MemberAccessExpressionSyntax), env);
      case SyntaxKind.ParenthesizedExpression:
        return await this.evaluateParenthesizedExpression((node as ParenthesizedExpressionSyntax), env);
      default:
        this.diagnostic.reportInvalidExpression(node);
        return Runtime.MK_NULL();
    }
  }

  private evaluateNameExpression(
    node: NameExpressionSyntax, 
    env: Environment
  ): RuntimeValue {
    const value = env.resolveVariable(node.identifier.text!);

    if (value === undefined) {
      this.diagnostic.reportUndefinedVariable(node);
      return Runtime.MK_NULL();
    }

    return value!;
  }

  private evaluateLiteralExpression(
    node: LiteralExpressionSyntax
  ): RuntimeValue {
    switch (node.literal.kind) {
      // String
      case SyntaxKind.StringLiteralToken:
        return Runtime.MK_STRING((node.literal as SyntaxToken).value as string);
      // Number
      case SyntaxKind.NumberLiteralToken:
        return Runtime.MK_NUMBER((node.literal as SyntaxToken).value as number);
      // Boolean
      case SyntaxKind.TrueKeyword:
      case SyntaxKind.FalseKeyword:
        return Runtime.MK_BOOLEAN((node.literal as SyntaxToken).value as boolean);
      // Null
      case SyntaxKind.NullLiteralToken:
        return Runtime.MK_NULL();
      default:
        this.diagnostic.reportInvalidLiteralExpression(node);
        return Runtime.MK_NULL();
    }
  }

  private async evaluateObjectLiteralExpression(
    node: ObjectLiteralExpressionSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    const properties = await this.evaluateObjectLiteralPropertiesExpression(node.properties, env);
    return Runtime.MK_OBJECT(properties);
  }

  private async evaluateObjectLiteralPropertiesExpression(
    node: ObjectLiteralPropertySyntax[], 
    env: Environment
  ): Promise<Map<string, RuntimeValue>> {
    const properties = new Map<string, RuntimeValue>();

    for (const property of node) {
      if (properties.has(property.identifier.text!)) {
        this.diagnostic.reportDuplicateProperty(property);
      }

      if (property.statement === undefined) {
        properties.set(property.identifier.text!, Runtime.MK_NULL());
        continue;
      }

      if (property.statement.kind === SyntaxKind.FunctionExpression) {
        properties.set(property.identifier.text!, this.evaluateFunctionExpression(property.identifier.text!, property.statement as FunctionExpressionSyntax, env));
        continue;
      } else {
        const value = await this.evaluateExpression(property.statement, env);
        properties.set(property.identifier.text!, value);
      }
    }

    return properties;
  }

  private async evaluateCallExpression(
    node: CallExpressionSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    const args   = await Promise.all(node.arguments.map(arg => this.evaluateExpression(arg, env))); 
    const callee = await this.evaluateExpression(node.identifier, env);

    if (callee.kind === RuntimeKind.Native) {
      const native = callee as RuntimeNative;
      this.addResult(native.callback(args, env));
      return Runtime.MK_NULL();
    } else if (callee.kind === RuntimeKind.Function) {
      const func = callee as RuntimeFunction;
      const scope = new Environment(func.environment);

      for (let i = 0; i < func.parameters.length; i++) {
        scope.declareVariable(func.parameters[i], args[i]);
      }

      return await this.evaluateBlockStatement(func.body, scope);
    } else {
      this.diagnostic.reportInvalidCallExpression(node);
      return Runtime.MK_NULL();
    }
  }

  private async evaluateBinaryExpression(
    node: BinaryExpressionSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    const left  = await this.evaluateExpression(node.left, env);
    const right = await this.evaluateExpression(node.right, env);

    switch (node.operator.kind) {
      case SyntaxKind.PlusToken: {
        if (left.kind === RuntimeKind.String || right.kind === RuntimeKind.String) {
          return Runtime.MK_STRING((left as RuntimeString).value + (right as RuntimeString).value);
        } else if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_NUMBER((left as RuntimeNumber).value + (right as RuntimeNumber).value);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_NULL();
        }
      }
      case SyntaxKind.MinusToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_NUMBER((left as RuntimeNumber).value - (right as RuntimeNumber).value);
        }
        this.diagnostic.reportInvalidBinaryExpression(node);
        return Runtime.MK_NULL();
      }
      case SyntaxKind.StarToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_NUMBER((left as RuntimeNumber).value * (right as RuntimeNumber).value);
        }
        this.diagnostic.reportInvalidBinaryExpression(node);
        return Runtime.MK_NULL();
      }
      case SyntaxKind.SlashToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_NUMBER((left as RuntimeNumber).value / (right as RuntimeNumber).value);
        }
        this.diagnostic.reportInvalidBinaryExpression(node);
        return Runtime.MK_NULL();
      }
      case SyntaxKind.PercentToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_NUMBER((left as RuntimeNumber).value % (right as RuntimeNumber).value);
        }
        this.diagnostic.reportInvalidBinaryExpression(node);
        return Runtime.MK_NULL();
      }
      case SyntaxKind.EqualsEqualsToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_BOOLEAN((left as RuntimeNumber).value === (right as RuntimeNumber).value);
        } else if (left.kind === RuntimeKind.String && right.kind === RuntimeKind.String) {
          return Runtime.MK_BOOLEAN((left as RuntimeString).value === (right as RuntimeString).value);
        } else if (left.kind === RuntimeKind.Boolean && right.kind === RuntimeKind.Boolean) {
          return Runtime.MK_BOOLEAN((left as RuntimeBoolean).value === (right as RuntimeBoolean).value);
        } else if (left.kind === RuntimeKind.Null && right.kind === RuntimeKind.Null) {
          return Runtime.MK_BOOLEAN(true);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_BOOLEAN(false);
        }
      }
      case SyntaxKind.BangEqualsToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_BOOLEAN((left as RuntimeNumber).value !== (right as RuntimeNumber).value);
        } else if (left.kind === RuntimeKind.String && right.kind === RuntimeKind.String) {
          return Runtime.MK_BOOLEAN((left as RuntimeString).value !== (right as RuntimeString).value);
        } else if (left.kind === RuntimeKind.Boolean && right.kind === RuntimeKind.Boolean) {
          return Runtime.MK_BOOLEAN((left as RuntimeBoolean).value !== (right as RuntimeBoolean).value);
        } else if (left.kind === RuntimeKind.Null && right.kind === RuntimeKind.Null) {
          return Runtime.MK_BOOLEAN(false);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_BOOLEAN(true);
        }
      }
      case SyntaxKind.AmpersandAmpersandToken: {
        if (left.kind === RuntimeKind.Boolean && right.kind === RuntimeKind.Boolean) {
          return Runtime.MK_BOOLEAN((left as RuntimeBoolean).value && (right as RuntimeBoolean).value);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_BOOLEAN(false);
        }
      }
      case SyntaxKind.PipePipeToken: {
        if (left.kind === RuntimeKind.Boolean && right.kind === RuntimeKind.Boolean) {
          return Runtime.MK_BOOLEAN((left as RuntimeBoolean).value || (right as RuntimeBoolean).value);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_BOOLEAN(false);
        }
      }
      case SyntaxKind.LessToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {  
          return Runtime.MK_BOOLEAN((left as RuntimeNumber).value < (right as RuntimeNumber).value);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_BOOLEAN(false);
        }
      }
      case SyntaxKind.LessEqualsToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {  
          return Runtime.MK_BOOLEAN((left as RuntimeNumber).value <= (right as RuntimeNumber).value);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_BOOLEAN(false);
        }
      }
      case SyntaxKind.GreaterToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_BOOLEAN((left as RuntimeNumber).value > (right as RuntimeNumber).value);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_BOOLEAN(false);
        }
      }
      case SyntaxKind.GreaterEqualsToken: {
        if (left.kind === RuntimeKind.Number && right.kind === RuntimeKind.Number) {
          return Runtime.MK_BOOLEAN((left as RuntimeNumber).value >= (right as RuntimeNumber).value);
        } else {
          this.diagnostic.reportInvalidBinaryExpression(node);
          return Runtime.MK_BOOLEAN(false);
        } 
      }
      default: {
        this.diagnostic.reportNotImplemented(node);
        return Runtime.MK_NULL();
      }
    }
  }

  private async evaluateUnaryExpression(
    node: UnaryExpressionSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    const operand = await this.evaluateExpression(node.operand, env);

    switch(node.operator.kind) {
      case SyntaxKind.MinusToken: {
        if (operand.kind !== RuntimeKind.Number) {
          this.diagnostic.reportInvalidUnaryExpression(node);
          return Runtime.MK_NULL();
        }
        return Runtime.MK_NUMBER(-(operand as RuntimeNumber).value);
      }
      case SyntaxKind.BangToken: {
        if (operand.kind !== RuntimeKind.Boolean) {
          this.diagnostic.reportInvalidUnaryExpression(node);
          return Runtime.MK_NULL();
        }
        return Runtime.MK_BOOLEAN(!(operand as RuntimeBoolean).value);
      }
      default: {
        this.diagnostic.reportNotImplemented(node);
        return Runtime.MK_NULL();
      }
    }
  }

  private async evaluateAssignmentExpression(
    node: AssignmentExpressionSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    const name      = node.identifier.text!;
    const variable  = env.resolveVariable(name);
    const value     = await this.evaluateExpression(node.expression, env);

    if (!variable) {
      this.diagnostic.reportVariableNeverDeclared(node);
      return value;
    }

    if (env.isConstant(name)) {
      this.diagnostic.reportConstantCannotBeReAssigned(node);
      return value;
    }


    switch(node.operator.kind) {
      case SyntaxKind.AmpersandEqualsToken: {
        if (variable.kind !== RuntimeKind.Number || value.kind !== RuntimeKind.Number) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        ((variable as RuntimeNumber).value as number) &= ((value as RuntimeNumber).value as number);
        break;
      }
      case SyntaxKind.BangEqualsToken: {
        if (variable.kind !== RuntimeKind.Boolean || value.kind !== RuntimeKind.Boolean) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        ((variable as RuntimeBoolean).value as boolean) = !((value as RuntimeBoolean).value as boolean);
        break;
      }
      case SyntaxKind.PipeEqualsToken: {
        if (variable.kind !== RuntimeKind.Number || value.kind !== RuntimeKind.Number) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        ((variable as RuntimeNumber).value as number) |= ((value as RuntimeNumber).value as number);
        break;
      }
      case SyntaxKind.PlusEqualsToken: {
        if (
          (variable.kind !== RuntimeKind.Number || value.kind !== RuntimeKind.Number) &&
          (variable.kind !== RuntimeKind.String || value.kind !== RuntimeKind.String)
        ) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        if (variable.kind === RuntimeKind.Number) {
          ((variable as RuntimeNumber).value as number) += ((value as RuntimeNumber).value as number);
        } else {
          ((variable as RuntimeString).value as string) += ((value as RuntimeString).value as string);
        }

        break;
      }
      case SyntaxKind.MinusEqualsToken: {
        if (variable.kind !== RuntimeKind.Number || value.kind !== RuntimeKind.Number) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        ((variable as RuntimeNumber).value as number) -= ((value as RuntimeNumber).value as number);
        break;
      }
      case SyntaxKind.SlashEqualsToken: {
        if (variable.kind !== RuntimeKind.Number || value.kind !== RuntimeKind.Number) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        ((variable as RuntimeNumber).value as number) /= ((value as RuntimeNumber).value as number);
        break;
      }
      case SyntaxKind.StarEqualsToken: {
        if (variable.kind !== RuntimeKind.Number || value.kind !== RuntimeKind.Number) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        ((variable as RuntimeNumber).value as number) *= ((value as RuntimeNumber).value as number);
        break;
      }
      case SyntaxKind.EqualsToken: {
        if (variable.kind !== value.kind) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        switch (variable.kind) {
          case RuntimeKind.Boolean: {
            ((variable as RuntimeBoolean).value as boolean) = ((value as RuntimeBoolean).value as boolean);
            break;
          }
          case RuntimeKind.Number: {
            ((variable as RuntimeNumber).value as number) = ((value as RuntimeNumber).value as number);
            break;
          }
          case RuntimeKind.String: {
            ((variable as RuntimeString).value as string) = ((value as RuntimeString).value as string);
            break;
          }
          case RuntimeKind.Object: {
            ((variable as RuntimeObject).properties) = ((value as RuntimeObject).properties);
            break;
          }
          case RuntimeKind.Null: {
            break;
          }
          default: {
            this.diagnostic.reportInvalidAssignmentExpression(node);
            return value;
          }
        }
        break;
      }
      case SyntaxKind.CaretEqualsToken: {
        if (variable.kind !== RuntimeKind.Number || value.kind !== RuntimeKind.Number) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        ((variable as RuntimeNumber).value as number) ^= ((value as RuntimeNumber).value as number);
        break;
      }
      case SyntaxKind.PercentEqualsToken: {
        if (variable.kind !== RuntimeKind.Number || value.kind !== RuntimeKind.Number) {
          this.diagnostic.reportInvalidAssignmentExpression(node);
          return value;
        }

        ((variable as RuntimeNumber).value as number) %= ((value as RuntimeNumber).value as number);
        break;
      }
      default: {
        this.diagnostic.reportInvalidAssignmentExpression(node);
        return value;
      }
    }

    return env.assignVariable(name, variable);
  }

  private async evaluateMemberAccessExpression(
    node: MemberAccessExpressionSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    const object = env.resolveVariable(node.identifier.text!);

    if (!object || object.kind !== RuntimeKind.Object) {
      this.diagnostic.reportInvalidMemberAccessExpression(node);
      return Runtime.MK_NULL();
    }

    return await this.evaluateCallOrNameFromMemberAccessExpression(node.expression as CallExpressionSyntax, object as RuntimeObject, env);
  }

  private async evaluateCallOrNameFromMemberAccessExpression(
    node: CallExpressionSyntax | NameExpressionSyntax, 
    object: RuntimeObject, 
    env: Environment
  ): Promise<RuntimeValue> {
    if (node.kind === SyntaxKind.CallExpression) {
      return await this.evaluateCallFromMemberAccessExpression(node, object, env);
    } else {
      return await this.evaluateNameFromMemberAccessExpression(node, object, env);
    }
  }

  private async evaluateCallFromMemberAccessExpression(
    node: CallExpressionSyntax, 
    object: RuntimeObject, 
    env: Environment
  ): Promise<RuntimeValue> {
    const args    = await Promise.all(node.arguments.map((arg) => this.evaluateExpression(arg, env)));
    const callee  = this.evaluateNameFromMemberAccessExpression(node.identifier, object, env);

    if (callee.kind === RuntimeKind.Native) {
      const native = callee as RuntimeNative;
      this.addResult(native.callback(args, env));
      return Runtime.MK_NULL();
    } else if (callee.kind === RuntimeKind.Function) {
      const func  = callee as RuntimeFunction;
      const scope = new Environment(func.environment);

      for (let i = 0; i < func.parameters.length; i++) {
        scope.declareVariable(func.parameters[i], args[i]);
      }

      return await this.evaluateBlockStatement(func.body, scope);
    } else {
      this.diagnostic.reportInvalidCallExpression(node);
      return Runtime.MK_NULL();
    }
  }

  private evaluateNameFromMemberAccessExpression(
    node: NameExpressionSyntax, 
    object: RuntimeObject, 
    _env: Environment
  ): RuntimeValue {
    if (object.properties.has(node.identifier.text!)) {
      return object.properties.get(node.identifier.text!)!;
    } else {
      this.diagnostic.reportInvalidNameExpression(node);
      return Runtime.MK_NULL();
    }
  }

  private async evaluateParenthesizedExpression(
    node: ParenthesizedExpressionSyntax, 
    env: Environment
  ): Promise<RuntimeValue> {
    return await this.evaluateExpression(node.expression, env);
  }

  private evaluateFunctionExpression(
    name: string, 
    node: FunctionExpressionSyntax, 
    env: Environment
  ): RuntimeValue {
    return Runtime.MK_FUNCTION(
      name,
      node.parameters.parameters.map((p) => p.identifier.text!),
      node.body,
      env,
    );
  }
}