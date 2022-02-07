---
title: 'FXH Token & DAO'
date: '2022-02-06'
description: 'About the FXH token and the FXH DAO'
---


*This document describes the FXH Token and DAO which are yet to be implemented. Please look at the roadmap if you want more informations on when those features will see the daylight.*

In this document, the token is referred to as the **FXH token**, which is not its final name.


# The DAO

As a community platform, fxhash will have a main DAO which will be tied to its token. 50% of the platform fees will be sent to the main DAO.

## Staking

By staking FXH tokens on the main DAO, stakers will receive a share of the fees every 7 days.

When staking FXH tokens, they will be moved to a waiting pool. Every 7 days, the DAO will perform 2 tasks:

* distribute the fees it received between all the stakers
* move FXH tokens from the waiting pool to the staking pool

By design, it will take 14 days for staked tokens to return tezos.

## Withdrawing staked FXH tokens

Any user can decide to withdraw their tokens when they see fit. When withdrawing tokens from the DAO, it will first withdraw tokens from the waiting pool and then withdraw tokens from the staking pool. 

For instance, if you have:

* 10 FXH Tokens in the staking pool
* 5 FXH Tokens in the waiting pool
* 0 FXH Tokens in your wallet

You decide to withdraw 8 FXH Tokens from the DAO. You will end up having:

* 7 FXH Tokens in the staking pool
* 0 FXH Tokens in the waiting pool
* 8 FXH Tokens in your wallet


# The FXH Token

## Initial distribution

**TODO**

## Economical value

Since the token will give users access to a share of the platform fees, it will by default hold a certain value tied to the revenues of the platform.

## Utility value

We are planning on adding utility functions to the token later down the line, as we will discover interesting ways to utilize the token. The first goal is to have the token hold some value. Adding utility is less important for the first iteration as it can be added by adding new features.

## Proposing and voting

Proposals can be made on the main DAO by spending *N* FXH tokens. Having tokens in the staking pool will give voting powers to their owners. Once a proposal is made, it will enter a voting phase. Once a quorum is reached, the fxhash team will be responsible for applying changes if needed.

