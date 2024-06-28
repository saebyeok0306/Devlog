import React from "react";
import PageTemplate from "components/base/pageTemplate";
import HeaderContainer from "containers/base/HeaderContainer";
import EditorContainer from "containers/editor/EditorContainer";

function Editor() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <EditorContainer />
    </PageTemplate>
  );
}

export default Editor;
