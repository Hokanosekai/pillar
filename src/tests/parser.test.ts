/**
 * @fileoverview Tests for the parser
 * @author Hokanosekai
 * @license GPL-3.0
 * @version 0.1.0
 * @since
 * @module parser
 */

import { assertEquals, assertExists } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { Parser } from "../compiler/parser.ts";
import { SyntaxKind } from "../types/lexer/syntax-kind.ts";

/**
 * Parser - Empty test
 * @since 0.1.0
 * @category default
 */
Deno.test({
  name: "Parser - Empty test",
  fn() {
    const parser = new Parser("");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.kind, SyntaxKind.CompilationUnit);

    assertEquals(ast.root.members.length, 0);

    assertExists(ast.root.endOfFile);
    assertEquals(ast.root.endOfFile.kind, SyntaxKind.EndOfFileToken);
  },
});