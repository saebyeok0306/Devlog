import CommentEditor from "components/editor/commentEditor";
import { Dropdown, Timeline } from "flowbite-react";
import { useRecoilValue } from "recoil";
import { replyTimelineTheme } from "./replyTimelineTheme";
import MDEditor from "@uiw/react-md-editor";
import { getDatetime } from "utils/getDatetime";

import { HiAnnotation } from "react-icons/hi";
import {
  cancelEditHandler,
  isWriteComment,
  onEditHandler,
  onReplyHandler,
  updateEditHandler,
  uploadReplyHandler,
} from "./CommentsHandler";
import { authAtom } from "recoil/authAtom";
import { commentAtom } from "recoil/commentAtom";
import { postAtom } from "recoil/postAtom";

const CommentReply = ({ rootComment, comments, reply, setReply }) => {
  const authDto = useRecoilValue(authAtom);
  const postContent = useRecoilValue(postAtom);
  console.log(reply.target);
  return (
    <Timeline.Item className={"comment create-reply"}>
      <Timeline.Point icon={HiAnnotation} />
      <Timeline.Content>
        <Timeline.Time className="comment-user">
          <div>{`${authDto.username}님`}</div>
        </Timeline.Time>
        <Timeline.Body className="comment-content">
          <div className="comment-content-body">
            <p className="comment-reply-name">@{reply.target.user.username}</p>
          </div>
          <CommentEditor
            content={reply.content}
            setContent={(text) => setReply({ ...reply, content: text })}
            files={reply.files}
            setFiles={(files) => setReply({ ...reply, files: files })}
            onCancel={() =>
              cancelEditHandler({
                reply: reply,
                setReply: setReply,
              })
            }
            onSave={() =>
              uploadReplyHandler({
                postContent: postContent,
                comments: comments,
                reply: reply,
                setReply: setReply,
              })
            }
          />
        </Timeline.Body>
      </Timeline.Content>
    </Timeline.Item>
  );
};

const CommentBox = ({ comment, comments, reply, setReply }) => {
  const isReply = comment.parent ? true : false;
  return (
    <Timeline.Item className={isReply ? "comment reply" : "comment"}>
      <Timeline.Point
        icon={HiAnnotation}
        theme={isReply ? replyTimelineTheme : null}
      >
        {isReply ? (
          <div className="comment-reply-line">
            <div className="border-t border-gray-200 dark:border-gray-700 top-3 -left-6" />
          </div>
        ) : null}
      </Timeline.Point>
      <Timeline.Content>
        {reply.flag === false && reply.editId === comment.id ? (
          <CommentEdit
            comment={comment}
            comments={comments}
            reply={reply}
            setReply={setReply}
          />
        ) : (
          <CommentView comment={comment} reply={reply} setReply={setReply} />
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
};

const CommentView = ({ comment, reply, setReply }) => {
  const authDto = useRecoilValue(authAtom);
  const commentState = useRecoilValue(commentAtom);
  const CommentToolbar = () => {
    if (
      isWriteComment({ commentState: commentState, authDto: authDto }) &&
      comment.user.email === authDto.email
    ) {
      return (
        <>
          <Dropdown label="" inline>
            <Dropdown.Item
              onClick={() =>
                onEditHandler({
                  comment: comment,
                  reply: reply,
                  setReply: setReply,
                })
              }
            >
              수정
            </Dropdown.Item>
            <Dropdown.Item>삭제</Dropdown.Item>
          </Dropdown>
        </>
      );
    }
    return null;
  };
  return (
    <>
      <Timeline.Time className="comment-user">
        <div>{`${comment.user?.username}님`}</div>
        <div className="text-gray-900 dark:text-gray-400 comment-menu">
          <CommentToolbar />
        </div>
      </Timeline.Time>
      <Timeline.Body className="comment-content">
        {comment?.parent ? (
          <div className="comment-content-body">
            <p className="comment-reply-name">
              @{comment.parentData.user.username}
            </p>
            <MDEditor.Markdown
              className="comment-md-content"
              source={comment.content}
              style={{
                flex: "1",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                backgroundColor: "inherit",
              }}
            />
            {/* {comment.content} */}
          </div>
        ) : (
          <div className="comment-content-body">
            <MDEditor.Markdown
              className="comment-md-content"
              source={comment.content}
              style={{
                flex: "1",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                backgroundColor: "inherit",
              }}
            />
          </div>
        )}
        <div className="comment-content-footer">
          <time dateTime={comment.createdAt}>
            {getDatetime(comment.createdAt)}
          </time>
          {isWriteComment({ commentState: commentState, authDto: authDto }) ? (
            <button
              onClick={() =>
                onReplyHandler({
                  targetComment: comment,
                  reply: reply,
                  setReply: setReply,
                })
              }
            >
              답글
            </button>
          ) : null}
        </div>
      </Timeline.Body>
    </>
  );
};

const CommentEdit = ({ comment, comments, reply, setReply }) => {
  return (
    <>
      <CommentEditor
        content={reply.content}
        setContent={(text) => setReply({ ...reply, content: text })}
        files={reply.files}
        setFiles={(files) => setReply({ ...reply, files: files })}
        onCancel={() =>
          cancelEditHandler({
            setReply: setReply,
          })
        }
        onSave={() =>
          updateEditHandler({
            comment: comment,
            comments: comments,
            reply: reply,
            setReply: setReply,
          })
        }
      />
    </>
  );
};

const Comments = ({ comments, reply, setReply }) => {
  // const [content, setContent] = useRecoilState(replyAtom);
  return (
    <>
      {comments.map((comment, idx) => (
        <div key={idx}>
          <CommentBox
            comment={comment}
            comments={comments}
            reply={reply}
            setReply={setReply}
          />
          {comment.children &&
            comment.children.map((child, idx2) => (
              <CommentBox
                key={idx2 + 10000}
                comment={child}
                comments={comments}
                reply={reply}
                setReply={setReply}
              />
            ))}
          {reply.flag === true && reply.editId === comment.id ? (
            <CommentReply
              rootComment={comment}
              comments={comments}
              reply={reply}
              setReply={setReply}
            />
          ) : null}
        </div>
      ))}
    </>
  );
};

export default Comments;
