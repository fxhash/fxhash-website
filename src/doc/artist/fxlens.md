---
title: "fx(lens)"
date: "2023-03-20"
description: "A documentation about fx(lens), fxhash local development studio."
---

> fx(lens) is fxhash **fully-featured local development environment**, designed to facilitate the development and the publication of fxhash projects.

# What is fx(lens) ?

fx(lens) is a web page which can be executed locally, designed to load and interact with fxhash projects in your local environment. It provides various tools which can be accessed via a minimalistic UI, facilitating the exploration of fxhash projects as they are being developped.

![screenshot of fxlens](/images/doc/artist/lens/lens-1.png)

# fx(lens) + boilerplate

fx(lens) on its own is just a web page which can load a token. To further improve the development experience we created a boilerplate which comes with fx(lens) integrated. With 3 commands, you can bootstrap a fully-featured dev environment specifically dedicated to work on fxhash projects. Our boilerplate comes with CLI utilities to quickly spin some servers locally and open fx(lens) pointing to the project's server. This unlocks a few possibilities, such as having hot-reloading for your project (as soon as you save your project file, the page updates).

::github[fxhash boilerplate]{href=https://github.com/fxhash/fxhash-boilerplate desc="fxhash official boilerplate, fully-featured development environment with many utilities to work and publish a fxhash project."}

## Overview

This is a list of features supported by our boilerplate:

- **already setup**: code snippet is injected, you can start to work on your content immediately
- **local environment** with [Live Reload](https://webpack.js.org/configuration/dev-server/#devserverlivereload) so that you can iterate faster on your projects
- **fx(lens)**: an interface to explore your code with different hashes, and a display of controllers to modulate the params defined in your code
- **javascript imports**: you can import npm packages, use the import syntax, and webpack will bundle everything in a single minified javascript file
- **automated deployment**: run a command to build your files and create a ZIP archive ready to be deployed on fxhash

## How to install the boilerplate on your machine

### Prerequisites

- `node` >= 14
- `npm` >= 6.14.4 (comes installed with node nowadays)

### Install the boilerplate locally

Open your CLI and navigate to the folder of your choice.

```sh
cd path/to/your/working/directory
```

Clone the repository, and unlink git (so that it's not synced with the repo)

```sh
npx degit fxhash/params-boilerplate your_project_name
```

Navigate to the folder freshly created

```sh
cd your_project_name
```

Install dependencies and fx(lens)

```sh
npm install
```

### Start the environment

```sh
npm start
```

This will start 2 servers, one for fx(lens) and one for your project, and will open fx(lens) pointing to the project in your browser ([http://localhost:3000/?target=http://localhost:3301/](http://localhost:3000/?target=http://localhost:3301/))

If everything went well, you should see the following page:

![fx(lens) capture after first opening](/images/doc/artist/lens/lens-install.png)

## How to work with the boilerplate

At the root of your the boilerplate folder, there is a `project` folder. This is where any file related to your project should go. The boilerplates comes with the following project structure:

```text
├── project
|   ├── public
|   |   ├── index.html  <-- entry point of the page, loads css, js and includes fxhash snippet
|   |   └── style.css   <-- loaded by index.html, your styles can go in there
|   └── public
|       └── index.js    <-- entry point of the code, comes with basic usage example
```

The `index.js` is where the core of your code will go. You will find some example code in the file, so that it's easier for you to get started right away.

::infobox[If you want to lear more about the `$fx` API that's made available by the snippet, you can read the [Snippet API documentation](/doc/artist/snippet-api).]

## How to publish a project once done

The boilerplates comes with a command to prepare your project files for an upload on fxhash. At the root of the boilerplate, you can run:

```sh
npm run build
```

This will create (or update if done previously) 2 folders at the root of the boilerplate:

- `dist`: the files of your project, with the javascript bundled
- `dist-zipped`: a folder containing a zip of your project, ready to be uploaded to fxhash

Then, you can just upload the `dist-zipped/project.zip` ZIP file on the minting interface of fxhash.

# Using fx(lens) as a standalone

fx(lens) can also work as a standalone, and you can point it to any URL where a project is running. You can read the readme in the github repository for more details.

::github[fx(lens)]{href=https://github.com/fxhash/fxlens desc="fx(lens) is an interactive environment to view, tweak and develop generative tokens for the fx(hash) platform"}
