import { SyntaxKind } from "../lexer/syntax-kind.ts";
import { SyntaxNode } from "../lexer/syntax-node.ts";
import { SyntaxToken } from "../lexer/syntax-token.ts";
import { MemberSyntax } from "./member-syntax.ts";

export interface CompilationUnitSyntax extends SyntaxNode {
  kind:                           SyntaxKind.CompilationUnit;
  members:                        Array<MemberSyntax>;
  endOfFile:                      SyntaxToken;
}