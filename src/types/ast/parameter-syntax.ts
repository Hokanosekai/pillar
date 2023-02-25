import { SyntaxKind } from "../lexer/syntax-kind.ts";
import { SyntaxNode } from "../lexer/syntax-node.ts";
import { SyntaxToken } from "../lexer/syntax-token.ts";

export interface ParameterSyntax extends SyntaxNode {
  kind:                           SyntaxKind.Parameter;
  identifier:                     SyntaxToken;
}

export interface ParameterListSyntax extends SyntaxNode {
  kind:                           SyntaxKind.ParameterList;
  openParen:                      SyntaxToken;
  parameters:                     Array<ParameterSyntax>;
  closeParen:                     SyntaxToken;
}