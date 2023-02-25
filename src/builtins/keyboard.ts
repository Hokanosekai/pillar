import { Environment } from "../compiler/environment.ts";
import { CompiledKind } from "../types/evaluator/compiled-kind.ts";
import { GetKeyboardKind, IsModifierKey, IsNumpadKey } from "../types/evaluator/keyboard-kind.ts";
import { RuntimeKind } from "../types/evaluator/runtime-kind.ts";
import { RuntimeObject, RuntimeString, RuntimeValue } from "../types/evaluator/runtime-value.ts";

export const KeyboardBuiltIn = {
  press: (args: RuntimeValue[], _env: Environment) => {
    const key = args.length === 1 
      ? GetKeyboardKind((args[0] as RuntimeString).value)
      : GetKeyboardKind((args[1] as RuntimeString).value);
    const modifier = args.length === 1
      ? null
      : GetKeyboardKind((args[0] as RuntimeString).value);

    if (modifier && (IsModifierKey(modifier) || IsNumpadKey(modifier))) {
      return {
        kind: CompiledKind.CompiledCallMemberSyntax,
        callee: {
          kind: CompiledKind.CompiledNameExpressionSyntax,
          name: {
            kind:  CompiledKind.KEYS,
            text:  modifier,
            value: modifier,
          },
        },
        argument: {
          kind: CompiledKind.CompiledLiteralExpressionSyntax,
          literal: {
            text:  key,
            value: key,
          },
        },
      }
    }

    return {
      kind:      CompiledKind.CompiledNameExpressionSyntax,
      name: {
        kind:  CompiledKind.KEYS,
        text:  key,
        value: key,
      },
    }
  }
}

export const Keyboard: RuntimeObject = {
  kind:       RuntimeKind.Object,
  isExported: true,
  properties: new Map([
    ["press", {
      kind:       RuntimeKind.Native,
      isExported: true,
      name:       "press",
      callback:   KeyboardBuiltIn.press,
    }],
  ]),
};
