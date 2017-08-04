// @flow

type Value = boolean | number | string | Object;

export type Option<T: Value> = Something<T> | Nothing;

class Something<T: Value> {
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

  expect(_msg: string): T {
    return this.value;
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

  map<U: Value>(f: T => ?U): Option<U> {
    const result = f(this.value);
    return result == null ? None : Some(result);
  }

  mapOr<U: Value>(_def: U, f: T => U): U {
    return f(this.value);
  }

  mapOrElse<U: Value>(_def: () => U, f: T => U): U {
    return f(this.value);
  }

  and<U: Value>(optb: Option<U>): Option<U> {
    return optb;
  }

  andThen<U: Value>(f: T => Option<U>): Option<U> {
    return f(this.value);
  }

  or(_optb: Option<T>): Option<T> {
    return this;
  }

  orElse(_f: () => Option<T>): Option<T> {
    return this;
  }

  match<U>(m: {|Some: T => U, None: () => U|}): U {
    return m.Some(this.value);
  }
}

class Nothing {
  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }

  expect<T: Value>(msg: string): T {
    throw new Error(msg);
  }

  unwrap<T: Value>(): T {
    throw new Error('called `Option::unwrap()` on a `None` value');
  }

  unwrapOr<T: Value>(def: T): T {
    return def;
  }

  unwrapOrElse<T: Value>(f: () => T): T {
    return f();
  }

  map<T: Value, U: Value>(_f: T => ?U): Option<U> {
    return this;
  }

  mapOr<T: Value, U: Value>(def: U, _f: T => U): U {
    return def;
  }

  mapOrElse<T: Value, U: Value>(def: () => U, _f: T => U): U {
    return def();
  }

  and<U: Value>(_optb: Option<U>): Option<U> {
    return this;
  }

  andThen<T: Value, U: Value>(_f: T => Option<U>): Option<U> {
    return this;
  }

  or<T: Value>(optb: Option<T>): Option<T> {
    return optb;
  }

  orElse<T: Value>(f: () => Option<T>): Option<T> {
    return f();
  }

  match<T, U>(m: {|Some: T => U, None: () => U|}): U {
    return m.None();
  }
}

export const None = Object.freeze(new Nothing());

export function Some<T: Value>(value: T): Option<T> {
  return Object.freeze(new Something(value));
}
