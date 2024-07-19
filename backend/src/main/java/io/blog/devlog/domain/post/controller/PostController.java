package io.blog.devlog.domain.post.controller;

import io.blog.devlog.domain.post.dto.RequestPostDto;
import io.blog.devlog.domain.post.dto.ResponsePostDto;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<ResponsePostDto>> getPosts(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size) throws BadRequestException {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Post> posts = postService.getPosts(pageable);
        List<ResponsePostDto> responsePostDtos = new ArrayList<>();
        for (Post post : posts) {
            responsePostDtos.add(ResponsePostDto.of(post));
        }
        return ResponseEntity.ok(responsePostDtos);
    }

    @GetMapping("/{url}")
    public ResponseEntity<ResponsePostDto> getPost(@PathVariable String url) throws BadRequestException {
        Post post = postService.getPostByUrl(url);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ResponsePostDto.of(post));
    }

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<ResponsePostDto>> getPostsByCategory(@PathVariable String categoryName,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size) throws BadRequestException {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Post> posts = postService.getPostsByCategory(categoryName, pageable);
        List<ResponsePostDto> responsePostDtos = new ArrayList<>();
        for (Post post : posts) {
            responsePostDtos.add(ResponsePostDto.of(post));
        }
        return ResponseEntity.ok(responsePostDtos);
    }
}
