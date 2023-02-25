import { GetKeywordKind, GetText, SyntaxKind } from "../types/lexer/syntax-kind.ts";
import { SyntaxToken } from "../types/lexer/syntax-token.ts";
import { SyntaxTrivia } from "../types/lexer/syntax-trivia.ts";
import { TextLocation } from "../types/text-location.ts";
import { Diagnostic } from "../utils/diagnostic.ts";

export class Lexer {
  public _diagnostics                    = new Diagnostic();
  public _trivia                         = new Array<SyntaxTrivia>();

  private _column                        = 0;
  private _position                      = 0;
  private _start                         = 0;
  private _line                          = 0;
  private _kind                          = SyntaxKind.UnknownToken;
  private _value: string | number | null = null;

  constructor(
    private _source: string,
  ) {}

  private peek    = (offset: number): string => 
    this._position + offset >= this._source.length
      ? "\0"
      : this._source[this._position + offset];
  private current = () => this.peek(0);
  private next    = () => this.peek(1);
  private length  = (start: number) => this._position - start;
  private column  = () => this.length(this._start) > 1? this._column - this.length(this._start): this._column;
  private advance = (offset = 1): string => {
    this._position += offset;
    this._column   += offset;
    return this.current();
  }

  public get diagnostic() {
    return this._diagnostics;
  }

  private currentTextLocation(start: number): TextLocation {
    return {
      start:  start,
      end:    this._position,
      text:   this._source.substring(start, this._position),
      line:   this._line,
      column: this._column - 1,
      length: this.length(start),
    }
  }

  public lex(): SyntaxToken {

    this.readTrivia(true);

    const leadingTrivia    = this._trivia;
    const tokenStart       = this._position;

    this.readToken();

    const tokenKind        = this._kind;
    const tokenValue       = this._value;
    const tokenEnd         = this._position;

    this.readTrivia(false);

    const trailingTrivia   = this._trivia;
    const tokenText        = GetText(tokenKind) === null
      ? this._source.substring(tokenStart, tokenEnd)
      : GetText(tokenKind);

    return {
      kind:           tokenKind,
      value:          tokenValue,
      text:           tokenText,
      location:       this.currentTextLocation(tokenStart),
      leadingTrivia:  leadingTrivia,
      trailingTrivia: trailingTrivia,
    };
  }

  private readTrivia(leading: boolean): void {
    this._trivia = new Array<SyntaxTrivia>();

    let done = false;

    while (!done) {
      this._start = this._position;
      this._kind  = SyntaxKind.UnknownToken;
      this._value = null;

      switch (this.current()) {
        case "\0":
          done = true;
          break;
        case "/": {
          if (this.next() === "/") {
            this.readSingleLineComment();
          } else if (this.next() === "*") {
            this.readMultiLineComment();
          } else {
            done = true;
          }
          break;
        }
        case "\r":
        case "\n": {
          this._line++;
          this._column = 0;
          if (!leading) done = true;
          this.readBreakLine();
          break;
        }
        case " ":
        case "\t": 
          this.readWhitespace();
          break;
        default:
          done = true;
          break;
      }
    }

    const length  = this.length(this._start);
    const text    = this._source.substring(this._start, this._position);
    if (length > 0) {
      this._trivia.push({
        kind:     this._kind,
        text:     text,
        location: this.currentTextLocation(this._start),
      });
    }
  }

  private readWhitespace(): void {
    let done = false;
    while (!done) {
      switch (this.current()) {
        case "\0":
        case "\n":
        case "\r":
          done = true;
          break;
        default: {
          if (!this.isWhitespaceToken(this.current())) {
            done = true;
          } else {
            this.advance();
          }
          break;
        }
      }
    }

    this._kind = SyntaxKind.WhitespaceTrivia;
  }

  private readBreakLine(): void {
    if (this.current() === "\n" && this.next() === "\r") {
      this.advance(2);
    } else {
      this.advance();
    }

    this._kind = SyntaxKind.BreakLineTrivia;
  }

  private readSingleLineComment(): void {
    this.advance(1);
    let done = false;

    while (!done) {
      switch (this.current()) {
        case "\0":
        case "\r":
        case "\n":
          this._line++;
          this._column = 0;
          done = true;
          break;
        default:
          this.advance();
          break;
      }
    }

    this._kind = SyntaxKind.SingleLineCommentTrivia;
  }

  private readMultiLineComment(): void {
    this.advance(1);
    let done = false;

    while (!done) {
      switch (this.current()) {
        case "\0":
          this._diagnostics.reportUnterminatedMultiLineComment(this.currentTextLocation(this._start));
          done = true;
          break;
        case "*":
          if (this.next() === "/") {
            this.advance();
            done = true;
          }
          this.advance();
          break;
        case "\r":
        case "\n": {
          this._line++;
          this._column = 0;
          this.advance();
          break;
        }
        default:
          this.advance();
          break;
      }
    }

    this._kind = SyntaxKind.MultiLineCommentTrivia;
  }

  private readToken(): void {
    this._start = this._position;
    this._kind  = SyntaxKind.UnknownToken;
    this._value = null;

    switch (this.current()) {
      case "\0":
        this._kind = SyntaxKind.EndOfFileToken;
        break;
      case "+": {
        this.advance();
        if (this.current() === "+") {
          this.advance();
          this._kind = SyntaxKind.PlusPlusToken;
        } else if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.PlusEqualsToken;
        } else {
          this._kind = SyntaxKind.PlusToken;
        }
        break;
      }
      case "-": {
        this.advance();
        if (this.current() === "-") {
          this.advance();
          this._kind = SyntaxKind.MinusMinusToken;
        } else if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.MinusEqualsToken;
        } else {
          this._kind = SyntaxKind.MinusToken;
        }
        break;
      }
      case "*": {
        this.advance();
        if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.StarEqualsToken;
        } else {
          this._kind = SyntaxKind.StarToken;
        }
        break;
      }
      case "/": {
        this.advance();
        if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.SlashEqualsToken;
        } else {
          this._kind = SyntaxKind.SlashToken;
        }
        break;
      }
      case "%": {
        this.advance();
        if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.PercentEqualsToken;
        } else {
          this._kind = SyntaxKind.PercentToken;
        }
        break;
      }
      case "=": {
        this.advance();
        if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.EqualsEqualsToken;
        } else {
          this._kind = SyntaxKind.EqualsToken;
        }
        break;
      }
      case "!": {
        this.advance();
        if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.BangEqualsToken;
        } else {
          this._kind = SyntaxKind.BangToken;
        }
        break;
      }
      case "&": {
        this.advance();
        if (this.current() === "&") {
          this.advance();
          this._kind = SyntaxKind.AmpersandAmpersandToken;
        } else if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.AmpersandEqualsToken;
        } else {
          this._kind = SyntaxKind.AmpersandToken;
        }
        break;
      }
      case "|": {
        this.advance();
        if (this.current() === "|") {
          this.advance();
          this._kind = SyntaxKind.PipePipeToken;
        } else if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.PipeEqualsToken;
        } else {
          this._kind = SyntaxKind.PipeToken;
        }
        break;
      }
      case "^": {
        this.advance();
        if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.CaretEqualsToken;
        } else {
          this._kind = SyntaxKind.CaretToken;
        }
        break;
      }
      case "~": {
        this.advance();
        this._kind = SyntaxKind.TildeToken;
        break;
      }
      case "<": {
        this.advance();
        if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.LessEqualsToken;
        } else {
          this._kind = SyntaxKind.LessToken;
        }
        break;
      }
      case ">": {
        this.advance();
        if (this.current() === "=") {
          this.advance();
          this._kind = SyntaxKind.GreaterEqualsToken;
        } else {
          this._kind = SyntaxKind.GreaterToken;
        }
        break;
      }
      case "(": {
        this.advance();
        this._kind = SyntaxKind.LeftParenthesisToken;
        break;
      }
      case ")": {
        this.advance();
        this._kind = SyntaxKind.RightParenthesisToken;
        break;
      }
      case "{": {
        this.advance();
        this._kind = SyntaxKind.LeftBraceToken;
        break;
      }
      case "}": {
        this.advance();
        this._kind = SyntaxKind.RightBraceToken;
        break;
      }
      case "[": {
        this.advance();
        this._kind = SyntaxKind.LeftBracketToken;
        break;
      }
      case "]": {
        this.advance();
        this._kind = SyntaxKind.RightBracketToken;
        break;
      }
      case ",": {
        this.advance();
        this._kind = SyntaxKind.CommaToken;
        break;
      }
      case ".": {
        this.advance();
        this._kind = SyntaxKind.DotToken;
        break;
      }
      case ";": {
        this.advance();
        this._kind = SyntaxKind.SemicolonToken;
        break;
      }
      case ":": {
        this.advance();
        this._kind = SyntaxKind.ColonToken;
        break;
      }
      case "?": {
        this.advance();
        this._kind = SyntaxKind.QuestionToken;
        break;
      }
      case "'":
      case '"': 
        this.readString();
        break;
      case "_":
        this.readIdentifierOrKeyword();
        break;
      default:
        if (this.isWhitespaceToken(this.current())) {
          this.advance();
        } else if (this.isNewLineToken(this.current())) {
          this.advance();
          this._line++;
          this._column = 0;
        } else if (this.isDigit(this.current())) {
          this.readNumber();
        } else if (this.isLetter(this.current())) {
          this.readIdentifierOrKeyword();
        } else {
          this._kind = SyntaxKind.UnknownToken;
          this._value = this.current();
          this.advance();
        }
        break;
    }
  }

  private readString() {
    this.advance(); // skip the first quote
    let value = "";

    let done = false;
    while (!done) {
      switch (this.current()) {
        case '"':
        case "'":
          if (this.next() == '"' || this.next() == "'") {
            value += this.current();
            this.advance(2);
          } else {
            this.advance();
            done = true;
          }
          break;
        case "\r":
        case "\n":
        case "\0": {
          this._diagnostics.reportUnterminatedString(this.currentTextLocation(this._start));
          done = true;
          break;
        }
        default: {
          value += this.current();
          this.advance();
          break;
        }
      }
    }

    this._kind = SyntaxKind.StringLiteralToken;
    this._value = value;
  }

  private readNumber() {
    while (this.isDigit(this.current())) {
      this.advance();
    }

    if (this.current() === "." && this.isDigit(this.next())) {
      this.advance();
      while (this.isDigit(this.current())) {
        this.advance();
      }
    }

    const length = this._position - this._start;
    const text = this._source.substring(this._start, this._position);

    if (length > 1 && text.startsWith("0")) {
      this._diagnostics.reportInvalidNumber(this.currentTextLocation(this._start));
    }

    this._kind = SyntaxKind.NumberLiteralToken;
    this._value = parseFloat(text);
  }

  private readIdentifierOrKeyword() {
    while (this.isLetter(this.current()) || this.isDigit(this.current())) {
      this.advance();
    }

    const text = this._source.substring(this._start, this._position);

    this._kind = GetKeywordKind(text) || SyntaxKind.IdentifierToken;
    this._value = text;
  }

  private isLetter(char: string): boolean {
    return char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "_";
  }

  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  private isNewLineToken(char: string): boolean {
    return char === "\r" || char === "\n";
  }

  private isWhitespaceToken(char: string): boolean {
    return char === " " || char === "\t";
  }
}