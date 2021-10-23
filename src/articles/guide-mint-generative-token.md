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

First, you upload your project and mint it as a Generative Token. This project is a tiny website which sole purpose is to generate some visuals based on 64 characters hexadecimal string. The project needs to be designed in a way that, when the same string is given to it, it **always produces the same output**. However, a different string should produce a **different output**.

![Generative Token overview](/images/articles/overview.png)

## 2. Your project is stored

Your project will be stored on the [IPFS](https://ipfs.io/) network, and then stored on the tezos blockchain. It ensures its immutability.

## 3. People mint a unique token from your GT

When a GT is successfully minted on the platform, anyone will be able to mint a unique token from it. When such an event arises, a random 64 characters hexadecimal string is generated and is injected into a new instance of your project. Then, this new *website* is uploaded to IPFS, to finally be minted on the blockchain. This process ensures that each token minted from your GT will be independent, self-contained and immutable. Anyone will get a unique link to a website stored on IPFS.

![Mint overview](/images/articles/mint-desc.png)

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
  let charSet='abcdef0163456789'
  var fxhash=Array(64).fill(0).map(_=>charSet[(Math.random()*charSet.length)|0]).join('')
  var fxhashValues=fxhash.match(/.{4}/g).map(s=>parseInt(s,16)).map(n=>n/(10**((''+n).length-1))).map(n=>n-(n|0))
  var fxhashValues2=fxhash.match(/.{8}/g).map(s=>parseInt(s,16)).map(n=>n/(10**((''+n).length-1))).map(n=>n-(n|0))
  //---- do not edit the following code
</script>
```

This snippet serves 2 purposes: 

- it will be replaced by fxhash to generate unique tokens from your GT
- during the development stages, it emulates eventual hashes your program could get as an input. Every time you refresh the page, it generates a random hash. This way, you can really build your GT properly before deploying it.

The code snippet exposes 3 variables:

- `fxhash`: a random 64 characters hexadecimal string. This particular variable will be hardcoded with a static hash when someone mints a token from your GT
- `fxhashValues`: an array of 16 pseudo-random values derived from the random hash
- `fxhashValues2`: an array of 8 pseudo-random values derived from the random hash (with more precision than `fxhashValues`)

**Those 3 variables will be globally accessible by your program, and must be used to drive any random process your piece requires**.

## Zip, test & mint

Once you are done developing your GT, you will need to compress all of its content into a ZIP archive. fxhash only accepts the ZIP format. The `index.html` file must be located at the root of the archive.

Once you have your ZIP file, you can check that it behaves properly by uploading it to the [sandbox](/sandbox). The sandbox can be used as a quick way to test your project.

Once you have properly tested your project, you can [mint](/mint-generative) it by following the instructions on the page.


# Guidelines

*Some guidelines must be followed to ensure your GT works properly*.

## Network requests

You **cannot** make any network request. If you need an external library/font/image, you must put it in your project folder. I know, this isn't an ideal workflow, but the point is to create **self-contained** tokens which can execute properly regardless of external conditions.

## Respond to window size

Your web page must be responsive (ie adapt itself to any screen size). Moreover, we advise that your application should respond to the "resize" event of the "window". It may eventually happen in the lifetime of the tokens that the viewport size changes during its execution. *If you want to keep a fixed size canvas, you can do so, and maybe center the canvas in the viewport*.

## Random numbers generation

If your program needs more random numbers that those provided by fxhash, you must ensure that those numbers will always be the same every time your program executes with the same hash string as input. To achieve that, you can for instance use some Pseudorandom Number Generators (PRNG) where a seed can be provided. You can learn more about it in this [stackoverflow thread](https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript) for instance.

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

We also provide a simpler boilerplate, with a single html and javascript file. The snippet is already injected, but that's it.

## Starting from scratch

You can also start from scratch, just remember to inject the snippet in the `<head>` of your index, before importing your scripts.


# Have fun

We hope this guide will cover most of what you need to know to build tokens on fxhash. If you have any issues, feel free to join our Discord server: [https://discord.gg/nrPXd3Cn](https://discord.gg/nrPXd3Cn)