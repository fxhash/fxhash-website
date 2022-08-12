import { FigureElement } from "./FigureEditor";
import { ImageAttributeSettings } from "../Image/ImageAttributeSettings";
import { BlockParamsModal } from "../../SlateEditor/Utils/BlockParamsModal";
import { Node, Transforms } from "slate";
import { IArticleBlockDefinition, TEditAttributeComp } from "../../../../types/ArticleEditor/BlockDefinition";
import { FigcaptionElement } from "./FigcaptionEditor";
import { VideoAttributeSettings } from "../Video/VideoAttributeSettings";

const medias = ["image", "video"];
const mediaAttributeSettings: Record<string, TEditAttributeComp> = {
  "image": ImageAttributeSettings,
  "video": VideoAttributeSettings,
}
export const figureDefinition: IArticleBlockDefinition<null> = {
  name: "Image",
  icon: null,
  render: FigureElement,
  hasUtilityWrapper: true,
  editAttributeComp: ({ element, onEdit }) => {
    const children = Node.elements(element)
    for (const [child] of children) {
      if (medias.indexOf(child.type) > -1) {
        const AttributeSettings = mediaAttributeSettings[child.type];
        return <AttributeSettings element={child} onEdit={onEdit} />
      }
    }
    return null
  },
  editAttributeWrapper: BlockParamsModal,
  // when the AttributeSettings fires onEdit, we need to update the media
  // child component instead of the figure element
  onEditNodeFactory: (editor, element, path) => (update) => {
    const children = Node.elements(element)
    for (const [child, childPath] of children) {
      if (medias.indexOf(child.type) > -1) {
        Transforms.setNodes(editor, update, {
          at: path.concat(childPath)
        })
        return
      }
    }
  },
  hideSettingsAfterUpdate: true,
  preventAutofocusTrigger: true,
}

export const figcaptionDefinition: IArticleBlockDefinition<null> = {
  name: "Caption",
  icon: null,
  render: FigcaptionElement,
  hasUtilityWrapper: false,
  hideFloatingInlineMenu: true,
}
