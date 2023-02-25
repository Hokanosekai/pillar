// deno-lint-ignore-file no-empty-interface
import { SyntaxKind } from "../lexer/syntax-kind.ts";
import { SyntaxNode } from "../lexer/syntax-node.ts";
import { SyntaxToken } from "../lexer/syntax-token.ts";
import { ExpressionSyntax } from "./expressions-syntax.ts";

export interface StatementSyntax extends SyntaxNode {}

export interface BlockStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.BlockStatement;
  openBrace:                     SyntaxToken;
  statements:                    Array<StatementSyntax>;
  closeBrace:                    SyntaxToken;
}

export interface ExpressionStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.ExpressionStatement;
  expression:                    ExpressionSyntax;
}

export interface BreakStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.BreakStatement;
  break:                         SyntaxToken;
}

export interface ContinueStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.ContinueStatement;
  continue:                      SyntaxToken;
}

export interface ReturnStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.ReturnStatement;
  return:                        SyntaxToken;
  expression?:                   ExpressionSyntax;
}

export interface ElseClauseSyntax extends StatementSyntax {
  kind:                          SyntaxKind.ElseClause;
  else:                          SyntaxToken;
  statement:                     StatementSyntax;
}

export interface IfStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.IfStatement;
  if:                            SyntaxToken;
  condition:                     ExpressionSyntax;
  then:                          StatementSyntax;
  else?:                         ElseClauseSyntax;
}

export interface WhileStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.WhileStatement;
  while:                         SyntaxToken;
  condition:                     ExpressionSyntax;
  statement:                     StatementSyntax;
}

export interface ForStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.ForStatement;
  for:                           SyntaxToken;
  openParen:                     SyntaxToken;
  identifier:                    SyntaxToken;
  equals:                        SyntaxToken;
  lowerBound:                    ExpressionSyntax;
  to:                            SyntaxToken;
  upperBound:                    ExpressionSyntax;
  closeParen:                    SyntaxToken;
  statement:                     StatementSyntax;
}

export interface VariableDeclarationSyntax extends StatementSyntax {
  kind:                          SyntaxKind.VariableDeclaration;
  constant:                      boolean;
  keyword:                       SyntaxToken;
  identifier:                    SyntaxToken;
  equals?:                       SyntaxToken;
  initializer?:                  ExpressionSyntax;
}

export interface GlobalStatementSyntax extends StatementSyntax {
  kind:                          SyntaxKind.GlobalStatement;
  statement:                     StatementSyntax;
}