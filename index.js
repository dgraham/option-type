// @flow

export type Option<T> = Some<T> | None<T>;

export class Some<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSome(): boolean {
    return true;
  }

  isNone(): boolean {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_def: T): T {
    return this.value;
  }

  unwrapOrElse(_f: () => T): T {
    return this.value;
  }
}

export class None<T> {
  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }

  unwrap(): T {
    throw new Error('called `Option::unwrap()` on a `None` value');
  }

  unwrapOr(def: T): T {
    return def;
  }

  unwrapOrElse(f: () => T): T {
    return f();
  }
}
