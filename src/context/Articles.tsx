import React, { useEffect, useMemo, useReducer, useState } from "react"
import { DraftNFTArticle, NFTArticleForm } from "../types/ArticleEditor/Editor";

interface ArticlesState {
  articles: {
    [key: string]: DraftNFTArticle | null,
  }
}
interface ISavePayload {
  id: string
  articleForm: NFTArticleForm
  minted?: boolean
}
type ArticlesAction =
  | { type: "loadAll" }
  | { type: "save", payload: ISavePayload }
  | { type: "delete", payload: { id: string } }
interface Context {
  state: ArticlesState
  dispatch: React.Dispatch<ArticlesAction>
  // check if an article is being edited
  isEdited: (id: string) => boolean
}

const initialState: ArticlesState = {
  articles: {}
}
export const localStorageKey = 'local_articles';
export const ArticlesContext = React.createContext<Context>({} as Context)

export const loadAllLocalArticles = () => {
  const localArticlesValue = localStorage.getItem(localStorageKey);
  return localArticlesValue ? JSON.parse(localArticlesValue) : initialState;
};
export const loadLocalArticle = (id: string) => {
  const data = loadAllLocalArticles();
  return data?.articles ? data.articles[id] : null;
}
const articlesReducer = (state: ArticlesState, action: ArticlesAction): ArticlesState => {
  switch (action.type) {
    case "loadAll":
      return loadAllLocalArticles();
    case "save": {
      const newState = {...state} || loadAllLocalArticles();
      newState.articles[action.payload.id] = {
        form: action.payload.articleForm,
        lastSavedAt: new Date().toUTCString(),
        minted: action.payload.minted || false,
      };
      localStorage.setItem(localStorageKey, JSON.stringify(newState));
      return newState;
    }
    case "delete": {
      const newState = loadAllLocalArticles();
      delete newState.articles[action.payload.id];
      localStorage.setItem(localStorageKey, JSON.stringify(newState));
      return newState;
    }
    default:
      return state;
  }
}
interface ArticlesProviderProps {
  children: any;
}
export const ArticlesProvider = ({ children }: ArticlesProviderProps) => {
  const [state, dispatch] = useReducer<React.Reducer<ArticlesState, ArticlesAction>>(articlesReducer, initialState)
  const providerValue = useMemo(
    () => ({
      state,
      dispatch,
      isEdited: (id: string) => !!state.articles[id],
    }),
    [state, dispatch],
  )

  useEffect(() => {
    dispatch({ type: "loadAll" })
  }, [dispatch])

  return <ArticlesContext.Provider value={providerValue}>
    {children}
  </ArticlesContext.Provider>
}
