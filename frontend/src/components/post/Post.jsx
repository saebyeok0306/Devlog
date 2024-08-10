import React from "react";

import "./Post.scss";
import { postDatetime } from "utils/postDatetime";

import { HiCalendar, HiHeart } from "react-icons/hi";
import MDEditor from "@uiw/react-md-editor";
import RehypeVideo from "rehype-video";
import { themeAtom } from "recoil/themeAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { postAtom } from "recoil/postAtom";

function Post({ ...props }) {
  const [isDark] = useRecoilState(themeAtom);
  const postContent = useRecoilValue(postAtom);

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
