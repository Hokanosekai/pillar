import { CompiledKind } from "../types/evaluator/compiled-kind.ts";
import { CompiledCallMemberSyntax, CompiledLiteralExpressionSyntax, CompiledNameExpressionSyntax, CompiledStatement, CompiledUnitSyntax } from "../types/evaluator/compiled-syntax.ts";
import { Diagnostic } from "../utils/diagnostic.ts";

export class Emitter {
  private _diagnostic = new Diagnostic();
  private _result     = new Array<string>();

  constructor(
    private _root: CompiledUnitSyntax,
  ) {}

  public get diagnostic() {
    return this._diagnostic;
  }

  public get result() {
    return this._result;
  }

  private emitGap(n = 1) {
    this._result.push(" ".repeat(n));
  }
  /**
   * Emit the source code
   * 
   * Transpile the source code into the target language
   * 
   * @example
   * Keyword.press(ENTER) -> ENTER
   * Process.wait(1000) -> DELAY 1000
   * 
   * @example Comments
   * // This is a comment -> REM This is a comment
   * /* This is a 
   * multi-line comment *\/ -> REM This is a multi-line comment
   *
   * @example Strings
   * Process.write("Hello World!") -> STRING Hello World!
   * 
   * @example For loops
   * for (i = 0 to 10) {
   *  Process.write(i)
   * } -> STRING 0
   *      STRING 1
   *      STRING 2
   *      STRING 3
   *      STRING 4
   *      STRING 5
   *      STRING 6
   *      STRING 7
   *      STRING 8
   *      STRING 9
   *
   * @example If statements
   * if (true) {
   *  Process.write("Hello World!")
   * } -> STRING Hello World!
   * 
   * @example Functions
   * fn print(y) {
   *  Process.write(y)
   * }
   * 
   * print("Hello World!") -> STRING Hello World!
   * 
   */
  public emit(root = this._root) {
    this.emitCompilationUnit(root);
  }

  private emitNewLine() {
    this.result.push(`\r\n`);
  }

  private emitCompilationUnit(node: CompiledUnitSyntax) {
    this.emitBody(node.body);
  }

  private emitBody(nodes: Array<CompiledStatement>) {
    for (const node of nodes) {
      switch (node.kind) {
        case CompiledKind.CompiledCallMemberSyntax:
          this.emitCallMember((node as CompiledCallMemberSyntax));
          break;
        case CompiledKind.CompiledNameExpressionSyntax:
          this.emitNameExpression((node as CompiledNameExpressionSyntax));
          break;
      }
      this.emitNewLine();
    }
  }

  private emitCallMember(node: CompiledCallMemberSyntax) {
    this.emitNameExpression(node.callee);
    this.emitGap();
    this.emitLiteralExpression(node.argument);
  }

  private emitNameExpression(node: CompiledNameExpressionSyntax) {
    this.result.push(node.name.text!);
  }

  private emitLiteralExpression(node: CompiledLiteralExpressionSyntax) {
    this.result.push(node.literal.text!);
  }
}