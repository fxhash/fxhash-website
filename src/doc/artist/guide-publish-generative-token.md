---
title: "Guide to publish a Generative Token"
date: "2023-03-20"
description: "Learn how to create and publish a Generative Token on fxhash"
---

> This document will walk you through all the concepts you need to know to understand how you can build and publish a **Generative Token** (GT) on **fxhash**.

# Table of Contents

# Knowledge requirements

GT on fxhash can only be written in **html/css/javascript**. Ultimately, GT are documents which can be interpreted by a web browser. When someone will collect an iteration of your GT, the web document you created will be used and the unique data for the given iteration will be injected into the document. Don't worry, as an artist, the generation process is automated, and if you follow the guidelines it should be straightforward to implement a GT. However, you will need to know how to render graphics within a web document to use the platform.

# General overview

> This section will give you a rough overview of the Generative Tokens on fxhash. Don't worry if some informations are missing for you to properly understand the process, some particular aspects are covered in other parts of our documentation.

## Upload and mint a GT

First, you upload your project and mint it as a Generative Token. This project is a tiny website which sole purpose is to generate some visual/audio based on a 51-characters [base 58](https://en.bitcoinwiki.org/wiki/Base58) encoded number (Tezos transaction hashes have the same signature). The project needs to be designed in a way that, when the same string is given to it, it **always produces the same output**. However, a different string should produce a **different output**.

![Generative Token overview](/images/articles/guide-mint/overview.jpg)

## Your project is stored

Your project will be stored on the [IPFS](https://ipfs.io/) network, and then stored on the tezos blockchain. **It ensures its immutability**.

## People mint a unique token from your GT

When a GT is published on the platform, anyone will be able to mint unique iterations from it. When such an event arises, the mint transaction generates a unique hash. The hash is sent as a URL parameter to your project. A [code snippet](#fxhash-code-snippet) is used to get this hash from the URL so that it can be used in your code.

![Mint overview](/images/articles/guide-collect/guide-mint.jpg)

## Image preview

When a token is minted, fxhash provides a service to generate a preview, which will be attached to the tokens as an alternate way to visualize them.

# How to build a Generative Token

To facilitate the creation of fxhash projects, we have created a fully-featured development environment. We recommend its usage to remove the pain of setting up the files manually.

![screenshot of fxlens](/images/doc/artist/lens/lens-1.png)

::github[fxhash boilerplate]{href=https://github.com/fxhash/fxhash-boilerplate desc="fxhash official boilerplate, fully-featured development environment with many utilities to work and publish a fxhash project."}

::infobox[More information on this dev environment on the [fxlens documentation page](/doc/artist/fxlens).]

# How is a Generative Token structured

> This section covers different aspect on the structure and specifications of Generative Tokens. If you are using the fxhash boilerplate, many of the requirements are supported out-of-the-box.

## Project structure

All the files needed by your project must be in the same directory, with an `index.html` file at its root.

## Resources

When you link to a file in your index.html, paths must be relative.

- `src="./path/to/file.js"` -> OK
- `src="/path/to/file.js"` -> **NOT** OK

You can use as many sub-directories as you see fit.

## fxhash code snippet

fxhash requires projects to inject a [code snippet](/doc/artist/snippet-api#snippet-code) in the `<head>` section of the `index.html`. This snippet exposes an API to interact with fxhash modules, described in the [Snippet API documentation](/doc/artist/snippet-api).

## Zip, test & mint

Once you are done developing your GT, you will need to compress all of its content into a ZIP archive. fxhash only accepts the ZIP format. The `index.html` file must be located at the root of the archive.

Once you have your ZIP file, you can check that it behaves properly by uploading it to the [sandbox](/sandbox). The sandbox can be used as a quick way to test your project.

Once you have properly tested your project, you can [mint](/mint-generative) it by following the instructions on the page.

# Leverage fxhash modules for your projects

> fxhash is built with modularity in mind. The snippet injected into the code gives access to those various modules, listed below.

- [`fx(params)`](/doc/artist/params): gives artists the option to define a set of parameters collectors will modulate before minting their iteration
- [`features`](/doc/artist/snippet-api#fxfeaturesfeatures): can be used to expose the features of an iteration

::infobox[The [Snippet API documentation page](/doc/artist/snippet-api) goes in-depth into what can be done with the various fxhash modules.]{type=info}

# How to publish (mint) a GT

## Sync your wallet

First of all, you will need to have a Tezos wallet synced with fxhash.

## Mint your GT

Once your GT is ready to be published (once it's been carefully tested in the sandbox), you can [open the mint page](/mint-generative). This page will guide you through the different steps of the process:

- **authoring**: select who's authoring the piece: yourself alone or collaboration ?
- **upload to IPFS**: drop your .ZIP file and wait until it gets uploaded to IPFS through fxhash servers
- **check files**: check again if your project behaves properly once uploaded to IPFS. Also if you implemented features, check if they work properly. This step is also used to configure which hash will be used for the preview of your project.
- **configure capture**: select the capture mode and configure it. Also check if the capture is working properly
- **verifications**: a comparative check between the preview & the live version
- **distribution**: number of editions, pricing & general distribution settings
- **explore variation settings**: configure the variations a collector can explore when viewing your token
- **project details**: contextual informations about your piece
- **preview & mint**: a preview of your project once published, and the mint button

There are lots of steps, but each step is required for your project to be released in the best possible conditions.

You can find more information on individual steps in the following articles:

- [Capture settings](/doc/artist/project-settings#capture-settings)
- [Explore variation settings](/doc/artist/project-settings#explore-variation-settings)
- [Reserves](/doc/artist/project-settings#reserves)
- [Pricing your project](/doc/artist/pricing-your-project)

# Guidelines

> Some guidelines must be followed to ensure your Generative Token works properly.

## Network requests

You **cannot** make any network request. If you need an external library/font/image, you must put it in your project folder. I know, this isn't an ideal workflow, but the point is to create **self-contained** tokens which can execute properly regardless of external conditions.

## Respond to window size

Your web page must be responsive (ie adapt itself to any screen size). Moreover, we advise that your application should respond to the "resize" event of the "window". It may eventually happen in the lifetime of the tokens that the viewport size changes during its execution. _If you want to keep a fixed size canvas, you can do so, and maybe center the canvas in the viewport_.

## Random numbers generation

Your program must use pseudorandom number generation with a seed, where the seed is the `fxhash` variable. You can use the [`$fx.rand()`](/doc/artist/snippet-api#fxrand) function for that matter.

## Other

- the ZIP file must be **<= 30 MB**. Please try to optimize your projects as much as possible.

# Best practices and common mistakes

> A list of best practices and common mistakes (and how to fix them) to ensure that your token has as long a life as possible.

## Test often

This section comes first as it's the most important in ensuring that your token is as good as you can make it. Remember that once you release, you can't edit the token, so make sure to test as often as you can when developing.

Testing often will also allow you to catch problems early that would become big issues later on. Nobody likes to get to the minting stage - or worse, selling out - only to discover that their token doesn't work properly.

## Resolutions and DPRs

> Ensure your token looks the same in all resolutions and DPRs.

It is ideal if your token produces the same artwork at different sizes. Make sure to test your token often at different resolutions and DPRs. One of the most common pitfalls that artists fall into is not doing so and having their tokens look different at different sizes - as well as different to the preview - as a result.

There are a number of different ways of getting your token to work in a resolution independent manor. Jump into the creator-support channel if you'd like to ask any questions.

## WebGL

WebGL is a big subject and there are a number of items worth talking about in relation to it.

### Power of two textures and framebuffers

Some GPUs allow you to specify non power of two textures and framebuffers, however using non power of two textures and framebuffers will break the preview system.

### WebGL on different silicone

WebGL is an emulation layer on top of different graphics APIs which talk to hardware, as such implementation of basic things like sine calculation and float precision can vary.

One important thing to remember about WebGL is that you should be doing as muchof your calculation up-front, in javascript, and providing those values to WebGL as uniforms.

### WebGL and previews

As of right now the preview system doesn't have a GPU. As such, rendering your scene falls to the CPU, which will render WebGL but at an extremely low framerate.

If your token is WebGL then you want to make sure that you're rendering an accepable preview in the first couple of frames.

## Computational complexity and previews

If your token is computationally expensive, then it's possible that the preview system will stumble over it and the signer will not be able to sign mints! Please be aware that there exist ways to generate less complex previews for your tokens, but the implementation of this necessarily needs to fall on you, the artist. Jump into the creator-support channel if you'd like to ask any questions.

## Test often

This is such an important point that it bears mentioning twice.

- Test often
- Test in many different environments
- Test using the same hash at different resolutions
- Test in the sandbox as well as standalone

# 3 ways to start a project

> This section will provide you with some boilerplate projects to make the development on your GT easier.

## Using our main boilerplate (recommended)

We encourage you to use our fxhash boilerplate, specifically designed to create projects for fxhash.

::github[fxhash boilerplate]{href=https://github.com/fxhash/fxhash-boilerplate desc="fxhash official boilerplate, fully-featured development environment with many utilities to work and publish a fxhash project."}

It comes with the following features:

- **already setup**: code snippet is injected, you can start to work on your content immediately
- **local environment** with [Live Reload](https://webpack.js.org/configuration/dev-server/#devserverlivereload) so that you can iterate faster on your projects
- **fx(lens)**: an interface to explore your code with different hashes, and a display of controllers to modulate the params defined in your code
- **javascript imports**: you can import npm packages, use the import syntax, and webpack will bundle everything in a single minified javascript file
- **automated deployment**: run a command to build your files and create a ZIP archive ready to be deployed on fxhash

::infobox[More details on the boilerplate in the [fx(lens) documentation page](/doc/artist/fxlens)]

## Using our simple boilerplate

We also provide a [simple boilerplate](https://github.com/fxhash/fxhash-simple-boilerplate), with a single html and javascript file. The snippet is already injected, but that's it. If you want to work with fx(params) you will need to provide the input bytes yourself, or use [fx(lens)](/doc/artist/fxlens).

::github[fxhash simple boilerplate]{href=https://github.com/fxhash/fxhash-simple-boilerplate desc="fxhash official simple boilerplate, with a few files prepared for you to bootstrap a project easily."}

::infobox[We advise to only go for this option if you already have some experience in web development, and with fxhash]

## Starting from scratch

You can also start from scratch, just remember to inject the snippet in the `<head>` of your index, before importing your scripts. Similar to the simple boilerplate, you will need fx(lens) to work with fx(params).

::infobox[This option is only suited for experienced programmers]{type=warning}

# Have fun

We hope this guide will cover most of what you need to know to build tokens on fxhash. If you have any issues, feel free to join [our Discord server](https://discord.com/fxhash).
