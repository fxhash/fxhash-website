---
title: 'About the beta mode'
date: '2021-10-20'
description: 'About the beta mode'
---


Hey, this is [@ciphrd](https://twitter.com/ciphrd) the author of fxhash. fxhash is currently in beta mode. These are a few notes to inform you about:
 - how to help in improving the platform (bug reports, feature requests, suggestions)
 - the risks of using the platform in its current state


## OPENING / CLOSING

During the beta, the platform minting contract will only be opened 50% of the time. This gives the servers some breathing room to process the mints and release some stress. Currently, fxhash opens everyday at 11am CET and closes at 11pm CET. This schedule may slightly change, I post status update on Twitter/Discord. When contracts are closed, you will not be able to add a Generative Token neither will you be able to mint unique Gentk. The indicator at the top-right reflects the contracts state, if red: closed, if green: opened. **The Marketplace, on the other hand, will remain opened 24h/24h**.

Note that this behaviour may still be there when the platform will officially be released. Not for technical reasons but because the community and I seem to be enjoying this concept, and I like how it reflects the story of fxhash. If that's the case, we'll find some way to have a better schedule that cycles for the people all around the world !


## Help fxhash

If you are interested in helping me to build this project, first of all **thank you for your interest, it truly means a lot**. Since I am still new in writing application for/with blockchains, there will certainly be at least a few iterations over this current version before it reaches a stable state. From my numerous tests, I didn't find any problematic bug, but I am certainly missing some edge cases which you can help identify.

I am also very interested to hear your thoughts about the platform, let it be conceptual or technical. I built fxhash because I wanted such a tool to exist for myself, as a generative artist. Feedback from your experience using it will help me understand what you need from this tool.

I opened a discord for you to report bugs. I think discord will work best in this case because some bugs sometimes require some back-and-forth. Also I think this could be a great way to exchange ideas about the future of the platform. I'm hoping to reach a point were fxhash will be driven by its community, so Discord might be a good place to start gathering people interested.

**Join discord**: [https://discord.gg/wzqxfdCKCC](https://discord.gg/wzqxfdCKCC)


## The risks

The platform was released very recently and so I do not guarantee that every feature will work as intended. The project is not fully stable yet, and so there might be a point where some updates require the contracts to be updated and the data to be fully erased. I'm hoping that contracts won't need to be updated, and it could very well be the case. However I think you need to know about this eventual issue. I think it could be great to keep the prices low so that people can experiment and test your tokens. 


## Update 11/11/2021 (so many 1 it's almost binary)

I'm adding this section to clarify a few things about the beta which, I must agree, wasn't clear at all.

When the platform will be launching, the contracts will be replaced with new contracts (adding a few needed features to them). There is currently a debate about what will happen with the tokens from the old contract. There are a few options:

* nothing (seems like nobody is interested by this one)
* a "graveyard" -> tokens will remain visible on an other front-end, as a reminder to what used to be there
* transfer the data to the new contracts (will create some duplicates and cost a lot of XTZ for the storage)
* include those within the platform, with a little "badge" on them. They could be traded in the marketplace.

We are currently discussing about it on the Discord.


### What are the high minting costs ? Are there platform fees ?

These cost are only related to storage fees to store the token data on the blockchain. Storage fees are very high on blockchains, so that's why. Each byte has a cost. It's about the same cost as minting a token on H=N to give you a comparaison scale. **Platform fees for minting are currently at 2.5%, and so for the whole duration of the beta**.