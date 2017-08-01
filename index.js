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

  match<U>(m: {|Some: T => U, None: () => U|}): U {
    return m.None();
  }
}
