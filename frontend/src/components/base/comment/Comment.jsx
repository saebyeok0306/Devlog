import React from "react";

import "./Comment.scss";
import { Timeline } from "flowbite-react";
import { HiAnnotation } from "react-icons/hi";
import { timelineCustomTheme } from "styles/theme/timeline";
import CommentEditor from "components/editor/commentEditor";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { getDatetime } from "utils/getDatetime";
import { authAtom } from "recoil/authAtom";

function Comment({ ...props }) {
  const { commentRef, comments } = props;
  const [isDark] = useRecoilState(themeAtom);
  const [authDto] = useRecoilState(authAtom);

  console.log(comments);

  const Comments = () => {
    return (
      <>
        {comments.map((comment, idx) => (
          <div key={idx}>
            <CommentBox comment={comment} />
            {comment.children &&
              comment.children.map((child, idx2) => (
                <CommentBox key={idx2 + 10000} comment={child} />
              ))}
          </div>
        ))}
      </>
    );
  };

  const CommentBox = (comment) => {
    const isReply = comment.comment.parent ? true : false;
    const CommentToolbar = () => {
      if (comment.comment.user.email === authDto.email) {
        return (
          <>
            <p>｜</p>
            <button>수정</button>
            <p>｜</p>
            <button>삭제</button>
          </>
        );
      }
      return null;
    };
    return (
      <Timeline.Item className={isReply ? "comment reply" : "comment"}>
        <Timeline.Point
          icon={HiAnnotation}
          theme={isReply ? pointerTheme : null}
        >
          {isReply ? (
            <div className="comment-reply-line">
              <div className="border-t border-gray-200 dark:border-gray-700 top-3 -left-6" />
            </div>
          ) : null}
        </Timeline.Point>
        <Timeline.Content>
          <Timeline.Time className="comment-user">
            <div>{`${comment.comment.user?.username}님`}</div>
            <div className="text-gray-900 dark:text-gray-400 comment-menu">
              <p>{getDatetime(comment.comment.createdAt)}</p>
              <p>｜</p>
              <button>답글</button>
              <CommentToolbar />
            </div>
          </Timeline.Time>
          <Timeline.Body className="comment-content">
            {isReply ? (
              <div>
                <p>@{comment.comment.parentName}</p>
                {comment.comment.content}
              </div>
            ) : (
              <div>{comment.comment.content}</div>
            )}
          </Timeline.Body>
        </Timeline.Content>
      </Timeline.Item>
    );
  };

  return (
    <div
      ref={commentRef}
      className="comment-container"
      data-color-mode={isDark ? "dark" : "light"}
    >
      <Timeline className="comments" theme={timelineCustomTheme}>
        <Comments />
      </Timeline>

      <CommentEditor />
    </div>
  );
}

const pointerTheme = {
  horizontal: "flex items-center",
  line: "hidden h-0.5 w-full bg-gray-200 dark:bg-gray-700 sm:flex",
  marker: {
    base: {
      horizontal:
        "absolute -left-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700",
      vertical:
        "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700",
    },
    icon: {
      base: "h-3 w-3 text-yellow-600 dark:text-yellow-300",
      wrapper:
        "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-200 dark:bg-yellow-900",
    },
  },
  vertical: "",
};

export default Comment;
