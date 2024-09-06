package io.blog.devlog.domain.post.dto;

import io.blog.devlog.domain.comment.dto.ResponseCommentDto;
import io.blog.devlog.domain.post.model.PostCommentFlag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponsePostCommentDto {
    private ResponsePostDto post;
    private List<ResponseCommentDto> comments;
    private boolean commentFlag;

    public static ResponsePostCommentDto of(String email, PostCommentFlag postCommentFlag, List<ResponseCommentDto> comments) {
        return ResponsePostCommentDto.builder()
                .post(ResponsePostDto.of(email, postCommentFlag.getPost()))
                .comments(comments)
                .commentFlag(postCommentFlag.isCommentFlag())
                .build();
    }
}
