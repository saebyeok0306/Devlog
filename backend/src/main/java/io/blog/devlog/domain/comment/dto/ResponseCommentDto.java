package io.blog.devlog.domain.comment.dto;

import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.user.dto.ResponseUserDto;
import io.blog.devlog.domain.user.model.User;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseCommentDto {
    private ResponseUserDto user;
    private Long parent; // 대댓글
    private String content;

    public static ResponseCommentDto of(Comment comment) {
        return ResponseCommentDto.builder()
                .user(ResponseUserDto.of(comment.getUser()))
                .parent(comment.getParent())
                .content(comment.getContent())
                .build();
    }
}
