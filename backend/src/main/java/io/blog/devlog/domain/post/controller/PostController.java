package io.blog.devlog.domain.post.controller;

import io.blog.devlog.domain.post.dto.RequestPostDto;
import io.blog.devlog.domain.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
@Slf4j
public class PostController {
    private final PostService postService;

    @PostMapping
    public void uploadPost(@RequestBody RequestPostDto requestPostDto) throws BadRequestException {
        log.info("Post uploaded : " + requestPostDto.getTitle());
        postService.savePost(requestPostDto);
    }
}
