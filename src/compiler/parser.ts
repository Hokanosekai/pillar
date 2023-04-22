// deno-lint-ignore-file no-explicit-any
import { CompilationUnitSyntax } from "../types/ast/compilation-unit-syntax.ts";
import { AssignmentExpressionSyntax, BinaryExpressionSyntax, CallExpressionSyntax, MemberAccessExpressionSyntax, ExpressionSyntax, FunctionExpressionSyntax, LiteralExpressionSyntax, NameExpressionSyntax, ObjectLiteralExpressionSyntax, ObjectLiteralPropertySyntax, ParenthesizedExpressionSyntax, UnaryExpressionSyntax } from "../types/ast/expressions-syntax.ts";
import { MemberSyntax,FunctionDeclarationSyntax, ImportDeclarationSyntax, ExportDeclarationSyntax } from "../types/ast/member-syntax.ts";
import { ParameterListSyntax,ParameterSyntax } from "../types/ast/parameter-syntax.ts";
import { BlockStatementSyntax, BreakStatementSyntax, ContinueStatementSyntax, ElseClauseSyntax, ExpressionStatementSyntax, ForStatementSyntax, GlobalStatementSyntax,IfStatementSyntax,ReturnStatementSyntax,StatementSyntax, VariableDeclarationSyntax, WhileStatementSyntax } from "../types/ast/statements-syntax.ts";
import { GetBinaryOperatorPrecedence, GetUnaryOperatorPrecedence, SyntaxKind } from "../types/lexer/syntax-kind.ts";
import { SyntaxNode } from "../types/lexer/syntax-node.ts";
import { SyntaxToken } from "../types/lexer/syntax-token.ts";
import { Diagnostic } from "../utils/diagnostic.ts";
import { Lexer } from "./lexer.ts";

export class Parser {
  private _lexer: Lexer;

  private _diagnostic = new Diagnostic();
  private _tokens     = new Array<SyntaxToken>();

  private _position   = 0;

  constructor(
    private _source: string,
  ) {
    this._lexer = new Lexer(this._source);
    this.init();
  }

  private init() {
    const tokens  = new Array<SyntaxToken>();
    let badTokens = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = this._lexer.lex();

      if (token.kind === SyntaxKind.UnknownToken) {
        badTokens.push(token);
        continue;
      } else {
        if (badTokens.length > 0) {
          const leadingTrivia = token.leadingTrivia;
          let index = 0;

          badTokens.forEach((badToken) => {
            badToken.trailingTrivia.forEach((trivia: any) => {
              leadingTrivia.splice(index++, 0, trivia);
            });

            const trivia = {
              kind:     SyntaxKind.SkippedTextTrivia,
              text:     badToken.text,
              location: badToken.location,
            };
            leadingTrivia.splice(index++, 0, trivia);

            badToken.trailingTrivia.forEach((trivia: any) => {
              leadingTrivia.splice(index++, 0, trivia);
            });
          });

          badTokens = new Array<SyntaxToken>();

          token = {
            kind:           token.kind,
            text:           token.text,
            value:          token.value,
            location:       token.location,
            leadingTrivia:  leadingTrivia,
            trailingTrivia: token.trailingTrivia,
          };
        }

        tokens.push(token);
      }
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    this._diagnostic.merge(this._lexer.diagnostic);
    this._tokens = tokens;
  }

  public get diagnostic() {
    return this._diagnostic;
  }

  private peek    = (offset: number): SyntaxToken => 
    this._position + offset >= this._tokens.length
      ? this._tokens[this._tokens.length - 1]
      : this._tokens[this._position + offset];
  private current = () => this.peek(0);
  private next    = () => this.peek(1);
  private advance = (offset = 1): SyntaxToken => {
    const current = this.current();
    this._position += offset;
    return current;
  };
  private match   = (expected: SyntaxKind) => 
    this.current().kind === expected 
      ? this.advance() 
      : (
          this._diagnostic.reportUnexpectedToken(this.current(), expected), 
          { 
            kind:           SyntaxKind.UnknownToken, 
            text:           null, 
            value:          null, 
            location:       this.current().location, 
            leadingTrivia:  [], 
            trailingTrivia: []
          }
        );

  private parseCompilationUnit(): CompilationUnitSyntax {
    const members   = this.parseMembers();
    const endOfFile = this.match(SyntaxKind.EndOfFileToken);

    return {
      kind:      SyntaxKind.CompilationUnit,
      members:   members,
      endOfFile: endOfFile,
    };
  }

  private parseMembers(): MemberSyntax[] {
    const members = new Array<MemberSyntax>();

    while (this.current().kind !== SyntaxKind.EndOfFileToken) {
      const startToken = this.current();
      const member     = this.parseMember();

      members.push(member);

      if (startToken === this.current()) {
        this.advance(1);
      }
    }

    return members;
  }

  private parseMember(): MemberSyntax {
    switch (this.current().kind) {
      // Import/Export
      case SyntaxKind.ImportKeyword:             return this.parseImportDeclaration();
      case SyntaxKind.ExportKeyword:             return this.parseExportDeclaration();
      // Function
      case SyntaxKind.FunctionKeyword:           return this.parseFunctionDeclaration();
      // Global
      default:                                   return this.parseGlobalStatement();
    }
  }

  private parseImportDeclaration(): ImportDeclarationSyntax {
    const importKeyword = this.match(SyntaxKind.ImportKeyword);
    const identifier    = this.parseExpression();

    return {
      kind:          SyntaxKind.ImportDeclaration,
      import:        importKeyword,
      identifier:    identifier,
    } as ImportDeclarationSyntax;
  }

  private parseExportDeclaration(): ExportDeclarationSyntax {
    const exportKeyword = this.match(SyntaxKind.ExportKeyword);
    const statement     = this.parseStatement();

    return {
      kind:          SyntaxKind.ExportDeclaration,
      export:        exportKeyword,
      statement:     statement,
    } as ExportDeclarationSyntax;
  }

  private parseFunctionDeclaration(): FunctionDeclarationSyntax {
    const functionKeyword  = this.match(SyntaxKind.FunctionKeyword);
    const identifier       = this.match(SyntaxKind.IdentifierToken);
    const openParenthesis  = this.match(SyntaxKind.LeftParenthesisToken);
    const parameterList    = this.parseParameterList();
    const closeParenthesis = this.match(SyntaxKind.RightParenthesisToken);
    const statement        = this.parseBlockStatement();

    return {
      kind:       SyntaxKind.FunctionDeclaration,
      function:   functionKeyword,
      identifier: identifier,
      openParen:  openParenthesis,
      parameters: parameterList,
      closeParen: closeParenthesis,
      body:       statement as BlockStatementSyntax,
    } as FunctionDeclarationSyntax;
  }

  private parseParameterList(): ParameterListSyntax {
    const parameters = new Array<ParameterSyntax>();
    let parseNext    = true;

    while (
      parseNext &&
      this.current().kind !== SyntaxKind.RightParenthesisToken &&
      this.current().kind !== SyntaxKind.EndOfFileToken
    ) {
      const parameter = this.parseParameter();
      parameters.push(parameter);

      if (this.current().kind === SyntaxKind.CommaToken) {
        this.advance(1);
      } else {
        parseNext = false;
      }
    }

    return {
      kind:       SyntaxKind.ParameterList,
      parameters: parameters,
    } as ParameterListSyntax;
  }

  private parseParameter(): ParameterSyntax {
    const identifier = this.match(SyntaxKind.IdentifierToken);
    //const type = this.match(SyntaxKind.IdentifierToken);

    return {
      kind:       SyntaxKind.Parameter,
      identifier: identifier,
    } as ParameterSyntax;
  }

  private parseGlobalStatement(): GlobalStatementSyntax {
    const statement = this.parseStatement();

    return {
      kind:      SyntaxKind.GlobalStatement,
      statement: statement,
    } as GlobalStatementSyntax;
  }

  private parseStatement(): StatementSyntax {
    switch (this.current().kind) {
      // Function
      case SyntaxKind.FunctionKeyword: return this.parseFunctionDeclaration();
      // Expression statements
      case SyntaxKind.IfKeyword:       return this.parseIfStatement();
      case SyntaxKind.WhileKeyword:    return this.parseWhileStatement();
      case SyntaxKind.ForKeyword:      return this.parseForStatement();
      case SyntaxKind.BreakKeyword:    return this.parseBreakStatement();
      case SyntaxKind.ContinueKeyword: return this.parseContinueStatement();
      case SyntaxKind.ReturnKeyword:   return this.parseReturnStatement();
      // Variable declarations
      case SyntaxKind.ConstKeyword:
      case SyntaxKind.LetKeyword:      return this.parseVariableDeclaration();
      // Default
      default:                         return this.parseExpressionStatement();
    }
  }

  private parseBlockStatement(): BlockStatementSyntax {
    const statements = new Array<StatementSyntax>();
    const openBrace  = this.match(SyntaxKind.LeftBraceToken);

    while (
      this.current().kind !== SyntaxKind.RightBraceToken &&
      this.current().kind !== SyntaxKind.EndOfFileToken
    ) {
      const startToken = this.current();
      const statement  = this.parseStatement();

      statements.push(statement);

      if (this.current() === startToken) {
        this.advance(1);
      }
    }

    const closeBrace = this.match(SyntaxKind.RightBraceToken);

    return {
      kind:       SyntaxKind.BlockStatement,
      openBrace:  openBrace,
      statements: statements,
      closeBrace: closeBrace,
    } as BlockStatementSyntax;
  }

  private parseIfStatement(): IfStatementSyntax {
    const ifKeyword   = this.match(SyntaxKind.IfKeyword);
    const condition   = this.parseExpression();
    const statement   = this.parseBlockStatement();
    const elseClause  = this.current().kind === SyntaxKind.ElseKeyword
      ? this.parseOptionalElseClause()
      : null;

    return {
      kind:      SyntaxKind.IfStatement,
      if:        ifKeyword,
      condition: condition,
      then:      statement,
      else:      elseClause,
    } as IfStatementSyntax;
  }

  private parseOptionalElseClause(): ElseClauseSyntax | null {
    if (this.current().kind !== SyntaxKind.ElseKeyword) {
      return null;
    }

    const elseKeyword = this.match(SyntaxKind.ElseKeyword);
    const statement   = this.parseBlockStatement();

    return {
      kind:      SyntaxKind.ElseClause,
      else:      elseKeyword,
      statement: statement,
    } as ElseClauseSyntax;
  }
  
  private parseWhileStatement(): WhileStatementSyntax {
    const whileKeyword  = this.match(SyntaxKind.WhileKeyword);
    const condition     = this.parseExpression();
    const statement     = this.parseBlockStatement();

    return {
      kind:      SyntaxKind.WhileStatement,
      while:     whileKeyword,
      condition: condition,
      statement: statement,
    } as WhileStatementSyntax;
  }

  private parseForStatement(): ForStatementSyntax {
    const forKeyword  = this.match(SyntaxKind.ForKeyword);
    const openParen   = this.match(SyntaxKind.LeftParenthesisToken);
    const identifier  = this.match(SyntaxKind.IdentifierToken);
    const equals      = this.match(SyntaxKind.EqualsToken);
    const lowerBound  = this.parseExpression();
    const toKeyword   = this.match(SyntaxKind.ToKeyword);
    const upperBound  = this.parseExpression();
    const closeParen  = this.match(SyntaxKind.RightParenthesisToken);
    const statement   = this.parseBlockStatement();

    return {
      kind:       SyntaxKind.ForStatement,
      for:        forKeyword,
      openParen:  openParen,
      identifier: identifier,
      equals:     equals,
      lowerBound: lowerBound,
      to:         toKeyword,
      upperBound: upperBound,
      closeParen: closeParen,
      statement:  statement,
    } as ForStatementSyntax;
  }

  private parseBreakStatement(): BreakStatementSyntax {
    const breakKeyword = this.match(SyntaxKind.BreakKeyword);
    return {
      kind:  SyntaxKind.BreakStatement,
      break: breakKeyword,
    } as BreakStatementSyntax;
  }

  private parseContinueStatement(): ContinueStatementSyntax {
    const continueKeyword = this.match(SyntaxKind.ContinueKeyword);
    return {
      kind:     SyntaxKind.ContinueStatement,
      continue: continueKeyword,
    } as ContinueStatementSyntax;
  }

  private parseReturnStatement(): ReturnStatementSyntax {
    const returnKeyword = this.match(SyntaxKind.ReturnKeyword);
    const expression    = this.current().kind === SyntaxKind.RightBraceToken
      ? null
      : this.parseExpression();

    return {
      kind:       SyntaxKind.ReturnStatement,
      return:     returnKeyword,
      expression: expression,
    } as ReturnStatementSyntax;
  }

  private parseVariableDeclaration(): VariableDeclarationSyntax {
    const constant    = this.current().kind === SyntaxKind.ConstKeyword;
    const keyword     = constant
      ? this.match(SyntaxKind.ConstKeyword)
      : this.match(SyntaxKind.LetKeyword);
    const identifier  = this.match(SyntaxKind.IdentifierToken);
    const equals      = this.current().kind === SyntaxKind.EqualsToken
      ? this.match(SyntaxKind.EqualsToken)
      : null;
    const initializer = equals
      ? this.parseExpression()
      : null;

    if (constant && (!initializer && !equals)) {
      this.diagnostic.reportUnexpectedConstantInitializer(identifier);
    }

    return {
      kind:        SyntaxKind.VariableDeclaration,
      constant:    constant,
      keyword:     keyword,
      identifier:  identifier,
      equals:      equals,
      initializer: initializer,
    } as VariableDeclarationSyntax;
  }

  private parseExpressionStatement(): ExpressionStatementSyntax {
    const expression = this.parseExpression();
    return {
      kind:       SyntaxKind.ExpressionStatement,
      expression: expression,
    } as ExpressionStatementSyntax;
  }

  private parseExpression(): ExpressionSyntax {
    return this.parseAssignmentExpression();
  }

  private parseAssignmentExpression(): ExpressionSyntax {
    if (this.current().kind === SyntaxKind.IdentifierToken) {
      switch (this.next().kind) {
        case SyntaxKind.EqualsToken:
        case SyntaxKind.PlusEqualsToken:
        case SyntaxKind.MinusEqualsToken:
        case SyntaxKind.StarEqualsToken:
        case SyntaxKind.SlashEqualsToken:
        case SyntaxKind.PercentEqualsToken:
        case SyntaxKind.AmpersandEqualsToken:
        case SyntaxKind.BangEqualsToken:
        case SyntaxKind.CaretEqualsToken:
        case SyntaxKind.PipeEqualsToken: {
          const identifier = this.match(SyntaxKind.IdentifierToken);
          const operator   = this.advance(1);
          const expression = this.parseExpression();

          return {
            kind:       SyntaxKind.AssignmentExpression,
            identifier: identifier,
            operator:   operator,
            expression: expression,
          } as AssignmentExpressionSyntax;
        }
      }
    }

    return this.parseBinaryExpression();
  }

  private parseBinaryExpression(parentPrecedence = 0): ExpressionSyntax {
    let left;
    const unaryOperatorPrecedence = GetUnaryOperatorPrecedence(this.current().kind);
    if (unaryOperatorPrecedence !== 0 && unaryOperatorPrecedence >= parentPrecedence) {
      const operator = this.advance(1);
      const operand  = this.parseBinaryExpression(unaryOperatorPrecedence);
      left = {
        kind:     SyntaxKind.UnaryExpression,
        operator: operator,
        operand:  operand,
      } as UnaryExpressionSyntax;
    } else {
      left = this.parsePrimaryExpression();
    }

    while (true) {
      const precedence = GetBinaryOperatorPrecedence(this.current().kind);
      if (precedence === 0 || precedence <= parentPrecedence) {
        break;
      }

      const operator = this.advance(1);
      const right    = this.parseBinaryExpression(precedence);
      left = {
        kind:     SyntaxKind.BinaryExpression,
        left:     left,
        operator: operator,
        right:    right,
      } as BinaryExpressionSyntax;
    }

    return left;
  }

  private parsePrimaryExpression(): ExpressionSyntax {
    switch (this.current().kind) {
      case SyntaxKind.LeftBraceToken:         return this.parseObjectLiteralExpression();

      case SyntaxKind.FalseKeyword:
      case SyntaxKind.TrueKeyword:             return this.parseBooleanLiteral();

      case SyntaxKind.NumberLiteralToken:      return this.parseNumberLiteral();

      case SyntaxKind.StringLiteralToken:      return this.parseStringLiteral();

      case SyntaxKind.LeftParenthesisToken:    return this.parseParenthesizedExpression();

      case SyntaxKind.IdentifierToken:
      default:                                 return this.parseMemberAccessOrCallExpression();
    }
  }

  private parseObjectLiteralExpression(): ObjectLiteralExpressionSyntax {
    const openBrace  = this.match(SyntaxKind.LeftBraceToken);
    const properties = new Array<ObjectLiteralPropertySyntax>();
    let parseNext    = true;

    while (
      parseNext &&
      this.current().kind !== SyntaxKind.RightBraceToken &&
      this.current().kind !== SyntaxKind.EndOfFileToken
    ) {
      const property = this.parseObjectLiteralProperty();
      properties.push(property);

      if (this.current().kind === SyntaxKind.CommaToken) {
        this.advance(1);
      } else {
        parseNext = false;
      }
    }

    const closeBrace = this.match(SyntaxKind.RightBraceToken);
    return {
      kind:       SyntaxKind.ObjectLiteralExpression,
      openBrace:  openBrace,
      properties: properties,
      closeBrace: closeBrace,
    } as ObjectLiteralExpressionSyntax;
  }

  private parseObjectLiteralProperty(): ObjectLiteralPropertySyntax {
    const identifier = this.match(SyntaxKind.IdentifierToken);

    if (this.current().kind === SyntaxKind.ColonToken) {
      return this.parseObjectLiteralPropertyWithColon(identifier);
    }

    return {
      kind:       SyntaxKind.ObjectLiteralProperty,
      identifier: identifier,
      colon:      undefined,
      statement:  undefined,
    } as ObjectLiteralPropertySyntax;
  }

  private parseObjectLiteralPropertyWithColon(identifier: SyntaxToken): ObjectLiteralPropertySyntax {
    const colon = this.match(SyntaxKind.ColonToken);

    if (this.current().kind === SyntaxKind.FunctionKeyword) {
      return this.parseObjectLiteralPropertyWithColonAndFunction(identifier, colon);
    }

    const statement = this.parseExpressionStatement();
    return {
      kind:       SyntaxKind.ObjectLiteralProperty,
      identifier: identifier,
      colon:      colon,
      statement:  statement,
    } as ObjectLiteralPropertySyntax;
  }

  private parseObjectLiteralPropertyWithColonAndFunction(identifier: SyntaxToken, colon: SyntaxToken): ObjectLiteralPropertySyntax {
    const fun = this.parseFunctionExpression();

    return {
      kind:       SyntaxKind.ObjectLiteralProperty,
      identifier: identifier,
      colon:      colon,
      statement:  fun,
    } as ObjectLiteralPropertySyntax;
  }

  private parseFunctionExpression(): FunctionExpressionSyntax {
    const functionKeyword  = this.match(SyntaxKind.FunctionKeyword);
    const openParenthesis  = this.match(SyntaxKind.LeftParenthesisToken);
    const parameterList    = this.parseParameterList();
    const closeParenthesis = this.match(SyntaxKind.RightParenthesisToken);
    const statement        = this.parseBlockStatement();

    return {
      kind:             SyntaxKind.FunctionExpression,
      function:         functionKeyword,
      openParen:        openParenthesis,
      parameters:       parameterList,
      closeParen:       closeParenthesis,
      body:             statement,
    } as FunctionExpressionSyntax;
  }

  private parseBooleanLiteral(): LiteralExpressionSyntax {
    const isTrue = this.current().kind === SyntaxKind.TrueKeyword
    const keyword = isTrue
      ? this.match(SyntaxKind.TrueKeyword)
      : this.match(SyntaxKind.FalseKeyword);

    return {
      kind:    SyntaxKind.LiteralExpression,
      literal: keyword,
      value:   isTrue,
    } as LiteralExpressionSyntax;
  }

  private parseNumberLiteral(): LiteralExpressionSyntax {
    const token = this.match(SyntaxKind.NumberLiteralToken);
    return {
      kind:    SyntaxKind.LiteralExpression,
      literal: token,
      value:   parseFloat(token.text as string),
    } as LiteralExpressionSyntax;
  }

  private parseStringLiteral(): LiteralExpressionSyntax {
    const token = this.match(SyntaxKind.StringLiteralToken);
    return {
      kind:    SyntaxKind.LiteralExpression,
      literal: token,
      value:   token.text,
    } as LiteralExpressionSyntax;
  }

  private parseParenthesizedExpression(): ParenthesizedExpressionSyntax {
    const openParen  = this.match(SyntaxKind.LeftParenthesisToken);
    const expression = this.parseExpression();
    const closeParen = this.match(SyntaxKind.RightParenthesisToken);

    return {
      kind:       SyntaxKind.ParenthesizedExpression,
      openParen:  openParen,
      expression: expression,
      closeParen: closeParen,
    } as ParenthesizedExpressionSyntax;
  }

  private parseMemberAccessOrCallExpression(): ExpressionSyntax {
    if (this.next().kind === SyntaxKind.LeftParenthesisToken) {
      return this.parseCallExpression();
    }

    return this.parseMemberAccessOrNameExpression();
  }

  private parseMemberAccessOrNameExpression(): ExpressionSyntax {
    if (this.next().kind === SyntaxKind.DotToken) {
      const identifier      = this.match(SyntaxKind.IdentifierToken);
      const dotToken        = this.match(SyntaxKind.DotToken);
      const expression      = this.parseMemberAccessOrCallExpression();

      return {
        kind:       SyntaxKind.MemberAccessExpression,
        identifier: identifier,
        dot:        dotToken,
        expression: expression,
      } as MemberAccessExpressionSyntax;
    }

    return this.parseNameExpression();
  }

  private parseCallExpression(): CallExpressionSyntax {
    const identifier = this.parseNameExpression();
    const openParen  = this.match(SyntaxKind.LeftParenthesisToken);
    const args       = this.parseArguments();
    const closeParen = this.match(SyntaxKind.RightParenthesisToken);

    return {
      kind:       SyntaxKind.CallExpression,
      identifier: identifier,
      openParen:  openParen,
      arguments:  args,
      closeParen: closeParen,
    } as CallExpressionSyntax;
  }

  private parseArguments(): Array<ExpressionSyntax> {
    const args    = new Array<ExpressionSyntax>();
    let parseNext = true;

    while (
      parseNext &&
      this.current().kind !== SyntaxKind.RightParenthesisToken &&
      this.current().kind !== SyntaxKind.EndOfFileToken
    ) {
      const arg = this.parseExpression();
      args.push(arg);

      if (this.current().kind === SyntaxKind.CommaToken) {
        this.advance(1);
      } else {
        parseNext = false;
      }
    }

    return args;
  }

  private parseNameExpression(): NameExpressionSyntax {
    const identifier = this.match(SyntaxKind.IdentifierToken);
    return {
      kind:       SyntaxKind.NameExpression,
      identifier: identifier,
    } as NameExpressionSyntax;
  }

  public parse(): {
    diagnostic: Diagnostic,
    root:       CompilationUnitSyntax,
  } {
    const compilationUnit = this.parseCompilationUnit();
    //this.print(compilationUnit);
    return {
      diagnostic: this.diagnostic,
      root:       compilationUnit,
    };
  }

  public print(node: SyntaxNode, indent = "", isLast = true): void {
    const marker = isLast ? '└──' : '├──';

    console.log(`${indent}${marker}${node.kind} ${(node as SyntaxToken).text || ''}`);

    indent += isLast ? '   ' : '│  ';

    switch (node.kind) {
      case SyntaxKind.CompilationUnit: {
        const compilationUnit = node as CompilationUnitSyntax;
        compilationUnit.members.forEach((member, i) => {
          this.print(member, indent, i === compilationUnit.members.length - 1);
        });
        break;
      }
      case SyntaxKind.ImportDeclaration: {
        const importDeclaration = node as ImportDeclarationSyntax;
        this.print(importDeclaration.identifier, indent, true);
        break;
      }
      case SyntaxKind.ExportDeclaration: {
        const exportDeclaration = node as ExportDeclarationSyntax;
        this.print(exportDeclaration.statement, indent, true);
        break;
      }
      case SyntaxKind.GlobalStatement: {
        const globalStatement = node as GlobalStatementSyntax;
        this.print(globalStatement.statement, indent, true);
        break;
      }
      case SyntaxKind.FunctionDeclaration: {
        const functionDeclaration = node as FunctionDeclarationSyntax;
        this.print(functionDeclaration.identifier, indent, false);
        this.print(functionDeclaration.parameters, indent, false);
        this.print(functionDeclaration.body, indent, true); 
        break;
      }
      case SyntaxKind.FunctionExpression: {
        const functionExpression = node as FunctionExpressionSyntax;
        this.print(functionExpression.parameters, indent, false);
        this.print(functionExpression.body, indent, true);
        break;
      }
      case SyntaxKind.ObjectLiteralExpression: {
        const objectLiteralExpression = node as ObjectLiteralExpressionSyntax;
        objectLiteralExpression.properties.forEach((property, i) => {
          this.print(property, indent, i === objectLiteralExpression.properties.length - 1);
        });
        break;
      }
      case SyntaxKind.ObjectLiteralProperty: {
        const objectLiteralProperty = node as ObjectLiteralPropertySyntax;
        this.print(objectLiteralProperty.identifier, indent, false);
        this.print(objectLiteralProperty.statement!, indent, true);
        break;
      }
      case SyntaxKind.ParameterList: {
        const parameterList = node as ParameterListSyntax;
        parameterList.parameters.forEach((parameter, i) => {
          this.print(parameter, indent, i === parameterList.parameters.length - 1);
        });
        break;
      }
      case SyntaxKind.Parameter: {
        const parameter = node as ParameterSyntax;
        this.print(parameter.identifier, indent, true);
        break;
      }
      case SyntaxKind.BlockStatement: {
        const blockStatement = node as BlockStatementSyntax;
        blockStatement.statements.forEach((statement, i) => {
          this.print(statement, indent, i === blockStatement.statements.length - 1);
        });
        break;
      }
      case SyntaxKind.VariableDeclaration: {
        const variableDeclaration = node as VariableDeclarationSyntax;
        this.print(variableDeclaration.identifier, indent, variableDeclaration.initializer === undefined);
        if (variableDeclaration.initializer) {
          this.print(variableDeclaration.initializer, indent, true);
        }
        break;
      }
      case SyntaxKind.ExpressionStatement: {
        const expressionStatement = node as ExpressionStatementSyntax;
        this.print(expressionStatement.expression, indent, true);
        break;
      }
      case SyntaxKind.BinaryExpression: {
        const binaryExpression = node as BinaryExpressionSyntax;
        this.print(binaryExpression.left, indent, false);
        this.print(binaryExpression.operator, indent, false);
        this.print(binaryExpression.right, indent, true);
        break;
      }
      case SyntaxKind.ParenthesizedExpression: {
        const parenthesizedExpression = node as ParenthesizedExpressionSyntax;
        this.print(parenthesizedExpression.expression, indent, true);
        break;
      }
      case SyntaxKind.CallExpression: {
        const callExpression = node as CallExpressionSyntax;
        this.print(callExpression.identifier, indent, false);
        console.log(`${indent}└──Arguments`);
        callExpression.arguments.forEach((arg, i) => {
          this.print(arg, indent + '   ', i === callExpression.arguments.length - 1);
        });
        break;
      }
      case SyntaxKind.MemberAccessExpression: {
        const callMemberExpression = node as MemberAccessExpressionSyntax;
        this.print(callMemberExpression.identifier, indent, false);
        this.print(callMemberExpression.expression, indent, true);
        break;
      }
      case SyntaxKind.IfStatement: {
        const ifStatement = node as IfStatementSyntax;
        this.print(ifStatement.condition, indent, false);
        this.print(ifStatement.then, indent, ifStatement.else === undefined);
        if (ifStatement.else) {
          this.print(ifStatement.else, indent, true);
        }
        break;
      }
      case SyntaxKind.ElseClause: {
        const elseClause = node as ElseClauseSyntax;
        this.print(elseClause.statement, indent, true);
        break;
      }
      case SyntaxKind.WhileStatement: {
        const whileStatement = node as WhileStatementSyntax;
        this.print(whileStatement.condition, indent, false);
        this.print(whileStatement.statement, indent, true);
        break;
      }
      case SyntaxKind.ForStatement: {
        const forStatement = node as ForStatementSyntax;
        this.print(forStatement.identifier, indent, false);
        break;
      }
      case SyntaxKind.ReturnStatement: {
        const returnStatement = node as ReturnStatementSyntax;
        this.print(returnStatement.expression!, indent, true);
        break;
      }
      case SyntaxKind.LiteralExpression: {
        const literalExpression = node as LiteralExpressionSyntax;
        this.print(literalExpression.literal, indent, true);
        break;
      }
      case SyntaxKind.NameExpression: {
        const nameExpression = node as NameExpressionSyntax;
        this.print(nameExpression.identifier, indent, true);
        break;
      }
      case SyntaxKind.TrueKeyword:
      case SyntaxKind.FalseKeyword:
      case SyntaxKind.NumberLiteralToken:
      case SyntaxKind.StringLiteralToken:
      case SyntaxKind.IdentifierToken: {
        console.log(`${indent}   ${(node as SyntaxToken).text}`);
        break;
      }
      case SyntaxKind.UnknownToken: {
        console.log(`${indent}   ${SyntaxKind[node.kind]} ${(node as SyntaxToken).text}`);
        break;
      }
      default: {
        console.log(`${indent}   ${SyntaxKind[node.kind]}`);
        break;
      }
    }
  }
}