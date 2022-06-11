import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { BaseEditor, BaseElement,  createEditor, Node, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import TezosStorage, {TezosStorageProps} from "../elements/TezosStorage";
import {withAutoFormat} from './AutoFormatPlugin';
import Embed from "../elements/Embed";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type TypeElement = BaseElement & { 
  type: string
  children: any 
}

type HeadlineElement = TypeElement & {
  depth: number
}

type ImageElement = TypeElement & {
  title: string   
  url: string
  alt?: string
}

type TezosStorageElement = TypeElement & TezosStorageProps

type CustomElement =  HeadlineElement | TezosStorageElement | ImageElement;

type FormattedText = { 
  text: string
  strong?: boolean
  emphasis?: boolean 
  delete?: boolean
  inlineCode?: boolean
}

type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}


const renderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  switch (element.type) {
    case 'embed-media': 
      return (
	<Embed{...attributes} href={element.href} />
      );
    case "tezos-storage":
      return (
	<TezosStorage
	  {...attributes}
	  pKey={element.pKey}
	  address={element.address}
	  metadataSpec={element.metadataSpec}
	  bigmap={element.bigmap}
	  value={element.value}
	>
	  {children}
	</TezosStorage>
      );
    case "paragraph":
      return <p {...attributes}>{children}</p>;
    case "heading": {
      switch (element.depth) {
        case 1:
          return <h1 {...attributes}>{children}</h1>;
        case 2:
          return <h2 {...attributes}>{children}</h2>;
        case 3:
          return <h3 {...attributes}>{children}</h3>;
        case 4:
          return <h4 {...attributes}>{children}</h4>;
        case 5:
          return <h5 {...attributes}>{children}</h5>;
        case 6:
          return <h6 {...attributes}>{children}</h6>;
        default:
          break;
      }
      break;
    }
    case "thematicBreak":
      return <hr />;
    case "blockquote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "list":
      if (element.ordered) {
        return <ol {...attributes}>{children}</ol>;
      } else {
        return <ul {...attributes}>{children}</ul>;
      }
    case "listItem":
      return (
        <li {...attributes}>
          {element.checked === true ? (
            <input type="checkbox" readOnly checked />
          ) : element.checked === false ? (
            <input type="checkbox" readOnly />
          ) : null}
          {children}
        </li>
      );
    case "table":
      return (
        <table>
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case "tableRow":
      return <tr {...attributes}>{children}</tr>;
    case "tableCell":
      return <td {...attributes}>{children}</td>;
    case "html":
      return (
        <div
          {...attributes}
          dangerouslySetInnerHTML={{
            __html: element.children[0].text as string,
          }}
        />
      );
    case "inlineMath":
      return (
	<span contentEditable={false}>
	  <InlineMath math={element.data.math}/>
	  {children}
	</span>
      );
    case "code":
      return (
        <code {...attributes}>
	  {children}
	</code>
      );
    case "yaml":
    case "toml":
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      );
    case "definition":
      break;
    case "footnoteDefinition":
      break;
    case "break":
      return <br />;
    case "link":
      return (
        <a
          {...attributes}
          href={element.url as string}
          title={element.title as string}
        >
          {children}
        </a>
      );
    case "image":
      return (
        <>
          <img
            {...attributes}
            src={element.url as string}
            title={element.title as string}
            alt={element.alt as string}
          />
          {children}
        </>
      );
    case "linkReference":
      break;
    case "imageReference":
      break;
    case "footnote":
      break;
    case "footnoteReference":
      break;
    default:
      break;
  }
  return <p {...attributes}>{children}</p>;
};

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.strong) {
    children = <strong>{children}</strong>;
  }
  if (leaf.emphasis) {
    children = <em>{children}</em>;
  }
  if (leaf.delete) {
    children = <del>{children}</del>;
  }
  if (leaf.inlineCode) {
    children = <code>{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};

interface SlateEditorProps {
  initialValue: Descendant[]
};

const INLINE_ELEMENTS = ['inlineMath']
const VOID_ELEMENTS = ['inlineMath']

export const SlateEditor = forwardRef<Node[], SlateEditorProps>(
  ({ initialValue }: SlateEditorProps, ref: React.ForwardedRef<Node[]>) => {
    const editor = useMemo(() => {
      const e = withReact(
	withAutoFormat(
	  withHistory(
	    createEditor()
	  )
	)
      );
      const { isInline, isVoid } = e;
      e.isInline = element => INLINE_ELEMENTS.includes(element.type) || isInline(element)
      e.isVoid = element => VOID_ELEMENTS.includes(element.type) || isVoid(element)
      return e;
    }, []);

    const [value, setValue] = useState<Node[]>(initialValue);
    (ref as React.MutableRefObject<Node[]>).current = value;

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    
    return (
      <div
	className="markdown-body"
	style={{flex:1 , margin: 10}}
      >
	<Slate
	  editor={editor} 
	  value={value} 
	  onChange={setValue}
	>
	  <Editable
	    renderElement={renderElement}
	    renderLeaf={renderLeaf}
	    style={{whiteSpace: 'normal'}} 
	  />
        </Slate>
      </div>
    );
  }
);

SlateEditor.displayName = "SlateEditor";


