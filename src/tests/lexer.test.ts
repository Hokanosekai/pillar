import { assertEquals, assertFalse, assertInstanceOf } from "https://deno.land/std/testing/asserts.ts";
import { Lexer } from "../compiler/lexer.ts";
import { SyntaxKind } from "../types/lexer/syntax-kind.ts";
import { SyntaxToken } from "../types/lexer/syntax-token.ts";

Deno.test({
  name: "Lexer - Variable Declaration",
  fn() {
    const lexer   = new Lexer("let a = 10");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.LetKeyword, "First token should be a 'let' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    assertEquals(tokens[2].kind, SyntaxKind.EqualsToken, "Third token should be an equals token");
    assertEquals(tokens[3].kind, SyntaxKind.NumberLiteralToken, "Fourth token should be a number literal");
  }
});

Deno.test({
  name: "Lexer - Variable Declaration with String",
  fn() {
    const lexer   = new Lexer("let a = \"Hello World!\"");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.LetKeyword, "First token should be a 'let' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    assertEquals(tokens[2].kind, SyntaxKind.EqualsToken, "Third token should be an equals token");
    assertEquals(tokens[3].kind, SyntaxKind.StringLiteralToken, "Fourth token should be a string literal");
  }
});

Deno.test({
  name: "Lexer - Variable Declaration with Boolean",
  fn() {
    const lexer   = new Lexer("let a = true");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.LetKeyword, "First token should be a 'let' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    assertEquals(tokens[2].kind, SyntaxKind.EqualsToken, "Third token should be an equals token");
    assertEquals(tokens[3].kind, SyntaxKind.TrueKeyword, "Fourth token should be a true keyword");
  }
});

Deno.test({
  name: "Lexer - Variable Declaration without initialization",
  fn() {
    const lexer   = new Lexer("let a");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.LetKeyword, "First token should be a 'let' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
  }
});

Deno.test({
  name: "Lexer - Variable Declaration with const",
  fn() {
    const lexer   = new Lexer("const a = 10");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.ConstKeyword, "First token should be a 'const' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    assertEquals(tokens[2].kind, SyntaxKind.EqualsToken, "Third token should be an equals token");
    assertEquals(tokens[3].kind, SyntaxKind.NumberLiteralToken, "Fourth token should be a number literal");
  }
});

Deno.test({
  name: "Lexer - Variable Declaration with const without initialization",
  fn() {
    const lexer   = new Lexer("const a");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.ConstKeyword, "First token should be a 'const' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    
    assertFalse(lexer.diagnostic.hasErrors(), "There should be a diagnostic");
  }
});