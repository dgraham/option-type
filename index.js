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

  map<U>(f: T => U): Option<U> {
    return new Some(f(this.value));
  }

  mapOr<U>(_def: U, f: T => U): U {
    return f(this.value);
  }

  mapOrElse<U>(_def: () => U, f: T => U): U {
    return f(this.value);
  }

  and<U>(optb: Option<U>): Option<U> {
    return optb;
  }

  andThen<U>(f: T => Option<U>): Option<U> {
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

export class None<T> {
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

  map<U>(_f: T => U): Option<U> {
    return new None();
  }

  mapOr<U>(def: U, _f: T => U): U {
    return def;
  }

  mapOrElse<U>(def: () => U, _f: T => U): U {
    return def();
  }

  and<U>(_optb: Option<U>): Option<U> {
    return new None();
  }

  andThen<U>(_f: T => Option<U>): Option<U> {
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
