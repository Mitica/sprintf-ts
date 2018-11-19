# sprintf-ts

sprintf TypeScript utils.

## API


### parseParams(format: string): TsParam[]

Parse params from a sprintf format.

#### Usage

```ts
import { parseParams } from 'sprintf-ts'

let params = parseParams('Hello %1$s, %s, %2$s, %s');
// = [{ name: 'p1', type: ['string'] }, { name: 'p2', type: ['string'] }]

params = parseParams('Hello %(name)s');
// = [{ name: 'p1', type: ['{ name: string }'] }]

```

## Types

```ts
type TsParam = {
    name: string
    type: string[]
}
```
