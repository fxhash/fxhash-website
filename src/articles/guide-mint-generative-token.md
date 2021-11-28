---
title: 'Guide to mint a Generative Token'
date: '2021-10-20'
description: 'Learn how to create and mint a Generative Token on fxhash'
---

This document will walk you through all the concepts you need to know to understand how you can build and mint a **Generative Token** (GT) on **fxhash**.


# Table of Contents


# Knowledge requirements

GT on fxhash can only be written in **html/css/javascript**. Ultimately, GT are documents which can be interpreted by a web browser. When someone will collect your GT, it will create a unique web document derived from the one you provided. Don't worry, as an artist, the generation process is automated, and if you follow the guidelines it should be straightforward to implement a GT. However, you will need to know how to render graphics within a web document to use the platform.

# General overview

*This section will give you a rough overview of the Generative Tokens on fxhash. Don't worry if some informations are missing for you to properly understand the process, it will be covered later in this document.*

## 1. Upload and mint a GT

First, you upload your project and mint it as a Generative Token. This project is a tiny website which sole purpose is to generate some visuals based on a 51-characters [base 58](https://en.bitcoinwiki.org/wiki/Base58) encoded number (Tezos transaction hashes have the same signature). The project needs to be designed in a way that, when the same string is given to it, it **always produces the same output**. However, a different string should produce a **different output**.

![Generative Token overview](/images/articles/overview.jpg)

## 2. Your project is stored

Your project will be stored on the [IPFS](https://ipfs.io/) network, and then stored on the tezos blockchain. It ensures its immutability.

## 3. People mint a unique token from your GT

When a GT is successfully minted on the platform, anyone will be able to mint a unique token from it. When such an event arises, the hash of the transaction is injected into a new instance of your project. Then, this new *website* is uploaded to IPFS, and is assigned to the metadata of the new Token. This process ensures that each token minted from your GT will be independent, self-contained and immutable. Anyone will get a unique link to a website stored on IPFS.

![Mint overview](/images/articles/mint-desc.jpg)

## 4. Image preview

When a token is minted, fxhash provides a service to generate a preview, which will be attached to the tokens as an alternate way to visualize them.


# How to build a GT

*This section covers the different aspects you need to know to create a GT.*

## Project structure

All the files needed by your project must be in the same directory, with an `index.html` file at its root.

## Resources

When you link to a file in your index.html, paths must be relative.

- `src="./path/to/file.js"` -> OK
- `src="/path/to/file.js"` -> **NOT** OK

You can use as many sub-directories as you see fit.

## fxhash code snippet

fxhash requires you to insert the following code snippet in the `<head>` section of your `index.html`

```html
<script id="fxhash-snippet">
  //---- do not edit the following code (you can indent as you wish)
  let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  var fxhash = "oo" + Array(49).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('')
  let b58dec = (str) => str.split('').reduce((p,c,i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0)
  let fxhashTrunc = fxhash.slice(2)
  let regex = new RegExp(".{" + ((fxhashTrunc.length/4)|0) + "}", 'g')
  let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
  let sfc32 = (a, b, c, d) => {
    return () => {
      a |= 0; b |= 0; c |= 0; d |= 0
      var t = (a + b | 0) + d | 0
      d = d + 1 | 0
      a = b ^ b >>> 9
      b = c + (c << 3) | 0
      c = c << 21 | c >>> 11
      c = c + t | 0
      return (t >>> 0) / 4294967296
    }
  }
  var fxrand = sfc32(...hashes)
  //---- /do not edit the following code
</script>
```

This snippet serves 2 purposes: 

- some parts of it will be replaced by fxhash to generate unique tokens from your GT (a static hash will be inserted instead of the random generation)
- during the development stages, it emulates eventual hashes your program could get as an input. Every time you refresh the page, it generates a random hash. This way, you can really build your GT properly before deploying it.

The code snippet exposes 2 variables:

- `fxhash`: a random 51 characters base 58 encoded string (designed to have the same signature has a Tezos transaction hash). When someone mints a unique Token from a Generative Token, the transaction hash is hardcoded in place of the code that generates a random one.
- `fxrand()`: a PRNG function that generates deterministic PRN between 0 and 1. **Simply use it instead of Math.random()**.

**Those 2 variable/function will be globally accessible by your program, and must be used to drive any random process required by your piece**.

## Features

Fxhash supports the definition of features. To add features to a Token, you simply have to populate a `$fxhashFeatures` object in the `window` object.

```js
window.$fxhashFeatures = {
  // here define the token features
}
```

If you want the token features to be available, the `window.$fxhashFeatures` **must be defined once the page is loaded**. For instance, the following code might result in features not getting picked up by our module:

```js
// WILL NOT WORK CONSISTENTLY
setTimeout(() => {
  window.$fxhashFeatures = {
    // here define the token features
  }
}, 1000)
```

Each propery of the `$fxhashFeatures` object will define one feature of the Tokens.

Features should also be derived from the `fxhash` string and from the `fxhash` string only. They should match the visual characteristics of the Token (ie reflect the settings behind the generative process of the token).

The type of a feature value can **only** be `string`, `number` or `boolean`. Any other type will be discarded.

For instance, this object will define 3 features:

```js
window.$fxhashFeatures = {
  "Dark": true,
  "Colors number": 7,
  "Head size": "Big"
}
```

Fxhash automatically computes the rarity of a particular feature by counting the number of occurences among all the tokens of the collection. Two feature values are considered the same if a [strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) between those returns true. If you want the rarity of a feature to be meaningful, you must define its values in a way that ensures multiple occurences to appear.

For instance, this will not work well with the rarity module:

```js
window.$fxhashFeatures = {
  // each token will have a different "Super" feature value between 0 and 1
  "Super": fxrand()
}
```

If defined in such a way, each token will have a different "Super" feature value and thus they will all have the same rarity in regard to that feature.

What you can do instead, is to assign a string to a range of values:

```js
function getFeatureString(value) {
  if (value < 0.5) return "low"
  if (value < 0.9) return "medium"
  else return "high"
}

window.$fxhashFeatures = {
  // feature can only be "low", "medium" or "high"
  "Super": getFeatureString(fxrand())
}
```

With this implementation, the value of the feature will only be `low`, `medium` or `high`. This ensures that the rarity module will correctly assign the `Super` feature rarity when a Token is minted. Of course, this is a very naïve implementation, you may want to adapt it to fit your needs in a better way.

## Zip, test & mint

Once you are done developing your GT, you will need to compress all of its content into a ZIP archive. fxhash only accepts the ZIP format. The `index.html` file must be located at the root of the archive.

Once you have your ZIP file, you can check that it behaves properly by uploading it to the [sandbox](/sandbox). The sandbox can be used as a quick way to test your project.

Once you have properly tested your project, you can [mint](/mint-generative) it by following the instructions on the page.


# How to publish (mint) a GT

## Sync your wallet

First of all, you will need to have a Tezos wallet and sync your wallet with fxhash.

## Mint your GT

Once your GT is ready to be published (once you carefully tested it in the sandbox), you can [open the mint page](/mint-generative). This page will guide you through the different steps of the process:

* **upload to IPFS**: drop your .ZIP file and wait until it gets uploaded to IPFS
* **check files**: check again if your project behaves properly once uploaded to IPFS. Also if you implemented features, check if they work properly. This step is also used to configure which hash will be used for the preview of your project.
* **configure capture**: select the capture mode and configure it. Also check if the capture is working properly
* **verifications**: last check to see if token & capture work as intended
* **mint**: enter informations about the Token & call the contract to mint

## Configure capture settings

This step will define how should the capture module generate preview of the tokens generated by your GT. You have 3 modes available for the capture:

* **From \<canvas\>**: capture module will directly grab the data of the canvas selected in the document with the CSS selector you provided. The preview will have the same size as the canvas.
* **Viewport capture**: the capture will be made on the whole viewport, set at the resolution you will provide.
* ~~**Custom function**~~ (not available yet): implement a custom function to provide the image directly from your code.


# Guidelines

*Some guidelines must be followed to ensure your GT works properly*.

## Network requests

You **cannot** make any network request. If you need an external library/font/image, you must put it in your project folder. I know, this isn't an ideal workflow, but the point is to create **self-contained** tokens which can execute properly regardless of external conditions.

## Respond to window size

Your web page must be responsive (ie adapt itself to any screen size). Moreover, we advise that your application should respond to the "resize" event of the "window". It may eventually happen in the lifetime of the tokens that the viewport size changes during its execution. *If you want to keep a fixed size canvas, you can do so, and maybe center the canvas in the viewport*.

## Random numbers generation

Your program must use pseudorandom number generation with a seed, where the seed is the `fxhash` variable. You can use the `fxrand()` function for that matter. It implements the *Small Fast Counter* algorithm, which is part of the PracRand PRNG test suite. It passes PractRand, as well as Crush/BigCrush (TestU01). It's fast, and its usage is recommended. You can however use your own PRNG function as long as you give it the `fxhash` seed.

## Other

- the ZIP file must be **under 15 Mo**. Please try to optimize your projects as much as possible.


# 3 ways to start a project

*This section will provide you with some boilerplate projects to make the development on your GT easier.*

## Using our webpack boilerplate

We encourage you to use our [webpack boilerplate](https://github.com/fxhash/fxhash-webpack-boilerplate), specifically designed to create projects on fxhash. It comes with the following features:

- **already setup**: code snippet is injected, you can start to work on your content immediately
- **local environment** with [Live Reload](https://webpack.js.org/configuration/dev-server/#devserverlivereload) so that you can iterate faster on your projects
- **javascript imports**: you can import npm packages, use the import syntax, and webpack will bundle everything in a single minified javascript file
- **automated deployment**: run a command to build your files and create a ZIP archive ready to be deployed on fxhash

All the instructions are in the README in the [Github repository](https://github.com/fxhash/fxhash-webpack-boilerplate).

## Using our simplest boilerplate

We also provide a [simpler boilerplate](https://github.com/fxhash/fxhash-simple-boilerplate), with a single html and javascript file. The snippet is already injected, but that's it.

## Starting from scratch

You can also start from scratch, just remember to inject the snippet in the `<head>` of your index, before importing your scripts.


# Have fun

We hope this guide will cover most of what you need to know to build tokens on fxhash. If you have any issues, feel free to join our Discord server: [https://discord.gg/nrPXd3Cn](https://discord.com/invite/wzqxfdCKCC)