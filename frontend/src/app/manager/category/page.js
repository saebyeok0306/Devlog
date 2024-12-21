import PageTemplate from "@/components/common/pageTemplate";
import HeaderContainer from "@/containers/base/HeaderContainer";
import CategoryManagerContainer from "@/containers/main/CategoryManagerContainer";

export default function ServerPage() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <CategoryManagerContainer />
    </PageTemplate>
  );
}
