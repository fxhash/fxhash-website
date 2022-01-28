# fxhash front-end

This project is the front-end of [fxhash](https://fxhash.xyz/).
The front-end uses [Nextjs](https://nextjs.org/), a React framework.
If you want to contribute, being familiar with React might be required. However, Nextjs is pretty easy to pick-up knowing React ! Just get familiar with the basic concepts in their doc and you're good to go.


## Installation

```bash
git clone https://github.com/fxhash/fxhash-website
```

Go to the project directory

```bash
npm install
# or
yarn install
```

Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_API_ROOT = https://api.fxhash.xyz/graphql
NEXT_PUBLIC_API_INDEXER = https://indexer.fxhash.xyz:4001/
NEXT_PUBLIC_API_FILE_ROOT = https://file-api.fxhash.xyz:4004
NEXT_PUBLIC_TZKT_API = https://api.tzkt.io/v1/
NEXT_PUBLIC_API_CAPTURE = https://europe-west1-centering-helix-329717.cloudfunctions.net/dev-local-fxhash-web-capture

NEXT_PUBLIC_URL_DISCORD = https://discord.gg
NEXT_PUBLIC_URL_TWITTER = https://twitter.com
NEXT_PUBLIC_URL_INSTAGRAM = https://instagram.com

NEXT_PUBLIC_MAX_FILESIZE = 15

NEXT_PUBLIC_RPC_NODES = https://mainnet.api.tez.ie,https://mainnet.smartpy.io,https://rpc.tzbeta.net,https://teznode.letzbake.com
NEXT_PUBLIC_TZ_NET = mainnet

NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER = KT1AEVuykWeuuFX7QkEAMNtffzwhe1Z98hJS
NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE = KT1Xo5B7PNBAeynZPmca4bRh6LQow4og1Zb9
NEXT_PUBLIC_TZ_CT_ADDRESS_OBJKT = KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE
NEXT_PUBLIC_TZ_CT_ADDRESS_USERREGISTER = KT1Ezht4PDKZri7aVppVGT4Jkw39sesaFnww
NEXT_PUBLIC_TZ_CT_ADDRESS_TOK_MODERATION = KT1HgVuzNWVvnX16fahbV2LrnpwifYKoFMRd
NEXT_PUBLIC_TZ_CT_ADDRESS_USER_MODERATION = KT1TWWQ6FtLoosVfZgTKV2q68TMZaENhGm54
NEXT_PUBLIC_TZ_CT_ADDRESS_CYCLES = KT1ELEyZuzGXYafD2Gar6iegZN1YdQR3n3f5

NEXT_PUBLIC_BETA_MODE = on
NEXT_PUBLIC_GT_MIN_PRICE = 0

NEXT_PUBLIC_ALGOLIA_APP_ID = 6N9LMRLY02
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY = e6c2e443d04ecb3ce097de0f1648cb57
NEXT_PUBLIC_ALGOLIA_INDEX_GENERATIVE = fxhash-generative-tokens
NEXT_PUBLIC_ALGOLIA_INDEX_MARKETPLACE = fxhash-offers

ANALYZE = false

NEXT_PUBLIC_BANNER_MESSAGE = <span><strong>Warning</strong>: fxhash is in BETA mode. More by clicking this banner</span>
NEXT_PUBLIC_MAINTENANCE_MESSAGE = Deploying new backend architecture
NEXT_PUBLIC_MAINTENANCE_MODE = 0

NEXT_PUBLIC_REFERENCE_OPENING = 2021-11-26T06:00:00.000Z
```

This will set the front-end to run against the main fxhash API and the contracts on the **mainnet** so **BE CAREFUL**. If you buy a token using this front-end running on your local machine using your wallet, it will be **as if you ran the same operation on the official website**.

> Currently this project runs against the mainnet, but at some point I will set up some backend on the testnet for a better dev experience.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## How to contribute

You can find opened issues on the [https://github.com/fxhash/fxhash-website/issues](https://github.com/fxhash/fxhash-website/issues) tab. If you want to implement a feature, please check first if an issue is opened and see what needs to be implemented in that regard. If no issue is opened, feel free to implement your feature as you wish.

### Workflow

* fork the **dev** branch of this repo
* create a branch to implement a feature or fix a bug
* when done, push the branch to your git repository fork
* create a pull request againts the **dev** branch
* the team will review it, and either request changes or merge it

If you find a bug with the front end, you can create an issue.

### Branch naming convention

* `feature/_`: add a feature
* `change/_`: a change on a particular feature
* `bug/_`: fix a bug

### Stack used

* [nextjs](https://nextjs.org/) / [react](https://reactjs.org/)
* [typescript](https://www.typescriptlang.org/)
* [css modules](https://github.com/css-modules/css-modules) (with sass)
* [taquito](https://tezostaquito.io/) to interact with the blockchain
* [ApolloClient](https://www.apollographql.com/docs/react/) to run graohQL queries (both durring SSR and on the client-side), and handle the store (client-side)

### Project structure

* `/articles`: markdown files, generated in html at build time, they populate the `about` tab of the website
* `/components`: reusable components used multiple times in the app
* `/containers`: bigger *building block* components. They often use multiple components and have some more complexe logic
* `/pages`: the different pages of the website (see nextjs doc)
* `/queries`: graphQL queries (not all of them are in there, to be done)
* `/services`: modules to interact with external services
* `/styles`: the generic styles of the app
* `/types`: type definitions
* `/utils`: general-purpose utility functions 