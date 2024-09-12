package io.blog.devlog.domain.post.controller;

import io.blog.devlog.domain.comment.dto.ResponseCommentDto;
import io.blog.devlog.domain.comment.service.CommentService;
import io.blog.devlog.domain.like.model.PostLikeDetail;
import io.blog.devlog.domain.like.service.PostLikeService;
import io.blog.devlog.domain.post.dto.*;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.model.PostDetail;
import io.blog.devlog.domain.post.service.PostService;
import io.blog.devlog.domain.post.service.PostUploadService;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
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

import static io.blog.devlog.global.utils.SecurityUtils.getUserEmail;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
@Slf4j
public class PostController {
    private final UserService userService;
    private final PostService postService;
    private final CommentService commentService;
    private final PostLikeService postLikeService;
    private final PostUploadService postUploadService;

    @PostMapping
    public void uploadPost(@RequestBody RequestPostDto requestPostDto) throws BadRequestException {
        log.info("Post uploaded : " + requestPostDto.getTitle());
        postUploadService.savePost(requestPostDto);
    }

    @PostMapping("/edit")
    public void editPost(@RequestBody RequestEditPostDto requestEditPostDto) throws BadRequestException {
        log.info("Post edited : " + requestEditPostDto.getTitle());
        postUploadService.editPost(requestEditPostDto);
    }

    @GetMapping
    public ResponseEntity<ResponsePageablePostDto> getPosts(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) throws BadRequestException {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Post> posts = postService.getPosts(pageable);
        List<ResponsePostNonContentDto> responsePostDtos = new ArrayList<>();
        for (Post post : posts) {
            responsePostDtos.add(ResponsePostNonContentDto.of(post));
        }
        ResponsePageablePostDto responsePageablePostDto = ResponsePageablePostDto.builder()
                .posts(responsePostDtos)
                .currentPage(posts.getNumber())
                .totalPages(posts.getTotalPages())
                .totalElements(posts.getTotalElements())
                .build();
        return ResponseEntity.ok(responsePageablePostDto);
    }

    @GetMapping("/{url}")
    public ResponseEntity<ResponsePostCommentDto> getPost(@PathVariable String url) throws BadRequestException {
        String email = getUserEmail();
        User user = userService.getUserByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .email(null)
                    .role(Role.GUEST)
                    .username("GUEST")
                    .build();
        }
        PostDetail postDetail = postService.getPostByUrl(url, user);
        List<ResponseCommentDto> comments = commentService.getCommentsFromPost(user, postDetail);
        PostLikeDetail postLikeDetail = postLikeService.likeDetailFromPost(postDetail.getPost(), user);
        return ResponseEntity.ok(ResponsePostCommentDto.of(email, postDetail, comments, postLikeDetail));
    }

    @GetMapping("/category/v1/{categoryName}")
    public ResponseEntity<ResponsePageablePostDto> getPostsByCategory(@PathVariable String categoryName,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size) throws BadRequestException {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Post> posts = postService.getPostsByCategory(categoryName, pageable);
        List<ResponsePostNonContentDto> responsePostDtos = new ArrayList<>();
        for (Post post : posts) {
            responsePostDtos.add(ResponsePostNonContentDto.of(post));
        }
        ResponsePageablePostDto responsePageablePostDto = ResponsePageablePostDto.builder()
                .posts(responsePostDtos)
                .currentPage(posts.getNumber())
                .totalPages(posts.getTotalPages())
                .totalElements(posts.getTotalElements())
                .build();
        return ResponseEntity.ok(responsePageablePostDto);
    }

    @GetMapping("/category/v2/{categoryId}")
    public ResponseEntity<ResponsePageablePostDto> getPostsByCategoryId(@PathVariable Long categoryId,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size) throws BadRequestException {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Post> posts = postService.getPostsByCategoryId(categoryId, pageable);
        List<ResponsePostNonContentDto> responsePostDtos = new ArrayList<>();
        for (Post post : posts) {
            responsePostDtos.add(ResponsePostNonContentDto.of(post));
        }
        ResponsePageablePostDto responsePageablePostDto = ResponsePageablePostDto.builder()
                .posts(responsePostDtos)
                .currentPage(posts.getNumber())
                .totalPages(posts.getTotalPages())
                .totalElements(posts.getTotalElements())
                .build();
        return ResponseEntity.ok(responsePageablePostDto);
    }

    @DeleteMapping("/{url}")
    public void deletePost(@PathVariable String url) throws BadRequestException {
        String email = getUserEmail();
        PostDetail postDetail = postService.getPostByUrl(email, url);
        if(!postDetail.getPost().getUser().getEmail().equals(email)) {
            throw new BadRequestException("You don't have permission to delete this post.");
        }
        commentService.deleteCommentsByPostId(postDetail.getPost().getId());
        postService.deletePost(postDetail.getPost());
//        List<ResponseCommentDto> comments = commentService.getCommentsFromPost(postCommentFlag);
    }
}
