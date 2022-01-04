---
title: 'Changelog'
date: '2021-12-24'
description: 'The fxhash changelog'
---


# 04/01/2022

This update was introduced to prevent scammers from making profits using fxhash, and to secure collectors at the contract level. The Issuer contract was swapper for a new contract and all the data from the old one was transferred to provide the best experience for the community. Old tokens will benefit from the new feature `burn_supply`.

* update of the user moderation contract
  - on-chain views to give other contracts the ability to use the flags set by moderators
  - introducing the verified flag
* update of the token moderation contract
  - on-chain views to give other contracts the ability to use the flags set by moderators
* update of the issuer contract, new features, on-chain securities against scammers
  - more modular architecture
  - the data of the old contract was transferred into the new one so that it does not impact users at all
  - added `burn_supply` endpoint for artists to burn remaining supply
  - intoducing a 1 hour delay for the publication of Generative Tokens to prevent duplicates
  - no more batch minting
  - 1-hour lock for new generative tokens only published by un-verified artists (to fight against scammers)
  - tokens moderated cannot be minted anymore
  - user banned cannot publish Generative Tokens anymore
* front-end:
  - added the `locked` page under the `explore` tab. This is where tokens locked for 1-hour will show up before hitting the explore page once they are not locked
  - verification badge: users verified on the contract by the moderation team will now have a badge next to their name
  - added a setting `Display editions burnt on cards` to reflect the new `burn_supply` entry point directly on the token cards (default off)
  - improved the lock on the mint button to reflect the 1-hour lock on the contract (with a nice cooldown)

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