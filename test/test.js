// @flow

import assert from 'assert';
import {describe, it} from 'mocha';
import {type Option, None, Some} from '../index';

describe('option', function() {
  it('can be some or none', function() {
    let option: Option<number> = new Some(42);
    assert(option.isSome());

    option = new None();
    assert(option.isNone());
  });

  it('unwraps some value', function() {
    const value = new Some(42);
    assert.equal(value.unwrap(), 42);
  });

  it('throws unwrapping none', function() {
    assert.throws(() => new None().unwrap());
  });

  describe('unwrapOr', function() {
    it('returns the value for some', function() {
      const option = new Some(42);
      assert.equal(option.unwrapOr(12), 42);
    });

    it('returns the default for none', function() {
      const option = new None();
      assert.equal(option.unwrapOr(12), 12);
    });
  });

  describe('unwrapOrElse', function() {
    it('returns the value for some', function() {
      const option = new Some(42);
      assert.equal(option.unwrapOrElse(() => 12), 42);
    });

    it('invokes the default function for none', function() {
      const option = new None();
      assert.equal(option.unwrapOrElse(() => 12), 12);
    });
  });

  describe('map', function() {
    it('returns the mapped value for some', function() {
      const option = new Some(42);
      const actual = option.map(x => `x is ${x}`);
      assert.equal(actual.unwrap(), 'x is 42');
    });

    it('returns none for none', function() {
      const option = new None();
      const actual = option.map(x => `x is ${x}`);
      assert(actual.isNone());
    });
  });

  describe('mapOr', function() {
    it('returns the mapped value for some', function() {
      const option = new Some('foo');
      assert.equal(option.mapOr(42, x => x.length), 3);
    });

    it('returns the default value for none', function() {
      const option = new None();
      assert.equal(option.mapOr(42, x => x.length), 42);
    });
  });

  describe('mapOrElse', function() {
    it('returns the mapped value for some', function() {
      const option = new Some('foo');
      assert.equal(option.mapOrElse(() => 42, x => x.length), 3);
    });

    it('returns the default value for none', function() {
      const option = new None();
      assert.equal(option.mapOrElse(() => 42, x => x.length), 42);
    });
  });

  describe('and', function() {
    it('returns none for some and none', function() {
      const x = new Some(2);
      const y: Option<string> = new None();
      assert(x.and(y).isNone());
    });

    it('returns none for none and some', function() {
      const x: Option<number> = new None();
      const y: Option<string> = new Some('foo');
      assert(x.and(y).isNone());
    });

    it('returns some for some and some', function() {
      const x: Option<number> = new Some(2);
      const y: Option<string> = new Some('foo');
      assert.equal(x.and(y).unwrap(), 'foo');
    });

    it('returns none for none and none', function() {
      const x: Option<number> = new None();
      const y: Option<string> = new None();
      assert(x.and(y).isNone());
    });
  });

  describe('andThen', function() {
    it('flat maps some and none', function() {
      const sq = (x: number): Option<number> => new Some(x * x);
      const nope = (_: number): Option<number> => new None();

      assert.equal(new Some(2).andThen(sq).andThen(sq).unwrap(), 16);
      assert(new Some(2).andThen(sq).andThen(nope).isNone());
      assert(new Some(2).andThen(nope).andThen(sq).isNone());
      assert(new None().andThen(sq).andThen(sq).isNone());
    });
  });

  describe('or', function() {
    it('returns the some over none', function() {
      assert.equal(new Some(2).or(new None()).unwrap(), 2);
    });

    it('returns the alternative to none', function() {
      assert.equal(new None().or(new Some(2)).unwrap(), 2);
    });

    it('returns the first of two somes', function() {
      assert.equal(new Some(2).or(new Some(100)).unwrap(), 2);
    });

    it('returns none for two nones', function() {
      assert(new None().or(new None()).isNone());
    });
  });

  describe('orElse', function() {
    const def = () => new Some(42);
    const nope = () => new None();

    it('returns the some', function() {
      assert.equal(new Some(2).orElse(def).unwrap(), 2);
    });

    it('returns the default some value', function() {
      assert.equal(new None().orElse(def).unwrap(), 42);
    });

    it('returns the default none value', function() {
      assert(new None().orElse(nope).isNone());
    });
  });

  describe('match', function() {
    it('matches some', function() {
      const x = new Some(2);
      const value = x.match({
        Some: v => v * 2,
        None: () => 42
      });
      assert.equal(value, 4);
    });

    it('matches none', function() {
      const x = new None();
      const value = x.match({
        Some: v => v * 2,
        None: () => 42
      });
      assert.equal(value, 42);
    });
  });
});
