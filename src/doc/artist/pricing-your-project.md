---
title: 'Pricing your project'
date: '2022-04-16'
description: 'Some information on the different pricing strategies as well as some advices for pricing your project.'
---

Finding the right price and strategy to release a project as an artist can be a daunting task. This articles provides some advices in that regard and describes the different pricing methods available on fxhash.


# Pricing strategies

When publishing a project on fx, artists can chose to distribute their work with different pricing strategies. As of today, 2 strategies are available:

* fixed price
* dutch auction

Once a project is released with a certain pricing strategy, **the strategy cannot be changed**.


## Fixed price

The most straightforward strategy, the price is fixed and won't change unless updated manually by the author(s). An opening time can be defined so that minting is enabled only after the specified time.

It is possible to update the settings of a fixed price at any time.


## Dutch auction

A Dutch Auction is defined by the following settings:

* an opening time
* a list of prices, in descending order
* a fixed time step

The Dutch Auction begins at the `opening time`, with the first price of the list. After every `time step`, the next price in the list becomes active. This is repeated until the last price of the list is met, ie the **reserve price**.

For instance, if you set the following settings:

* **opening time**: 01/01/2100 at 00:00
* 50 / 30 / 10 / 5 / 2
* 10 minutes

Your project will only become mintable (even by yourself) on the 01/01/2100 at 00:00. The starting price will be 50. After 10 minutes, the price will become 30. So on so forth until the reserve price of 2 is met at 00:40. Then the price will never change.

Once a Dutch Auction has started, **it cannot be updated anymore**, even after the reserve price is met. This is designed to ensure fairness for the collectors who commited when the auction was active.


# Pricing recommendations

If you are still lacking experience in selling your work on crypto platforms, we know that putting some value on it can be both challenging and emotionally demanding. As you will get more experience, it will become easier to find the right price. Not easy, but easier.

There are many strategies to find a price, and you will need to find your own. However, answering those questions may help you if you are struggling:

* what's the average price of the pieces on the market ?
* how much time did you spend working on your piece ? how much would you like to be compensated for this time spent ?
* is your work already known out there ? - if it's not yet, it can be easier to find a collector base by putting more attractive prices
* have you ever sold some of your work ? how does this piece compares (in terms of quality) to your previous works ?
* how many editions will be generated ?
* what image do you want your work to be associated with ? does the price play a role in that matter ?

By answering these questions, you should at least have an estimate on how to price your work.

If you are still undecided for a fixed price, you can use the Dutch Auction to let the market decide for you. It's easier to define a range of prices and observe what happens when it hits the market.

**Remember:** it's very hard to find your own prices, don't put too much pressure on yourself, we all go through that. If you want some advices from our welcoming community, feel free to ask your questions on the `# | creator-support` channel on [our Discord](https://discord.gg/fxhash).