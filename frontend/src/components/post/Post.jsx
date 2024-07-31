import React, { useEffect, useState } from "react";

import "./Post.scss";
import { useParams } from "react-router-dom";
import { get_post_url_api } from "api/Posts";
import { toast } from "react-toastify";
import { postDatetime } from "utils/postDatetime";

import { HiCalendar } from "react-icons/hi";
import MDEditor from "@uiw/react-md-editor";
import RehypeVideo from "rehype-video";
import { themeAtom } from "recoil/themeAtom";
import { useRecoilState } from "recoil";

function Post() {
  const { postUrl } = useParams();
  const [isDark] = useRecoilState(themeAtom);
  const [content, setContent] = useState(null);

  useEffect(() => {
    get_post_url_api(postUrl)
      .then((res) => {
        console.log(res.data);
        setContent(res.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("잘못된 접근입니다.");
      });
  }, [postUrl]);

  if (content === null) {
    return <div></div>;
  }

  const createdAtFormat = postDatetime(content.createdAt);
  return (
    <div className="post-container" data-color-mode={isDark ? "dark" : "light"}>
      <header>
        <h1 className="post-title">{content.title}</h1>
        <div className="post-category">{content.category.name}</div>
        <div className="post-datetime text-gray-700 dark:text-gray-400">
          <HiCalendar />
          <span>{createdAtFormat}</span>
        </div>
      </header>
      <hr />
      <article>
        <MDEditor.Markdown
          source={content.content}
          rehypePlugins={[[RehypeVideo]]}
        />
      </article>
      <hr />
    </div>
  );
}

export default Post;
