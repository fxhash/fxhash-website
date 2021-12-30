---
title: 'Changelog'
date: '2021-12-24'
description: 'The fxhash changelog'
---


# 30/12/2021

* gentk ownership optimization
  - gentks ownerhip is no longer transferred to `fxhash marketplace` at the indexer level
  - optimized queries to render gentk Cards over the whole application


# 26/12/2021

* updated the `randomize` button feature by giving control back to artists
  - feature was renamed to `variations`, as some strategies won't utilize pure randomness anymore
  - added a step after the **verification** during the minting pipeline to control the `variations` button
  - tokens minted prior to the addition of the feature will have the `variations` button disabled since we don't want to force any behaviour that wasn't implemented at the time of the mint
  - artists can control the button during **the mint period** and **after generative token is fully minted**
  - artists can define if the exploration of variations is infinite and random, or if the exploration can only be done for a finite number of variations they define.


# 25/12/2021 🎅

* update of the core
  - changed metadata generation (v0.1 -> v0.2)
  - data is no longer duplicated for each children but the generator is used with URL parameters
  - added a version field in the metadata JSON to have back compatibility when upgrading
* updated loss of precision on the PRNG derived from the hash
  - Piter Pasma proposed a clean solution to update the b58dec function so that no more bytes are lost
  - `b58dec` function was replaced in the boilerplates and will now replace the older snippets from now on
* added `fxpreview()`
  - new way to trigger capture using programmatic trigger
  - abstraction of the trigger into its own capture setting
  - UI now reflects those changes by proposing the `fxpreview()` in a trigger step
  - updated the snippets in the boilerplates
* added **randomize** button under the Generative Token to explore random iterations when viewing a token. This option will hopefully help collectors in their choices.
* added changelog