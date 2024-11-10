import React, { useEffect, useState } from "react";

import "./Comment.scss";
import { Timeline } from "flowbite-react";
import { timelineCustomTheme } from "@/styles/theme/timeline";
import CommentEditor from "@/components/editor/commentEditor";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "@/recoil/themeAtom";
import { authAtom } from "@/recoil/authAtom";
import { postAtom } from "@/recoil/postAtom";
import { commentAtom, commentsAtom, CommentsData } from "@/recoil/commentAtom";
import Comments from "./comments/Comments";
import {
  isWriteComment,
  uploadCommentHandler,
} from "./comments/CommentsHandler";
import { get_comments_by_post_api } from "@/api/Comment";
import { sortComments } from "@/utils/sortComments";
import { toast } from "react-toastify";

function Comment({ ...props }) {
  const { commentRef } = props;
  const authDto = useRecoilValue(authAtom);
  const isDark = useRecoilValue(themeAtom);
  const [updater, setUpdater] = useState(0);
  const [reply, setReply] = useState({
    flag: false, // true: 답글 작성 false: 편집
    editId: null, // 편집 중인 댓글 id
    target: null, // 답글 대상
    content: "",
    private: false,
  });
  const postContent = useRecoilValue(postAtom);
  const commentState = useRecoilValue(commentAtom);
  const [commentsData, setCommentsData] = useRecoilState(commentsAtom);

  const [editorComment, setEditorComment] = useState({
    content: "",
    private: false,
  });

  useEffect(() => {
    if (updater < 1) return;
    get_comments_by_post_api(postContent.id)
      .then((res) => {
        const sortedComments = sortComments(res.data);
        const commentsObj = new CommentsData(sortedComments, res.data?.length);
        setCommentsData(commentsObj);
      })
      .catch((error) => {
        toast.error("댓글을 불러오는데 실패했습니다.");
        console.error("Failed to get comments:", error);
        setCommentsData(new CommentsData());
      });
    // eslint-disable-next-line
  }, [updater]);

  return (
    <div
      ref={commentRef}
      className="comment-container"
      data-color-mode={isDark ? "dark" : "light"}
    >
      <Timeline className="comments" theme={timelineCustomTheme}>
        <Comments
          comments={commentsData.comments}
          reply={reply}
          setReply={setReply}
          setUpdater={setUpdater}
        />
      </Timeline>
      {/* Post Comment Editor */}
      {!reply.editId &&
      isWriteComment({ commentState: commentState, authDto: authDto }) ? (
        <CommentEditor
          comment={editorComment}
          setComment={setEditorComment}
          onSave={(content, files) =>
            uploadCommentHandler({
              postContent: postContent,
              comments: commentsData.comments,
              editorComment: editorComment,
              setEditorComment: setEditorComment,
              content: content,
              files: files,
            })
          }
          setUpdater={setUpdater}
        />
      ) : null}
    </div>
  );
}

export default Comment;
