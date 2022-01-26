---
title: 'Changelog'
date: '2021-12-24'
description: 'The fxhash changelog'
---


# 25/01/2021

* added GPU-enabled rendering instances


# 20/01/2021

* optimized the computations of the market stats microservice
* added endpoints to the public API to get the history of the market stats for collections
* added charts to the marketplace page of collections


# 18/01/2021

* added relevance sort option when search is active (explore/marketplace)


# 17/01/2021

* cycles are now directly pulled from the contracts and UI reflects cycles in contracts
* added supported for any number of cycles layered (off days are now displayed properly)
* added cycle IDs to the schedule (easier for communication)
* improved the guides to collect, and to publish Generative Tokens
* added guides to the header of the home page
* improved responsive on home page


# 15/01/2021

* heavy optimization of the marketplace statistic computations
* API now serves precomputed marketplace stats (and does so way faster than before when it had to get computed on-the-fly)
* statistics are now stored with a 1 hour granularity in the database, so history is available
* added generic endpoint to get those stats, with sort options
* added a board of the most successful collections on secondary on the Marketplace page (to be moved to a separate stats page)


# 13/01/2021

* added sort/filters to the generativeToken endpoint of the API
* added sort/filters to the exploration of the Generative Tokens


# 12/01/2021

* added filters on the offers endpoint of the API
* added filters and sort options to the marketplace


# 10/01/2021

* improved the minting flow
  - removed useless intermediate page with mint button only
  - mint button on Generative Token page now directly calls the contract to mint
  - added the animation for reveal using the transaction hash after the mint


# 08/01/2021

* added a new settings panel with customization settings for the UI, and a cleaner space for settings in general


# 07/01/2021

* added boolean `isFxpreview` to check if the code is loaded in preview mode (server taking the capture)
* increased the max delay from 40s to 80s
* added support for SVG elements in the sandbox
* increased the size limit from 15MB to 30MB


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
  - creators can now mint from their token even if disabled
* on-chain cycles:
  - we will be testing the schedule implementing on-chain !
  - a new contract defines when the platform is opened based on some defined cycles
  - the `mint` entry-point (to mint unique iterations) and the `mint_issuer` entry point (to publish Generative Tokens) can follow different cycles now
* front-end:
  - added the `locked` page under the `explore` tab. This is where tokens locked for 1-hour will show up before hitting the explore page once they are not locked
  - verification badge: users verified on the contract by the moderation team will now have a badge next to their name
  - added a setting `Display editions burnt on cards` to reflect the new `burn_supply` entry point directly on the token cards (default off)
  - improved the lock on the mint button to reflect the 1-hour lock on the contract (with a nice cooldown !)

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
