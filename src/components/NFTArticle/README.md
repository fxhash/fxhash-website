# NFT Article

These are guidelines on how to add new elements, plugins and processor features to FxHash Nft Articles.

## Introduction

We process a markdown from a Slate.js editor. To achieve that we use two tools:
- Slate.js - for all features related to the editor (mainly elements) - https://docs.slatejs.org/
- Unified - allow us to transform between slate, markdown and html - https://github.com/unifiedjs/unified

It is recommended to read about the concepts of Slate.js before doing any changes.

## Folder structure

```
NFTArticle
│   README.md
│   NFTArticle.tsx
│   NFTArticleEditor.tsx
│   
└───elements
│   │
│   └───Element
│       │   ElementDisplay.tsx
│       │   ElementEditor.tsx
│       │   ElementDefinition.tsx
│       │   ElementProcessor.ts
│       
└───editor
│   │   index.tsx
│   │   Blocks.tsx
│   │
│   └───Plugins
│       │   plugin.[tsx, ts]
│   
└───processor
    │   index.ts
    │   plugins.ts
    │   getStateFromAnotherState.ts
```

- NFTArticle is a component to display an article from a markdown file.
- NFTArticleEditor will load the editor, the data from a markdown file and transform it into Slate nodes.

## Editor

Editor folder contains all components related to the editor behavior: UI, plugins.

### UI Folder

UI folder contains all components for the editor interface (components that can be used by `elements/ElementEditor.tsx` for example)

### Add a new plugin

Create a file or folder in `editor/plugins`.

If you enhance the editor with additional features on the behavior, the entrance file function must be of the form:

```ts
export const withBreaks: EnhanceEditorWith = (editor) => {
  const { insertBreak } = editor

  // example
  editor.insertBreak = () => {
    // code
  }

  return editor
}
```

## Elements

List of elements implemented by the editor

### Add a new element

Adding a new element require one mandatory file : `ElementDefinition.tsx`

```tsx
export const elementDefinition: IArticleBlockDefinition<OptionalInstanciateData> =  {
  name: "Element",
  icon: <i className="fa-element-icon" aria-hidden />,
  render: ElementEditor,
  instanciateElement: (opts) => ({
    type: "element",
    children: [{
      text: ""
    }]
  }),
}
```
The file contains all data required to implement the element behavior in the editor. (Read about IArticleBlockDefinition to get more infos)

The `render` define how the element will be rendered in the editor. It can be defined in the property or in a different file. If a different file is used, name it `ElementEditor.tsx`.

When displaying an article outside the editor, if the element is not already handled by the processor, we can define a `ElementDisplay.tsx` and a `ElementProcessor.tsx`
- `ElementDisplay.tsx`: Component to display
- `ElementProcessor.ts`: Transformation Functions between processors

Once you have created the element, add the definition to the file `editor/Blocks.tsx`

## Processor

The processor allow us to change between different states: Slate, Markdown, React. 

### Add a new processor

Create a file named `getNewStateFromState.ts` and add the default export to `processor/index.ts`

### Add a new plugin processor

Sometimes some processors have incomplete plugins or you need to change the behavior of something. In that case, add a new function to the file `plugin.ts`

