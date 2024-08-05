import Comment from "components/base/comment";
import Post from "components/post";
import React from "react";

function PostCommentContainer({ ...props }) {
  console.log("PostCommentContainer", props);
  return (
    <>
      <Post {...props} />
      <Comment {...props} />
    </>
  );
}

export default PostCommentContainer;
