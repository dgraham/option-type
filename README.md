# Option type

An [Option][] type for [Flow][], inspired by [Rust][].

[Option]: https://en.wikipedia.org/wiki/Option_type
[Flow]: https://flow.org
[Rust]: https://doc.rust-lang.org/std/option/index.html

## Usage

```js
import {type Option, Some, None} from 'option-type';

function divide(numerator: number, denominator: number): Option<number> {
  if (denominator === 0) {
    return None;
  } else {
    return Some(numerator / denominator);
  }
}

const result = divide(2, 3);
const message = result.match({
  Some: x => `Result: ${x}`,
  None: () => 'Cannot divide by zero'
});
console.log(message);
```

## Result

A [`Result`][result] type is also included in this package because it's so
closely related to `Option`.

```js

import {type Result, Ok, Err} from 'option-type';

function parse(json: string): Result<Object, Error> {
  try {
    return Ok(JSON.parse(json));
  } catch (e) {
    return Err(e);
  }
}

const result = parse('{"name": "hubot"}');
const message = result.match({
  Ok: x => `Result: ${x.name}`,
  Err: e => `Failed to parse JSON text: ${e}`
});
console.log(message);
```

[result]: https://doc.rust-lang.org/std/result/enum.Result.html

## Development

```
npm install
npm test
```

## License

Distributed under the MIT license. See LICENSE for details.
