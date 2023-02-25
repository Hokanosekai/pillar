export interface IError {
  message: string;
}

export class Error implements IError {
  constructor(
    public message: string,
  ) {}

  public toString() {
    return this.message;
  }
}

export class CliError extends Error {
  constructor(
    public message: string,
  ) {
    super(message);
  }
}