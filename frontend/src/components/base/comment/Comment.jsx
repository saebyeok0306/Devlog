import React from "react";

import "./Comment.scss";
import { Timeline } from "flowbite-react";
import { HiAnnotation } from "react-icons/hi";
import { timelineCustomTheme } from "styles/theme/timeline";
import CommentEditor from "components/editor/commentEditor";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";

function Comment({ ...props }) {
  const { commentRef, comments } = props;
  const [isDark] = useRecoilState(themeAtom);

  const Comments = () => {
    return (
      <Timeline className="comments" theme={timelineCustomTheme}>
        {comments.map((comment, idx) => (
          <Timeline.Item key={idx} className="comment">
            <Timeline.Point icon={HiAnnotation} />
            <Timeline.Content>
              <Timeline.Time className="comment-user">
                <div>{`${comment.user.username}님`}</div>
                <div className="text-gray-900 dark:text-gray-400 comment-menu">
                  <button>수정</button>
                  <p>｜</p>
                  <button>삭제</button>
                </div>
              </Timeline.Time>
              <Timeline.Body className="comment-content">
                {comment.content}
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };

  return (
    <div
      ref={commentRef}
      className="comment-container"
      data-color-mode={isDark ? "dark" : "light"}
    >
      <Comments />
      <CommentEditor />
    </div>
  );
}

export default Comment;
