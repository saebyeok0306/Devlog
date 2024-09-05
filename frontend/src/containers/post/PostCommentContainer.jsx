import { get_post_url_api } from "api/Posts";
import Comment from "components/base/comment";
import Post from "components/post";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "recoil/authAtom";
import { commentAtom, CommentState } from "recoil/commentAtom";
import { postAtom } from "recoil/postAtom";
import { sortComments } from "utils/sortComments";

function PostCommentContainer({ ...props }) {
  const navigate = useNavigate();
  const { postUrl } = useParams();
  const [authDto] = useRecoilState(authAtom);
  const [, setPostContent] = useRecoilState(postAtom);
  const [, setCommentState] = useRecoilState(commentAtom);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      await setPostContent("");
      await setComments([]);
      await get_post_url_api(postUrl)
        .then((res) => {
          setPostContent(res.data?.post);
          const sortedComments = sortComments(res.data?.comments);
          setComments(sortedComments);
          setCommentState(new CommentState(res.data?.commentFlag));
        })
        .catch((error) => {
          console.error("Failed to get post:", error);
          navigate(-1);
        });
    };
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postUrl, authDto]);

  return (
    <>
      <Post {...props} />
      <Comment {...props} comments={comments} />
    </>
  );
}

export default PostCommentContainer;
