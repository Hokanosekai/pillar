import { TextLocation } from "../text-location.ts";
import { SyntaxNode } from "./syntax-node.ts";
import { SyntaxTrivia } from "./syntax-trivia.ts";

export interface SyntaxToken extends SyntaxNode {
  text:           string | null;
  value:          string | number | boolean | null;
  location:       TextLocation;
  leadingTrivia:  Array<SyntaxTrivia>;
  trailingTrivia: Array<SyntaxTrivia>;
}
