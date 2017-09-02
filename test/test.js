// @flow

import assert from 'assert';
import {describe, it} from 'mocha';
import {type Option, option, None, Some} from '../index';

describe('option', function() {
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
