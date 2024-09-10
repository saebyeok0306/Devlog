package io.blog.devlog.domain.comment.dto;

import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.user.dto.ResponseUserDto;
import io.blog.devlog.domain.user.model.User;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseCommentDto {
    private Long id;
    private ResponseUserDto user;
    private Long parent; // 대댓글
    private String content;
    private boolean isPrivate;
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private boolean ownership; // 권한 소유

    public static ResponseCommentDto of(String email, Comment comment) {
        if (comment.isDeleted()) {
            return ResponseCommentDto.builder()
                    .id(comment.getId())
                    .user(null)
                    .parent(comment.getParent())
                    .content(null)
                    .createdAt(comment.getCreatedAt())
                    .isPrivate(false)
                    .isDeleted(comment.isDeleted())
                    .ownership(false)
                    .build();
        }
        return ResponseCommentDto.builder()
                .id(comment.getId())
                .user(ResponseUserDto.of(comment.getUser()))
                .parent(comment.getParent())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .isPrivate(comment.isPrivate())
                .isDeleted(comment.isDeleted())
                .ownership(comment.getUser().getEmail().equals(email))
                .build();
    }
}
