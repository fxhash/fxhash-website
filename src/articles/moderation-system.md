---
title: 'The moderation system'
date: '2021-11-21'
description: 'How does the moderation system work ?'
---

fxhash is and will remain open to the artists. However, its open nature makes it a perfect target for malicious individuals. As of 2021/11/21, the platform saw copyminters taking advantage of the momentum and good energy in the community to scam enthousiast collectors. The platform must deploy tools to prevent this type of behavior. However, because of its open nature, regulating such behaviors is difficult. Since no curation of the content is made prior to projects being minted, a set of features was added to the front-end to protect collectors from these malicious behaviors.


# The report system

Members of the community can now report suspicious Generative Tokens on their page.

![Report button](/images/articles/mod/report.jpg)

A vote from a member will only count if it meets certain criteria:
* the member posted at least one Generative Token OR owns at least one Gentk
* only one report/account/Generative Token was made
* Generative Token was not flagged as `CLEAR` by a moderator

The report is sent to a Smart Contract which is indexed by fxhash, and the reports are processed when they reach the blockchain. If 10 votes are counted in the span of 1 hour, the Generative Token will be flagged as `REPORTED` by the indexer. Once a Generative Token is flagged as reported, it will be hidden from the main, explore, and user creations pages. It will then enter a moderation stage, during which only trusted community members will have the authority to decide if the Generative Token can remain on the platform.


# The moderation system

When a Generative Token is flagged as “REPORTED”, it will appear in the [/community/reports](/community/reports) page. On this page, moderators will have the ability to update the flag of the token to:

* **CLEAN**
* **MALICIOUS**

If a token is moderated as `CLEAN`, it will become accessible again, and reports will **no longer be counted**. It will never be flagged as `REPORTED` by the system again.

If a token is moderated as `MALICIOUS`, then it will **remain inaccessible on the main, explore, and user creations pages**. If some Gentk were already generated using the Generated Token, **they will be flagged as “undesirable content”**.

![Community reports](/images/articles/mod/comm-reports.jpg)

The moderation system does not set a finite flag on a Generative Token. A manual operation can update the state manually. 

Also, if a moderator sees an undesirable Generative Token, they can remove it from the UI manually, and so by calling a Smart Contract.


# Locking the mint button for an hour

One issue remains with the system described above. There is no way to establish if a Generative Token can be minted safely in the moments following its release. If no moderator is present, at least 10 reports are required for the token to be flagged, and it can take some time. *This  next feature helps in that regard*.

The mint button of a Token will appear as **locked** for an hour after its Generative Token is posted. This lock acts as a reminder for the collectors to assert the validity of a Generative Token before minting from it.

![Mint button locked](/images/articles/mod/lock-btn.jpg)

The lock can be removed by clicking on it, and by doing so acknowledging the risks of minting from a recent token which did not go through the community/moderators approval.


# Warning on flagged Tokens

Finally, a warning will appear at the top of all the Generative Tokens flagged. It will also appear at the top of Gentks minted from flagged Generative Tokens. It acts as a last-resort warning to inform members.

![Flag banner](/images/articles/mod/flag-banner.jpg)


# Why this system

This system was designed to meet certain criteria:

* protect the collectors
* keep the platform opened
* give the community the ability to self-moderate Generative Tokens
* give flexibility to the moderator team
* work along the current system


# These are only the first steps

The Smart Contracts currently used by fxhash will eventually be updated when the platform is released. Some features, yet to be determined, will be added to the next contracts to enforce this moderation system.
