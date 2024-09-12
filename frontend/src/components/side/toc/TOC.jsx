import { useEffect } from "react";
import Toc from "react-toc";
import { useRecoilState } from "recoil";
import { postAtom } from "recoil/postAtom";

import "./TOC.scss";
import { Button, Dropdown } from "flowbite-react";
import {
  HiOutlineChevronDoubleUp,
  HiChatAlt,
  HiLink,
  HiDotsVertical,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { PostContext, postContextAtom } from "recoil/editorAtom";
import { delete_post_api, get_post_files_api } from "api/Posts";
import { useNavigate } from "react-router-dom";
import { POST_STORE } from "api/Cache";

const scrollToTopHandler = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const scrollToCommentHandler = (commentRef) => {
  if (commentRef.current === null) return;
  commentRef.current.scrollIntoView({
    behavior: "smooth",
  });
};

const exportUrlHandler = (postContent) => {
  const url = `${window.location.origin}/post/${postContent?.url}`;
  navigator.clipboard.writeText(url);
  toast.info("URL이 복사되었습니다.", { position: "bottom-center" });
};

const postEditHandler = async (navigate, postContent, setPostContext) => {
  let files = [];
  try {
    const result = await get_post_files_api(postContent.id);
    files = result.data;
  } catch (error) {
    console.error("Failed to get post files:", error);
  }

  const preview = files.find(
    (file) =>
      `${process.env.REACT_APP_API_FILE_URL}/${file.filePath}/${file.fileUrl}` ===
      postContent.previewUrl
  );

  const newContext = new PostContext(
    postContent.id,
    postContent.title,
    postContent.content,
    postContent.category,
    files,
    preview,
    postContent.private,
    postContent.createdAt,
    postContent.modifiedAt,
    postContent.url
  );
  console.log(newContext);

  await setPostContext(newContext);
  navigate("/editor");
};

const postDeleteHandler = async (navigate, postContent) => {
  try {
    await delete_post_api(postContent.url);
    POST_STORE.clear();
    navigate("-1");
    toast.info("게시글이 삭제되었습니다.");
  } catch (error) {
    toast.error("게시글 삭제 중 오류가 발생했습니다.");
    console.error("Failed to delete post:", error);
  }
};

function TOC({ ...props }) {
  const { commentRef } = props;
  const navigate = useNavigate();
  const [postContent] = useRecoilState(postAtom);
  const [, setPostContext] = useRecoilState(postContextAtom);

  console.log(postContent);

  useEffect(() => {
    const postContent = document.querySelector(".post-content");
    if (!postContent) return;

    const options = {
      // root: postContent,
      rootMargin: "0px 0px -80% 0px",
      // rootMargin: "-20% 0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleHeadings = entries.filter((entry) => entry.isIntersecting);
      if (visibleHeadings.length === 0) return;
      const activeHeading = visibleHeadings[visibleHeadings.length - 1]; // visibleHeadings.length - 1
      const id =
        activeHeading.target
          .getAttribute("id")
          ?.toLowerCase()
          ?.replace(/\.?-/g, " ") || "";
      if (!id) return;
      const tocRef = document.querySelector(".toc");
      const tocList = tocRef.querySelectorAll("a");
      if (!tocList) return;
      for (const toc of tocList) {
        const href =
          toc
            .getAttribute("href")
            ?.slice(1)
            .toLowerCase()
            ?.replace(/\.?-/g, " ") || "";
        if (id === href) {
          toc.classList.add("toc-active");
        } else {
          toc.classList.remove("toc-active");
        }
      }
    }, options);

    const headings = postContent.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  });

  return (
    <aside className="toc-box">
      <div className="toc-container">
        <span className="toc-title">목차</span>
        <Toc
          markdownText={postContent?.content}
          type="raw"
          className="toc text-gray-800 dark:text-gray-300"
        />
        <div className="toc-buttons">
          <Button
            className="toc-button"
            size="xs"
            color="gray"
            onClick={scrollToTopHandler}
          >
            <HiOutlineChevronDoubleUp />
          </Button>
          <Button
            className="toc-button"
            size="xs"
            color="gray"
            onClick={() => scrollToCommentHandler(commentRef)}
          >
            <HiChatAlt />
          </Button>
          <Button
            className="toc-button"
            size="xs"
            color="gray"
            onClick={() => exportUrlHandler(postContent)}
          >
            <HiLink />
          </Button>
          {postContent?.ownership ? (
            <Dropdown
              className="dropdown"
              label=""
              // inline
              renderTrigger={() => (
                <Button className="toc-button" size="xs" color="gray">
                  <HiDotsVertical />
                </Button>
              )}
            >
              <Dropdown.Item
                onClick={() =>
                  postEditHandler(navigate, postContent, setPostContext)
                }
              >
                수정
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => postDeleteHandler(navigate, postContent)}
              >
                삭제
              </Dropdown.Item>
            </Dropdown>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export default TOC;
