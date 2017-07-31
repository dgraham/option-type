// @flow

import assert from 'assert';
import {describe, it} from 'mocha';
import {None, Some} from '../index';
import type {Option} from '../index';

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
});
