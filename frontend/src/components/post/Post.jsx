import React, { useEffect } from "react";

import "./Post.scss";
import { useParams } from "react-router-dom";
import { get_post_url_api } from "api/Posts";
import { toast } from "react-toastify";
import { postDatetime } from "utils/postDatetime";

import { HiCalendar, HiHeart } from "react-icons/hi";
import MDEditor from "@uiw/react-md-editor";
import RehypeVideo from "rehype-video";
import { themeAtom } from "recoil/themeAtom";
import { useRecoilState } from "recoil";
import { postAtom } from "recoil/postAtom";

function Post({ ...props }) {
  const { postUrl } = useParams();
  const [isDark] = useRecoilState(themeAtom);
  const [postContent, setPostContent] = useRecoilState(postAtom);

  useEffect(() => {
    get_post_url_api(postUrl)
      .then((res) => {
        console.log(res.data);
        setPostContent(res.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("잘못된 접근입니다.");
      });
  }, [postUrl]);

  if (postContent === null) {
    return <div></div>;
  }

  const createdAtFormat = postDatetime(postContent?.createdAt);
  return (
    <div className="post-container" data-color-mode={isDark ? "dark" : "light"}>
      <header>
        <h1 className="post-title">{postContent?.title}</h1>
        <div className="post-category">{postContent?.category?.name}</div>
        <div className="post-datetime text-gray-700 dark:text-gray-400">
          <HiCalendar />
          <span>{createdAtFormat}</span>
        </div>
      </header>
      <hr />
      <article>
        <MDEditor.Markdown
          className="post-content"
          source={postContent?.content}
          rehypePlugins={[[RehypeVideo]]}
          style={{ flex: "1", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        />
      </article>
      <hr />
      <footer>
        <HiHeart />
        <span>{`${postContent?.likes}개`}</span>
      </footer>
    </div>
  );
}

export default Post;
