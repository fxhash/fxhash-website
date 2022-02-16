---
title: 'Code of conduct'
date: '2021-11-24'
description: 'Some guidelines to follow when uploading content to fxhash'
---


This guide was written by the team of moderators: [Charlie](https://twitter.com/charliesque), [Liam](https://twitter.com/neuromantic6), [Qaulv](https://twitter.com/qaulv), [Eska](https://twitter.com/eskalexia), [Sam](https://twitter.com/sam___tsao)

# The hard

## Licencing

Make sure you include and indicate any licensing material in your code package. A good way to do this is using a LICENSE.md file and refer to it in a comment within your code. This file should contain any relevant licensing information including:

* The license to your code;
* The license of any included libraries; and
* The license of any derived code.

## Copyminting

Copyminting of any sort will not be tolerated. Immediately provable copymints and unauthorized derivatives of other cryptographic artwork will be rejected.

## Abuse

If your work is abusive or includes harmful or damaging narratives, it will be rejected. We believe in freedom of expression, however, if your artwork promotes hatred of a group of people, this constitutes a damaging narrative and your work will be rejected.


# The soft

## Generative work

Ideally, all work released on FXHash should adhere to the spirit of the website in that it should be generative and use a deterministic approach to randomness.

Ideally, your work should produce the same result given the same transaction hash. This means ensuring that you’re using fxrand() for random number generation and that you’re careful to use the same set of random numbers when you redraw your artwork (upon resizing for example).

If a mint of your generative token produces a different result on reload or redraw then it is considered in opposition to this principle.

## Effort in art

Art is the core of fxhash, some of us are artists, some of us collectors. We all share the love for art and with it the same values. Everybody plays their role in this ecosystem, be it creation, collection, talking, or even flipping. If you cannot identify with a role, try to tolerate it. It is the diversity that we love, and that will ultimately lead us to create the best inclusive generative art platform for everybody

# Images and layered PNG artwork (PFP)

Generative projects can use textures and images in a number of different ways, the simplest of these being layering randomly selected PNGs on top of each other, most commonly seen in PFP projects. These projects are acceptable and welcomed on fxhash but some communication guidelines must be followed to ensure that collectors know what they’re getting when they collect your token.

## What is acceptable

- Projects where javascript is used to layer multiple static images on top of each other or as a collage (ie. illustrations, pfps, etc.)
- Projects where javascript is used to manipulate or draw on top of a static image

## What is not acceptable

- Projects that are simply a collection generated static image
- Projects that are layered multiple static images on top of each other but not described as such in the project description
- Projects that involve static images with javascript being used to manipulate the image further but not described as such in the project description

## Project descriptions

The methods used to generate these projects must be described thoroughly in the description section of the project and the appropriate tags must be used (ex. PNG, layered PNG, etc.). Labeling them simply as “generative” or “created with p5js/js/etc.” is not acceptable and will be considered misleading language. The language for these projects must include a reference to them being “generative layered pngs” or something similar. 

A good rule of thumb when putting together a description of your token is that there is no such thing as too much communication of the core ideas and methodologies involved in your token. The more a collector knows about the underlying principles of your token the more comfortable they’re going to feel collecting it.

## tl;dr

If you're struggling with how to describe your artwork, the bare minimum you need to include, if your artwork is made of layered PNGs chosen at random is: This artwork is made by layering PNGs chosen at random.