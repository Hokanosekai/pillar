import { RuntimeString } from "./runtime-value.ts";

export enum CompiledKind {
  DELAY                           = "DELAY",
  DEFAULTDELAY                    = "DEFAULTDELAY",
  DEFAULT_DELAY                   = "DEFAULT_DELAY",
  STRING                          = "STRING",
  REM                             = "REM",
  REPEAT                          = "REPEAT",
  SYSRQ                           = "SYSRQ",
  ID                              = "ID",
  KEYS                            = "KEYS",

  // Other.
  SingleCharacterToken            = "SingleCharacterToken",

  // Nodes
  CompiledUnit                    = "CompilationUnit",
  CompiledCallMemberSyntax        = "CallMemberSyntax",

  // Expressions
  CompiledNameExpressionSyntax    = "NameExpressionSyntax",
  CompiledLiteralExpressionSyntax = "LiteralExpressionSyntax",

  // Literals
  CompiledStringLiteral           = "CompiledStringLiteral",
}

export const GetKindFromRuntimeValue = (value: RuntimeString): CompiledKind => {
  return CompiledKind[value.value as keyof typeof CompiledKind];
};
