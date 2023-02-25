import { Environment } from "../../compiler/environment.ts";
import { BlockStatementSyntax } from "../ast/statements-syntax.ts";
import { CompiledNode } from "./compiled-node.ts";
import { RuntimeKind } from "./runtime-kind.ts";

export interface RuntimeValue {
  kind:                           RuntimeKind;
  isExported:                     boolean;
  isReturn?:                       boolean;
}

export interface RuntimeBreak extends RuntimeValue {
  kind:                           RuntimeKind.Break;
  value:                          null;
}

export interface RuntimeContinue extends RuntimeValue {
  kind:                           RuntimeKind.Continue;
  value:                          null;
}

export interface RuntimeReturn extends RuntimeValue {
  kind:                           RuntimeKind.Return;
  value:                          RuntimeValue;
}

export interface RuntimeString extends RuntimeValue {
  kind:                           RuntimeKind.String;
  value:                          string;
}

export interface RuntimeNumber extends RuntimeValue {
  kind:                           RuntimeKind.Number;
  value:                          number;
}

export interface RuntimeBoolean extends RuntimeValue {
  kind:                           RuntimeKind.Boolean;
  value:                          boolean;
}

export interface RuntimeNull extends RuntimeValue {
  kind:                           RuntimeKind.Null;
  value:                          null;
  isBreak?:                        boolean;
}

export interface RuntimeObject extends RuntimeValue {
  kind:                           RuntimeKind.Object;
  properties:                     Map<string, RuntimeValue>;
}

export interface RuntimeFunction extends RuntimeValue {
  kind:                           RuntimeKind.Function;
  name:                           string;
  parameters:                     Array<string>;
  body:                           BlockStatementSyntax;
  environment:                    Environment;
}

export type RuntimeCallback = (args: Array<RuntimeValue>, env: Environment) => CompiledNode;

export interface RuntimeNative extends RuntimeValue {
  kind:                           RuntimeKind.Native;
  name:                           string;
  callback:                       RuntimeCallback;
}