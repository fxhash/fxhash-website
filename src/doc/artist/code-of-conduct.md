---
title: "Code of conduct"
date: "2022-01-13"
description: "Some guidelines to follow when uploading content to fxhash"
---

# The hard

## Licencing

Make sure you include and indicate any licensing material in your code package. A good way to do this is using a [LICENSE.md](http://LICENSE.md) file and refer to it in a comment within your code. This file should contain any relevant licensing information including:

- The license to your code;
- The license of any included libraries; and
- The license of any derived code.

## Copyminting

Copyminting of any sort will not be tolerated. Immediately provable copymints and unauthorized derivatives of other cryptographic artwork will be rejected.

## Abuse

If your work is abusive or includes harmful or damaging narratives, it will be rejected. We believe in freedom of expression, however, if your artwork promotes hatred of a group of people, this constitutes a damaging narrative and your work will be rejected.

## Advantaged Buying

Advantaged buyers are considered those who have tools they have built themselves or purchased from others which give them algorithmic and automatic buying powers from primary markets or secondary markets. This is colloquially referred to as ‘botting’ and like in many communities, is considered taboo. At fxhash, up until there is inbuilt anti-botting mechanisms included in the contracts, small scale botting is allowed but is highly discouraged, and those botting will be outed where possible, have their verification removed (with their chances of re-verification drastically reduced) and in extreme cases, a server-wide announcement made about their activities if we deem it a risk to our collectors.

## Market Manipulation

Attempts at market manipulation are taken extremely seriously and will not be accepted. Due to the nature of the blockchain, and methods and tools developed by the team, it is possible for us to thread together transactions (even across marketplaces) in order to create a strong, evidence based, case against a user. Users which do try to manipulate the market will be made aware to the community, and in turn destroying their reputation.

# The soft

## Generative work

Ideally, all work released on FXHash should adhere to the spirit of the website in that it should be generative and use a deterministic approach to randomness.

Ideally, your work should produce the same result given the same transaction hash. This means ensuring that you’re using fxrand() for random number generation and that you’re careful to use the same set of random numbers when you redraw your artwork (upon resizing for example).

If a mint of your generative token produces a different result on reload or redraw then it is considered in opposition to this principle.

At fxhash we apply a broader definition to generative work to encompass any and all procedural, parametric and generative work which uses fxrand() at its core. This saves philosophical arguments about taxonomy.

## Effort in art

Art is the core of fxhash, some of us are artists, some of us collectors. We all share the love for art and with it the same values. Everybody plays their role in this ecosystem, be it creation, collection, talking, or even flipping. If you cannot identify with a role, try to tolerate it. It is the diversity that we love, and that will ultimately lead us to create the best inclusive generative art platform for everybody

## Imitations, impersonation and inspiration.

Ideally your work should be unique in design and code, however as artists having a solid inspiration for your work may give you a strong path to completion. If an artwork is too similar to already existing (and well known) artworks, the fxhash team may moderate it on account of it being misleading towards collectors. There is a great deal of nuance to this and artworks, with their code and descriptions, will be taken into consideration before action is taken.

# Images and layered PNG artwork (PFP)

Generative projects can use textures and images in a number of different ways, the simplest of these being layering randomly selected PNGs on top of each other, most commonly seen in PFP projects. These projects are acceptable and welcomed on fxhash but some communication guidelines must be followed to ensure that collectors know what they’re getting when they collect your token.

## What is acceptable

- Projects where javascript is used to layer multiple static images on top of each other or as a collage (ie. illustrations, pfps, etc.)
- Projects where javascript is used to manipulate or draw on top of a static image

## What is not acceptable

- Projects that are simply a collection generated static image
- Projects that are layered multiple static images on top of each other but **not described as such** in the project description
- Projects that involve static images with javascript being used to manipulate the image further but **not described as such** in the project description

## Project descriptions

The methods used to generate these projects must be described thoroughly in the description section of the project and the appropriate tags must be used (ex. PNG, layered PNG, etc.). Labeling them simply as “generative” or “created with p5js/js/etc.” is not acceptable and will be considered misleading language. The language for these projects must include a reference to them being “generative layered pngs” or something similar.

A good rule of thumb when putting together a description of your token is that there is no such thing as too much communication of the core ideas and methodologies involved in your token. The more a collector knows about the underlying principles of your token the more comfortable they’re going to feel collecting it.

In future, a tagging system will be implemented that will allow artists to add layered / static PNG as tags that will be more clearly visible to collectors, however we still recommend being as descriptive of the artwork as possible.

# Rescheduling

The scheduling feature is provided as a means to refresh your project's settings and have it appear back at the top of the list. Resheduling can only be used under the following circumstances:

- Something has gone wrong with your launch - a mistake or issue with the drop that caused the launch to be broken; or
- A significant change to the allow list; and
- You have not rescheduled this token already.

If you're unsure of whether you meet these requirements and want to reschedule your token, please reach out to @fxhash team on Discord.

Abuse of the rescheduling system will result in the moderation of your token, repeated abuses will result in your profile being moderated.

## tl;dr

::infobox[If you’re struggling with how to describe your artwork, the bare minimum you need to include, if your artwork is made of layered PNGs chosen at random is: This artwork is made by layering PNGs chosen at random.]
