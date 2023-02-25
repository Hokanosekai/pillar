export enum SyntaxKind {
  // Tokens
  // Single-character tokens.
  LeftParenthesisToken         = "LeftParenthesisToken",
  RightParenthesisToken        = "RightParenthesisToken",
  LeftBraceToken               = "LeftBraceToken",
  RightBraceToken              = "RightBraceToken",
  LeftBracketToken             = "LeftBracketToken",
  RightBracketToken            = "RightBracketToken",
  CommaToken                   = "CommaToken",
  DotToken                     = "DotToken",
  MinusToken                   = "MinusToken",
  PlusToken                    = "PlusToken",
  SemicolonToken               = "SemicolonToken",
  SlashToken                   = "SlashToken",
  StarToken                    = "StarToken",
  PercentToken                 = "PercentToken",
  CaretToken                   = "CaretToken",
  AmpersandToken               = "AmpersandToken",
  PipeToken                    = "PipeToken",
  TildeToken                   = "TildeToken",
  BangToken                    = "BangToken",
  QuestionToken                = "QuestionToken",
  ColonToken                   = "ColonToken",
  
  // One or two character tokens.
  BangEqualsToken              = "BangEqualsToken",
  EqualsEqualsToken            = "EqualsEqualsToken",
  EqualsToken                  = "EqualsToken",
  PlusPlusToken                = "PlusPlusToken",
  MinusMinusToken              = "MinusMinusToken",
  PlusEqualsToken              = "PlusEqualsToken",
  MinusEqualsToken             = "MinusEqualsToken",
  StarEqualsToken              = "StarEqualsToken",
  SlashEqualsToken             = "SlashEqualsToken",
  PercentEqualsToken           = "PercentEqualsToken",
  CaretEqualsToken             = "CaretEqualsToken",
  AmpersandEqualsToken         = "AmpersandEqualsToken",
  PipeEqualsToken              = "PipeEqualsToken",
  LessToken                    = "LessToken",
  LessEqualsToken              = "LessEqualsToken",
  GreaterToken                 = "GreaterToken",
  GreaterEqualsToken           = "GreaterEqualsToken",
  AmpersandAmpersandToken      = "AmpersandAmpersandToken",
  PipePipeToken                = "PipePipeToken",

  // Literals
  IdentifierToken              = "IdentifierToken",
  StringLiteralToken           = "StringLiteralToken",
  NumberLiteralToken           = "NumberLiteralToken",
  BooleanLiteralToken          = "BooleanLiteralToken",
  NullLiteralToken             = "NullLiteralToken",
  UndefinedLiteralToken        = "UndefinedLiteralToken",

  // Keywords
  BreakKeyword                 = "BreakKeyword",
  WhileKeyword                 = "WhileKeyword",
  ConstKeyword                 = "ConstKeyword",
  LetKeyword                   = "LetKeyword",
  IfKeyword                    = "IfKeyword",
  ElseKeyword                  = "ElseKeyword",
  ContinueKeyword              = "ContinueKeyword",
  FalseKeyword                 = "FalseKeyword",
  ForKeyword                   = "ForKeyword",
  FunctionKeyword              = "FunctionKeyword",
  ReturnKeyword                = "ReturnKeyword",
  TrueKeyword                  = "TrueKeyword",
  ToKeyword                    = "ToKeyword",
  ImportKeyword                = "ImportKeyword",
  ExportKeyword                = "ExportKeyword",

  // Nodes
  CompilationUnit              = "CompilationUnit",
  FunctionDeclaration          = "FunctionDeclaration",
  Parameter                    = "Parameter",
  ParameterList                = "ParameterList",
  ElseClause                   = "ElseClause",
  GlobalStatement              = "GlobalStatement",
  ImportDeclaration            = "ImportDeclaration",
  ExportDeclaration            = "ExportDeclaration",

  // Statements
  BlockStatement               = "BlockStatement",
  BreakStatement               = "BreakStatement",
  ContinueStatement            = "ContinueStatement",
  ExpressionStatement          = "ExpressionStatement",
  ForStatement                 = "ForStatement",
  IfStatement                  = "IfStatement",
  ReturnStatement              = "ReturnStatement",
  WhileStatement               = "WhileStatement",
  VariableDeclaration          = "VariableDeclaration",

  // Expressions
  LiteralExpression            = "LiteralExpression",
  ObjectLiteralExpression      = "ObjectLiteralExpression",
  ObjectLiteralProperty        = "ObjectLiteralProperty",
  BinaryExpression             = "BinaryExpression",
  UnaryExpression              = "UnaryExpression",
  CallExpression               = "CallExpression",
  NameExpression               = "NameExpression",
  AssignmentExpression         = "AssignmentExpression",
  CompoundAssignmentExpression = "CompoundAssignmentExpression",
  ParenthesizedExpression      = "ParenthesizedExpression",
  MemberAccessExpression       = "MemberAccessExpression",
  FunctionExpression           = "FunctionExpression",

  // Trivia
  WhitespaceTrivia             = "WhitespaceTrivia",
  BreakLineTrivia              = "BreakLineTrivia",
  SkippedTextTrivia            = "SkippedTextTrivia",
  SingleLineCommentTrivia      = "SingleLineCommentTrivia",
  MultiLineCommentTrivia       = "MultiLineCommentTrivia",

  // Other
  UnknownToken                 = "UnknownToken",

  // End of file
  EndOfFileToken               = "EndOfFileToken",
}

export const GetKeywordKind = (text: string): SyntaxKind => {
  switch (text) {
    case "break":     return SyntaxKind.BreakKeyword;
    case "while":     return SyntaxKind.WhileKeyword;
    case "const":     return SyntaxKind.ConstKeyword;
    case "let":       return SyntaxKind.LetKeyword;
    case "if":        return SyntaxKind.IfKeyword;
    case "else":      return SyntaxKind.ElseKeyword;
    case "continue":  return SyntaxKind.ContinueKeyword;
    case "false":     return SyntaxKind.FalseKeyword;
    case "for":       return SyntaxKind.ForKeyword;
    case "to":        return SyntaxKind.ToKeyword;
    case "fn":        return SyntaxKind.FunctionKeyword;
    case "return":    return SyntaxKind.ReturnKeyword;
    case "true":      return SyntaxKind.TrueKeyword;
    case "import":    return SyntaxKind.ImportKeyword;
    case "export":    return SyntaxKind.ExportKeyword;
    default:          return SyntaxKind.IdentifierToken;
  }
}

export const GetText = (kind: SyntaxKind): string  | null => {
  switch (kind) {
    // Tokens
    // Single-character tokens.
    case SyntaxKind.LeftParenthesisToken:         return "(";
    case SyntaxKind.RightParenthesisToken:        return ")";
    case SyntaxKind.LeftBraceToken:               return "{";
    case SyntaxKind.RightBraceToken:              return "}";
    case SyntaxKind.LeftBracketToken:             return "[";
    case SyntaxKind.RightBracketToken:            return "]";
    case SyntaxKind.CommaToken:                   return ",";
    case SyntaxKind.DotToken:                     return ".";
    case SyntaxKind.MinusToken:                   return "-";
    case SyntaxKind.PlusToken:                    return "+";
    case SyntaxKind.SemicolonToken:               return ";";
    case SyntaxKind.SlashToken:                   return "/";
    case SyntaxKind.StarToken:                    return "*";
    case SyntaxKind.PercentToken:                 return "%";
    case SyntaxKind.CaretToken:                   return "^";
    case SyntaxKind.AmpersandToken:               return "&";
    case SyntaxKind.PipeToken:                    return "|";
    case SyntaxKind.TildeToken:                   return "~";
    case SyntaxKind.BangToken:                    return "!";
    case SyntaxKind.QuestionToken:                return "?";
    case SyntaxKind.ColonToken:                   return ":";

    // One or two character tokens.
    case SyntaxKind.BangEqualsToken:              return "!=";
    case SyntaxKind.EqualsEqualsToken:            return "==";
    case SyntaxKind.EqualsToken:                  return "=";
    case SyntaxKind.PlusPlusToken:                return "++";
    case SyntaxKind.MinusMinusToken:              return "--";
    case SyntaxKind.PlusEqualsToken:              return "+=";
    case SyntaxKind.MinusEqualsToken:             return "-=";
    case SyntaxKind.StarEqualsToken:              return "*=";
    case SyntaxKind.SlashEqualsToken:             return "/=";
    case SyntaxKind.PercentEqualsToken:           return "%=";
    case SyntaxKind.CaretEqualsToken:             return "^=";
    case SyntaxKind.AmpersandEqualsToken:         return "&=";
    case SyntaxKind.PipeEqualsToken:              return "|=";
    case SyntaxKind.LessToken:                    return "<";
    case SyntaxKind.LessEqualsToken:              return "<=";
    case SyntaxKind.GreaterToken:                 return ">";
    case SyntaxKind.GreaterEqualsToken:           return ">=";
    case SyntaxKind.AmpersandAmpersandToken:      return "&&";
    case SyntaxKind.PipePipeToken:                return "||";

    // Keywords
    case SyntaxKind.BreakKeyword:                 return "break";
    case SyntaxKind.WhileKeyword:                 return "while";
    case SyntaxKind.ConstKeyword:                 return "const";
    case SyntaxKind.LetKeyword:                   return "let";
    case SyntaxKind.IfKeyword:                    return "if";
    case SyntaxKind.ElseKeyword:                  return "else";
    case SyntaxKind.ContinueKeyword:              return "continue";
    case SyntaxKind.FalseKeyword:                 return "false";
    case SyntaxKind.ForKeyword:                   return "for";
    case SyntaxKind.ToKeyword:                    return "to";
    case SyntaxKind.FunctionKeyword:              return "fn";
    case SyntaxKind.ReturnKeyword:                return "return";
    case SyntaxKind.TrueKeyword:                  return "true";
    case SyntaxKind.ImportKeyword:                return "import";
    case SyntaxKind.ExportKeyword:                return "export";

    default:                                      return null;
  }
}

export const GetUnaryOperatorPrecedence = (kind: SyntaxKind): number => {
  switch (kind) {
    case SyntaxKind.PlusToken:
    case SyntaxKind.MinusToken:
    case SyntaxKind.TildeToken:
    case SyntaxKind.BangToken:
      return 6;
    default:
      return 0;
  }
}

export const GetBinaryOperatorPrecedence = (kind: SyntaxKind): number => {
  switch (kind) {
    case SyntaxKind.StarToken:
    case SyntaxKind.SlashToken:
    case SyntaxKind.PercentToken:
      return 5;
    case SyntaxKind.PlusToken:
    case SyntaxKind.MinusToken:
      return 4;
    case SyntaxKind.EqualsEqualsToken:
    case SyntaxKind.BangEqualsToken:
    case SyntaxKind.LessToken:
    case SyntaxKind.LessEqualsToken:
    case SyntaxKind.GreaterToken:
    case SyntaxKind.GreaterEqualsToken:
      return 3;
    case SyntaxKind.AmpersandToken:
    case SyntaxKind.AmpersandAmpersandToken:
      return 2;
    case SyntaxKind.PipeToken:
    case SyntaxKind.PipePipeToken:
    case SyntaxKind.CaretToken:
      return 1;
    default:
      return 0;
  }
}