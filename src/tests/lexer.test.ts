import { assertEquals, assertFalse, assertInstanceOf } from "https://deno.land/std/testing/asserts.ts";
import { Lexer } from "../compiler/lexer.ts";
import { SyntaxKind } from "../types/lexer/syntax-kind.ts";
import { SyntaxToken } from "../types/lexer/syntax-token.ts";

/**
 * @fileoverview Lexer tests
 * @author Hokanosekai
 * @license GPL-3.0
 * @version 0.1.0
 * @since 0.1.0
 * @module lexer
 */

/**
 * Lexer - Variable Declaration
 * @since 0.1.0
 * @category variables
 */
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

/**
 * Lexer - Variable Declaration with String
 * @since 0.1.0
 * @category variables
 */
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

/**
 * Lexer - Variable Declaration with Boolean
 * @since 0.1.0
 * @category variables
 */
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

/**
 * Lexer - Variable Declaration without initialization
 * @since 0.1.0
 * @category variables
 */
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

/**
 * Lexer - Variable Declaration with const
 * @since 0.1.0
 * @category variables
 */
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

/**
 * Lexer - Variable Declaration with const without initialization
 * @since 0.1.0
 * @category variables
 */
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

/**
 * Lexer - Conditional Statement
 * @since 0.1.0
 * @category statements
 * @subcategory conditional
 * @subcategory if
 */
Deno.test({
  name: "Lexer - Conditional Statement",
  fn() {
    const lexer   = new Lexer("if (a == 10) { }");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.IfKeyword, "First token should be an 'if' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.LeftParenthesisToken, "Second token should be an open parenthesis");
    assertEquals(tokens[2].kind, SyntaxKind.IdentifierToken, "Third token should be an identifier");
    assertEquals(tokens[3].kind, SyntaxKind.EqualsEqualsToken, "Fourth token should be an equals equals token");
    assertEquals(tokens[4].kind, SyntaxKind.NumberLiteralToken, "Fifth token should be a number literal");
    assertEquals(tokens[5].kind, SyntaxKind.RightParenthesisToken, "Sixth token should be a close parenthesis");
    assertEquals(tokens[6].kind, SyntaxKind.LeftBraceToken, "Seventh token should be an open brace");
    assertEquals(tokens[7].kind, SyntaxKind.RightBraceToken, "Eighth token should be a close brace");
  }
});

/**
 * Lexer - Conditional Statement with else
 * @since 0.1.0
 * @category statements
 * @subcategory conditional
 * @subcategory else
 */
Deno.test({
  name: "Lexer - Conditional Statement with else",
  fn() {
    const lexer   = new Lexer("if (a == 10) { } else { }");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.IfKeyword, "First token should be an 'if' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.LeftParenthesisToken, "Second token should be an open parenthesis");
    assertEquals(tokens[2].kind, SyntaxKind.IdentifierToken, "Third token should be an identifier");
    assertEquals(tokens[3].kind, SyntaxKind.EqualsEqualsToken, "Fourth token should be an equals equals token");
    assertEquals(tokens[4].kind, SyntaxKind.NumberLiteralToken, "Fifth token should be a number literal");
    assertEquals(tokens[5].kind, SyntaxKind.RightParenthesisToken, "Sixth token should be a close parenthesis");
    assertEquals(tokens[6].kind, SyntaxKind.LeftBraceToken, "Seventh token should be an open brace");
    assertEquals(tokens[7].kind, SyntaxKind.RightBraceToken, "Eighth token should be a close brace");
    assertEquals(tokens[8].kind, SyntaxKind.ElseKeyword, "Ninth token should be an 'else' keyword");
    assertEquals(tokens[9].kind, SyntaxKind.LeftBraceToken, "Tenth token should be an open brace");
    assertEquals(tokens[10].kind, SyntaxKind.RightBraceToken, "Eleventh token should be a close brace");
  }
});

/**
 * Lexer - While Loop
 * @since 0.1.0
 * @category statements
 * @subcategory loops
 * @subcategory while
 */
Deno.test({
  name: "Lexer - While Loop",
  fn() {
    const lexer   = new Lexer("while (a == 10) { }");
    const tokens  = new Array<SyntaxToken>();
    
    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.WhileKeyword, "First token should be a 'while' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.LeftParenthesisToken, "Second token should be an open parenthesis");
    assertEquals(tokens[2].kind, SyntaxKind.IdentifierToken, "Third token should be an identifier");
    assertEquals(tokens[3].kind, SyntaxKind.EqualsEqualsToken, "Fourth token should be an equals equals token");
    assertEquals(tokens[4].kind, SyntaxKind.NumberLiteralToken, "Fifth token should be a number literal");
    assertEquals(tokens[5].kind, SyntaxKind.RightParenthesisToken, "Sixth token should be a close parenthesis");
    assertEquals(tokens[6].kind, SyntaxKind.LeftBraceToken, "Seventh token should be an open brace");
    assertEquals(tokens[7].kind, SyntaxKind.RightBraceToken, "Eighth token should be a close brace");
  }
});

/**
 * Lexer - For Loop
 * @since 0.1.0
 * @category statements
 * @subcategory loops
 * @subcategory for
 */
Deno.test({
  name: "Lexer - For Loop",
  fn() {
    const lexer   = new Lexer("for (i = 0 to 10) { }");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.ForKeyword, "First token should be a 'for' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.LeftParenthesisToken, "Second token should be an open parenthesis");
    assertEquals(tokens[2].kind, SyntaxKind.IdentifierToken, "Third token should be an identifier");
    assertEquals(tokens[3].kind, SyntaxKind.EqualsToken, "Fourth token should be an equals token");
    assertEquals(tokens[4].kind, SyntaxKind.NumberLiteralToken, "Fifth token should be a number literal");
    assertEquals(tokens[5].kind, SyntaxKind.ToKeyword, "Sixth token should be a 'to' keyword");
    assertEquals(tokens[6].kind, SyntaxKind.NumberLiteralToken, "Seventh token should be a number literal");
    assertEquals(tokens[7].kind, SyntaxKind.RightParenthesisToken, "Eighth token should be a close parenthesis");
    assertEquals(tokens[8].kind, SyntaxKind.LeftBraceToken, "Ninth token should be an open brace");
    assertEquals(tokens[9].kind, SyntaxKind.RightBraceToken, "Tenth token should be a close brace");
  }
});


/**
 * Lexer - For Loop with step
 * @since 0.1.0
 * @category statements
 * @subcategory loops
 * @subcategory for
 * @todo Implement step
 */
Deno.test({
  name: "Lexer - For Loop with step",
  fn() {
    const lexer   = new Lexer("for (i = 0 to 10 step 2) { }");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.ForKeyword, "First token should be a 'for' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.LeftParenthesisToken, "Second token should be an open parenthesis");
    assertEquals(tokens[2].kind, SyntaxKind.IdentifierToken, "Third token should be an identifier");
    assertEquals(tokens[3].kind, SyntaxKind.EqualsToken, "Fourth token should be an equals token");
    assertEquals(tokens[4].kind, SyntaxKind.NumberLiteralToken, "Fifth token should be a number literal");
    assertEquals(tokens[5].kind, SyntaxKind.ToKeyword, "Sixth token should be a 'to' keyword");
    assertEquals(tokens[6].kind, SyntaxKind.NumberLiteralToken, "Seventh token should be a number literal");
    //assertEquals(tokens[7].kind, SyntaxKind.StepKeyword, "Eighth token should be a 'step' keyword");
    assertEquals(tokens[8].kind, SyntaxKind.NumberLiteralToken, "Ninth token should be a number literal");
    assertEquals(tokens[9].kind, SyntaxKind.RightParenthesisToken, "Tenth token should be a close parenthesis");
    assertEquals(tokens[10].kind, SyntaxKind.LeftBraceToken, "Eleventh token should be an open brace");
    assertEquals(tokens[11].kind, SyntaxKind.RightBraceToken, "Twelfth token should be a close brace");
  }
});

/**
 * Lexer - Function Declaration
 * @since 0.1.0
 * @category statements
 * @subcategory functions
 */
Deno.test({
  name: "Lexer - Function Declaration",
  fn() {
    const lexer   = new Lexer("fn add(a, b) { }");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);
    
    assertEquals(tokens[0].kind, SyntaxKind.FunctionKeyword, "First token should be a 'fn' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    assertEquals(tokens[2].kind, SyntaxKind.LeftParenthesisToken, "Third token should be an open parenthesis");
    assertEquals(tokens[3].kind, SyntaxKind.IdentifierToken, "Fourth token should be an identifier");
    assertEquals(tokens[4].kind, SyntaxKind.CommaToken, "Fifth token should be a comma");
    assertEquals(tokens[5].kind, SyntaxKind.IdentifierToken, "Sixth token should be an identifier");
    assertEquals(tokens[6].kind, SyntaxKind.RightParenthesisToken, "Seventh token should be a close parenthesis");
    assertEquals(tokens[7].kind, SyntaxKind.LeftBraceToken, "Eighth token should be an open brace");
    assertEquals(tokens[8].kind, SyntaxKind.RightBraceToken, "Ninth token should be a close brace");
  }
});

/**
 * Lexer - Function Declaration withou parameters
 * @since 0.1.0
 * @category statements
 * @subcategory functions
 */
Deno.test({
  name: "Lexer - Function Declaration without parameters",
  fn() {
    const lexer   = new Lexer("fn add() { }");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);
    
    assertEquals(tokens[0].kind, SyntaxKind.FunctionKeyword, "First token should be a 'fn' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    assertEquals(tokens[2].kind, SyntaxKind.LeftParenthesisToken, "Third token should be an open parenthesis");
    assertEquals(tokens[3].kind, SyntaxKind.RightParenthesisToken, "Fourth token should be a close parenthesis");
    assertEquals(tokens[4].kind, SyntaxKind.LeftBraceToken, "Fifth token should be an open brace");
    assertEquals(tokens[5].kind, SyntaxKind.RightBraceToken, "Sixth token should be a close brace");
  }
});

/**
 * Lexer - Import Statement from built-in module
 * @since 0.1.0
 * @category statements
 * @subcategory imports
 * @subcategory built-in
 */
Deno.test({
  name: "Lexer - Import Statement from built-in module",
  fn() {
    const lexer   = new Lexer("import Process");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.ImportKeyword, "First token should be an 'import' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
  }
});

/**
 * Lexer - Import Statement from local module
 * @since 0.1.0
 * @category statements
 * @subcategory imports
 * @subcategory local
 */
Deno.test({
  name: "Lexer - Import Statement from local module",
  fn() {
    const lexer   = new Lexer("import './mod.pill'");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);
    
    assertEquals(tokens[0].kind, SyntaxKind.ImportKeyword, "First token should be an 'import' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.StringLiteralToken, "Second token should be a string literal");
  }
});

/**
 * Lexer - Export Statement Declaration function
 * @since 0.1.0
 * @category statements
 * @subcategory exports
 */
Deno.test({
  name: "Lexer - Export Statement Declaration function",
  fn() {
    const lexer   = new Lexer("export fn add(a, b) { }");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.ExportKeyword, "First token should be an 'export' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.FunctionKeyword, "Second token should be a 'fn' keyword");
    assertEquals(tokens[2].kind, SyntaxKind.IdentifierToken, "Third token should be an identifier");
    assertEquals(tokens[3].kind, SyntaxKind.LeftParenthesisToken, "Fourth token should be an open parenthesis");
    assertEquals(tokens[4].kind, SyntaxKind.IdentifierToken, "Fifth token should be an identifier");
    assertEquals(tokens[5].kind, SyntaxKind.CommaToken, "Sixth token should be a comma");
    assertEquals(tokens[6].kind, SyntaxKind.IdentifierToken, "Seventh token should be an identifier");
    assertEquals(tokens[7].kind, SyntaxKind.RightParenthesisToken, "Eighth token should be a close parenthesis");
    assertEquals(tokens[8].kind, SyntaxKind.LeftBraceToken, "Ninth token should be an open brace");
    assertEquals(tokens[9].kind, SyntaxKind.RightBraceToken, "Tenth token should be a close brace");
  }
});

/**
 * Lexer - Export Statement Declaration variable
 * @since 0.1.0
 * @category statements
 * @subcategory exports
 */
Deno.test({
  name: "Lexer - Export Statement Declaration variable",
  fn() {
    const lexer   = new Lexer("export let a = 10");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();
      
      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.ExportKeyword, "First token should be an 'export' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.LetKeyword, "Second token should be a 'let' keyword");
    assertEquals(tokens[2].kind, SyntaxKind.IdentifierToken, "Third token should be an identifier");
    assertEquals(tokens[3].kind, SyntaxKind.EqualsToken, "Fourth token should be an equals sign");
    assertEquals(tokens[4].kind, SyntaxKind.NumberLiteralToken, "Fifth token should be a number");
  }
});

/**
 * Lexer - Export Statement Declaration constant
 * @since 0.1.0
 * @category statements
 * @subcategory exports
 */
Deno.test({
  name: "Lexer - Export Statement Declaration constant",
  fn() {
    const lexer   = new Lexer("export const a = 10");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.ExportKeyword, "First token should be an 'export' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.ConstKeyword, "Second token should be a 'const' keyword");
    assertEquals(tokens[2].kind, SyntaxKind.IdentifierToken, "Third token should be an identifier");
    assertEquals(tokens[3].kind, SyntaxKind.EqualsToken, "Fourth token should be an equals sign");
    assertEquals(tokens[4].kind, SyntaxKind.NumberLiteralToken, "Fifth token should be a number");
  }
});

/**
 * Lexer - Object Literal Declaration
 * @since 0.1.0
 * @category statements
 * @subcategory literals
 * @subcategory objects
 */
Deno.test({
  name: "Lexer - Object Literal Declaration",
  fn() {
    const lexer   = new Lexer("let a = { }");
    const tokens  = new Array<SyntaxToken>();

    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.LetKeyword, "First token should be a 'let' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    assertEquals(tokens[2].kind, SyntaxKind.EqualsToken, "Third token should be an equals sign");
    assertEquals(tokens[3].kind, SyntaxKind.LeftBraceToken, "Fourth token should be an open brace");
    assertEquals(tokens[4].kind, SyntaxKind.RightBraceToken, "Fifth token should be a close brace");
  }
});

/**
 * Lexer - Object Literal Declaration with properties
 * @since 0.1.0
 * @category statements
 * @subcategory literals
 * @subcategory objects
 */
Deno.test({
  name: "Lexer - Object Literal Declaration with properties",
  fn() {
    const lexer   = new Lexer("let a = { a: 10, b: 20 }");
    const tokens  = new Array<SyntaxToken>();
    
    let token: SyntaxToken;
    do {
      token = lexer.lex();

      tokens.push(token);
    } while (token.kind !== SyntaxKind.EndOfFileToken);

    assertEquals(tokens[0].kind, SyntaxKind.LetKeyword, "First token should be a 'let' keyword");
    assertEquals(tokens[1].kind, SyntaxKind.IdentifierToken, "Second token should be an identifier");
    assertEquals(tokens[2].kind, SyntaxKind.EqualsToken, "Third token should be an equals sign");
    assertEquals(tokens[3].kind, SyntaxKind.LeftBraceToken, "Fourth token should be an open brace");
    assertEquals(tokens[4].kind, SyntaxKind.IdentifierToken, "Fifth token should be an identifier");
    assertEquals(tokens[5].kind, SyntaxKind.ColonToken, "Sixth token should be a colon");
    assertEquals(tokens[6].kind, SyntaxKind.NumberLiteralToken, "Seventh token should be a number");
    assertEquals(tokens[7].kind, SyntaxKind.CommaToken, "Eighth token should be a comma");
    assertEquals(tokens[8].kind, SyntaxKind.IdentifierToken, "Ninth token should be an identifier");
    assertEquals(tokens[9].kind, SyntaxKind.ColonToken, "Tenth token should be a colon");
    assertEquals(tokens[10].kind, SyntaxKind.NumberLiteralToken, "Eleventh token should be a number");
    assertEquals(tokens[11].kind, SyntaxKind.RightBraceToken, "Twelfth token should be a close brace");
  }
});