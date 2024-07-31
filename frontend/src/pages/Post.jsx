import React from "react";
import PageTemplate from "components/base/pageTemplate";
import HeaderContainer from "containers/base/HeaderContainer";
import PostContainer from "containers/post/PostContainer";

function Post() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <PostContainer />
    </PageTemplate>
  );
}

export default Post;
