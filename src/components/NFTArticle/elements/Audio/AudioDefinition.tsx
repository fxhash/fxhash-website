import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";
import { AudioEditor } from "./AudioEditor";

interface InstanciateAudioOpts {
  src?: string
  caption?: string
}
export const audioDefinition: IArticleBlockDefinition<InstanciateAudioOpts> = {
  name: "Audio",
  icon: <i className="fa-solid fa-music" aria-hidden/>,
  buttonInstantiable: true,
  render: ({ attributes, element, children }) => {
    return (
      <AudioEditor attributes={attributes} element={element}>
        {children}
      </AudioEditor>
    )
  },
  hasUtilityWrapper: false,
  instanciateElement: (opts = { src: '', caption: '' }) => ({
    type: "figure",
    children: [{
      type: "audio",
      src: opts.src,
      children: [{
        text: ""
      }]
    }, {
      type: "figcaption",
      children: [{
        text: opts.caption
      }]
    }]
  }),
};
