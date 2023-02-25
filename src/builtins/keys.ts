import { KeyboardKind } from "../types/evaluator/keyboard-kind.ts";
import { RuntimeKind } from "../types/evaluator/runtime-kind.ts";

export const Keys = {
  kind:       RuntimeKind.Object,
  isExported: true,
  properties: new Map(
    Object.entries(KeyboardKind).map(([key, value]) => {
      return [key, {
        kind:       RuntimeKind.String,
        isExported: true,
        value:      value,
      }]
    })
  ),
}