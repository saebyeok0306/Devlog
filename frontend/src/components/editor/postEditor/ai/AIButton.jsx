import { ButtonView, Plugin } from "ckeditor5";

export default class AIButton extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("AIButton", () => {
      const button = new ButtonView();

      button.set({
        label: "Insert timestamp",
        withText: true,
      });

      button.on("execute", () => {
        const now = new Date();

        // Change the model using the model writer.
        editor.model.change((writer) => {
          // Insert the text at the user's current position.
          editor.model.insertContent(writer.createText(now.toString()));
        });
      });

      return button;
    });
  }
}
