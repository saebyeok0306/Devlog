import { ButtonView, Plugin } from "ckeditor5";

export default class TableAutoFit extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("TableAutoFit", () => {
      const button = new ButtonView();

      button.set({
        label: "AutoFit",
        withText: true,
      });

      button.on("execute", () => {
        const viewDocument = editor.editing.view.document;
        const model = editor.model;
        const selection = model.document.selection;
        const tableElement = selection.getFirstPosition().findAncestor("table");
        if (!tableElement) {
          return;
        }
        const selectedTableIdx = tableElement.index;

        editor.editing.view.change((writer) => {
          for (const viewElement of viewDocument.getRoot().getChildren()) {
            if (
              viewElement.is("element", "figure") &&
              viewElement.index === selectedTableIdx
            ) {
              for (const tableChild of viewElement.getChildren()) {
                if (
                  tableChild.is("element", "table") &&
                  tableChild.hasClass("ck-table-resized")
                ) {
                  for (const tableAttr of tableChild.getChildren()) {
                    if (tableAttr.is("element", "colgroup")) {
                      const cols = Array.from(tableAttr.getChildren());
                      const rate = 100 / cols.length;

                      // 각 col 요소에 width 스타일 적용
                      cols.forEach((col) => {
                        writer.setStyle("width", `${rate}%`, col);
                      });
                    }
                  }
                }
              }
              break;
            }
          }
        });
      });

      return button;
    });
  }
}
