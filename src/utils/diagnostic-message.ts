import { TextLocation } from "../types/text-location.ts";

export enum DiagnosticType {
  Error   = "error",
  Warning = "warning",
  Info    = "info",
}

export class DiagnosticMessage {
  constructor(
    public type: DiagnosticType,
    public location: TextLocation,
    public message: string,
  ) {}

  public print() {
    console.log(`[${this.type}] ${this.message} \n\tat line ${this.location.line}, col ${this.location.column}\n`);
  }

  public static error(location: TextLocation, message: string) {
    return new DiagnosticMessage(
      DiagnosticType.Error, 
      location, 
      message
    );
  }

  public static warning(location: TextLocation, message: string) {
    return new DiagnosticMessage(
      DiagnosticType.Warning, 
      location, 
      message
    );
  }

  public static info(location: TextLocation, message: string) {
    return new DiagnosticMessage(
      DiagnosticType.Info, 
      location, 
      message
    );
  }
}