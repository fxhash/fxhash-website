How to update the documentation section of the website
==============

The document section is derived from the `doc` folder only (the folder in which this file is).

At the root of the folder, next to the `README.md` file, you will find a `doc.json` which defines the structure of the about section as a whole.


# JSON structure

## Root

At the root of the JSON are the general informations on the documentation page.

```json
{
  "title": "Documentation",
  "description": "Learn about fxhash, its principles as an artist and as a collector.",
  "categories": [] 
}
```

* `title`: the title of the page, will be displayed at the top
* `description`: A short text to describe the page, will be displayed under the title
* `categories`: A list of categories


## Categories

A category is a group of articles.

```json
{
  "title": "The platform",
  "icon": "far fa-browser",
  "link": "fxhash",
  "articles": []
}
```

* `title`: The title of the category
* `icon`: Font awesome classnames to target an icon. Any icon can be used, even the pros. Icons can be found on this page [https://fontawesome.com/v5.15/icons?d=gallery&p=2](https://fontawesome.com/v5.15/icons?d=gallery&p=2)
* `link`: the root link of the category, will be explained in a following section
* `articles`: A list of articles


## Articles

An article is used to define an article object and point to the file where the content can be found.

```json
{
  "title": "Publish a Generative Token",
  "link": "guide-publish-generative-token"
}
```

* `title`: The title of the article, will be displayed in the menu
* `link`: The link to the article within the category directory


# How does it work

Articles are written in **markdown** and can be found in the same directory as this `README.md` file. When the site is built, somes pages will be generated using the `doc.json` object. For each article, a page will be created.

The `link` property in the category and article objects defines 2 things:
* where the content of the article is located
* the URL to access the article on the website

Basically, the `link` in the category objects defines the folder in which the article is located, and the `link` in the article object defines the name of the file in the folder.

Here's an example:

```json
{
  "title": "Documentation",
  "description": "zjefzihguezrg",
  "categories": [
    {
      "title": "Artistic guides",
      "icon": "fas fa-laptop-code",
      "link": "artist",
      "articles": [
        {
          "title": "Publish a Generative Token",
          "link": "guide-publish-generative-token"
        },
        {
          "title": "Artist Code of conduct",
          "link": "code-of-conduct"
        }
      ]
    }
  ] 
}
```

In this case, there are 2 articles:
* `/artist/guide-publish-generative-token`
* `/artist/code-of-conduct`