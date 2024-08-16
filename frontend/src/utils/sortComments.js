export const sortComments = (comments) => {
  // createdAt을 기준으로 정렬하고 parentId가 있는 경우 해당 id의 자식 댓글을 찾아서 정렬
  return (
    comments
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((comment) => {
        if (comment.parent) {
          const parentComment = comments.find((c) => c.id === comment.parent);
          if (parentComment) {
            comment["parentName"] = parentComment.user.username;
            if (parentComment.children) {
              parentComment.children.push(comment);
            } else {
              parentComment.children = [comment];
            }
          }
          return null;
        }
        return comment;
      })
      // parent가 없는 경우(답글이 아닌)만 남김. 답글은 위에서 따로 children으로 넣어줌.
      .filter((comment) => comment && !comment.parent)
  );
};
