// deno-lint-ignore-file
import { CompiledKind } from "./compiled-kind.ts";
import { CompiledNode } from "./compiled-node.ts";
import { CompiledToken } from "./compiled-token.ts";

export interface CompiledSyntax extends CompiledNode {}

export interface CompiledStatement extends CompiledSyntax {}

export interface CompiledExpression extends CompiledSyntax {}

export interface CompiledUnitSyntax extends CompiledSyntax {
  kind:                           CompiledKind.CompiledUnit;
  body:                           Array<CompiledStatement>;
}

export interface CompiledCallMemberSyntax extends CompiledStatement {
  kind:                           CompiledKind.CompiledCallMemberSyntax;
  callee:                         CompiledNameExpressionSyntax;
  argument:                       CompiledLiteralExpressionSyntax;
}

export interface CompiledNameExpressionSyntax extends CompiledExpression {
  kind:                           CompiledKind.CompiledNameExpressionSyntax;
  name:                           CompiledToken;
}

export interface CompiledLiteralExpressionSyntax extends CompiledExpression {
  kind:                           CompiledKind.CompiledLiteralExpressionSyntax;
  literal:                        CompiledToken;
}