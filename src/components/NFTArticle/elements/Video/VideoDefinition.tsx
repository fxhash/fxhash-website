import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";
import { VideoEditor } from "./VideoEditor";

interface InstanciateVideoOpts {
  src?: string
  caption?: string
}
export const videoDefinition: IArticleBlockDefinition<InstanciateVideoOpts> = {
  name: "Video",
  icon: <i className="fa-solid fa-video" aria-hidden/>,
  buttonInstantiable: true,
  render: ({ attributes, element, children }) => {
    return (
      <VideoEditor attributes={attributes} element={element}>
        {children}
      </VideoEditor>
    )
  },
  hasUtilityWrapper: false,
  instanciateElement: (opts = { src: '', caption: '' }) => ({
    type: "figure",
    children: [{
      type: "video",
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
