import { useEffect } from "react";
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
import { delete_post_api } from "api/Posts";
import { useNavigate } from "react-router-dom";
import { POST_STORE } from "api/Cache";
import tocbot from "tocbot";

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

// TODO: 게시글 수정은 /editor/{url} 형태로 새로고침해도 유지되도록 변경
const postEditHandler = async (navigate, postContent, setPostContext) => {
  const preview = postContent.files.find(
    (file) =>
      `${process.env.REACT_APP_API_FILE_URL}/${file.filePath}/${file.fileUrl}` ===
      postContent.previewUrl
  );

  const newContext = new PostContext(
    postContent.id,
    postContent.title,
    "", // body
    postContent.content,
    postContent.category,
    postContent.files,
    preview,
    postContent.private,
    postContent.createdAt,
    postContent.modifiedAt,
    postContent.url,
    postContent.views
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

  useEffect(() => {
    tocbot.init({
      // Where to render the table of contents.
      tocSelector: ".toc",
      // Where to grab the headings to build the table of contents.
      contentSelector: ".post-context",
      // Which headings to grab inside of the contentSelector element.
      headingSelector: "h1, h2, h3",
      // For headings inside relative or absolute positioned containers within content.
      hasInnerContainers: true,
      linkClass: "toc-link",
      isCollapsedClass: "",
      collapseDepth: 0,

      disableTocScrollSync: true,
      enableUrlHashUpdateOnScroll: false,
    });

    return () => {
      tocbot.destroy();
    };
  });

  return (
    <aside className="toc-box">
      <div className="toc-container">
        <span className="toc-title">목차</span>
        <div className="toc"></div>
        {/* <Toc
          markdownText={postContent?.content}
          type="raw"
          className="toc text-gray-800 dark:text-gray-300"
        /> */}
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
