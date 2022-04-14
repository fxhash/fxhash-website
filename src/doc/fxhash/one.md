---
title: 'fxhash 1.0 is out'
date: '2022-04-16'
description: 'Fxhash just launched its 1.0 version'
---


Here we are. After a crazy beta period, many twists and a wonderful adventure, fxhash is officially out of the beta and enters 1.0. We would like to give many **many** thanks to the wonderful community that your are. Your support really helped us bring fxhash to what it is today, and it's hard to find the words to express how thankful we are for that. We were only able to improve fx because of your investment, feedback, and also comprehension when the platform was in its lows. We truly love you.


## What comes with the 1.0 version ?

### Backend architecture

First of all, we've migrated the whole backend architecture to a more robust, state-of-the-art large scale solution. We will now have full control over our architecture which should in turn produce a more stable environment for our community. We now have **our own IPFS cluster**. We will not rely on pinata anymore to serve the files and so it should make our infrastructure more robust (especially the signing module which will be able to run way faster under high load). Pinata will still be used to duplicate the pins, but only as a safety.

From the outside, this may not look like anything, but such a change required a few months of planning, implementation and testing. Especially because of (the scale at which we operate) x (the complexity of our system). *Please note that even though we've carefully tested our services, there still might be some friction because we will basically go from 0 to 9000 in terms of traffic on the launch day*. You may experience some slow downs, but we will monitor everything and improve the system as it's being hammered.

The indexer was rewritten from scratch with a more robust architecture. No more indexing artefacts ! The API was also rewritten, with a more elegant design to support future changes.
 

### Smart contract features

We've released a new version of our Smart Contracts, more robust and upgradeable where it needed to be. Basically, you can view the fxhash contracts as a list of contracts which operate around a main NFT contract. The NFT contracts are immutable, but other contracts don't really need to be immutable and often need some upgrades as the platform needs change over time. This new architecture will allow us to make incremental changes on non-sensitive instructions.

We published a new NFT contract, which will store all the new generated NFTs. Nothing really new there, but it has a few extra features which make inter-operability easier.

We've released a new marketplace contract, which will slowly replace the old one since the main website will only create new listings on the new contract. You will still be able to view and purchase NFTs listed on the old contract, as a matter of fact from a user perspective you shouldn't notice the change at all. This contract comes with dormant features (such as offers, collection offers & listings) which will be added to the platform in the coming weeks. This new marketplace contract leverages onchain views to secure the payment of royalties, among many other features.

We've also released a new Generative contract, to which old projects will be transferred. It comes with a few interesting and modular features, mainly detailed at the end of this article.

And finally, the Collaboration Factory contract.


## List of the new features

### Collaborations

We've made a lot of efforts and lost a lot of brain cells to provide a seamless integration of the collaborations into the platform. We didn't want it to be a weird integration, but rather make the technical complexity transparent both for the artists & the collectors. We think collaborations play a major role in the development of our communities and so we wanted to provide a robust solution. We hope you will like it ! 

* [Read more on collaborations](/doc/artist/collaborations)

### More distribution strategies

We felt it was important to bring more tools for artists to distribute their work as they would like. Many of you requested different ideas in that regard, and so we tried to provide a modular solution to bring those ideas to life, as well as the new onew which will come later.

* [Read more on the new pricing strategies](/doc/artist/pricing-your-project)
* [Read more on the reserves](/doc/artist/reserves)

### Improving content classification

Some features were added to make it easier to have general details on some project. For instance, during the beta, there's been a lot of debates with *"PFP projects"*. Rather than putting barriers to remove those projects from the platform, we've added a label `Image composition` to help users quickly pick the technical aspects of a project.

We've added many other labels, and others will come. We will let you discover those as you browse.

### A global layer of polish

Many modules were not really clean, and sometimes even made it harder to browse the content. We've applied a global layer of polish accross the whole website to clean the module we thought needed it. There are still some details here and there, but globally we've made a spring CSS cleanup.