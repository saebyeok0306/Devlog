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
import io.blog.devlog.domain.post.service.PostViewsService;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import io.blog.devlog.domain.views.service.PostViewCountService;
import io.blog.devlog.global.client.SitemapClient;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static io.blog.devlog.global.utils.SecurityUtils.getUserEmail;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
@Slf4j
public class PostController {
    private final SitemapClient sitemapClient;
    private final UserService userService;
    private final PostService postService;
    private final CommentService commentService;
    private final PostLikeService postLikeService;
    private final PostUploadService postUploadService;
    private final PostViewsService postViewsService;
    private final PostViewCountService postViewCountService;

    @Transactional
    @PostMapping
    public void uploadPost(@RequestBody RequestPostDto requestPostDto) throws BadRequestException {
        log.info("Post uploaded : " + requestPostDto.getTitle());
        postUploadService.savePost(requestPostDto);
        sitemapClient.addPostSitemap(ResponsePostUrlDto.of(requestPostDto.getCategoryId(), requestPostDto.getUrl()));
    }

    @Transactional
    @PostMapping("/edit")
    public void editPost(@RequestBody RequestEditPostDto requestEditPostDto) throws BadRequestException {
        log.info("Post edited : " + requestEditPostDto.getTitle());
        Post post = postService.getPostById(requestEditPostDto.getId());
        if (post == null) {
            log.info("Post not found : " + requestEditPostDto.getId());
            throw new BadRequestException("Post not found : " + requestEditPostDto.getId());
        }
        Post renewPost = postUploadService.editPost(requestEditPostDto);
        if (!Objects.equals(post.getUrl(), renewPost.getUrl()) || !Objects.equals(post.getCategory().getId(), renewPost.getCategory().getId())) {
            sitemapClient.deletePostSitemap(ResponsePostUrlDto.of(post.getCategory().getId(), post.getUrl()));
            sitemapClient.addPostSitemap(ResponsePostUrlDto.of(renewPost.getCategory().getId(), renewPost.getUrl()));
        }
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

    @GetMapping("/inf")
    public ResponseEntity<ResponseSlicePostDto> getInfinitePosts(@RequestParam(defaultValue = "0") Long lastId,
                                                                    @RequestParam(defaultValue = "10") int size) throws BadRequestException {
        Pageable pageable = PageRequest.of(0, size, Sort.by("id").descending());
        Slice<Post> posts = postService.getInfinitePosts(pageable, lastId);
        List<Post> getPosts = posts.getContent();

        if (getPosts.isEmpty()) {
            return ResponseEntity.ok(ResponseSlicePostDto.builder().posts(Collections.emptyList()).lastId(0L).hasNext(false).build());
        }

        List<ResponsePostNonContentDto> responsePostDtos = new ArrayList<>();
        for (Post post : getPosts) {
            responsePostDtos.add(ResponsePostNonContentDto.of(post));
        }
        ResponseSlicePostDto responseSlicePostDto = ResponseSlicePostDto.builder()
                .posts(responsePostDtos)
                .lastId(getPosts.get(getPosts.size()-1).getId())
                .hasNext(posts.hasNext())
                .build();
        return ResponseEntity.ok(responseSlicePostDto);
    }

    @GetMapping("/{url}")
    public ResponseEntity<ResponsePostCommentDto> getPost(HttpServletRequest request, @PathVariable String url) throws BadRequestException {
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
        boolean increased = postViewsService.increaseViewCount(postDetail.getPost().getId(), request);
        if (increased) {
            postViewCountService.increaseViewCount(postDetail.getPost().getId());
        }
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

    @Transactional
    @DeleteMapping("/{url}")
    public void deletePost(@PathVariable String url) throws BadRequestException {
        String email = getUserEmail();
        PostDetail postDetail = postService.getPostByUrl(email, url);
        if(!postDetail.getPost().getUser().getEmail().equals(email)) {
            throw new BadRequestException("You don't have permission to delete this post.");
        }
        commentService.deleteCommentsByPostId(postDetail.getPost().getId());
        postService.deletePost(postDetail.getPost());
        sitemapClient.deletePostSitemap(ResponsePostUrlDto.of(postDetail.getPost().getCategory().getId(), postDetail.getPost().getUrl()));
    }
}
