import { TableEditor } from "./TableEditor";
import { SlateTable } from "../../SlateEditor/Plugins/SlateTablePlugin";
import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";
import { TableCellEditor } from "./TableCellEditor";

export const tableDefinition: IArticleBlockDefinition<null> = {
  name: "Table",
  icon: <i className="fa-regular fa-table" aria-hidden/>,
  buttonInstantiable: true,
  render: ({ attributes, element, children }) => (
    <TableEditor slateAttributes={attributes} slateElement={element}>
      {children}
    </TableEditor>
  ),
  hasUtilityWrapper: true,
  instanciateElement: () => SlateTable.createTable(2, 2),
  preventAutofocusTrigger: true,
}

export const tableRowDefinition: IArticleBlockDefinition<null> = {
  name: "Table row",
  icon: <i className="fa-regular fa-table" aria-hidden/>,
  render: ({ attributes, element, children }) => {
    return (
      <tr {...attributes}>{children}</tr>
    );
  },
  hasUtilityWrapper: false,
}

export const tableCellDefinition: IArticleBlockDefinition<null> = {
  name: "Table cell",
  icon: <i className="fa-regular fa-table" aria-hidden />,
  render: TableCellEditor,
  hasUtilityWrapper: false,
  inlineMenu: ['strong', 'emphasis'],
}
