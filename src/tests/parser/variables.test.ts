/**
 * @fileoverview Tests for the variables declarations
 * @author Hokanosekai
 * @license GPL-3.0
 * @version 0.1.0
 * @since
 * @module parser
 */

import { assertEquals, assertExists } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { Parser } from "../../compiler/parser.ts";
import { LiteralExpressionSyntax, NameExpressionSyntax, ObjectLiteralExpressionSyntax, ObjectLiteralPropertySyntax } from "../../types/ast/expressions-syntax.ts";
import { ExpressionStatementSyntax, GlobalStatementSyntax, VariableDeclarationSyntax } from "../../types/ast/statements-syntax.ts";
import { SyntaxKind } from "../../types/lexer/syntax-kind.ts";


/**
 * Parser - Constant declaration with number
 * @since 0.1.0
 * @category variables
 * @subcategory const
 * @subcategory number
 */
Deno.test({
  name: "Parser - Constant declaration with number",
  fn() {
    const parser = new Parser("const x = 1");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.ConstKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "const");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertEquals(initializer.literal.kind, SyntaxKind.NumberLiteralToken);
    assertEquals(initializer.value, 1);
    assertEquals(initializer.literal.text, "1");
  },
});


/**
 * Parser - Constant declaration with string as double quotes
 * @since 0.1.0
 * @category variables
 * @subcategory const
 * @subcategory string
 */
Deno.test({
  name: "Parser - Constant declaration with string as double quotes",
  fn() {
    const parser = new Parser("const x = \"hello\"");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.ConstKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "const");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertEquals(initializer.literal.kind, SyntaxKind.StringLiteralToken);
    assertEquals(initializer.literal.value, "hello");
    assertEquals(initializer.value, "\"hello\"");
  }
});


/**
 * Parser - Constant declaration with string as single quotes
 * @since 0.1.0
 * @category variables
 * @subcategory const
 * @subcategory string
 */
Deno.test({
  name: "Parser - Constant declaration with string as single quotes",
  fn() {
    const parser = new Parser("const x = 'hello'");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.ConstKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "const");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertEquals(initializer.literal.kind, SyntaxKind.StringLiteralToken);
    assertEquals(initializer.literal.value, "hello");
    assertEquals(initializer.value, "'hello'");
    assertEquals(initializer.literal.text, "'hello'");
  }
});


/**
 * Parser - Constant declaration with boolean true
 * @since 0.1.0
 * @category variables
 * @subcategory const
 * @subcategory boolean
 */
Deno.test({
  name: "Parser - Constant declaration with boolean true",
  fn() {
    const parser = new Parser("const x = true");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.ConstKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "const");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertEquals(initializer.literal.kind, SyntaxKind.TrueKeyword);
    assertEquals(initializer.value, true);
    assertEquals(initializer.literal.text, "true");
  }
});


/**
 * Parser - Constant declaration with boolean false
 * @since 0.1.0
 * @category variables
 * @subcategory const
 * @subcategory boolean
 */
Deno.test({
  name: "Parser - Constant declaration with boolean false",
  fn() {
    const parser = new Parser("const x = false");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.ConstKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "const");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertExists(initializer.literal);
    assertEquals(initializer.literal.kind, SyntaxKind.FalseKeyword);
    assertEquals(initializer.value, false);
    assertEquals(initializer.literal.text, "false");
  }
});


/**
 * Parser - Constant declaration with null
 * @since 0.1.0
 * @category variables
 * @subcategory const
 * @subcategory null
 */
Deno.test({
  name: "Parser - Constant declaration with null",
  fn() {
    const parser = new Parser("const x = null");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.ConstKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.NameExpression);

    assertEquals(declaration.keyword.text, "const");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as NameExpressionSyntax;

    assertExists(initializer.identifier);
    assertEquals(initializer.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(initializer.identifier.value, "null");
  }
});


/**
 * Parser - Constant declaration with object
 * @since 0.1.0
 * @category variables
 * @subcategory const
 * @subcategory object
 */
Deno.test({
  name: "Parser - Constant declaration with empty object",
  fn() {
    const parser = new Parser("const x = {}");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.ConstKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.ObjectLiteralExpression);

    assertEquals(declaration.keyword.text, "const");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as ObjectLiteralExpressionSyntax;

    assertEquals(initializer.openBrace.kind, SyntaxKind.LeftBraceToken);
    assertEquals(initializer.closeBrace.kind, SyntaxKind.RightBraceToken);

    assertEquals(initializer.openBrace.text, "{");
    assertEquals(initializer.closeBrace.text, "}");

    assertExists(initializer.properties);
    assertEquals(initializer.properties.length, 0);
  }
});


/**
 * Parser - Constant declaration with object
 * @since 0.1.0
 * @category variables
 * @subcategory const
 * @subcategory object
 */
Deno.test({
  name: "Parser - Constant declaration with object",
  fn() {
    const parser = new Parser("const x = { a: 1 }");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.ConstKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.ObjectLiteralExpression);

    assertEquals(declaration.keyword.text, "const");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as ObjectLiteralExpressionSyntax;

    assertEquals(initializer.openBrace.kind, SyntaxKind.LeftBraceToken);
    assertEquals(initializer.closeBrace.kind, SyntaxKind.RightBraceToken);

    assertEquals(initializer.openBrace.text, "{");
    assertEquals(initializer.closeBrace.text, "}");

    assertExists(initializer.properties);
    assertEquals(initializer.properties.length, 1);

    const property = initializer.properties[0] as ObjectLiteralPropertySyntax;

    assertExists(property.identifier);
    assertExists(property.colon);
    assertExists(property.statement);

    assertEquals(property.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(property.colon.kind, SyntaxKind.ColonToken);
    assertEquals(property.statement.kind, SyntaxKind.ExpressionStatement);

    assertEquals(property.identifier.text, "a");
    assertEquals(property.colon.text, ":");
    assertEquals(property.statement.kind, SyntaxKind.ExpressionStatement);

    const statement = property.statement as ExpressionStatementSyntax;

    assertExists(statement.expression);

    const expression = statement.expression as LiteralExpressionSyntax;

    assertEquals(expression.literal.kind, SyntaxKind.NumberLiteralToken);
    assertEquals(expression.literal.value, 1);
    assertEquals(expression.value, 1);
    assertEquals(expression.literal.text, "1");
  }
});


/**
 * Parser - Variable declaration without initializer
 * @since 0.1.0
 * @category variables
 * @subcategory let
 */
Deno.test({
  name: "Parser - Variable declaration without initializer",
  fn() {
    const parser = new Parser("let x");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
  }
});


/**
 * Parser - Variable declaration with number
 * @since 0.1.0
 * @category variables
 * @subcategory let
 * @subcategory number
 */
Deno.test({
  name: "Parser - Variable declaration with number",
  fn() {
    const parser = new Parser("let x = 1");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertExists(initializer.literal);
    assertEquals(initializer.literal.kind, SyntaxKind.NumberLiteralToken);
    assertEquals(initializer.literal.value, 1);
    assertEquals(initializer.value, 1);
    assertEquals(initializer.literal.text, "1");
  }
});


/**
 * Parser - Variable declaration with string as single quote
 * @since 0.1.0
 * @category variables
 * @subcategory let
 * @subcategory string
 */
Deno.test({
  name: "Parser - Variable declaration with string as single quote",
  fn() {
    const parser = new Parser("let x = 'hello'");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertExists(initializer.literal);
    assertEquals(initializer.literal.kind, SyntaxKind.StringLiteralToken);
    assertEquals(initializer.literal.value, "hello");
    assertEquals(initializer.value, "'hello'");
    assertEquals(initializer.literal.text, "'hello'");
  }
});


/**
 * Parser - Variable declaration with string as double quote
 * @since 0.1.0
 * @category variables
 * @subcategory let
 * @subcategory string
 */
Deno.test({
  name: "Parser - Variable declaration with string as double quote",
  fn() {
    const parser = new Parser('let x = "hello"');
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertExists(initializer.literal);
    assertEquals(initializer.literal.kind, SyntaxKind.StringLiteralToken);
    assertEquals(initializer.literal.value, "hello");
    assertEquals(initializer.value, '"hello"');
    assertEquals(initializer.literal.text, '"hello"');
  }
});


/**
 * Parser - Variable declaration with boolean true
 * @since 0.1.0
 * @category variables
 * @subcategory let
 * @subcategory boolean
 */
Deno.test({
  name: "Parser - Variable declaration with boolean true",
  fn() {
    const parser = new Parser("let x = true");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertExists(initializer.literal);
    assertEquals(initializer.literal.kind, SyntaxKind.TrueKeyword);
    assertEquals(initializer.value, true);
    assertEquals(initializer.literal.text, "true");
  }
});


/**
 * Parser - Variable declaration with boolean false
 * @since 0.1.0
 * @category variables
 * @subcategory let
 * @subcategory boolean
 */
Deno.test({
  name: "Parser - Variable declaration with boolean false",
  fn() {
    const parser = new Parser("let x = false");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.LiteralExpression);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as LiteralExpressionSyntax;

    assertExists(initializer.literal);
    assertEquals(initializer.literal.kind, SyntaxKind.FalseKeyword);
    assertEquals(initializer.value, false);
    assertEquals(initializer.literal.text, "false");
  }
});


/**
 * Parser - Variable declaration with null
 * @since 0.1.0
 * @category variables
 * @subcategory let
 * @subcategory null
 */
Deno.test({
  name: "Parser - Variable declaration with null",
  fn() {
    const parser = new Parser("let x = null");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.NameExpression);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as NameExpressionSyntax;

    assertExists(initializer.identifier);
    assertEquals(initializer.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(initializer.identifier.value, "null");
  }
});


/**
 * Parser - Variable declaration with empty object
 * @since 0.1.0
 * @category variables
 * @subcategory let
 * @subcategory object
 */
Deno.test({
  name: "Parser - Variable declaration with empty object",
  fn() {
    const parser = new Parser("let x = {}");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.ObjectLiteralExpression);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as ObjectLiteralExpressionSyntax;

    assertEquals(initializer.openBrace.kind, SyntaxKind.LeftBraceToken);
    assertEquals(initializer.closeBrace.kind, SyntaxKind.RightBraceToken);

    assertEquals(initializer.openBrace.text, "{");
    assertEquals(initializer.closeBrace.text, "}");

    assertExists(initializer.properties);
    assertEquals(initializer.properties.length, 0);
  }
});


/**
 * Parser - Variable declaration with object
 * @since 0.1.0
 * @category variables
 * @subcategory let
 * @subcategory object
 */
Deno.test({
  name: "Parser - Variable declaration with object",
  fn() {
    const parser = new Parser("let x = { a: 1 }");
    const ast = parser.parse();

    assertExists(ast.root);
    assertEquals(ast.root.members.length, 1);

    assertExists(ast.root.members[0]);
    assertEquals(ast.root.members[0].kind, SyntaxKind.GlobalStatement);

    const globalStatement = ast.root.members[0] as GlobalStatementSyntax;

    assertExists(globalStatement.statement);
    assertEquals(globalStatement.statement.kind, SyntaxKind.VariableDeclaration);

    const declaration = globalStatement.statement as VariableDeclarationSyntax;

    assertExists(declaration.keyword);
    assertExists(declaration.identifier);
    assertExists(declaration.equals);
    assertExists(declaration.initializer);

    assertEquals(declaration.keyword.kind, SyntaxKind.LetKeyword);
    assertEquals(declaration.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(declaration.equals.kind, SyntaxKind.EqualsToken);
    assertEquals(declaration.initializer.kind, SyntaxKind.ObjectLiteralExpression);

    assertEquals(declaration.keyword.text, "let");
    assertEquals(declaration.identifier.text, "x");
    assertEquals(declaration.equals.text, "=");

    const initializer = declaration.initializer as ObjectLiteralExpressionSyntax;

    assertEquals(initializer.openBrace.kind, SyntaxKind.LeftBraceToken);
    assertEquals(initializer.closeBrace.kind, SyntaxKind.RightBraceToken);

    assertEquals(initializer.openBrace.text, "{");
    assertEquals(initializer.closeBrace.text, "}");

    assertExists(initializer.properties);
    assertEquals(initializer.properties.length, 1);

    const property = initializer.properties[0] as ObjectLiteralPropertySyntax;

    assertExists(property.identifier);
    assertExists(property.colon);
    assertExists(property.statement);

    assertEquals(property.identifier.kind, SyntaxKind.IdentifierToken);
    assertEquals(property.colon.kind, SyntaxKind.ColonToken);
    assertEquals(property.statement.kind, SyntaxKind.ExpressionStatement);

    assertEquals(property.identifier.text, "a");
    assertEquals(property.colon.text, ":");
    assertEquals(property.statement.kind, SyntaxKind.ExpressionStatement);

    const statement = property.statement as ExpressionStatementSyntax;

    assertExists(statement.expression);

    const expression = statement.expression as LiteralExpressionSyntax;

    assertEquals(expression.literal.kind, SyntaxKind.NumberLiteralToken);
    assertEquals(expression.literal.value, 1);
    assertEquals(expression.value, 1);
    assertEquals(expression.literal.text, "1");
  }
});