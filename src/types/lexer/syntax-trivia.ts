import { TextLocation } from "../text-location.ts";
import { SyntaxKind } from "./syntax-kind.ts";

export interface SyntaxTrivia {
  kind:     SyntaxKind;
  text:     string | null;
  location: TextLocation;
}