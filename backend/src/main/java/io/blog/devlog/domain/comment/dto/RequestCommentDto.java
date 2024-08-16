package io.blog.devlog.domain.comment.dto;

import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.user.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestCommentDto {
    private User user;
    private Post post;
    private Long parent; // 대댓글
    private String content;
    private boolean isPrivate;

    public Comment toEntity() {
        return Comment.builder()
                .user(this.user)
                .post(this.post)
                .parent(this.parent)
                .content(this.content)
                .isPrivate(this.isPrivate)
                .build();
    }
}
