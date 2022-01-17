---
title: 'Collect & Mint Tokens'
date: '2021-10-20'
description: 'How to collect & mint tokens on fxhash ?'
---

This guide will walk you through everything you need to know in order to collect on fxhash. From the basic tools to interact with the *tezos blockchain* to the principles behind fxhash, it's covered in this article.


# Interact with the Tezos blockchain

In order to interact with the Smart Contracts of **fxhash**, you will need to have a tezos wallet. You can find a of [available wallets on the tezos website](https://tezos.com/learn/store-and-use/).

We recommend [Temple](https://templewallet.com/) (browser extension) or [Kukai](https://wallet.kukai.app/) (website).

Once you have a wallet and a tezos address on it, you can synchronize your wallet with fxhash by clicking on the *sync* button. You will need to send tezos to your address in order to purchase tokens on the platform. It can be done through various exchange platforms, such as [coinbase](https://www.coinbase.com/en/how-to-buy/tezos), [kraken](https://www.kraken.com/en-gb/learn/buy-tezos-xtz) or [coinhouse](https://www.coinhouse.com/buy-tezos/) for instance.


# How does fxhash work ?

![Mint overview](/images/articles/guide-collect/guide-mint.jpg)

## Overview

* Click on the mint button
* A confirmation is sent to your wallet
* Confirm the transaction
* Transaction is sent to the blockchain
* You become the owner of an unique iteration

## Waiting to be signed

While the metadata is being generated, the tokens will appear as *[waiting to be signed]*

![Waiting to be signed example](/images/articles/guide-collect/waiting-to-be-signed.jpg)


# Opening hours for new content

**fxhash** follows opening cycles for the new content. While you are free to mint unique iterations at any time, artists can only publish new Generative Tokens during opening hours. This mechanic was implemented during the early days, when the platform couldn't handle as many transaction as there were. It gave servers some time to catch up on **the signing process**.

However the community observed that the mechanic itself was quite interesting, as it could give a schedule so that collectors and artists could gather at the same time and expect new content to be added to the platform.

We are currently experimenting with the opening schedule. Maybe it will stay, maybe it won't. It's part of the fun for now.

You can find the opening schedule under [/community/opening-schedule](/community/opening-schedule)


# Temple with fxhash RPC (optionnal)

*This is not required, but can help you send request with more success to the tezos blockchain*

To interact with the Tezos blockchain using Temple, a RPC endpoint needs to receive the requests. Sometimes, when there is a lot of traffic on tezos, the public RPC used by Temple can be very slow. That's why we decided to deploy our own RPC endpoint. It's actually used by the front-end to interact with the blockchain as well, so that we can be safe from public nodes being down. This is how you can configure Temple to use our RPC endpoint:

## Open Temple

![Temple home](/images/articles/guide-collect/temple1.jpg)

## Open the settings

![Temple settings menu](/images/articles/guide-collect/temple2.jpg)

## Open the network settings

![Click on network settings](/images/articles/guide-collect/temple3.jpg)

## Add the fxhash RPC

* Scroll down, until you get to **ADD A NETWORK**
* Give it a name (whatever you prefer)
* Enter `https://rpc1.fxhash.xyz` as the base URL
* Add the network

![Add a network](/images/articles/guide-collect/temple4.jpg)

The RPC should now appear in the list of available endpoints.

![Network should be added](/images/articles/guide-collect/temple5.jpg)

## Set fxhash RPC as active RPC

* Go back to the home of Temple
* Click on the dropdown to select the RPC (labelled as Tezos Mainet if you have the default settings)
* Select `FXHASH RPC` (or the name you entered)

![Set RPC active](/images/articles/guide-collect/temple6.jpg)

## That's it !

Now the requests you send to the blockchain will go through the fxhash RPC, and so if the public nodes are down/slow due to important activity, it will make sure that your requests go through. You can change the RPC whenever you want.

## Is is safe to use ?

When you send an operation on the Tezos blockchain, it is signed locally using your private key (Temple does it under the hood). You then send the operation with a signature attached to it to prove that your are the author. RPCs are only receiving your operation and the signature, 2 components required to apply the transaction on the blockchain. The RPC **cannot** change the operation, because then the signature would become invalid and the blockchain would reject it. Also, since you never send the private key on the network, the RPC will never have it.

## Thanks to liquid !

The RPC was deployed by [liquid](https://twitter.com/l1qu1d_), thanks a lot to him !


# Be careful with your tezos

fxhash is an open generative art platform that is intended, but not promised or guaranteed, to be correct, complete, and up-to-date. We have taken reasonable steps to ensure that the information contained in this website is accurate, but we cannot represent that this website is free of errors. You accept that the information contained on this website may be erroneous and agree to conduct due diligence to verify any information obtained from this website and/or resources available on it prior to taking any action. You expressly agree not to rely upon any information contained in this website.

Before purchasing mints from any artist (including any fxhash verified user) offered on the site or marketplace, you are advised to verify the artist verification independently. Although we may choose in our sole discretion to intervene or attempt to resolve a dispute between you and other fxhash users or Third Party Sites, you agree that we have no obligation to do so and that all transactions are ultimately solely between you and the applicable fxhash users or Third-Party Tools. 
The verification badge provided shall help collectors but is no substitute for doing your diligence.