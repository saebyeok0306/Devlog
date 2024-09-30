import React, { useEffect } from "react";

import "./Post.scss";
import { getDatetime } from "utils/getDatetime";

import {
  HiCalendar,
  HiHeart,
  HiOutlineHeart,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import { themeAtom } from "recoil/themeAtom";
import { useRecoilValue } from "recoil";
import { postAtom } from "recoil/postAtom";
import { Navigate } from "react-router-dom";
import { Tooltip } from "flowbite-react";
import { authAtom } from "recoil/authAtom";
import { post_like_api, post_unlike_api } from "api/Like";
import { toast } from "react-toastify";
import { commentsAtom } from "recoil/commentAtom";

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
    toast.info(error.response.data.error);
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
  const CommentsData = useRecoilValue(commentsAtom);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    let toc_counter = 0;
    document.querySelectorAll("h1, h2, h3, h4, h5").forEach((el) => {
      el.setAttribute("id", el.tagName + "_" + toc_counter);
      toc_counter += 1;
    });

    const images = document.querySelectorAll(".post-context img");
    const modal = document.querySelector(".post-image-modal");
    const modalImg = document.querySelector(".post-image-modal img");

    images.forEach((img) => {
      img.addEventListener("click", () => {
        modalImg.src = img.src; // 클릭한 이미지의 src를 모달에 설정
        modal.classList.add("active"); // 모달 보이기
      });
    });

    modal.addEventListener("click", () => {
      modal.classList.remove("active");
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("click", () => {});
      });
      modal.removeEventListener("click", () => {});
    };
  }, [postContent]);

  if (postContent === null) {
    return <Navigate replace to="/" />;
  }

  const Like = () => {
    const likers =
      likes?.users.length > 0
        ? likes?.users.map((user) => `${user?.username}님`).join(", ")
        : "가장 먼저 좋아요를 눌러보세요.";

    return (
      <div className="post-like post-footer-item">
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
          <span>{`좋아요 ${likes?.likeCount}개`}</span>
        </Tooltip>
      </div>
    );
  };

  const createdAtFormat = getDatetime(postContent?.createdAt);
  return (
    <div className="post-container" data-color-mode={isDark ? "dark" : "light"}>
      <header>
        <h1 className="post-title">{postContent?.title}</h1>
        <div className="post-author">By.{postContent?.user?.username}</div>
        <div className="post-category">{postContent?.category?.name}</div>
        <div className="post-datetime text-gray-700 dark:text-gray-400">
          <HiCalendar />
          <span>{createdAtFormat}</span>
        </div>
      </header>
      <hr />
      <article>
        <div className="post-image-modal">
          <img src={null} alt="fullscreen" />
          <p>클릭하면 이미지가 축소됩니다.</p>
        </div>
        {/* <MDEditor.Markdown
          className="post-content"
          source={postContent?.content}
          rehypePlugins={[[RehypeVideo]]}
          remarkPlugins={[[remarkYoutubePlugin, {}]]}
          style={{ flex: "1", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        /> */}
        <div
          className="post-context ck-content"
          dangerouslySetInnerHTML={{ __html: postContent.content }}
        ></div>
      </article>
      <hr />
      <footer>
        <Like />
        <div className="post-comment-count post-footer-item">
          <HiOutlineChatAlt2 />
          <span>{`댓글 ${CommentsData.commentCount}개`}</span>
        </div>
      </footer>
    </div>
  );
}

export default Post;
