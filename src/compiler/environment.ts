// deno-lint-ignore-file
import { RuntimeValue } from "../types/evaluator/runtime-value.ts";
import { SyntaxNode } from "../types/lexer/syntax-node.ts";

interface IEnvironment {
  variables: Map<string, RuntimeValue>;
}

export class Environment {
  private parent?: Environment;
  private _variables = new Map<string, RuntimeValue>();
  private _constants = new Set<string>();

  constructor(
    parent?: Environment,
    options?: IEnvironment
  ) {
    if (parent) {
      this.parent = parent;
    }

    if (options) {
      this._variables = options.variables;
    }
  }

  public static create() {
    return new Environment(
      undefined,
      {
        variables: new Map<string, RuntimeValue>(),
      },
    );
  }

  public get variables() {
    return this._variables;
  }

  public get constants() {
    return this._constants;
  }

  public merge(environment: Environment) {
    for (const [key, value] of environment.variables) {
      this._variables.set(key, value);
    }

    for (const key of environment.constants) {
      this._constants.add(key);
    }
  }

  public declareVariable(name: string, value: RuntimeValue, constant = false): RuntimeValue {
    if (this.hasVariable(name)) {
      throw new Error(`Variable '${name}' already declared`);
    }

    if (constant) {
      this._constants.add(name);
    }

    return this._variables.set(name, value).get(name)!;
  }

  public declareExportedVariable(name: string, value: RuntimeValue, constant = false): RuntimeValue {
    if (this.hasVariable(name)) {
      throw new Error(`Variable '${name}' already declared`);
    }

    if (constant) {
      this._constants.add(name);
    }

    value.isExported = true;
    return this._variables.set(name, value).get(name)!;
  }

  public getVariable(name: string): RuntimeValue | undefined {
    return this._variables.get(name);
  }

  public assignVariable(name: string, value: RuntimeValue): RuntimeValue {
    return this._variables.set(name, value).get(name)!;
  }

  public resolveVariable(name: string): RuntimeValue | undefined {
    let current: Environment | undefined = this;

    while (current) {
      if (current._variables.has(name)) {
        return current._variables.get(name);
      }

      current = current.parent;
    }

    return undefined;
  }

  public hasVariable(name: string): boolean {
    let current: Environment | undefined = this;

    while (current) {
      if (current._variables.has(name)) {
        return true;
      }

      current = current.parent;
    }

    return false;
  }

  public isConstant(name: string): boolean {
    if (this._constants.has(name))  return true;
    if (!this.parent)               return false;
    return this.parent.isConstant(name);
  }

  public createChild(): Environment {
    return new Environment(this);
  }
}