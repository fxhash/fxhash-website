---
title: 'TreeDAO'
date: '2022-02-06'
description: 'A description of the TreeDAO architecture'
---

*This document describes the TreeDAO architecture which is yet to be implemented. Please look at the roadmap if you want more information on when those features will see daylight.*

# Empowering communities

People share common interests, values and objectives. We want to empower groups of people by giving them a way to interact together with the blockchain.

# How does it work?

## Leveraging the main DAO and the FXH token

*If you are not yet familiar with the main DAO and with the FXH token, you will find more information in [this document](/doc/community/token-dao).*

DAOs require at least two components to be functional:

* A way to define the shares owned by each member of the DAO
* A way to interact with the blockchain (preferably by taking into account the shares owned by its members)

The TreeDAO architecture proposes to utilize the existing main DAO and the FXH token to tie sub-DAOs together and facilitate their creation and management. It also gives them some economic and voting power on the platform. Moreover, instead of each sub-DAO building its framework from scratch to manage share distribution and blockchain interactions, we will provide support with a generic contract.

The sub-DAO contract will utilize the FXH token as the utility token to define the shares owned by its members. Members will buy sub-DAO shares using the FXH token. The sub-DAO will have rules so that the balance of FXH tokens in a sub-DAO contract doesn't go under the total amount of FXH tokens used to buy its shares. This rule will give members the ability to leave a sub-DAO by withdrawing the FXH tokens they invested (i.e., selling their shares back to the sub-DAO).

FXH tokens used to buy shares of a sub-DAO will be stakable on the main-DAO contract.

This architecture provides a lot of benefits:

* A single utility token is used by the whole community
* The token provides some economic value for the sub-DAOs (they will receive a portion of platform fees just like other FXH token stakers)
* An easy way to assert the shares owned by each member

## Voting system

As in any DAO, a voting system ensures actions are taken in the name of the entire group. Two components are required for a voting system:

* How the votes are shared among sub-DAO members
* How many votes are required to reach a quorum

Because we want to provide frameworks for the community, we will propose different models within the smart contract to define the share of the votes and the quorum. It will be possible for a sub-DAO to change its model during its lifetime (as any action, making this change is subject to a vote).

Any member can make a proposal which starts a voting period. There are two types of proposals.

### Textual proposals

Sub-DAOs can use the voting system to vote on certain ideas which don't require further actions on the smart contract level. The meaning and application of those results will be left to the members of the sub-DAOs. The voting will happen as follows:

* Proposal is made, voting starts for 7 days
* Members can vote on one of the outputs proposed
* Once the voting period is over, members decide on the result based on the votes registered. Quorum is not required because members can agree on the conditions required for an output to be considered as a result of the vote.

### Action proposals

Members can propose any action in the name of their sub-DAO. Such actions are materialized as a call to a smart contract method. Actions are not limited to a list, for instance they could be:

* Staking FXH tokens on the main DAO
* Sending *N* tezos to a tezos account
* Listing a token owned by the sub-DAO on the marketplace
* Buying a token on the marketplace
* Banning a member from the sub-DAO
* Create a curated space
* Update a curated space created with the sub-DAO
* ...

Once a proposal for an action is made, a voting period starts:

* Proposal for an action is made, voting starts for 7 days
* Members can vote for **APPLY** or **REJECT** on the operation
* Once a quorum is reached, any member will have the ability to trigger the action

In some instances, actions proposed at the beginning of the vote are not applicable anymore. If, for instance, the action was to buy a token on the marketplace but the same token was bought during the voting period, then the action cannot be applied anymore.

Sub-DAOs are not designed to perform time-sensitive operations but rather to take more important actions as a group.

## Joining a sub-DAO

Any entity (let it be a regular user or a sub-DAO) can join a sub-DAO by buying some of its shares.

Three types of assets will be subject to a request:

* (**Required**) some FXH tokens: they will define how much shares are bought when joining the sub-DAO
* (*Optional*) some tezos
* (*Optional*) FA2 assets

While FXH tokens are required to join a sub-DAO, adding tezos or FA2 assets are optional by contract design. Some sub-DAOs may define that new members can only join their community if they invest some initial value into the sub-DAO.

This is the only entry-point which will give any entity the ability to start a vote within a sub-DAO. During the voting period, assets are frozen.

The originator of the vote can cancel its request at any time during the voting phase.

When a quorum is reached, and if the sub-DAO agrees to the request, the originator can join the sub-DAO.

## Members can claim their ROI

The sub-DAO smart contracts will implement a **withdraw** method which distributes the current tezos balance back to members. Each member will receive a % of the treasury which corresponds to the % of shares they own. Withdrawing, as any action, will be subject to voting.

## Leaving a sub-DAO

Members should have the ability to leave a sub-DAO whenever they want. To provide more modularity, members will have the ability to withdraw as many FXH tokens as they originally invested within the sub-DAO. If this number reaches 0, they won't have shares and are no longer members of the sub-DAO. It will be possible, for instance, to claim 50% of the FXH tokens originally invested which will only remove 50% of the shares owned.

## Fractionalized ownership

Since the sub-DAOs will have the ability to buy tokens, by default all their members will have rights over the tokens bought in the name of their sub-DAO. When a token is sold by the sub-DAO, members will have control over the tezos generated by the sale. They can buy other pieces, send those tezos to another account, or withdraw those tezos to distribute the profits according to their individual shares in the sub-DAO.

# A tree achitecture

Ultimately, if we give a contract the ability to perform any action as a regular user could, they have the exact same ability to interact with the Tezos blockchain. In that regard, nothing prevents a sub-DAO from staking their FXH tokens in the name of another sub-DAO instead.

If at first we don't expect such cases to occur because they introduce some complexity in their usage, we hope that we will be able to eventually provide enough tools to facilitate the formation of such structures.