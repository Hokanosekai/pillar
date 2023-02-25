import { CompiledNode } from "./compiled-node.ts";

export interface CompiledToken extends CompiledNode {
  text:           string | null;
  value:          string | number | null;
}