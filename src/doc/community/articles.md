---
title: 'Articles'
date: '2022-08-01'
description: 'A presentation of what articles are, and why they could become a very powerful feature for the whole tezos ecosystem.'
---

We have recently released articles on fxhash. While articles may seem like a trivial feature at first sight, we believe they will become a major component for content creation and organization, not only for fxhash but also for the whole tezos ecosystem. This document will walk you through what articles are, how they are implemented and the key role they will play in our ecosystem.


# Articles as mutable semi-fungible tokens

First and foremost, articles are NFTs. Because we try to develop every feature by keeping decentralization and ownership at the core of our thought process, we decided to build a system where articles are minted as NFTs on-chain.

## Semi-fungible tokens

Articles are similar to Hic et Nunc multi-editions "NFTs". When a writer mints an article, they can mint as many editions as they see fit. We believe this is a necessary principle as it will help writers in getting a compensation for their work by connecting to more members of our community.

## Mutable metadata

While *traditionnal* NFTs are designed to be immutable, we believe this paradigm shouldn't apply to articles. At the pace at which our world changes, and because articles are going to be a core building block for educationnal content among other sensitive applications, it doesn't make sense to lock these at a given point in time. As such, it will be possible for writers to update their articles even after it was minted.


# Dynamic content & Tezos interoperability

We designed articles by thinking of them as interoperable modular blocks. Instead of implementing a solution specifically tailored to fxhash content, we thought about their integration within the Tezos ecosystem & 3rd party applications, not necessarily connected to fxhash.

## Tezos Storage Pointers

We wanted articles to have the ability to point to NFTs stored in Tezos Smart Contracts. We decided to create a specification to point to any content in the storage of a smart contract, called [Tezos Storage Pointer](https://github.com/fxhash/specifications/blob/main/general/tezos-storage-pointers.md). A Tezos Storage Pointer is a list of key-value properties which points to any data stored in a Smart Contract. This specification was primarly designed to point to some NFT metadata, but it can also be used for other purposes.

## Extended markdown

Articles are stored on IPFS as a markdown string, with an extension to the markdown specification. First of all, we use the [Github Flavored Markdown](https://github.github.com/gfm/) specification as a base layer, which allows for the insertion of some more complexe blocks such as tables and math formulas. This is a widely used spec, and as such its integration into existing application should be trivial.

In order to add custom blocks to the markdown (such as tezos storage pointers), we decided to use the directives specification extension ([proposal](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444), [syntax](https://github.com/micromark/micromark-extension-directive#syntax)) because it provides a very high level of modularity and many markdown parsers have a plugin for this spec. We hope that it will facilitate its integration into other applications.

This is an example of a tezos storage pointer in a markdown string:

```markdown
# Super title without inspiration

Phasellus ut augue in quam facilisis congue consequat ut nibh. In pellentesque erat eget ex pretium, eu tristique nibh pretium.

::tezos-storage-pointer[Some comment on this token]{contract="KT1NkZho1yRkDdQnN4Mz93sDYyY2pPrEHTNs" path="token_metadata:880"}

*Phasellus ut augue in quam facilisis congue consequat ut nibh. In pellentesque erat eget ex pretium, eu tristique nibh pretium. Nullam tristique...*
```

By using this design, we let the implementation of a viewer to the discretion of application developers. Because these are declarative pointers to some blockchain content, the data can be fetched on-the-fly from the blockchain. This is **dynamic content**. Moreover, pointers are not limited to fxhash, which means that this framework can be used to describe any content on tezos.

[This is the document describing our markdown specification.](https://github.com/fxhash/specifications/blob/main/articles/fx-markdown.md)

Our specification also supports:
* embedding youtube, spotify and twitter
* images pointing to IPFS
* video content (not implemented yet)
* audio content (not implemented yet)


# Facilitating the creation of articles

We've put a lot of work into the implementation of an intuitive [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editor. We really wanted to provide a seamless experience to writers, so we built a custom solution on top of [slatejs](https://www.slatejs.org/), a modular library to design text editor. Because we have so many custom blocks, it was a bit tricky to propose a great user experience. We hope our solution will fit your needs, and we will keep iterating on it based on your valuable feedback.


# Articles as building blocks of a new ecosystem

NFTs have become a major tool for artists. However, there are many other actors in this space, and we believe that they deserve tools which follow the same principles. Articles are the first building block towards the implementation of such a system. We briefly describe this system in our documentation: [Curated Spaces](/doc/community/curation).

The Articles feature will first be shipped on fxhash, but we will work towards the implementation of an external platform which will target the whole Tezos ecosystem.