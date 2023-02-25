import { AssignmentExpressionSyntax, BinaryExpressionSyntax, CallExpressionSyntax, MemberAccessExpressionSyntax, NameExpressionSyntax, ObjectLiteralExpressionSyntax, ObjectLiteralPropertySyntax } from "../types/ast/expressions-syntax.ts";
import { ForStatementSyntax, WhileStatementSyntax } from "../types/ast/statements-syntax.ts";
import { SyntaxKind } from "../types/lexer/syntax-kind.ts";
import { SyntaxNode } from "../types/lexer/syntax-node.ts";
import { SyntaxToken } from "../types/lexer/syntax-token.ts";
import { TextLocation } from "../types/text-location.ts";
import { DiagnosticMessage, DiagnosticType } from "./diagnostic-message.ts";

export class Diagnostic {
  private _messages = new Array<DiagnosticMessage>();

  private add(message: DiagnosticMessage) {
    this._messages.push(message);
  }

  public length() {
    return this._messages.length;
  }

  public merge(diagnostic: Diagnostic) {
    this._messages.push(...diagnostic._messages);
  }

  public hasErrors() {
    return this._messages.some((message) => message.type === DiagnosticType.Error);
  }

  public print() {
    for (const message of this._messages) {
      message.print();
    }
  }

  private expressionToString(node: SyntaxNode): string {
    switch (node.kind) {
      case SyntaxKind.BinaryExpression:
        return this.expressionToString((node as BinaryExpressionSyntax).left) + " " + (node as BinaryExpressionSyntax).operator.text + " " + this.expressionToString((node as BinaryExpressionSyntax).right);
      case SyntaxKind.NameExpression:
        return (node as NameExpressionSyntax).identifier.text!;
      case SyntaxKind.MemberAccessExpression:
        return this.expressionToString((node as MemberAccessExpressionSyntax).identifier) + "." + this.expressionToString((node as MemberAccessExpressionSyntax).expression);
      case SyntaxKind.LiteralExpression:
        return (node as SyntaxToken).value! as string;
      case SyntaxKind.AssignmentExpression:
        return this.expressionToString((node as AssignmentExpressionSyntax).identifier) + " " + (node as AssignmentExpressionSyntax).operator.text + " " + this.expressionToString((node as AssignmentExpressionSyntax).expression);
      case SyntaxKind.IdentifierToken:
        return (node as SyntaxToken).text!;
      case SyntaxKind.CallExpression:
        return this.expressionToString((node as CallExpressionSyntax).identifier) + "(" + (node as CallExpressionSyntax).arguments.map(arg => this.expressionToString(arg)) + ")";
      case SyntaxKind.ObjectLiteralExpression:
        return "{" + (node as ObjectLiteralExpressionSyntax).properties.map(prop => this.expressionToString(prop) + "\n") as string + "}";
      case SyntaxKind.ObjectLiteralProperty:
        return "\t" + (node as ObjectLiteralPropertySyntax).identifier.text + ": " + "[]";
      default:
        return node.kind;
    }
  }

  public reportError(location: TextLocation, message: string) {
    this.add(DiagnosticMessage.error(location, message));
  }

  public reportWarning(location: TextLocation, message: string) {
    this.add(DiagnosticMessage.warning(location, message));
  }

  public reportInfo(location: TextLocation, message: string) {
    this.add(DiagnosticMessage.info(location, message));
  }

  public reportNotImplemented(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Not implemented: ${node.kind}.`);
  }

  public reportInvalidNumber(location: TextLocation) {
    this.reportError(location, `The number ${location.text} is invalid.`);
  }

  public reportUnterminatedString(location: TextLocation) {
    this.reportError(location, `Unterminated string literal.`);
  }

  public reportBadCharacter(location: TextLocation) {
    this.reportError(location, `Invalid character input: '${location.text}'`);
  }

  public reportUnterminatedMultiLineComment(location: TextLocation) {
    this.reportError(location, `Unterminated multi-line comment.`);
  }

  public reportUnexpectedToken(node: SyntaxToken, expected: SyntaxKind) {
    this.reportError(node.location, `Unexpected token '${node.text}', expected '${expected}'.`);
  }

  public reportUnexpectedConstantInitializer(node: SyntaxToken) {
    this.reportError(node.location, `Unexpected constant initializer '${node.text}'.`);
  }

  public reportInvalidNode(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Must be a CompilationUnitSyntax, not a ${node.kind}.`);
  }

  public reportInvalidImportDeclaration(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Must be an NameExpression or an LiteralExpression, not a ${node.kind}.`);
  }

  public reportInvalidStatement(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Invalid statement '${node.kind}'.`);
  }

  public reportInvalidExpression(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Invalid expression '${node.kind}'.`);
  }

  public reportInvalidExportDeclaration(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Invalid export declaration '${node.kind}'.`);
  }

  public reportInvalidImportDeclarationSpecifier(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Invalid import declaration specifier '${(node as SyntaxToken).text}'.`);
  }

  public reportInvalidLiteralExpression(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Invalid literal expression '${(node as SyntaxToken).text}'.`);
  }

  public reportInvalidMemberAccessExpression(node: MemberAccessExpressionSyntax) {
    this.reportError(node.identifier.location, `Invalid member access expression '${this.expressionToString(node)}'.`);
  }

  public reportInvalidNameExpression(node: NameExpressionSyntax) {
    this.reportError(node.identifier.location, `Invalid name expression '${node.identifier.text}'.`);
  }

  public reportUndefinedVariable(node: NameExpressionSyntax) {
    this.reportError(node.identifier.location, `Undefined variable '${node.identifier.text}'.`);
  }

  public reportInvalidCallExpression(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Invalid call expression '${(node as SyntaxToken).text}'.`);
  }

  public reportInvalidIfStatement(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Invalid if statement '${(node as SyntaxToken).text}'.`);
  }

  public reportVariableAlreadyDeclared(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Variable '${(node as SyntaxToken).text}' already declared.`);
  }

  public reportInvalidAssignmentExpression(node: AssignmentExpressionSyntax) {
    this.reportError(node.identifier.location, `Invalid assignment expression '${this.expressionToString(node)}'.`);
  }

  public reportConstantCannotBeReAssigned(node: AssignmentExpressionSyntax) {
    this.reportError(node.identifier.location, `Constant '${node.identifier.text}' cannot be reassigned.`);
  }

  public reportVariableNeverDeclared(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Variable '${(node as SyntaxToken).text}' never declared.`);
  }

  public reportInvalidBinaryExpression(node: BinaryExpressionSyntax) {
    this.reportError(node.operator.location, `Invalid binary expression '${this.expressionToString(node)}'.`);
  }

  public reportInvalidUnaryExpression(node: SyntaxNode) {
    this.reportError((node as SyntaxToken).location, `Invalid unary expression '${(node as SyntaxToken).text}'.`);
  }

  public reportInvalidForStatement(node: ForStatementSyntax) {
    this.reportError(node.identifier.location, `Invalid for statement '${node.identifier.text}'.`);
  }

  public reportInvalidWhileStatement(node: WhileStatementSyntax) {
    this.reportError(node.while.location, `Invalid while statement.`);
  }

  public reportDuplicateProperty(node: ObjectLiteralPropertySyntax) {
    this.reportError(node.identifier.location, `Duplicate property '${node.identifier.text}'.`);
  }
}
