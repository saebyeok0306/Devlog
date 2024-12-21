import PageTemplate from "@/components/common/pageTemplate";
import HeaderContainer from "@/containers/base/HeaderContainer";
import PostStatisticsContainer from "@/containers/post/PostStatisticsContainer";

export default function ServerPage() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <PostStatisticsContainer />
    </PageTemplate>
  );
}
