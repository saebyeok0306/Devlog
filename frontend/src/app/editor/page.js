import PageTemplate from "@/components/common/pageTemplate";
import HeaderContainer from "@/containers/base/HeaderContainer";
import EditorContainer from "@/containers/editor/EditorContainer";

export default function ServerPage() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <EditorContainer />
    </PageTemplate>
  );
}
