---
title: 'FXH Token & DAO'
date: '2022-02-06'
description: 'About the FXH token and the FXH DAO'
---


*This document describes the FXH Token and DAO, which are yet to be implemented. Please look at the roadmap if you want more information on when those features will see daylight.*

In this document, the token is referred to as the **FXH token**, which is not its final name.

# The DAO

As a community platform, fxhash will have a main DAO tied to its token. The main DAO will receive 50% of fxhash platform fees.

## Staking

By staking FXH tokens on the main DAO, stakers receive a share of fxhash platform fees every seven days.

The main DAO has 2 pools of tokens:

* Waiting pool: tokens waiting to be moved to the staking pool
* Staking pool: tokens which are eligible for distribution of the platform fees

When staking, tokens are put in the waiting pool. Every seven days, the DAO performs two tasks:

* Distribute the fees it received between all the stakers
* Move FXH tokens from the waiting pool to the staking pool

By design, it will take up to 14 days for staked tokens to return Tezos.

## Withdrawing staked FXH tokens

Any user can decide to withdraw their tokens when they see fit. When withdrawing tokens from the DAO, they're first removed from the waiting pool and then withdrawn from the staking pool.

For instance, if you have:

* 10 FXH tokens in the staking pool
* 5 FXH tokens in the waiting pool
* 0 FXH tokens in your wallet

...and decide to withdraw 8 FXH tokens from the DAO, you will have:

* 7 FXH tokens in the staking pool
* 0 FXH tokens in the waiting pool
* 8 FXH tokens in your wallet

# The FXH token

## Initial distribution

**TODO**

## Economic value

FXH tokens give users access to a share of fxhash revenue expressed as platform fees. Therefore, the FXH token, a value distribution mechanism, contains a particular value itself. 

## Utility value

We plan to add utility functions to the token as we explore and discover exciting ways to utilize it in a way that benefits all fxhash users. But first, the goal is to have the token hold some value. Adding utility is less important in the first iteration and can be added over time.

## Proposing and voting

FXH holders can create proposals on the main DAO by spending *N* FXH tokens. After creation, proposals enter a voting phase wherein FXH stakers have the power to vote. After voting reaches a quorum, the fxhash team is held responsible for iterating changes as needed.
