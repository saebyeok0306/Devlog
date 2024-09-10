import React, { useEffect } from "react";

import "./Post.scss";
import { getDatetime } from "utils/getDatetime";

import { HiCalendar, HiHeart, HiOutlineHeart } from "react-icons/hi";
import MDEditor from "@uiw/react-md-editor";
import RehypeVideo from "rehype-video";
import { themeAtom } from "recoil/themeAtom";
import { useRecoilValue } from "recoil";
import { postAtom } from "recoil/postAtom";
import { Navigate } from "react-router-dom";
import { Tooltip } from "flowbite-react";
import { authAtom } from "recoil/authAtom";
import { post_like_api, post_unlike_api } from "api/Like";

const onLikeHandler = async (postUrl, likes, setLikes, authDto) => {
  try {
    await post_like_api(postUrl);
    setLikes({
      ...likes,
      liked: true,
      likeCount: likes.likeCount + 1,
      users: [...likes.users, authDto],
    });
  } catch (error) {
    console.error("Failed to like post:", error);
  }
};

const onLikeCancelHandler = async (postUrl, likes, setLikes, authDto) => {
  try {
    await post_unlike_api(postUrl);
    setLikes({
      ...likes,
      liked: false,
      likeCount: likes.likeCount - 1,
      users: likes.users.filter((user) => user.email !== authDto.email),
    });
  } catch (error) {
    console.error("Failed to cancel like post:", error);
  }
};

function Post({ ...props }) {
  const { likes, setLikes } = props;
  const isDark = useRecoilValue(themeAtom);
  const authDto = useRecoilValue(authAtom);
  const postContent = useRecoilValue(postAtom);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  if (postContent === null) {
    return <Navigate replace to="/" />;
  }

  const Like = () => {
    const likers =
      likes?.users.length > 0
        ? likes?.users.map((user) => `${user?.username}님`).join(", ")
        : "가장 먼저 좋아요를 눌러보세요.";

    return (
      <div className="post-like">
        {likes?.liked ? (
          <button
            onClick={() =>
              onLikeCancelHandler(postContent.url, likes, setLikes, authDto)
            }
          >
            <HiHeart />
          </button>
        ) : (
          <button
            onClick={() =>
              onLikeHandler(postContent.url, likes, setLikes, authDto)
            }
          >
            <HiOutlineHeart />
          </button>
        )}
        <Tooltip content={likers}>
          <span>{`${likes?.likeCount}개`}</span>
        </Tooltip>
      </div>
    );
  };

  const createdAtFormat = getDatetime(postContent?.createdAt);
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
        <Like />
      </footer>
    </div>
  );
}

export default Post;
