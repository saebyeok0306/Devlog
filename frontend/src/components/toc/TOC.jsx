import { useEffect } from "react";
import Toc from "react-toc";
import { useRecoilState } from "recoil";
import { postAtom } from "recoil/postAtom";

import "./TOC.scss";
import { Button } from "flowbite-react";
import { HiOutlineChevronDoubleUp, HiChatAlt, HiLink } from "react-icons/hi";
import { toast } from "react-toastify";

function TOC({ ...props }) {
  const { commentRef } = props;
  const [postContent] = useRecoilState(postAtom);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToComment = () => {
    if (commentRef.current === null) return;
    commentRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const exportUrl = () => {
    const url = `${window.location.origin}/post/${postContent?.url}`;
    navigator.clipboard.writeText(url);
    toast.info("URL이 복사되었습니다.", { position: "bottom-center" });
  };

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
    <aside>
      <div className="toc-container">
        <span className="toc-title">목차</span>
        <Toc
          markdownText={postContent?.content}
          type="raw"
          className="toc text-gray-800 dark:text-gray-300"
        />
        <div className="toc-buttons">
          <Button size="xs" color="gray" onClick={scrollToTop}>
            <HiOutlineChevronDoubleUp />
          </Button>
          <Button size="xs" color="gray" onClick={scrollToComment}>
            <HiChatAlt />
          </Button>
          <Button size="xs" color="gray" onClick={exportUrl}>
            <HiLink />
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default TOC;
