// deno-lint-ignore-file no-empty-interface
import { SyntaxKind } from "../lexer/syntax-kind.ts";
import { SyntaxNode } from "../lexer/syntax-node.ts";
import { SyntaxToken } from "../lexer/syntax-token.ts";
import { ParameterListSyntax } from "./parameter-syntax.ts";
import { BlockStatementSyntax, StatementSyntax } from "./statements-syntax.ts";

export interface ExpressionSyntax extends SyntaxNode {}

export interface BinaryExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.BinaryExpression;
  left:          ExpressionSyntax;
  operator:      SyntaxToken;
  right:         ExpressionSyntax;
}

export interface UnaryExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.UnaryExpression;
  operator:      SyntaxToken;
  operand:       ExpressionSyntax;
}

export interface AssignmentExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.AssignmentExpression;
  identifier:    SyntaxToken;
  operator:      SyntaxToken;
  expression:    ExpressionSyntax;
}

export interface CallExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.CallExpression;
  identifier:    NameExpressionSyntax;
  openParen:     SyntaxToken;
  arguments:     Array<ExpressionSyntax>;
  closeParen:    SyntaxToken;
}

export interface LiteralExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.LiteralExpression;
  literal:       SyntaxToken;
  value:         string | number | boolean | null;
}

export interface NameExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.NameExpression;
  identifier:    SyntaxToken;
}

export interface ParenthesizedExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.ParenthesizedExpression;
  openParen:     SyntaxToken;
  expression:    ExpressionSyntax;
  closeParen:    SyntaxToken;
}

export interface MemberAccessExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.MemberAccessExpression;
  identifier:    SyntaxToken;
  dot:           SyntaxToken;
  expression:    ExpressionSyntax;
}

export interface ObjectLiteralPropertySyntax extends ExpressionSyntax {
  kind:          SyntaxKind.ObjectLiteralProperty;
  identifier:    SyntaxToken;
  colon?:        SyntaxToken;
  statement?:    StatementSyntax;
}

export interface ObjectLiteralExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.ObjectLiteralExpression;
  openBrace:     SyntaxToken;
  properties:    Array<ObjectLiteralPropertySyntax>;
  closeBrace:    SyntaxToken;
}

export interface FunctionExpressionSyntax extends ExpressionSyntax {
  kind:          SyntaxKind.FunctionExpression;
  function:      SyntaxToken;
  openParen:     SyntaxToken;
  parameters:    ParameterListSyntax;
  closeParen:    SyntaxToken;
  body:          BlockStatementSyntax;
}