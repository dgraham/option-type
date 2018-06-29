// @flow

import assert from 'assert';
import {describe, it} from 'mocha';
import {
  type Result,
  asyncResult,
  Ok,
  Err,
  type Option,
  option,
  None,
  Some
} from '../index';

describe('Option<T>', function() {
  describe('option factory', function() {
    it('returns none for null', function() {
      assert(option(null).isNone());
    });

    it('returns none for undefined', function() {
      assert(option(undefined).isNone());
    });

    it('returns some for number', function() {
      assert(option(12).isSome());
    });
  });

  describe('expect', function() {
    it('unwraps some value', function() {
      const option = Some(42);
      assert.equal(option.expect('boom'), 42);
    });

    it('throws unwrapping none', function() {
      assert.throws(() => None.expect('boom'));
    });
  });

  describe('unwrap', function() {
    it('unwraps some value', function() {
      const option = Some(42);
      assert.equal(option.unwrap(), 42);
    });

    it('throws unwrapping none', function() {
      assert.throws(() => None.unwrap());
    });

    it('type checks as some or none', function() {
      let option: Option<number> = None;
      assert(option.isNone());

      option = Some(42);
      assert(option.isSome());

      const value: number = option.unwrap();
      assert.equal(value, 42);
    });
  });

  describe('unwrapOr', function() {
    it('returns the value for some', function() {
      const option = Some(42);
      assert.equal(option.unwrapOr(12), 42);
    });

    it('returns the default for none', function() {
      const option = None;
      assert.equal(option.unwrapOr(12), 12);
    });
  });

  describe('unwrapOrElse', function() {
    it('returns the value for some', function() {
      const option = Some(42);
      assert.equal(option.unwrapOrElse(() => 12), 42);
    });

    it('invokes the default function for none', function() {
      const option = None;
      assert.equal(option.unwrapOrElse(() => 12), 12);
    });
  });

  describe('map', function() {
    it('returns the mapped value for some', function() {
      const option = Some(42);
      const actual = option.map(x => `x is ${x}`);
      assert.equal(actual.unwrap(), 'x is 42');
    });

    it('maps some to none for null result', function() {
      const option = Some(42);
      assert(option.map(_ => null).isNone());
    });

    it('returns none for none', function() {
      const option = None;
      const actual = option.map(x => `x is ${x}`);
      assert(actual.isNone());
    });
  });

  describe('mapOr', function() {
    it('returns the mapped value for some', function() {
      const option = Some('foo');
      assert.equal(option.mapOr(42, x => x.length), 3);
    });

    it('returns the default value for none', function() {
      const option = None;
      assert.equal(option.mapOr(42, x => x.length), 42);
    });
  });

  describe('mapOrElse', function() {
    it('returns the mapped value for some', function() {
      const option = Some('foo');
      assert.equal(option.mapOrElse(() => 42, x => x.length), 3);
    });

    it('returns the default value for none', function() {
      const option = None;
      assert.equal(option.mapOrElse(() => 42, x => x.length), 42);
    });
  });

  describe('and', function() {
    it('returns none for some and none', function() {
      const x = Some(2);
      const y: Option<string> = None;
      assert(x.and(y).isNone());
    });

    it('returns none for none and some', function() {
      const x: Option<number> = None;
      const y: Option<string> = Some('foo');
      assert(x.and(y).isNone());
    });

    it('returns some for some and some', function() {
      const x: Option<number> = Some(2);
      const y: Option<string> = Some('foo');
      assert.equal(x.and(y).unwrap(), 'foo');
    });

    it('returns none for none and none', function() {
      const x: Option<number> = None;
      const y: Option<string> = None;
      assert(x.and(y).isNone());
    });
  });

  describe('andThen', function() {
    it('flat maps some and none', function() {
      const sq = (x: number): Option<number> => Some(x * x);
      const nope = (_: number): Option<number> => None;

      assert.equal(
        Some(2)
          .andThen(sq)
          .andThen(sq)
          .unwrap(),
        16
      );
      assert(
        Some(2)
          .andThen(sq)
          .andThen(nope)
          .isNone()
      );
      assert(
        Some(2)
          .andThen(nope)
          .andThen(sq)
          .isNone()
      );
      assert(
        None.andThen(sq)
          .andThen(sq)
          .isNone()
      );
    });
  });

  describe('or', function() {
    it('returns the some over none', function() {
      assert.equal(
        Some(2)
          .or(None)
          .unwrap(),
        2
      );
    });

    it('returns the alternative to none', function() {
      assert.equal(None.or(Some(2)).unwrap(), 2);
    });

    it('returns the first of two somes', function() {
      assert.equal(
        Some(2)
          .or(Some(100))
          .unwrap(),
        2
      );
    });

    it('returns none for two nones', function() {
      assert(None.or(None).isNone());
    });
  });

  describe('orElse', function() {
    const def = () => Some(42);
    const nope = () => None;

    it('returns the some', function() {
      assert.equal(
        Some(2)
          .orElse(def)
          .unwrap(),
        2
      );
    });

    it('returns the default some value', function() {
      assert.equal(None.orElse(def).unwrap(), 42);
    });

    it('returns the default none value', function() {
      assert(None.orElse(nope).isNone());
    });
  });

  describe('match', function() {
    it('matches some', function() {
      const x = Some(2);
      const value = x.match({
        Some: v => v * 2,
        None: () => 42
      });
      assert.equal(value, 4);
    });

    it('matches none', function() {
      const x = None;
      const value = x.match({
        Some: v => v * 2,
        None: () => 42
      });
      assert.equal(value, 42);
    });

    it('allows no return value in matchers', function() {
      const x = Some(2);
      x.match({
        Some(value) {
          assert.equal(value, 2);
        },
        None() {
          assert.ok(false, 'should not match none');
        }
      });
    });
  });
});

describe('Result<T, E>', function() {
  describe('asyncResult', function() {
    it('returns ok for resolved promise', async function() {
      const result = await asyncResult(Promise.resolve(42));
      assert(result.isOk());
      assert.equal(result.unwrap(), 42);
    });

    it('returns err for rejected promise', async function() {
      const result = await asyncResult(Promise.reject('boom'));
      assert(result.isErr());
      assert.equal(result.unwrapErr(), 'boom');
    });
  });

  describe('expect', function() {
    it('unwraps ok value', function() {
      const result = Ok(42);
      assert.equal(result.expect('boom'), 42);
    });

    it('throws unwrapping err', function() {
      assert.throws(() => Err(42).expect('boom'));
    });
  });

  describe('unwrap', function() {
    it('unwraps ok value', function() {
      const result = Ok(42);
      assert.equal(result.unwrap(), 42);
    });

    it('throws unwrapping err', function() {
      assert.throws(() => Err('boom').unwrap());
    });

    it('type checks as some or none', function() {
      let result: Result<number, string> = Err('boom');
      assert(result.isErr());

      result = Ok(42);
      assert(result.isOk());

      const value: number = result.unwrap();
      assert.equal(value, 42);
    });
  });

  describe('unwrapOr', function() {
    it('returns the value for ok', function() {
      const result = Ok(42);
      assert.equal(result.unwrapOr(12), 42);
    });

    it('returns the default for err', function() {
      const result = Err('boom');
      assert.equal(result.unwrapOr(12), 12);
    });
  });

  describe('unwrapOrElse', function() {
    it('returns the value for ok', function() {
      const result = Ok(42);
      assert.equal(result.unwrapOrElse(() => 12), 42);
    });

    it('invokes the default function for err', function() {
      const result = Err('boom');
      assert.equal(result.unwrapOrElse(() => 12), 12);
    });
  });

  describe('unwrapErr', function() {
    it('unwraps err value', function() {
      const result = Err('boom');
      assert.equal(result.unwrapErr(), 'boom');
    });

    it('throws unwrapping ok', function() {
      assert.throws(() => Ok(42).unwrapErr());
    });
  });

  describe('expectErr', function() {
    it('unwraps err value', function() {
      const result = Err(42);
      assert.equal(result.expectErr('boom'), 42);
    });

    it('throws unwrapping ok', function() {
      assert.throws(() => Ok(42).expectErr('boom'));
    });
  });

  describe('ok', function() {
    it('returns some for ok value', function() {
      const result = Ok(42);
      assert.equal(result.ok().unwrap(), 42);
    });

    it('returns none for err value', function() {
      const result = Err('boom');
      assert(result.ok().isNone());
    });
  });

  describe('err', function() {
    it('returns none for ok value', function() {
      const result = Ok(42);
      assert(result.err().isNone());
    });

    it('returns some for err value', function() {
      const result = Err('boom');
      assert.equal(result.err().unwrap(), 'boom');
    });
  });

  describe('map', function() {
    it('returns the mapped value for ok', function() {
      const result = Ok(42);
      const actual = result.map(x => `x is ${x}`);
      assert.equal(actual.unwrap(), 'x is 42');
    });

    it('returns err for err', function() {
      const result = Err('boom');
      const actual = result.map(x => `x is ${x}`);
      assert(actual.isErr());
    });
  });

  describe('mapErr', function() {
    it('returns the mapped value for err', function() {
      const result = Err(42);
      const actual = result.mapErr(x => `x is ${x}`);
      assert.equal(actual.unwrapErr(), 'x is 42');
    });

    it('returns ok for ok', function() {
      const result = Ok(42);
      const actual = result.mapErr(x => `x is ${x}`);
      assert(actual.isOk());
      assert.equal(actual.unwrap(), 42);
    });
  });

  describe('and', function() {
    it('returns err for ok and err', function() {
      const x = Ok(2);
      const y: Result<number, string> = Err('boom');
      assert(x.and(y).isErr());
    });

    it('returns err for err and ok', function() {
      const x: Result<number, string> = Err('boom');
      const y: Result<number, string> = Ok(42);
      assert(x.and(y).isErr());
    });

    it('returns ok for ok and ok', function() {
      const x: Result<number, string> = Ok(2);
      const y: Result<string, string> = Ok('foo');
      assert.equal(x.and(y).unwrap(), 'foo');
    });

    it('returns err for err and err', function() {
      const x: Result<string, string> = Err('one');
      const y: Result<number, string> = Err('two');
      assert(x.and(y).isErr());
      assert.equal(x.and(y).unwrapErr(), 'one');
    });
  });

  describe('andThen', function() {
    it('flat maps ok and err', function() {
      const sq = (x: number): Result<number, string> => Ok(x * x);
      const nope = (_: number): Result<number, string> => Err('boom');

      assert.equal(
        Ok(2)
          .andThen(sq)
          .andThen(sq)
          .unwrap(),
        16
      );
      assert(
        Ok(2)
          .andThen(sq)
          .andThen(nope)
          .isErr()
      );
      assert(
        Ok(2)
          .andThen(nope)
          .andThen(sq)
          .isErr()
      );
      assert(
        Err('boom')
          .andThen(sq)
          .andThen(sq)
          .isErr()
      );
    });
  });

  describe('or', function() {
    it('returns the ok over err', function() {
      assert.equal(
        Ok(2)
          .or(Err('boom'))
          .unwrap(),
        2
      );
    });

    it('returns the alternative to err', function() {
      assert.equal(
        Err('boom')
          .or(Ok(2))
          .unwrap(),
        2
      );
    });

    it('returns the first of two ok values', function() {
      assert.equal(
        Ok(2)
          .or(Ok(100))
          .unwrap(),
        2
      );
    });

    it('returns err for two err values', function() {
      assert(
        Err('one')
          .or(Err('two'))
          .isErr()
      );
      assert.equal(
        Err('one')
          .or(Err('two'))
          .unwrapErr(),
        'two'
      );
    });
  });

  describe('orElse', function() {
    const def = () => Ok(42);
    const nope = () => Err('boom');

    it('returns the ok', function() {
      assert.equal(
        Ok(2)
          .orElse(def)
          .unwrap(),
        2
      );
    });

    it('returns the default ok value', function() {
      assert.equal(
        Err('boom')
          .orElse(def)
          .unwrap(),
        42
      );
    });

    it('returns the default err value', function() {
      assert(
        Err('one')
          .orElse(nope)
          .isErr()
      );
      assert.equal(
        Err('one')
          .orElse(nope)
          .unwrapErr(),
        'boom'
      );
    });
  });

  describe('match', function() {
    it('matches ok', function() {
      const x = Ok(2);
      const value = x.match({
        Ok: v => v * 2,
        Err: v => v - 1
      });
      assert.equal(value, 4);
    });

    it('matches err', function() {
      const x = Err(42);
      const value = x.match({
        Ok: v => v * 2,
        Err: v => v + 1
      });
      assert.equal(value, 43);
    });

    it('allows no return value in matchers', function() {
      const x = Ok(2);
      x.match({
        Ok(value) {
          assert.equal(value, 2);
        },
        Err() {
          assert.ok(false, 'should not match err');
        }
      });
    });
  });
});
