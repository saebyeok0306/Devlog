import { get_post_url_api } from "api/Posts";
import Comment from "components/base/comment";
import Post from "components/post";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { authAtom } from "recoil/authAtom";
import { postAtom } from "recoil/postAtom";
import { sortComments } from "utils/sortComments";

function PostCommentContainer({ ...props }) {
  console.log("PostCommentContainer", props);
  const navigate = useNavigate();
  const { postUrl } = useParams();
  const [authDto] = useRecoilState(authAtom);
  const [, setPostContent] = useRecoilState(postAtom);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    get_post_url_api(postUrl)
      .then((res) => {
        console.log(res.data);
        setPostContent(res.data?.post);
        const sortedComments = sortComments(res.data?.comments);
        console.log(sortedComments);
        setComments(sortedComments);
      })
      .catch((error) => {
        console.log(error);
        toast.error("잘못된 접근입니다.");
        navigate(-1);
      });
  }, [postUrl, authDto]);

  return (
    <>
      <Post {...props} />
      <Comment {...props} comments={comments} />
    </>
  );
}

export default PostCommentContainer;
