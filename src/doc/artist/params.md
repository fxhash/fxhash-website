---
title: "fx(params)"
date: "2023-03-20"
description: "Some top-level documentation on fx(params)"
---

> fx(params) is the name of the module which gives artists the option to define a set of parameters collectors will modulate before minting their iteration. This document presents an overview of fx(params) and how it integrates into fx(hash).

::infobox[For in-depth technical details on fx(params), you can read the [fx(params) technical specifications](/doc/artist/snippet-api#fxparams).]

# Table of contents

# Overview

When you implement the code of your generative token, the [snippet API](/doc/artist/snippet-api) gives you access to some utility functions to define a set of parameters and get each parameter value very easily.

```js
// define parameters exposed to collectors
$fx.params([
  {
    id: "number_id",
    name: "A number",
    type: "number",
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

// get the value of a parameter
$fx.getParam("number_id")
```

# fx(params) update modes

For each individual parameter that you specify, you can also set a specific update mode for it. The default update mode is `"page-reload"` and describes the known behaviour of updating the artwork by performing a full page-load on the artwork. By setting the update mode to `"sync"` the parameter will be updated through the controllers without performing a full page-load on the artwork.

```js
{
  id: "number_id",
  name: "A number/float64",
  type: "number",
  update: "sync", // <-- new update property
},
```

All updates on prameters with `update: "sync"` are received in the background in real-time. If your artwork is already running in some kind of draw loop (e.g. via `requestAnimationFrame`), you will receive those changes during the runtime of your loop.

For even more advanced use cases, e.g. if you want to only re-render your artwork when the values of your parameters are changing, you can use the new event listeners described in the section [`$fx.on`](/doc/artist/snippet-api#fxoneventid-handler-ondone) on the snippet api page. 

# Dev environment for fx(params)

For projects to work with fx(params), two components are needed:

- define the list of parameters with `$fx.params()`
- inject the parameters into the code when it's loaded with an URL parameter

While the first component is fairly easy to implement, the second is more tricky, as one needs to provide a byte sequence matching with the parameters. Fortunately, our development environment, fx(lens), abstracts all this complexity so that every time your code is reloaded, an UI displays controllers you can play with right away.

![screenshot of fxlens](/images/doc/artist/lens/lens-1.png)

We highly recommend working with [fx(lens)](/doc/artist/fxlens) as you implement your project for fxhash, as it will greatly facilitate your workflow.

# How does params work under the hood ?

When your fx(params) project is published on fxhash, we will compute a number of bytes based on your params definition. This number will be sent onchain, and minting new iterations will require collector to provide this exact number of bytes when they will mint. Based on the parameters they chose for your piece, a byte sequence will be generated, and will be injected onchain. This sequence of bytes will be injected along the unique iteration hash into the piece as URL parameter, and will be processed by the fxhash snippet when the code is executed. Exactly like when working in fx(lens); the process is the same.

![params technical overview](/images/doc/artist/fxparams/params-technical-overview.png)

# Minting experience for collectors

Because artists may want to give collectors some time to play with the parameters before minting their iteration, fx(params) project will follow a 2-step minting process:

- a ticket is minted, giving the right to mint an iteration of the piece later on
- parameters are explored, and when ready the ticket is exchanged for the final iteration

![minting details of fxparams projects](/images/doc/artist/fxparams/tickets.png)

To ensure projects don't end up with staling tickets and unminted iterations, we've put a taxation mechanism in place: collectors will have to pay a fee to the artist(s) to keep the ticket. To ensure the best release conditions for artists' projects, they can configure a grace period: during the grace period, collectors don't have to pay a tax. This mechanism ensures that as an artist, you can properly define the period during which you want your project to be explored freely.

::infobox[Read more about the [underlying mechanism of mint tickets](/doc/collect/fxparams-mint-tickets#the-mint-ticket-mechanism).]

# fxhash minting interface

After getting their ticket, collectors will access a minting interface quite similar to fx(lens), where they will modulate the parameters defined by the artist(s). After they have selected the parameters of their choice, they can mint the iteration, which will inject the byte sequence onchain based on their parameters.

![fxhash minting interface for params](/images/doc/artist/fxparams/mint-interface.png)

# fx(params) and beyond

fx(params) offers a very low-level API which right now is only integrated on the main fxhash front-end. However, we can think of many ways to leverage fx(params) for particular use-cases. The primitives currently available are very basic, but eventually depending on requests by artists we may extend the system to allow for more freedom. fx(params) was designed as a base layer which can be extended for complex use cases. Think of interactive installations, custom minting interface with unique user inputs... etc

We are very excited to see how fx(params) will be leveraged by the artistic community ! If you have some crazy ideas and think the current state of fx(params) cannot support this idea, feel free to reach out on Discord (link in the footer) so that we can either point you in the right direction or extend fx(params) to support your idea.
