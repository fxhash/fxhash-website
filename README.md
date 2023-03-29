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

## Warning

The front-end is set up to run against the main fxhash API and the contracts on the **mainnet** so **BE CAREFUL**. If you buy a token using this front-end running on your local machine using your wallet, it will be **as if you ran the same operation on the official website**.


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

* `/articles` *[deprecated]*: markdown files, generated in html at build time, they populate the `about` tab of the website
* `/components`: reusable components used multiple times in the app
* `/containers`: bigger *building block* components. They often use multiple components and have some more complex logic
* `/context`: react context
* `/doc`: the articles from the doc - website doc is derived from this folder
* `/hooks`: react hooks
* `/pages`: the different pages of the website (see nextjs doc)
* `/queries`: graphQL queries (not all of them are in there, to be done)
* `/services`: modules to interact with external services
* `/styles`: the generic styles of the app
* `/types`: type definitions
* `/utils`: general-purpose utility functions 

