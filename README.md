# Option type

An [Option] type for [Flow], inspired by [Rust].

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

## Development

```
npm install
npm test
```

## License

Distributed under the MIT license. See LICENSE for details.
