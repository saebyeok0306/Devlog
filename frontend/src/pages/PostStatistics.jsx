import React from "react";
import PageTemplate from "components/common/pageTemplate";
import HeaderContainer from "containers/base/HeaderContainer";
import PostStatisticsContainer from "containers/post/PostStatisticsContainer";

function PostStatistics() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <PostStatisticsContainer />
    </PageTemplate>
  );
}

export default PostStatistics;
