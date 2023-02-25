import { CompiledKind } from "../types/evaluator/compiled-kind.ts";
import { CompiledCallMemberSyntax } from "../types/evaluator/compiled-syntax.ts"
import { RuntimeKind } from "../types/evaluator/runtime-kind.ts";
import { RuntimeNumber, RuntimeObject, RuntimeString, RuntimeValue } from "../types/evaluator/runtime-value.ts";

export const ProcessBuiltIn = {
  write: (args: RuntimeValue[]) => {
    return {
      kind:       CompiledKind.CompiledCallMemberSyntax,
      callee: {
        kind:     CompiledKind.CompiledNameExpressionSyntax,
        name: {
          kind:   CompiledKind.STRING,
          text:   CompiledKind.STRING,
          value:  CompiledKind.STRING,
        },
      },
      argument: {
        kind:     CompiledKind.CompiledLiteralExpressionSyntax,
        literal: {
          kind:   CompiledKind.CompiledStringLiteral,
          text:   (args[0] as RuntimeString).value,
          value:  (args[0] as RuntimeString).value,
        }
      }
    } as CompiledCallMemberSyntax;
  },
  wait: (args: RuntimeValue[]) => {
    return {
      kind:       CompiledKind.CompiledCallMemberSyntax,
      callee: {
        kind:     CompiledKind.CompiledNameExpressionSyntax,
        name: {
          kind:   CompiledKind.DELAY,
          text:   CompiledKind.DELAY,
          value:  CompiledKind.DELAY,
        },
      },
      argument: {
        kind:     CompiledKind.CompiledLiteralExpressionSyntax,
        literal: {
          kind:   CompiledKind.CompiledStringLiteral,
          text:   `${(args[0] as RuntimeNumber).value}`,
          value:  `${(args[0] as RuntimeNumber).value}`,
        }
      }
    } as CompiledCallMemberSyntax;
  }
}

export const Process: RuntimeObject = {
  kind:       RuntimeKind.Object,
  isExported: true,
  properties: new Map([
    ["write", {
      kind:       RuntimeKind.Native,
      isExported: true,
      name:       "write",
      callback:   ProcessBuiltIn.write,
    }],
    ["wait", {
      kind:       RuntimeKind.Native,
      isExported: true,
      name:       "wait",
      callback:   ProcessBuiltIn.wait,
    }],
  ]),
}; 