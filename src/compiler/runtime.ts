import { BlockStatementSyntax } from "../types/ast/statements-syntax.ts";
import { RuntimeKind } from "../types/evaluator/runtime-kind.ts";
import { RuntimeBoolean, RuntimeCallback, RuntimeFunction, RuntimeNative, RuntimeNull, RuntimeNumber, RuntimeObject, RuntimeString, RuntimeValue } from "../types/evaluator/runtime-value.ts";
import { Environment } from "./environment.ts";

export class Runtime {
  public static MK_NULL(isBreak = false): RuntimeNull {
    return {
      kind:         RuntimeKind.Null,
      value:        null,
      isBreak:      isBreak,
    } as RuntimeNull;
  }

  public static MK_OBJECT(properties: Map<string, RuntimeValue>): RuntimeObject {
    return {
      kind:         RuntimeKind.Object,
      properties:   properties,
    } as RuntimeObject;
  }

  public static MK_NUMBER(value: number): RuntimeNumber {
    return {
      kind:         RuntimeKind.Number,
      value:        value,
    } as RuntimeNumber;
  }

  public static MK_STRING(value: string): RuntimeString {
    return {
      kind:         RuntimeKind.String,
      value:        value,
    } as RuntimeString;
  }

  public static MK_BOOLEAN(value: boolean): RuntimeBoolean {
    return {
      kind:         RuntimeKind.Boolean,
      value:        value,
    } as RuntimeBoolean;
  }

  public static MK_FUNCTION(name: string, parameters: Array<string>, body: BlockStatementSyntax, environment: Environment): RuntimeFunction {
    return {
      kind:         RuntimeKind.Function,
      name:         name,
      parameters:   parameters,
      body:         body,
      environment:  environment,
    } as RuntimeFunction;
  }

  public static MK_NATIVE(name: string, callback: RuntimeCallback): RuntimeNative {
    return {
      kind:         RuntimeKind.Native,
      name:         name,
      callback:     callback,
    } as RuntimeNative;
  }
}