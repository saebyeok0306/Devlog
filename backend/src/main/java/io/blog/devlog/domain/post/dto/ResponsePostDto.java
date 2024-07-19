package io.blog.devlog.domain.post.dto;

import io.blog.devlog.domain.category.dto.CategoryDto;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.user.dto.ResponseUserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponsePostDto {
    private String url;
    private String title;
    private String content;
    private String previewUrl;
    private ResponseUserDto user;
    private CategoryDto category;
    private long views;
    private long likes;

    public static ResponsePostDto of(Post post) {
        return ResponsePostDto.builder()
                .url(post.getUrl())
                .title(post.getTitle())
                .content(post.getContent())
                .previewUrl(post.getPreviewUrl())
                .user(ResponseUserDto.of(post.getUser()))
                .category(CategoryDto.of(post.getCategory()))
                .views(post.getViews())
                .likes(post.getLikes())
                .build();
    }
}
