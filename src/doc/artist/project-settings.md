---
title: "Project settings"
date: "2023-03-20"
description: "Some in-depth documentation on the various settings artists can configure when minting their project on fxhash."
---

# Table of contents

# Capture settings

> When unique iterations are minted, fxhash signing module needs to generate some metadata to attach to the NFTs for them to appear as valid on the tezos ecosystem. Some part of the metadata is an image, and so the signing module needs to load your code in a webpage, and somehow extract a capture. Because there are a wide variety of projects, we propose some generic features to control this capture module.

There are 3 major settings for the capture:

- [when is it triggered ?](#trigger)
- [how is the image data extracted from the web document ?](#target)
- [in which environment will the code run ?](#environment)

## Trigger

The trigger defines when the capture module will take the preview after loading the token in a web browser:

- **Fixed delay**: Give it a delay of X seconds, and once the project is loaded, the capture module will wait X seconds before triggering the capture
- **fxpreview()**: The capture module will wait until your code calls `fxpreview()`. As soon as the function is called, the capture will be triggered. You can call this function whenever your algorithm is ready to be captured. _The capture module will automatically take a capture after 300 seconds have passed after your project was loaded in the browser._

## Target

This option defines what will be targetted by the capture module.

- **From \<canvas\>**: capture module will directly grab the data of the canvas selected in the document with the CSS selector you provide. The preview will have the same size as the canvas.
- **Viewport capture**: the capture will be made on the whole viewport, set at the resolution you will provide.

## Environment

There are 2 types of rendering instances to generate previews of tokens:

- **CPU only**: those are the default, and most scalable instances. They rely on a CPU fallback implementation for WebGL. They are suited for the majority of projects
- **GPU-enabled**: those are instances with a GPU. They can render with a GPU, but they are way slower to bootstrap and so the time it takes to generate a capture is longer because of the bootstrap time.

For most of the cases, even if your project uses WebGL, CPU instances are better because we can scale a very high amount of instances, and so it doesn't bloat the rendering queue. However, in some cases, your project may need a GPU to render properly. **For now, we only have 4 instances available, and as a result the metadata assignation will be slower for projects using those GPU-enabled instances**.

::infobox[You should **only use GPU-enabled instances** if your project doesn't render properly using regular instances]{type=warning}

If you don't use WebGL and only the regular canvas API, it's also possible that your project doesn't render properly on the CPU instance because the canvas API uses GPU acceleration. If you observe differences between the capture and your live version, then try using GPU-enabled rendering.

## Recommendations

If your project is loading asynchronous requests from the project's folder, **always consider that one of those ressources may be slow to load**. In that regard, if you load resources please always use `fxpreview()` to trigger the capture.

# Explore variation settings

As the artist, we want you to have control over the freedom viewers will have when exploring variations of your project on the token page. Under the display frame, a `variations` button can be used to explore different variations, if enabled when you minted the Generative Token.

![Mint overview](/images/articles/guide-mint/variations-button.png)

For projects using fx(params), the `explore params` button allows users to navigate the parameter space of your Generative Token.

![Explore params](/images/articles/guide-mint/explore-params-button.png)

You can configure the following settings, for both **during the mint** period and **after fully minted**:

- **enabled**: Determines if the `variations` and `explore params` buttons are active. If disabled, these buttons will be unclickable and visibly deactivated.
- **number of variations:**
  - **infinite**: viewers can explore any amount of variations and so randomly
  - **limited set of hashes**: define a list of hashes the viewers will cycle through when clicking on the button

These settings should give enough control to define a strategy during the lifetime of your token. You can for instance disabled infinite exploration after token is minted, so that the front end only display a finite number of states through the minted collection of the token. You decide.

::infobox[Please note that the variation settings have no effect on the iterations which will be generated from your project.]

# Reserves

> Reserves offer a general-purpose framework to have a better control on how to distribute your work. There are a few aspects to consider before using reserves in your project.

## What is a Reserve ?

A reserve is defined by a number of slots, as well as a strategy for who will have an access to the reserve. For now, there's only 1 type of reserve available: `Access Lists`. We will add more Reserve options in the future.

A Reserve ensures that its number of slots will only give access to the same number of editions to eligible collectors. When a user mints an iteration from your project, if they're eligible to the reserve, they will consume one slot from it (and eventually consume one of their slots). When the number of slots reaches 0, the reserve becomes fully consumed and cannot be activated anymore.

### Strategies

A Reserve can be configured in 2 ways:

- the number of slots is equal to the total number of slots for the eligible users: every user is guaranteed to have access to an edition
- the number of slots is smaller than the total number of slots for the eligible users: not every user is guaranteed to have access to an edition

Let's demonstrate this concept with an access list for 2 users, A and B.

![Reserve equal](/images/doc/artist/reserves/equal-slots.jpg)

In this first case, the number of slots of the reserve is equal to the total number of slots of the users in the access list. Both users A and B are guaranteed to get their 5 editions.

![Unequal reserve](/images/doc/artist/reserves/unequal-slots.jpg)

In this second case, the number of slots of the reserve is smaller than the total number of slots given to the users in the access list. It means that neither A nor B are guaranteed to get their 5 editions. If User A mints 5 editions from the reserve first, user B will only be left with 2 editions. If we had set the number of reserve slots to 1, only A or B would have been able to get an edition from the reserve.

Reserves are very permissive (at least when created), and it's up to you to configure those properly based on your distribution strategy.

### Reserves can be stacked

You can add multiple reserves to your project. Each reserve will save its slots for the eligible users. This is an example of multiple reserves (each of them is as access list):

![Stacked reserves](/images/doc/artist/reserves/stacking.jpg)

By having the ability to define multiple reserves, it gives you a fine control over the distribution. Use it as you see fit for your projects.

### Think about new users

We would recommend to keep new users in mind. It's great to reward your previous collectors, but we wouldn't want the platform to become gated for new-comers because of this feature. We are trusting your jugement in that regard.

### Limitations

::infobox[**As of today, and due to an issue with some optimization in our contracts, Access Lists are limited to 500 addresses per list**. We are working on solving this issue.]{type=warning}

## Use cases

### Reserve editions for yourself

Previously, artists had to disable their project and mint from it with a special access before releasing it to the public. This is no longer needed by using a Reserve for yourself. Create a reserve of type `Access List`, give it the number of slots you'd like, and add yourself in the access list with the same number of slots. You will be guaranteed to be able to mint the same number of editions whenever you'd like.

### Reward your past collectors

We've built an UI to import the current holders of the iterations generated by your projects.

![Import holders](/images/doc/artist/reserves/holder-import.jpg)

You can pick different import strategies, each being described when the option is selected.

Please keep in mind that reserves are not dynamic. Future collectors won't be included in a previously created reserve.

### Import from a CSV

You can import a CSV file when creating a reserve, which allows you to use different off-chain strategies. The CSV file should respect the following format:

```txt
address;amount
tz1dtzgLYUHMhP6sWeFtFsHkHqyPezBBPLsZ;2
tz1PoDdN2oyRyF6DA73zTWAWYhNL4UGr3Egj;4
tz1MGzgRu6qJ3RaBUErnpFDLarFVPgaApKrA;1
```

### Lock N editions for later

By setting a reserve as an access list to a burn address (or to yourself if you're not planning on consuming it), you can lock acertain number of editions which can then be safely unlocked.

## Updating a reserve

Reserves are static. When a user mints from a reserve, it updates the smart contract storage, which then has to be indexed to be displayed on the UI with the update. It means that what you see on the UI may not be completly up-to-date with onchain storage. And so, consider the following case:

![Race condition](/images/doc/artist/reserves/race.jpg)

From the contract's perspective, the following happens:

- Reserve: 10 (User A: 10)
- User A mints from reserve
- Reserve: 9 (User A: 9)
- User A: get NFT
- Author updates reserve
- Reserve: 10 (User A: 10, User B: 1)

This is known as a race condition, and measures must be taken to prevent those cases from happening. That's why the Smart Contract will reject `update_reserve` calls if a project is not disabled. When updating a reserve, we suggest following these steps:

- disable the project
- wait until the UI displays your project as disabled (refresh page)
- update the reserve
- enable the project

These steps will ensure that no race condition can happen between the UI state and the contract storage.
