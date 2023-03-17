---
title: "Pricing your project"
date: "2023-03-20"
description: "Some information on the different pricing strategies as well as some advices for pricing your project."
---

> Finding the right price and strategy to release a project as an artist can be a daunting task. This articles provides some advices in that regard and describes the different pricing methods available on fxhash.

# Pricing strategies

When publishing a project on fx, artists can chose to distribute their work with different pricing strategies. As of today, 2 strategies are available:

- fixed price
- dutch auction

The pricing strategy as well as the pricing details can be updated at any time.

::infobox[For projects released prior to our V3 contracts (March 20, 2023), the pricing strategy cannot be changed, and Dutch Auction cannot be updated once started.]

## Fixed price

The most straightforward strategy, the price is fixed and won't change unless updated manually by the author(s). An opening time can be defined so that minting is enabled only after the specified time.

## Dutch auction

A Dutch Auction is defined by the following settings:

- an opening time
- a list of prices, in descending order
- a fixed time step

The Dutch Auction begins at the `opening time`, with the first price of the list. After every `time step`, the next price in the list becomes active. This is repeated until the last price of the list is met, ie the **reserve price**.

For instance, if you set the following settings:

- **opening time**: 01/01/2100 at 00:00
- 50 / 30 / 10 / 5 / 2
- 10 minutes

Your project will only become mintable (even by yourself) on the 01/01/2100 at 00:00. The starting price will be 50. After 10 minutes, the price will become 30. So on so forth until the reserve price of 2 is met at 00:40. Then the price will never change.

# Splitting the proceeds

> When publishing a project, you can define how the proceeds will be split on both the primary & secondary market.

For the primary splits, it's automatically applied to any transaction made by collectors to mint their unique iteration.

For the secondary splits, unique iterations will copy the current value on the issue and it will never change. So even if you change the secondary splits, it won't affect previously minted iterations. Only future ones.

We recommend keeping the number of splits under 10, because otherwise it will make any transaction where the splits have to be distributed slightly more expensive for the initiator of the transaction.

# Pricing recommendations

> Pricing your work is a challenging yet necessary step before releasing your project on fxhash.

fxhash allows artists to set any price by using the fixed price method or a set of prices by using the Dutch Auction mechanic. Although fxhash does not provide pricing figures for emerging or established artists — fxhash does offer a few recommendations.

## New artists

Whether you’re about to publish your first project or third — your pricing is crucial.

Without an active collector base, you’ll find it easier to attract collectors to your work with lower prices. This method aims to gain recognition by offering a low barrier to entry to new and established collectors.

When determining a price, you can ask yourself a series of questions, such as:

- How long did it take to create this project?
- If you’ve sold previous work on fxhash or elsewhere, how much was the average selling price?
- Will this be a large or small edition project?
- Do you anticipate releasing often or seldomly?
- What prices did successful artists use during their first project?

Once you've answered these questions, you should have an idea of where you’d like to price your upcoming project.

## Established artists

If you have an active collector base and are ready to release a new project on fxhash — pricing becomes much more complicated and may require extensive consideration.

Below is a list of recommendations to employ while determining the price of your work.

### Median floor price

What is the median floor price of your work across your collection of projects?

For example, if your median floor price is 250 XTZ across two previously minted projects on fxhash — 250 XTZ may be the ideal starting price (fixed or DA) for your next release.

### Hype and botting consideration

Established artists are typically targeted by bot networks that have the potential to mint out projects instantly.

With this in mind, it’s recommended to price your upcoming project at a price that will deter bots while allowing real collectors a chance to purchase your work. To do so, fxhash enables artists to harness Reserve Lists (Allow Lists) and Dutch Auction.

Dutch Auctions generally favor a very high starting price, decreasing over time to more attractive prices for collectors of all levels. Although bots may still present a problem at a Dutch Auction's lower levels, more collectors are likely to purchase your work than if you had yet to employ the DA mechanic.

**Example 1:**

You want to avoid an instant mint of your new 256 edition project that’s receiving a lot of hype on Twitter and Discord. Instead of using a fixed price mechanic of 250 XTZ, you can set the DA to 1,000 - 750 - 500 - 250 - 100 XTZ. In this example, the artist provides a range, and the market participants (collectors) determine the fair and final value.

---

Suppose you want to avoid utilizing the DA mechanic but want to ensure your work gets into the hands of previous collectors. In that case, the Reserve List is an excellent method to generate a list of prior supporters’ wallets.

Whether you choose to produce a 100% Reserve List or a 50% AL/50% Public FCFS (or any other ratio) is your decision.

**Example 2:**

You want to reward your collector base by ensuring they have unencumbered access to your upcoming 500 edition project. You can generate a list of wallets that hold at least one of your previous works and then use a lottery system to pick 500 winning wallets. Once the mint is live, only these 500 Allow Listed wallets can access the project. After a predetermined time, you can open the project to the general public on a FCFS basis if the project is not minted out. In this example, pricing is flexible due to the absence of bot networks.

**Example 3:** Similarly to Example 2, you could also over-allocate the allowlist, meaning that more collectors are allowed to mint than the project's edition size. This encourages minting, as supply is less than demand. After a predetermined time, you can open the project to the general public on a FCFS basis if the project is not minted out. In this example, pricing is flexible due to the absence of bot networks.

::infobox[Read more on reserves in the [Reserves documentation](/doc/artist/project-settings#reserves).]

### **Understanding market dynamics**

Overall, artists should understand the constant shift in market dynamics.

In general, _instant mints_ are detrimental to new and established collectors alike. Higher prices are generally known to slow minting speed but also produce a barrier to entry of its own to new collectors.

Established artists should understand that fluctuating market dynamics make it incredibly challenging to find the ideal price to satisfy _everyone_. However, fxhash offers a wide range of useful tools that allow the market to determine a fair value (Dutch Auctions) and the ability to show your appreciation to previous collectors with Reserve Lists.

Ultimately, it’s your decision to price your work as you see fit, but hopefully, this document helps you find the ideal balance while pricing your work on fxhash. If you’re still experiencing issues regarding pricing, please head over to the `# | creator-support` channel on **[our Discord](https://discord.gg/fxhash)** or get in contact with our beloved [Ozzie](https://twitter.com/artlinguistics).
