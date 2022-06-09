import { NamedExoticComponent } from "react";
import type { Node } from "unist";

export interface Article {
  id: string
  date: string
  title: string
  contentHtml: string
  description: string
}

export type getPropsFromNode<T> = (node: Node, properties: any) => Omit<T, "children">
export interface NFTArticleElementComponent<T> extends NamedExoticComponent<T> {
  defaultProps?: {
    [key: string]: any
  }
  getPropsFromNode?: getPropsFromNode<T>
}
