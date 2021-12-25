---
title: 'Changelog'
date: '2021-12-24'
description: 'The fxhash changelog'
---



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
