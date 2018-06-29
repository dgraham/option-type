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

export function option<T: Value>(value: ?T): Option<T> {
  return value == null ? None : Some(value);
}

export type Result<T, E> = Okay<T> | Failure<E>;

class Okay<T: Value> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return false;
  }

  expect(_msg: string): T {
    return this.value;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_optb: T): T {
    return this.value;
  }

  unwrapOrElse<E: Value>(_f: E => T): T {
    return this.value;
  }

  unwrapErr<E: Value>(): E {
    throw new Error(this.value);
  }

  expectErr<E: Value>(msg: string): E {
    throw new Error(`${msg}: ${String(this.value)}`);
  }

  ok(): Option<T> {
    return Some(this.value);
  }

  err<E: Value>(): Option<E> {
    return None;
  }

  map<U: Value, E: Value>(f: T => U): Result<U, E> {
    return Ok(f(this.value));
  }

  mapErr<E: Value, F: Value>(_f: E => F): Result<T, F> {
    return this;
  }

  and<U: Value, E: Value>(res: Result<U, E>): Result<U, E> {
    return res;
  }

  andThen<U: Value, E: Value>(f: T => Result<U, E>): Result<U, E> {
    return f(this.value);
  }

  or<F: Value>(_res: Result<T, F>): Result<T, F> {
    return this;
  }

  orElse<E: Value, F: Value>(_f: E => Result<T, F>): Result<T, F> {
    return this;
  }

  match<E: Value, U>(m: {|Ok: T => U, Err: E => U|}): U {
    return m.Ok(this.value);
  }
}

class Failure<E: Value> {
  value: E;

  constructor(value: E) {
    this.value = value;
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }

  expect<T: Value>(msg: string): T {
    throw new Error(`${msg}: ${String(this.value)}`);
  }

  unwrap<T: Value>(): T {
    throw new Error(this.value);
  }

  unwrapOr<T: Value>(optb: T): T {
    return optb;
  }

  unwrapOrElse<T: Value>(f: E => T): T {
    return f(this.value);
  }

  unwrapErr(): E {
    return this.value;
  }

  expectErr(_msg: string): E {
    return this.value;
  }

  ok<T: Value>(): Option<T> {
    return None;
  }

  err(): Option<E> {
    return Some(this.value);
  }

  map<U: Value, T: Value>(_f: T => U): Result<U, E> {
    return this;
  }

  mapErr<T: Value, F: Value>(f: E => F): Result<T, F> {
    return Err(f(this.value));
  }

  and<U: Value>(_res: Result<U, E>): Result<U, E> {
    return this;
  }

  andThen<U: Value, T: Value>(_f: T => Result<U, E>): Result<U, E> {
    return this;
  }

  or<T: Value, F: Value>(res: Result<T, F>): Result<T, F> {
    return res;
  }

  orElse<T: Value, F: Value>(f: E => Result<T, F>): Result<T, F> {
    return f(this.value);
  }

  match<T: Value, U>(m: {|Ok: T => U, Err: E => U|}): U {
    return m.Err(this.value);
  }
}

export function Ok<T: Value>(value: T): Okay<T> {
  return Object.freeze(new Okay(value));
}

export function Err<E: Value>(value: E): Failure<E> {
  return Object.freeze(new Failure(value));
}

export function asyncResult<T: Value>(
  value: Promise<T>
): Promise<Result<T, Error>> {
  return value.then(v => Ok(v), e => Err(e));
}
