import PageTemplate from "@/components/common/pageTemplate";
import HeaderContainer from "@/containers/base/HeaderContainer";
import PostEditorContainer from "@/containers/editor/PostEditorContainer";

export default function ServerPage() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <PostEditorContainer />
    </PageTemplate>
  );
}
