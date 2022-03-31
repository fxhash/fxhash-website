Data transformers
===============


# Issue

At multiple places in the app, we need entities to have certain fields represented with a certain type.

This is particularly the case when packing <-> unpacking data and when getting values smart contracts <-> forms, where different fields have to go under different transformations. Using regular functionnal programming can make the code quite messy as we need many functions to perform small tasks on different data types. Not to mention transforming object with nested fields...


# Solution

Transformers (*in the lack of a better term) are an elegant solution to this problem. They leverage a property: at the end, even in deeply nested fields, the same tiny transformations are applied to the values.

There are 3 states in which an entity (more precisely its properties) can be:

* `unpacked`: when byte data is unpacked out of the chain, it has certain properties. (basically numbers are BigNumber instances)
* `generic`: the most common form in which the data can be (stored in the servers, used everywhere on the front end)
* `inputready`: inputs need a different representation of some data, either for user conveniency or by system requirements (inputs are better with strings only)

To transform any data from a state between any other state, a transformer needs to implement the following transformations:

* `unpacked` -> `generic`
* `generic` -> `unpacked`
* `generic` -> `inputready`
* `inputready` -> `generic`


# How does it work

## Transformer

A transformer defines a set of transformations between different states. For instance, the mutez field is represented as following in the different states:

* `unpacked`: BigNumber
* `generic`: mutez, number
* `inputready`: tez, string

Its transformer will implement the required transformations, and it will become a reusabled block whenever required for the field.

## Object definitions

For each object which needs to undergo a transformation, we define a schema where its properties are mapped to a transformer.

```ts
type TransformDefinition<GObject> = Record<
  (keyof GObject), Transformer|TransformDefinition<any>
>
interface MyObject<GNumber = number, GDate = Date> {
  price: GNumber
  opensAt: GDate
}
const MyObjectTransformDefinition: TransformDefinition<MyObject> = {
  price: MutezTransformer,
  opensAt: DateTransformer,
}
```

Then, we can just run the transformation using a generic Transformation function:

```ts
const transformed: B = Transformation<A, B>(
  myvariable, // type must be A
  MyObjectTransformation,
  ETransformState.UNPACKED, // from
  ETransformState.GENERIC,  // to
)
```

This will take `myvariable` in its unpacked type, and will output its transformed version in its generic type.