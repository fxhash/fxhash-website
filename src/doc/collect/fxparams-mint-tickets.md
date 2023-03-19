---
title: "fx(params) and mint tickets"
date: "2023-03-20"
description: "Documentation on the minting pipeline with fx(params) & the mint tickets."
---

# fx(params) quick overview

fx(params) is a powerful new module allowing generative artists to define a set of parameters that collectors explore, adjust, and toggle before minting. This optional feature is intended to amplify artistic powers of expression and enables collectors to collaborate in the creative process.

::infobox[fx(params) was introduced by fxhash on March 20, 2023]

# A refined minting experience for fx(params) projects

For projects without fx(params), the minting process is quite straightforward: click on `mint`, get an iteration. Because fx(params) requires inputs from collectors, they need to have enough time to properly explore the parametric space, while having their slot to mint secured.

**fx(params)** introduces an intuitive two-step minting process designed to enhance the creative experience for collectors.

![minting details of fxparams projects](/images/doc/artist/fxparams/tickets.png)

First, mint a ticket to an **fx(params)** project. This ticket allows you to discover endless minting possibilities by playing with different parameter combinations. Then, exchange your ticket to lock in the parameters and mint your favorite output.

Our new minting process unlocks artistic exploration and experimentation like never before, empowering collectors to co-create generative art from infinite perspectives.

After a ticket is bought, it can be exchanged for an iteration through the fx(params) minting interface.

![fxhash minting interface for params](/images/doc/artist/fxparams/mint-interface.png)

# The mint ticket mechanism

The **fx(params)** two-step minting process introduces new dynamics, such as:

- Time needed to explore parameters before minting
- Collectors keeping tickets without exchanging them
- Artists sharing the creative process with collectors

To address the nuances of these dynamics and protect the interests of both artists and collectors using **fx(params)**, tickets are subject to a Harberger tax system. This tax mechanism requires ticket holders to pay a daily tax to maintain ownership of an unexchanged ticket.

With a tax in place, we can facilitate and incentivize several important factors at once, such as maximizing the amount of tickets exchanged for artworks, the proper assessment of mint ticket value by collectors, and ensuring artists are compensated for collectors holding unexchanged tickets.

Let’s take a deeper look at how the **fx(params)** mint ticket tax system works in the next section.

## How the mint ticket works

After an artist-defined grace period, **tickets are always listed for sale and subject to a daily proportional tax** until they are exchanged for an artwork.

In other words, once outside of the grace period, ticket holders have two options: pay a daily tax or exchange the ticket for an artwork. This means there is no option to keep the ticket off the market and that, as a ticket holder, you should constantly reassess the ticket’s market value to avoid paying a higher daily proportional tax than necessary.

![Visual representation of tickets taxation](/images/doc/collector/fxparams/ticket-tax.png)

### 🆓 Grace period

The grace period is a duration of time defined by the artist wherein ticket holders can explore the generative algorithm and play with parameters without paying tax on the unexchanged ticket.

Defining the length of the grace period allows artists to further refine and influence the collector’s exploratory process, giving them more or less time to exchange their ticket for an artwork before the daily proportional tax applies.

Grace periods can be as short as one day or longer than multiple lifetimes — it’s entirely up to the artist. When the grace period ends, the tax mechanism kicks in, requiring tickets to be listed on the market and subject to tax for as long as they remain unexchanged.

::infobox[**Careful!** If at the end of the grace period, tax has not been provisioned, owner will lose ownership of their ticket and it will enter foreclosure. Make sure to either exchange your tickets before the end of the grace period, or pay the tax in advance based on the price you want to set and for how long you want the ticket to be covered.]{type=warning}

### 💸 Daily proportional tax

Once an unexchanged ticket falls outside of the grace period, a new set of requirements should be met by the ticket holder to maintain ownership of the ticket.

1. The ticket holder defines a price for the ticket, thereby listing it on the secondary market
2. A daily tax proportional to the ticket’s list price must be paid to retain ownership

These requirements entail that unexchanged tickets are always for sale and collectable by anyone — and that any salable ticket is subject to the daily tax. **If the ticket tax is not paid**, ownership is forfeited by the owner and the ticket is entered into foreclosure.

The yearly tax is roughly 51% of the ticket price defined by its owner. Moreover, all taxes collected from **fx(params)** projects are sent to their respective creators.

### ⛔ Ticket foreclosure

When a ticket holder fails to pay the daily proportional tax, their ticket is forfeited and entered into foreclosure. During this process, the ticket is auctioned off beginning from its list price and decreases linearly over a 24hr period until it reaches a 0.1 XTZ resting price. Anyone can buy a ticket in foreclosure, including its previous owner.

::infobox[When a ticket is claimed, either during the auction in its foreclosure or at the price defined by the previous owner, the full amount paid by the buyer is transfered the the previous owner. Only taxes are paid to the artists.]

### Extra information

Mint tickets are NFTs: they will appear in your wallet alongside your other NFTs, and you will be able to transfer them.

However, mint tickets cannot be traded on other marketplaces: that's because the marketplace is written into the mint tickets Smart Contract.

::infobox[If a ticket is transferred to another account, the recipient will be responsible for either paying the tax to keep ownership or exchanging the ticket for an iteration]{type=warning}
