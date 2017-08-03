// @flow

type Value = boolean | number | string | Object;

export type Option<T: Value> = Some<T> | None<T>;

export class Some<T: Value> {
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

  map<U: Value>(f: T => U): Option<U> {
    const result = f(this.value);
    return result == null ? new None() : new Some(result);
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

export class None<T: Value> {
  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }

  expect(msg: string): T {
    throw new Error(msg);
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

  map<U: Value>(_f: T => U): Option<U> {
    return new None();
  }

  mapOr<U: Value>(def: U, _f: T => U): U {
    return def;
  }

  mapOrElse<U: Value>(def: () => U, _f: T => U): U {
    return def();
  }

  and<U: Value>(_optb: Option<U>): Option<U> {
    return new None();
  }

  andThen<U: Value>(_f: T => Option<U>): Option<U> {
    return new None();
  }

  or(optb: Option<T>): Option<T> {
    return optb;
  }

  orElse(f: () => Option<T>): Option<T> {
    return f();
  }

  match<U>(m: {|Some: T => U, None: () => U|}): U {
    return m.None();
  }
}
