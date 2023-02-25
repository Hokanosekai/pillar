// deno-lint-ignore-file no-empty-interface
import { SyntaxKind } from "../lexer/syntax-kind.ts";
import { SyntaxNode } from "../lexer/syntax-node.ts";
import { SyntaxToken } from "../lexer/syntax-token.ts";
import { ExpressionSyntax } from "./expressions-syntax.ts";
import { ParameterListSyntax } from "./parameter-syntax.ts";
import { BlockStatementSyntax, StatementSyntax } from "./statements-syntax.ts";

export interface MemberSyntax extends SyntaxNode {}

export interface FunctionDeclarationSyntax extends MemberSyntax {
  kind:                           SyntaxKind.FunctionDeclaration;
  function:                       SyntaxToken;
  identifier:                     SyntaxToken;
  openParen:                      SyntaxToken;
  parameters:                     ParameterListSyntax;
  closeParen:                     SyntaxToken;
  body:                           BlockStatementSyntax;
}

export interface ImportDeclarationSyntax extends MemberSyntax {
  kind:                           SyntaxKind.ImportDeclaration;
  import:                         SyntaxToken;
  identifier:                     ExpressionSyntax;
}

export interface ExportDeclarationSyntax extends MemberSyntax {
  kind:                           SyntaxKind.ExportDeclaration;
  export:                         SyntaxToken;
  statement:                      StatementSyntax;
}