package io.blog.devlog.domain.post.dto;

import io.blog.devlog.domain.comment.dto.ResponseCommentDto;
import io.blog.devlog.domain.post.model.Post;
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

    public static ResponsePostCommentDto of(Post post, List<ResponseCommentDto> comments) {
        return ResponsePostCommentDto.builder()
                .post(ResponsePostDto.of(post))
                .comments(comments)
                .build();
    }
}
