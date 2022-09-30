---
title: 'Integration guide'
date: '2021-12-31'
description: 'An integration guide of different fxhash components for the developers'
---



# Table of Contents


# Scope of the guide

This guide provides informations on how to integrate some of the components of fxhash into any external application. Because we want to encourage the development of ecosystems around applications in the decentralized web, we think applications should provide resources for developers in order to facilitate those integrations. This guide will point you to tools and cover best practices. It will always describe the integration for the latest version, but as it will get updated you will find thoses updates at the end of the article, if needed.


# Fxhash contracts

These are the addresses of the contracts actively being used by fxhash:

| ID | Address | Description |
| --- | --- | --- |
| issuer | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER}}` | Generative Tokens - stores the projects & main entrypoint to mint NFTs |
| gentk_v1 | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_GENTK_V1}}` | FA2 NFTs, beta tokens |
| gentk_v2 | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_GENTK_V2}}` | FA2 NFTs, tokens since fxhash 1.0 |
| articles | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ARTICLES}}` | fx(text) FA2 contract |
| marketplace_v1 | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V1}}` | The beta marketplace contract, still indexed but no more listings are made through this contract. Shouldn't be used anymore, soon to be deprecated. |
| marketplace_v2 | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V2}}` | The marketplace contact since fxhash 1.0 |
| marketplace_v3 | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V3}}` | The next marketplace contract, currently only being used for the Articles. |
| user_register | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_USERREGISTER}}` | Used to store user name & user profile |
| moderation_team | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_TEAM_MODERATION}}` | Controls which tezos addresses have special rights on fxhash contracts |
| moderation_token | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_TOK_MODERATION}}` | Can be used by moderation to assign a flag to a token |
| moderation_user | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_USER_MODERATION}}` | Can be used by moderation to assign a flag to a user |
| cycles | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_CYCLES}}` | Defines cycles, used by issuer to control open/close state |
| collab_factory | `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_COLLAB_FACTORY}}` | The contract which can be used to originate collaboration contracts |

The most complex yet versatile way to query the contracts data is to use the [public tzkt api](https://api.tzkt.io/). Recommended only for experienced users. If you want to quickly build an app on top of fxhash, we recommend using our public API.

We realize that it has become difficult to index our contracts, so if you have any issues we would love your feedback to create a better integration guide for the next people who will need it: [discord](https://discord.gg/fxhash) (channel `#3rd-party-integration`). We're sorry about this, but fxhash was released as a test project a few month ago and we had to develop the platform while maintaining the existing contracts in the best way we could. This is our best solution for a transition to our version 1.0.


# Using the open GraphQL API

fxhash exposes a public GraphQL API. The API is exposed under the following URL: `https://api.fxhash.xyz/graphql`. You can interact with the API by sending HTTP POST requests complying to the GraphQL specifications. This is a very easy and flexible way to get only the data you need. This article briefly explains how to interact with the GraphQL APIs using HTTP requests: [https://graphql.org/graphql-js/graphql-clients/](https://graphql.org/graphql-js/graphql-clients/).

## Tooling

Some GraphQL clients facilitate the implementation of GraphQL requests:
* [graphql-request](https://www.npmjs.com/package/graphql-request) [JS]: minimal GraphQL client supporting Node and browsers for scripts or simple apps
* [Apollo Client](https://www.apollographql.com/docs/react/) [JS]: used by the fxhand frontend, state management, cache... some robust and versatile components fore more complex applications
* [graphql-python/gql](https://github.com/graphql-python/gql) [Python]: simple library

The API enables [introspection](https://graphql.org/learn/introspection/), which means that you can use any tool to inspect the schema and explore a way to get the resources you need for your use-case:
* [Apollo Studio sandbox explorer](https://studio.apollographql.com/sandbox?endpoint=https%3A%2F%2Fapi.fxhash.xyz%2Fgraphql): UX friendly features to explore the schema **very easily** (recommended)
* [fxhash Graphiql endpoint](https://api.fxhash.xyz/graphiql): basic interface to test queries, less features than Apollo Sandbox Explorer

## Best practices

Try to compose your queries to only request the data you need. Each extra byte might not seem to have a huge impact individually, but when operating at a large scale it can quickly become a huge overload for the application and worsen the experience of all the users. We try to provide the best infrastructure we can, but if we all make the efforts to optimize the queries, we can reduce this load and improve the experience for all the community (and eventually our costs).

Also, try to think in terms of **query cost**. For instance, if your application needs to run lots of queries, and if those queries seem to be slow (+800ms), it's quite possible that they could be optimised. Check if other endpoints can provide the same informations using pagination for instance. Ultimately, feel free to reach out on [discord](https://discord.gg/fxhash) (channel `#3rd-party-integration`) if you encounter any issue / want to report a problem.


# Integrating fxhash resources

The Generative Tokens and the Gentks have some self-explanatory properties, however others may require more details to be used properly. This is particularly the case of the metadata of those tokens.

## Versioning

First of all, the metadata is versioned so that whenever a change is made to their definition, it reflects in their `version` field. Prior to version `0.2`, there wasn't any version field so if the `version` field is not defined in some metadata, one can assume that the version is `0.1`. This function ensures that given some metadata (let it be a Generative Token or a Gentk), it outputs its version:

```js
function getVersion(metadata) {
  return metadata.version ?? "0.1"
}
```

## Generative Tokens

These are the definitions for the metadata of a Generative for version 0.2:

```json
{
   "name": "Name of the Geberative Token",
   "description": "Description of the Generative Token",
   "childrenDescription": "Description of the Gentks generated",
   "tags": [ "list", "of", "tags" ],
   // URI to display the live version
   "artifactUri":"ipfs://QmWKdzyjJvZV2TFT6A9TTkBosGxvkmt7eTWcW338MpTgS9?fxhash=oo7KXsC8LbggF4wafcscSyiPGgCFbZZdVtGuBSv477bpjw76UpF",
   // URI to display the HQ preview
   "displayUri":"ipfs://QmcCbKcwLoPrfwPYzdbX1MEVgc91a5XdFb2vqNcu69Xt1T",
   // URI to display the thumbnail, a LQ version of the preview
   "thumbnailUri":"ipfs://QmWC7E3Sp8QzHN5EA33krcpuZv6Fi2CzjUQqZWdic2CB7E",
   // URI of the generator
   "generativeUri":"ipfs://QmWKdzyjJvZV2TFT6A9TTkBosGxvkmt7eTWcW338MpTgS9",
   // hash generated by fxhash backend to assert authenticity of the token
   "authenticityHash":"56972db4c0841a854c6a307f6fbfe5c699e6524ff28d3d82c5d46469a6efbaea",
   // hash used for the preview of the token
   "previewHash":"oo7KXsC8LbggF4wafcscSyiPGgCFbZZdVtGuBSv477bpjw76UpF",
   // capture settings
   "capture":{
      "mode":"VIEWPORT",
      "triggerMode":"FN_TRIGGER",
      "resolution":{
         "x":1080,
         "y":1080
      }
   },
   // other general-purpose settings
   "settings":{
      "exploration":{
         "preMint":{
            "enabled":true,
            "hashConstraints":null
         },
         "postMint":{
            "enabled":false,
            "hashConstraints":null
         }
      }
   },
   "symbol":"FXGEN",
   "decimals":0,
   "version":"0.2"
}
```

We will not describe the differences between prior versions and this one, but rather propose a generic-purpose function to get a display URL of the live version of a Generative Token regardless of its version:

```js
// get live display URL of a Generative Token
export function generativeLiveDisplayUrl(uri) {
  // you can use another gateway if you prefer
  const gateway = "https://gateway.fxhash.xyz/ipfs/"
  return gateway + metdata.artifactUri.substring(7)
}
```

This function removes the `ipfs://` at the beginning of the URI and composes a display URL based on the result.

## Gentks

Gentks follow approximately the same construction:

```json
{
  "name": "Name of the Gentk",
  // transaction hash used to generate the Gentk
  "iterationHash": "opXnGtQiUMfyKL2AHq6c13E3tg7fxUKx1eTD4UoxFdVWBR1YuE8",
  "description": "Description (same as the .childrenDescription field of its parent)",
  "tags": [ "list", "of", "tags" ], // same as its parent
  // URI to the generator, cannot be displayed alone
  "generatorUri": "ipfs://QmWKdzyjJvZV2TFT6A9TTkBosGxvkmt7eTWcW338MpTgS9",
  // URI to display the live version
  "artifactUri": "ipfs://QmWKdzyjJvZV2TFT6A9TTkBosGxvkmt7eTWcW338MpTgS9?fxhash=opXnGtQiUMfyKL2AHq6c13E3tg7fxUKx1eTD4UoxFdVWBR1YuE8",
  // HQ preview
  "displayUri": "ipfs://QmZ1SD15ynTmCPCGbW6tgCrTM2go7J1jFcLJcv4sSPgtSG",
  // LQ preview
  "thumbnailUri": "ipfs://QmU2oJGJKq5jQsKKxBf2bVhSnWoYS28owfzyXx1Mb34zyF",
  // hash generated by fxhash backend to assert authenticity of the token
  "authenticityHash": "aa04e03a6fee5ebeb9ab4b3c38acd32b0a94f1abe1d47784e50bccc9152c6f56",
  // list of attributes for the token
  "attributes": [
    {
      "name": "Attribute 1",
      "value": "it's a string"
    },
    {
      "name": "Attribute 2",
      "value": 17
    }
  ],
  "decimals": 0,
  "symbol": "GENTK",
  "version": "0.2"
}
```

The exact same function can be used to display the live version of a Gentk:

```js
// get live display URL of a Gentk
export function gentkLiveDisplayUrl(uri) {
  // you can use another gateway if you prefer
  const gateway = "https://gateway.fxhash.xyz/ipfs/"
  return gateway + metdata.artifactUri.substring(7)
}
```

## Best practices

* The thumbnails are 300x300 png images. They should be used instead of the HQ preview if possible, to reduce the cost of the gateway.



# About the moderation contracts

You can get some details on the moderation systems:

* [User Moderation system](https://github.com/fxhash/system-descriptions/blob/master/USER_MODERATION.md)
* [Generative Token moderation system](https://www.fxhash.xyz/doc/fxhash/moderation)


# Updates

## 05/01/2022

* A new issuer contract was deployed and will replace the new one. Some storage changes were made to optimize the space. Metadata was moved into the ledger. Ledger is now referenced by the issuer ID only, and the creator is now a field. This simplifies lookups on the contract side.
  - issuer: `KT1AEVuykWeuuFX7QkEAMNtffzwhe1Z98hJS` -> `KT1XCoGnfupWk7Sp8536EfrxcP73LmT68Nyr`
  - user moderation: `KT1CgsLyNpqFtNw3wdfGasQYZYfgsWSMJfGo` -> `KT1TWWQ6FtLoosVfZgTKV2q68TMZaENhGm54`
  - user moderation: `KT1BQqRn7u4p1Z1nkRsGEGp8Pc92ftVFqNMg` -> `KT1HgVuzNWVvnX16fahbV2LrnpwifYKoFMRd`


## 16/04/2022 - Migration to fxhash 1.0

The version 1.0 of fxhash comes with many updates, especially on the contract-side. To support these updates and start again from a solid state, the API was partially re-written. If you were using the API in your applications, there are high chances that you will need to rewrite the concerned parts.

### API 

This document covers the breaking changes made to the API: [https://github.com/fxhash/fxhash-api/blob/main/doc/MIGRATION_V1.md](https://github.com/fxhash/fxhash-api/blob/main/doc/MIGRATION_V1.md)

If some of your queries which used to be working are still not working after you applied the changes, you can reach out on [discord](https://discord.gg/fxhash) (channel `#3rd-party-integration`). It's possible that we forgot to include those changes due to the amount of work that was required for transitionning to v1.0.

### Contracts

A new gentk contract was deployed, any new gentk will be minted to the new contract.

The issuer contract was replaced by a new one, which implements many more features. The data from the previous issuer was transfered to the new one so that we can leverage a few of its new features to affect beta Generative Tokens.

* issuer: `KT1XCoGnfupWk7Sp8536EfrxcP73LmT68Nyr` -> `{{process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER}}`

Prices are not defined on the issuer contract anymore, but on the pricing contracts. Each pricing method has its own Smart Contract, and if you want to index Generative Token prices, you will also need to index the pricing contracts.

The new marketplace contract will now replace the marketplace_v1 contract. The name of the entry points was normalized to ease their integration. For listings, these are the 3 entry points concerned:

* `listing`: create a listing
* `listing_accept`: accept a listing
* `listing_cancel`: cancel a listing

The marketplace_v2 contract supports both the gentk_v1 and gentk_v2 contracts. When an entry point needs a reference to a gentk, it will ask for:

```js
{
  id: 0, // the id of the token
  version: 0 // the version, 0: gentk_v1, 1: gentk_v2
}
```

**You should NOT create new listings on the marketplace_v1 contract, as we aim to deprecate it in the following months**.

The `token_moderation` and `user_moderation` contracts were redeployed and the data was transfered from the previous contract. Not much changed but now those contracts supports moderation reasons to contextualize the actions taken by the moderators.