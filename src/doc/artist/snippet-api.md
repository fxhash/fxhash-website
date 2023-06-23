---
title: "Snippet API"
date: "2023-03-20"
description: "A description of the API exposed by the fxhash snippet."
---

> By inserting the fxhash snippet into your code, you get access to a set of utility functions to implement fxhash-specific features and interact with the different fxhash modules.

# Table of Contents

# Usage

The snippet creates a `$fx` property in the `window` object, allowing you to call `$fx` anywhere in your code. `$fx` is an object exposing the various properties and functions of the fxhash API.

For instance, if you want to access the hash of an iteration, you can write:

```js
// iteration hash, ex: ooj2HmX8dgniNPuPRcapyXBn9vYpsNwgD1uwx98SLceF6iCZJZK
$fx.hash
```

Or if you want to trigger the preview, you can do:

```js
$fx.preview()
```

# API Overview

| Property                              | Type                                               | Description                                                                                                                                                                                      |
| ------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`hash`](#fxhash)                     | string                                             | The string hash injected into the iteration.                                                                                                                                                     |
| [`iteration`](#fxiteration)           | string                                             | The iteration number in the collection.                                                                                                                                                          |
| [`rand()`](#fxrand)                   | ()&nbsp;=>&nbsp;number                             | A pseudo random number generator, using the unique hash as a seed. Outputs a number between 0 (inclusive) and 1 (exclusive). `[0; 1[`                                                            |
| [`minter`](#fxminter)                 | string                                             | The string of the wallet address of the minter injected into the iteration.                                                                                                                      |
| [`randminter()`](#fxrandminter)       | ()&nbsp;=>&nbsp;number                             | A pseudo random number generator, using the minter address as a seed. Outputs a number between 0 (inclusive) and 1 (exclusive). ` [0; 1[`                                                        |
| [`preview()`](#fxpreview)             | ()&nbsp;=>&nbsp;void                               | A function which can be called to programmatically trigger the image capture of the iteration.                                                                                                   |
| [`isPreview`](#fxispreview)           | boolean                                            | A boolean which will be set to true if your code is being ran in fxhash capture module. Can be useful if you want to define specific properties for the capture only.                            |
| [`features()`](#fxfeaturesfeatures)   | (object)&nbsp;=>&nbsp;void                         | This function can be called with an object as parameter to define the features of the iteration.                                                                                                 |
| [`getFeature()`](#fxgetfeaturename)   | (string)&nbsp;=>&nbsp;any                          | Given a feature name, output its value (as defined through the `features()` function)                                                                                                            |
| [`getFeatures()`](#fxgetfeatures)     | ()&nbsp;=>&nbsp;object                             | Return the features object (whole object defined through the `features()` function)                                                                                                              |
| [`params()`](#fxparamsdefinition)     | (array)&nbsp;=>&nbsp;void                          | This function can be called with an array of parameter definitions as an input. This is how you can define the parameters collectors will modulate before minting their iteration of your piece. |
| [`getParam()`](#fxgetparamid)         | (string)&nbsp;=>&nbsp;any                          | Given a param ID, returns its current value based on the param values passed to the iteration.                                                                                                   |
| [`getParams()`](#fxgetparams)         | ()&nbsp;=>&nbsp;object                             | Return an map of param key value pairs, based on the provided params definition and the current values of all the parameters.                                                                    |
| [`getRawParam()`](#fxgetrawparamid)   | (string)&nbsp;=>&nbsp;string                       | Returns the bytes string of a parameter as passed to the iteration.                                                                                                                              |
| [`on()`](#fxoneventid-handler-ondone) | (string, function, function)&nbsp;=>&nbsp;function | Adds an event listener to an event. returns a function to remove the event listener.                                                                                                             |

# Top-level API reference

## $fx.hash

The string hash injected into the iteration. Will be unique for every iteration of a project. Directly grabbed from the `fxhash` URL parameter when the iteration is loaded.

```js
console.log($fx.hash) // output example: ooj2HmX8dgniNPuPRcapyXBn9vYpsNwgD1uwx98SLceF6iCZJZK
```

## $fx.iteration

The iteration number in the collection. Directly grabbed from the `iteration` URL parameter when the iteration is loaded.

```js
console.log($fx.iteration) // output example: 42
```

## $fx.rand()

> The `$fx.rand()` function is a Pseudorandom Number Generator which outputs a number between 0 and 1 (`[0; 1[`). It uses the unique hash injected into the code as a seed, and will always output the same sequence of numbers.

```js
const rand01 = $fx.rand() // number [0; 1[
const r2 = fxrand() // same effect as above
```

`$fx.rand()` can pretty much be used instead of `Math.random()`

The fxhash snippet provides an implementation of SFC32 ([Standard Fast Counter 32](https://github.com/bryc/code/blob/master/jshash/PRNGs.md#sfc32)) as the PRNG.

`$fx.rand()` is a pointer to the `fxrand()` function. You can use any of these in your code, although we recommend using the `$fx` syntax for consistency accross your code.

::infobox[It is not mandatory to use the `$fx.rand()` function as your source of randomness, you can implement the PRNG of your choice instead, as long as it uses the hash as the seed.]

## $fx.minter

The string wallet address of the minter injected into the iteration. Directly grabbed from the `fxminter` URL parameter when the iteration is loaded.

```js
console.log($fx.minter) // output example: tz18jgjtEDRtkvNoV9LToradSmVNYFS9aXEe
```

## $fx.randminter()

> The `$fx.randminter()` function is a Pseudorandom Number Generator which outputs a number between 0 and 1 (`[0; 1[`). It uses the minter address injected into the code as a seed, and will always output the same sequence of numbers.

```js
const rand01 = $fx.randminter() // number [0; 1[
const r2 = fxrandminter() // same effect as above
```

`$fx.randminter()` can pretty much be used instead of `Math.random()`

The fxhash snippet provides an implementation of SFC32 ([Standard Fast Counter 32](https://github.com/bryc/code/blob/master/jshash/PRNGs.md#sfc32)) as the PRNG.

`$fx.randminter()` is a pointer to the `fxrandminter()` function. You can use any of these in your code, although we recommend using the `$fx` syntax for consistency accross your code.

::infobox[It is not mandatory to use the `$fx.randminter()` function as your source of randomness, you can implement the PRNG of your choice instead, as long as it uses the minter address as the seed.]

## $fx.preview()

> A function which can be called to programmatically trigger the image capture of the iteration. This function only works if `programmatic trigger` is configured in the capture settings, when you mint your project. See [capture settings](/doc/artist/capture-settings) for more details.

```js
function draw() {
  // render here
  //...

  // trigger the preview
  $fx.preview()
}
```

For projects where an animation is rendered, this function can be particularly useful to trigger a capture at a particular frame, where the output is the best:

```js
let counter = 0
function draw() {
  requestAnimationFrame(draw)

  // render here
  // ...

  // increment frame counter
  counter++

  // when reaching frame 6000, trigger the capture
  if (counter === 6000) {
    $fx.preview()
  }
}
requestAnimationFrame(draw)
```

## $fx.isPreview

A boolean which will be set to true if your code is being ran in fxhash capture module. Can be useful if you want to define specific properties for the capture only.

```js
if ($fx.isPreview) {
  // will be executed only when preview is taken by fxhash
} else {
  // usual execution
}
```

## $fx.features(features)

> Calling this function will define the features for the current iteration. You can define various features based on the output of the pseudorandom function. Features will be extracted from an iteration when the metadata generation module of fxhash will generate the metadata of the iteration.

You need to pass an object where keys are the feature names and their values the corresponding feature values. **Values can be of type `string`, `number` or `boolean`.**

```js
// call this function before performing computations
$fx.features({
  'A feature of type string': $fx.rand() > 0.5 ? 'Super cool' : 'Not cool !',
  'Feature number': Math.floor($fx.rand() * 100),
  'A boolean feature': $fx.rand() > 0.8 > true : false,
  'A constant feature': 'constant value',
})
```

Features should also be derived from the `$fx.hash` string and from the `$fx.hash` string only. They should match the visual characteristics of the Token (ie reflect the settings behind the generative process of the token).

::infobox[`$fx.features()` should only be called once, as a call of $fx.features() will erase features set by a previous function call.]{type=warning}

If you want the token features to be available, this function **must be called once the page is loaded**. For instance, the following code might result in features not getting picked up by our module:

```js
// WILL NOT WORK CONSISTENTLY
setTimeout(() => {
  $fx.features({
    // here define the token features
  })
}, 1000)
```

Fxhash automatically computes the rarity of a particular feature by counting the number of occurences among all the tokens of the collection. Two feature values are considered the same if a [strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) between those returns true. If you want the rarity of a feature to be meaningful, you must define its values in a way that ensures multiple occurences to appear.

For instance, this will not work well with the rarity module:

```js
$fx.features({
  // each token will have a different "Intensity" feature value between 0 and 1
  Intensity: fxrand(),
})
```

If defined in such a way, each token will have a different `Intensity` feature value and thus they will all have the same rarity in regard to that feature.

What you can do instead, is to assign a string to a range of values:

```js
function getFeatureString(value) {
  if (value < 0.5) return "low"
  if (value < 0.9) return "medium"
  else return "high"
}

$fx.features({
  // feature can only be "low", "medium" or "high"
  Intensity: getFeatureString(fxrand()),
})
```

With this implementation, the value of the feature will only be `low`, `medium` or `high`. This ensures that the rarity module will correctly assign the `Intensity` feature rarity when a Token is minted. Of course, this is a very naïve implementation, you may want to adapt it to fit your needs in a better way.

## $fx.getFeature(name)

> This function outputs the value of a feature, given its name. Must be called after `$fx.features()`.

The `name` parameter should match a key defined of the object passed to `$fx.features()`.

```js
// defining the features
$fx.features({
  "First feature": 0.5,
  "Another feature": true,
})

// outputs "0.5"
console.log($fx.getFeature("First feature"))

// outputs "true"
console.log($fx.getFeature("Another feature"))
```

Since this function requires the name of the feature to be passed to it, it can become quite verbose and redundant to call it every time you need to access the value of a feature, especially if you need this value a lot. In such a case, we recommend storing the feature value in a variable instead:

```js
const feat1 = "feature value here"
$fx.features({
  "A very long feature name, not practical": feat1,
})
// same outputs
console.log($fx.getFeature("A very long feature name, not practical"))
console.log(feat1)
```

## $fx.getFeatures()

> Returns the whole object passed to the `$fx.features(object)` function. Must be called after `$fx.features()`.

```js
// first define the features
$fx.features({
  "feat 1": 0.8,
  "feat 2": true,
})

// outputs:
// {
//   "feat 1": 0.8,
//   "feat 2": true
// }
console.log($fx.getFeatures())
```

When a capture of an iteration is taken by fxhash capture module, an url parameter `preview=1` is added. The fxhash snippet detects if this parameter is set to 1 and sets `$fx.isPreview` to true or false based on that.

## $fx.params(definition)

> `$fx.params(definition)` can be called to define a list of parameters collectors will have access to when they mint their iteration. Collectors will be able to explore the parametric space you provide, and pick one value for each parameter. `definition` must be an array of objects following strict guidelines, where each object in the array defines one parameter.

::infobox[**`$fx.params()` must be called before trying to access any parameter value.**]{type=warning}

Ex:

```js
// this is how params are defined
$fx.params([
  {
    id: "number_id",
    name: "A number",
    type: "number",
    options: {
      min: -10,
      max: 10,
      step: 0.1,
    },
  },
  {
    id: "boolean_id",
    name: "A boolean",
    type: "boolean",
    //default: true,
  },
  {
    id: "color_id",
    name: "A color",
    type: "color",
  },
])
```

When this function is executed, a few things are happening:

- it store the array you provide as the parameters definition
- it reads the `fxparams` URL parameter, processes the bytes and converts them into values based on the definition you provided
- values are stored and made accessible through utility functions

That's why this function must be called before trying to access any parameter value; its execution will result in the values of parameters being populated.

More details on the [parameter definition specifications](#parameter-definition-specifications) section below.

## $fx.getParam(id)

> Returns the value of a parameter based on the params definition provided to `$fx.params(definition)` and the input bytes passed to the code via URL parameters (`&fxparams={byte_sequence_here}`), the bytes sequence will be processed by `$fx.params()` when it is called. `$fx.getParam(id)` will output the processed value of the parameter where `id` matches the parameter of a same `id`, as defined in your params definition.

```js
// define the params
$fx.params([
  {
    id: "a_param_id", // this property will be used for $fx.getParam(id)
    name: "A random name",
    type: "boolean",
  },
  {
    id: "another_param",
    name: "Super param!",
    type: "color",
  },
])

// depending on the sequence of bytes injected into the code when it's executed,
// the values will be different

// get the value of parameter "A random name"
// output example:
// true
console.log($fx.getParam("a_param_id"))

// get the value of parameter "Super param!"
// output example:
// {
//   arr: {
//     rgb: [25, 6, 158],
//     rgba: [25, 6, 158, 104],
//   },
//   hex: {
//     rgb: "#19069e",
//     rgba: "#19069e68",
//   },
//   obj: {
//     rgb: { r: 25, g: 6, b: 158 },
//     rgba: { r: 25, g: 6, b: 158, a: 104 },
//   }
// }
console.log($fx.getParam("another_param"))
```

Depending on the type of the parameter, the fxhash snippet may apply extra processing to facilitate their usage in your code. See the [parameter definition specifications](#parameter-definition-specifications) section for more details on each parameter type.

## $fx.getParams()

> Returns an object of the processed parameters, where the keys are the parameter ids. Must be called after `$fx.params(definition)`.

```js
// define the params
$fx.params([
  {
    id: "a_param_id", // this property will be used for $fx.getParam(id)
    name: "A random name",
    type: "boolean",
  },
  {
    id: "another_param",
    name: "Super param!",
    type: "color",
  },
])

// depending on the sequence of bytes injected into the code when it's executed,
// the values will be different

// output example:
// {
//   a_param_id: false,
//   another_param: {
//     arr: {
//       rgb: [25, 6, 158],
//       rgba: [25, 6, 158, 104],
//     },
//     hex: {
//       rgb: "#19069e",
//       rgba: "#19069e68",
//     },
//     obj: {
//       rgb: { r: 25, g: 6, b: 158 },
//       rgba: { r: 25, g: 6, b: 158, a: 104 },
//     }
//   }
// }
console.log($fx.getParams())
```

## $fx.getRawParam(id)

> Given a parameter id, returns the hexadecimal string byte sequence corresponding to the parameter, before any processing. Must be called after `$fx.params(definition)`.

```js
// define the params
$fx.params([
  {
    id: "a_param_id", // this property will be used for $fx.getParam(id)
    name: "A random name",
    type: "boolean",
  },
  {
    id: "another_param",
    name: "Super param!",
    type: "color",
  },
])

// depending on the sequence of bytes injected into the code when it's executed,
// the values will be different

// get the value of parameter "A random name"
// output example:
// "01"
console.log($fx.getRawParam("a_param_id"))

// get the value of parameter "Super param!"
// output example:
// "19069e68"
console.log($fx.getParam("another_param"))
```

## $fx.on(eventId, handler, onDone)

> Allows you to subscribe to specific events in the pipeline. Those event subscriptions can be used to trigger effects and override default behaviours

The `eventId` must match an existing `eventId` that you can subscribe to. The `handler` is the function that is called when the event is triggered. Additionally you can opt-out of the default behaviour of an event handler by returning `false` from the handler. The `onDone` function is called as the last thing of any event, e.g. after the default behaviour of the event was applied.

Existing `eventId`'s are:

- `params:update` is triggered whenever values of params are updated

```ts
// define your parameters
$fx.params([
  {
    id: "number_id",
    type: "number",
    update: "sync",
  },
])

function main() {
  // render artwork
}

$fx.on(
  "params:update", // subscribe to the params update event
  (newValues) => {
    // opt-out param update when number_id is 5
    if (newValues.number_id === 5) return false
    // opt-in any other param value update
    return true
  },
  () => main() // render artwork when event was handled
)
```

Following is the typescript definition of the `$fx.on` function:

```ts
type FxOnFunction = (
  eventId: string
  handler: (...args) => boolean | Promise<boolean>
  onDone: (optInDefault: boolean, ...args) => void
) => () => void
```

The function returned by the `$fx.on` function can be called to remove the registered event listener.

```ts
const removeListener = $fx.on("params:update", (newValues) => {
  // do something
})

removeListener() // <-- Will remove the event listener
```

# fx(params)

> fx(params) is the name of the module which gives artists the option to define a set of parameters collectors will modulate before minting their iteration. This section goes into technical details about fx(params).

::infobox[If you want an overview on how fx(params) integrates into the platform, you can read [fx(params) overview documentation](/doc/artist/params).]

## Technical overview

The snippet API exposes a set of utility functions which lets artists define a list of parameters and get the active value of these parameters.

- [`$fx.params()`](#fxparamsdefinition): define the parameters
- [`$fx.getParam()`](#fxgetparamid): get the value of a single parameter
- [`$fx.getParams()`](#fxgetparams): get all the parameter values
- [`$fx.getRawParam()`](#fxgetrawparamid): get the raw value of a single parameter

The `$fx.params(definition)` function must be called first, with an array of parameter definitions. Under the hood, calling this function will serve a few purposes:

- store the parameters definition in-memory, so that it can be exposed to fxhash (or non-fxhash) modules when needed (for instance when displaying controllers)
- process the parameters injected into the document via an URL parameter, and store the values in-memory so that they can be exposed to your code afterwards

![params technical overview](/images/doc/artist/fxparams/params-technical-overview.png)

When working with fx(params), the code needs to receive a sequence of bytes as string of hexadecimal values, so that one value can be mapped to every parameter. It would not be convenient at all to input this string manually, as such we recommend using [fx(lens)](/doc/artist/fxlens) to work on your fx(hash) projects. fx(lens) comes with built-in tools and hot-reloading to facilitate iterating on your project and manipulating the various parameters as you define those in your code.

## Parameter definition specifications

When calling `$fx.params(definition)`, a `definition` array of parameter definitions must be passed to the function. This array must be constant, which means that the same value must be passed every time the code is executed. **There cannot be any source of randomness in the definition**.

A parameter definition is an object following strict guidelines. Ex:

```js
$fx.params([
  {
    id: "number_id",
    name: "A number",
    type: "number",
    options: {
      min: -10,
      max: 10,
      step: 0.1,
    },
  },
  {
    id: "boolean_id",
    name: "A boolean",
    type: "boolean",
  },
  {
    id: "color_id",
    name: "A color",
    type: "color",
  },
])
```

Following is the typescript type of a parameter definition:

```ts
// a parameter definition
type ParameterDefinitionType = {
  id: string // required
  name?: string // optional, if not defined name == id
  type: "number" | "string" | "boolean" | "color" | "select" | "bigint" // required
  default?: string | number | bigint | boolean // optional
  update?: "page-reload" | "sync" // optional
  options?: TYPE_SPECIFIC_OPTIONS // (optional) different options per type (see below)
}
```

Let's go over each property to see what they represent.

---

`id`

**Required**

A string identifier, which will be used to get the parameter value later in the code. This is also used to populate an object of the different parameter [id; value] when the bytes are deserialized into values when `$fx.params()` is called.

**Each id must be unique! Two parameters cannot have the same id.**

---

`name`

_Optional_

A string which will be used as a display name on the minting interface. If not set, the parameter name will be its id. We recommend setting a name for every parameter so that collectors can see a nice text displayed next to the controller. We also recommend sticking with short names to keep the minting UI clean.

---

`type`

**Required**

The type of the parameter, must be one of the available types (`number`, `string`, `boolean`, `color`, `select`, `bigint`). See below for each type specification.

---

`default`

_Optional_

A default value for the parameter. If defined, when the minting interface with the controllers is loaded, the corresponding value of the controller will be set to this one. If not set, the controller value will be set to a random one within the constraints defined in the parameter options.

---

`update`

_Optional_

Specifies the update mode of the parameter. The default update mode is `"page-reload"`. With update mode `"page-reload"`, a full page reload on the artwork is performed whenever the value of the parameter changes. When the update mode is set to `"sync"` the parameter values are updated during the runtime of the artwork - no page reload is performed when the parameter values change.

---

`options`

_Optional_

An object with type-specific options. Each type has specific options, described in the section below. Default values are used for each option if not defined. The default values are also described in the section below.

---

### The different parameter types

Each type comes with specifications:

- a list of available options
- a format in which the bytes are deserialized and made available to your code
- a kind of controller which will be displayed to modulate the parameter (this will happen outside the context of the piece itself, most often in a parent context)

Let's go over each type.

---

`number`

Numbers are deserialized into [javascript float64 numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) (default javascript number type).

**Options**

| Property | Type   | Default                                                                                                               | Description                                                                                                                                                                                                                                                                        |
| -------- | ------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| min      | number | [Number.MIN_VALUE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE) | The minimum value the number can take. Controllers will be bound to [min; max]                                                                                                                                                                                                     |
| max      | number | [Number.MAX_VALUE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE) | The maximum value the number can take. Controllers will be bound to [min; max]                                                                                                                                                                                                     |
| step     | number | undefined                                                                                                             | If defined, specifies the granularity that the value must adhere to. Only values which are equal to the basis for stepping (`default` if specified, `min` otherwise, eventually the random value generated if none are specified) are valid. If undefined, any number is accepted. |

Example:

```js
$fx.params([
  {
    id: "a_number",
    name: "A number",
    type: "number",
    default: 5,
    options: {
      min: -10,
      max: 10,
      step: 1,
    },
  },
])
```

Corresponding controller:

![a slider and a text input](/images/doc/artist/fxparams/controller-number.png)

---

`string`

Strings are deserialized into a series of UTF-8 characters.

**Options**

| Property  | Type   | Default | Description                                                                                                                                                                                                    |
| --------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| minLength | number | 0       | The minimum number of characters which has to be inputted                                                                                                                                                      |
| maxLength | number | 64      | The maximum number of character which can be inputted. We recommend keeping this value as low as possible, because this will always be the number of bytes sent onchain, even if a smaller string is inputted. |

Example:

```js
$fx.params([
  {
    id: "a_string",
    name: "A string",
    type: "string",
    default: "Default value",
    options: {
      minLength: 5,
      maxLength: 32,
    },
  },
])
```

Corresponding controller:

![a text input](/images/doc/artist/fxparams/controller-string.png)

---

`boolean`

Booleans are deserialized into native javascript booleans.

_There are no available options for the boolean type._

Example:

```js
$fx.params([
  {
    id: "a_boolean",
    name: "A boolean",
    type: "boolean",
    default: false,
  },
])
```

Corresponding controller:

![a checkbox](/images/doc/artist/fxparams/controller-boolean.png)

---

`color`

Colors are serialized with 4 bytes, each byte representing the value between 0 and 255 of one channel (red, green, blue, alpha). When a color is deserialized, it is processed into an utility-object to facilitate their usage. The object is constructed as follows:

```js
{
  arr: {
    rgb: [25, 6, 158],
    rgba: [25, 6, 158, 104],
  },
  hex: {
    rgb: "#19069e",
    rgba: "#19069e68",
  },
  obj: {
    rgb: { r: 25, g: 6, b: 158 },
    rgba: { r: 25, g: 6, b: 158, a: 104 },
  }
}
```

_There are no available options for the color type._

Example:

```js
$fx.params([
  {
    id: "a_color",
    name: "A color",
    type: "color",
    default: "abababff",
  },
])
```

Corresponding controller:

![a color picker and a text input](/images/doc/artist/fxparams/controller-color.png)

---

`select`

A select is defined by a list of strings, where each string defines an option which can be selected. A select can take up to 256 entries. A select is stored as a single byte onchain, which is the hexadecimal representation of a number between 0 and 255, corresponding to the index of the selected option in the array of options. When deserialized, the string of the option is extracted.

The options property of a select is required and must be an array of strings, corresponding to the available options.

**Options**

| Property | Required     | Type     | Default | Description                                                          |
| -------- | ------------ | -------- | ------- | -------------------------------------------------------------------- |
| options  | **Required** | string[] | /       | A list of strings, corresponding to available options in the select. |

Example:

```js
$fx.params([
  {
    id: "a_select",
    name: "A select",
    type: "select",
    default: "one",
    options: {
      options: ["one", "two", "three", "four"],
    },
  },
])

// output example:
// "one"
console.log($fx.getParam("a_select"))
```

Corresponding controller:

![a select with various options](/images/doc/artist/fxparams/controller-select.png)

---

`bigint`

A bigint is deserialized into an int64, which is the [BigInt javascript type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). Bigint can represent very big integer values which cannot be represented usually with javascript float numbers (between `-9223372036854775808` and `9223372036854775807`). If you need an integer value between `-9007199254740991` and `9007199254740991`, use the `number` type instead as integer values can be represented with 100% precision with float64.

**Options**

| Property | Type   | Default                | Description                                                                    |
| -------- | ------ | ---------------------- | ------------------------------------------------------------------------------ |
| min      | number | `-9223372036854775808` | The minimum value the number can take. Controllers will be bound to [min; max] |
| max      | number | `9223372036854775807`  | The maximum value the number can take. Controllers will be bound to [min; max] |

Example:

```js
$fx.params([
  {
    id: "a_bigint",
    name: "A BigInt",
    type: "bigint",
    default: 1458965n,
    options: {
      min: -1000000000000000n,
      max: 1000000000000000n,
    },
  },
])
```

Corresponding controller:

![a slider and a text input](/images/doc/artist/fxparams/controller-bigint.png)

# Snippet code

> The following code must be inserted in the `<head></head>` section of fxhash projects. This is the code which exposes the fxhash snippet API.

::infobox[This snippet is already integrated in the [fxhash boilerplate](/doc/artist/fxlens#fxlens--boilerplate), so if you are working with it you don't need to add anything.]

```html
<script id="fxhash-snippet">
  //---- do not edit the following code (you can indent as you wish)
  let search = new URLSearchParams(window.location.search)
  let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  let b58dec = (str) =>
    [...str].reduce(
      (p, c) => (p * alphabet.length + alphabet.indexOf(c)) | 0,
      0
    )
  // make fxrand from hash
  var fxhash =
    search.get("fxhash") ||
    "oo" +
      Array(49)
        .fill(0)
        .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
        .join("")
  let fxhashTrunc = fxhash.slice(2)
  let regex = new RegExp(".{" + ((fxhash.length / 4) | 0) + "}", "g")
  let hashes = fxhashTrunc.match(regex).map((h) => b58dec(h))
  let sfc32 = (a, b, c, d) => {
    return () => {
      a |= 0
      b |= 0
      c |= 0
      d |= 0
      var t = (((a + b) | 0) + d) | 0
      d = (d + 1) | 0
      a = b ^ (b >>> 9)
      b = (c + (c << 3)) | 0
      c = (c << 21) | (c >>> 11)
      c = (c + t) | 0
      return (t >>> 0) / 4294967296
    }
  }
  var fxrand = sfc32(...hashes)
  // make fxrandminter from minter address
  var fxminter =
    search.get("fxminter") ||
    "tz1" +
      Array(33)
        .fill(0)
        .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
        .join("")
  let fxminterTrunc = fxminter.slice(3)
  regex = new RegExp(".{" + ((fxminterTrunc.length / 4) | 0) + "}", "g")
  hashes = fxminterTrunc.match(regex).map((h) => b58dec(h))
  var fxrandminter = sfc32(...hashes)

  // true if preview mode active, false otherwise
  // you can append preview=1 to the URL to simulate preview active
  var isFxpreview = search.get("preview") === "1"
  // call this method to trigger the preview
  function fxpreview() {
    window.dispatchEvent(new Event("fxhash-preview"))
    setTimeout(() => fxpreview(), 500)
  }
  // get the byte params from the URL
  let fxparams = search.get("fxparams")
  fxparams = fxparams ? fxparams.replace("0x", "") : fxparams

  // the parameter processor, used to parse fxparams
  const processors = {
    number: {
      deserialize: (input) => {
        const view = new DataView(new ArrayBuffer(8))
        for (let i = 0; i < 8; i++) {
          view.setUint8(i, parseInt(input.substring(i * 2, i * 2 + 2), 16))
        }
        return view.getFloat64(0)
      },
      bytesLength: () => 8,
      constrain: (value, definition) => {
        let min = Number.MIN_SAFE_INTEGER
        if (typeof definition.options?.min !== "undefined")
          min = Number(definition.options.min)
        let max = Number.MAX_SAFE_INTEGER
        if (typeof definition.options?.max !== "undefined")
          max = Number(definition.options.max)
        max = Math.min(max, Number.MAX_SAFE_INTEGER)
        min = Math.max(min, Number.MIN_SAFE_INTEGER)
        const v = Math.min(Math.max(value, min), max)
        return v
      },
      random: (definition) => {
        let min = Number.MIN_SAFE_INTEGER
        if (typeof definition.options?.min !== "undefined")
          min = Number(definition.options.min)
        let max = Number.MAX_SAFE_INTEGER
        if (typeof definition.options?.max !== "undefined")
          max = Number(definition.options.max)
        max = Math.min(max, Number.MAX_SAFE_INTEGER)
        min = Math.max(min, Number.MIN_SAFE_INTEGER)
        const v = Math.random() * (max - min) + min
        if (definition?.options?.step) {
          const t = 1.0 / definition?.options?.step
          return Math.round(v * t) / t
        }
        return v
      },
    },
    bigint: {
      deserialize: (input) => {
        const view = new DataView(new ArrayBuffer(8))
        for (let i = 0; i < 8; i++) {
          view.setUint8(i, parseInt(input.substring(i * 2, i * 2 + 2), 16))
        }
        return view.getBigInt64(0)
      },
      bytesLength: () => 8,
      random: (definition) => {
        const MIN_SAFE_INT64 = -9223372036854775808n
        const MAX_SAFE_INT64 = 9223372036854775807n
        let min = MIN_SAFE_INT64
        let max = MAX_SAFE_INT64
        if (typeof definition.options?.min !== "undefined")
          min = BigInt(definition.options.min)
        if (typeof definition.options?.max !== "undefined")
          max = BigInt(definition.options.max)
        const range = max - min
        const bits = range.toString(2).length
        let random
        do {
          random = BigInt(
            "0b" +
              Array.from(
                crypto.getRandomValues(new Uint8Array(Math.ceil(bits / 8)))
              )
                .map((b) => b.toString(2).padStart(8, "0"))
                .join("")
          )
        } while (random > range)
        return random + min
      },
    },
    boolean: {
      // if value is "00" -> 0 -> false, otherwise we consider it's 1
      deserialize: (input) => {
        return input === "00" ? false : true
      },
      bytesLength: () => 1,
      random: () => Math.random() < 0.5,
    },
    color: {
      deserialize: (input) => input,
      bytesLength: () => 4,
      transform: (input) => {
        const r = parseInt(input.slice(0, 2), 16)
        const g = parseInt(input.slice(2, 4), 16)
        const b = parseInt(input.slice(4, 6), 16)
        const a = parseInt(input.slice(6, 8), 16)
        return {
          hex: {
            rgb: "#" + input.slice(0, 6),
            rgba: "#" + input,
          },
          obj: {
            rgb: { r, g, b },
            rgba: { r, g, b, a },
          },
          arr: {
            rgb: [r, g, b],
            rgba: [r, g, b, a],
          },
        }
      },
      constrain: (value, definition) => {
        const hex = value.replace("#", "")
        return hex.slice(0, 8).padEnd(8, "f")
      },
      random: () =>
        `${[...Array(8)]
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")}`,
    },
    string: {
      deserialize: (input) => {
        const hx = input.match(/.{1,4}/g) || []
        let rtn = ""
        for (let i = 0; i < hx.length; i++) {
          const int = parseInt(hx[i], 16)
          if (int === 0) break
          rtn += String.fromCharCode(int)
        }
        return rtn
      },
      bytesLength: (options) => {
        if (typeof options?.maxLength !== "undefined")
          return Number(options.maxLength) * 2
        return 64 * 2
      },
      constrain: (value, definition) => {
        let min = 0
        if (typeof definition.options?.minLength !== "undefined")
          min = definition.options.minLength
        let max = 64
        if (typeof definition.options?.maxLength !== "undefined")
          max = definition.options.maxLength
        let v = value.slice(0, max)
        if (v.length < min) {
          return v.padEnd(min)
        }
        return v
      },
      random: (definition) => {
        let min = 0
        if (typeof definition.options?.minLength !== "undefined")
          min = definition.options.minLength
        let max = 64
        if (typeof definition.options?.maxLength !== "undefined")
          max = definition.options.maxLength
        const length = Math.round(Math.random() * (max - min) + min)
        return [...Array(length)]
          .map((i) => (~~(Math.random() * 36)).toString(36))
          .join("")
      },
    },
    select: {
      deserialize: (input, definition) => {
        return (
          definition.options.options[parseInt(input, 16)] || definition.default
        )
      },
      bytesLength: () => 1,
      constrain: (value, definition) => {
        if (definition.options.options.includes(value)) {
          return value
        }
        return definition.options.options[0]
      },
      random: (definition) => {
        const index = Math.round(
          Math.random() * (definition?.options?.options?.length - 1) + 0
        )
        return definition?.options?.options[index]
      },
    },
  }

  // takes the parameters as bytes and outputs an object with the
  // deserialized parameters, identified by their id in an object
  const deserializeParams = (bytes, definition) => {
    const params = {}
    for (const def of definition) {
      const processor = processors[def.type]
      // if we don't have any parameters defined in the URL, set the
      // default value and move on
      if (!bytes) {
        let v
        if (typeof def.default === "undefined") v = processor.random(def)
        else v = def.default
        params[def.id] = processor.constrain?.(v, def) || v
        continue
      }
      // extract the length from the bytes & shift the initial bytes string
      const valueBytes = bytes.substring(
        0,
        processor.bytesLength(def?.options) * 2
      )
      bytes = bytes.substring(processor.bytesLength(def?.options) * 2)
      // deserialize the bytes into the params
      const value = processor.deserialize(valueBytes, def)
      params[def.id] = processor.constrain?.(value, def) || value
    }
    return params
  }

  const transformParamValues = (values, definitions) => {
    const paramValues = {}
    for (const def of definitions) {
      const processor = processors[def.type]
      const value = values[def.id]
      // deserialize the bytes into the params
      paramValues[def.id] = processor.transform
        ? processor.transform(value)
        : value
    }
    return paramValues
  }

  window.$fx = {
    _version: "3.0.0",
    _processors: processors,
    // where params def & features will be stored
    _params: undefined,
    _features: undefined,
    // where the parameter values are stored
    _paramValues: {},

    hash: fxhash,
    rand: fxrand,

    minter: fxminter,
    randminter: fxrandminter,

    preview: fxpreview,
    isPreview: isFxpreview,
    params: function (definition) {
      // todo: maybe do some validation on the dev side ?
      // or maybe not ?
      this._params = definition
      this._rawValues = deserializeParams(fxparams, definition)
      this._paramValues = transformParamValues(this._rawValues, definition)
    },
    features: function (features) {
      this._features = features
    },
    getFeature: function (id) {
      return this._features[id]
    },
    getFeatures: function () {
      return this._features
    },
    getParam: function (id) {
      return this._paramValues[id]
    },
    getParams: function () {
      return this._paramValues
    },
    getRawParam: function (id) {
      return this._rawValues[id]
    },
    getRawParams: function () {
      return this._rawValues
    },
    getDefinitions: function () {
      return this._params
    },
    stringifyParams: function (params) {
      return JSON.stringify(
        params,
        (key, value) => {
          if (typeof value === "bigint") return value.toString()
          return value
        },
        2
      )
    },
  }
  window.addEventListener("message", (event) => {
    if (event.data === "fxhash_getInfo") {
      parent.postMessage(
        {
          id: "fxhash_getInfo",
          data: {
            version: window.$fx._version,
            hash: window.$fx.hash,
            features: window.$fx.getFeatures(),
            params: {
              definitions: window.$fx.getDefinitions(),
              values: window.$fx.getRawParams(),
            },
            minter: window.$fx.minter,
          },
        },
        "*"
      )
    }
  })
  // END NEW

  //---- /do not edit the following code
</script>
```
