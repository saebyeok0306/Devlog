package io.blog.devlog.domain.post.dto;

import io.blog.devlog.domain.comment.dto.ResponseCommentDto;
import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.post.model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponsePostCommentDto {
    private ResponsePostDto post;
    private List<ResponseCommentDto> comments;

    public static ResponsePostCommentDto of(Post post, List<Comment> comments) {
        List<ResponseCommentDto> responseCommentDtos = new ArrayList<>();
        for (Comment comment : comments) {
            responseCommentDtos.add(ResponseCommentDto.of(comment));
        }
        return ResponsePostCommentDto.builder()
                .post(ResponsePostDto.of(post))
                .comments(responseCommentDtos)
                .build();
    }
}
