package io.blog.devlog.domain.views.controller;

import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.model.PostDetail;
import io.blog.devlog.domain.post.service.PostService;
import io.blog.devlog.domain.views.dto.ResponsePostViewCountDto;
import io.blog.devlog.domain.views.service.PostViewCountService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/views/post")
@RequiredArgsConstructor
public class PostViewCountController {
    private final PostService postService;
    private final PostViewCountService postViewCountService;

    @GetMapping("/{postUrl}/daily")
    public List<ResponsePostViewCountDto> getDailyPostViewCount(@PathVariable String postUrl, @RequestParam String start, @RequestParam String end) throws BadRequestException {
        Post post = postService.getSimplePostByUrl(postUrl);
        return postViewCountService.getDailyPostViewCount(post.getId(), start, end);
    }

    @GetMapping("/{postUrl}/monthly")
    public List<ResponsePostViewCountDto> getMonthlyPostViewCount(@PathVariable String postUrl, @RequestParam String start, @RequestParam String end) {
        Post post = postService.getSimplePostByUrl(postUrl);
        return postViewCountService.getMonthlyPostViewCount(post.getId(), start, end);
    }

    @GetMapping("/{postUrl}/yearly")
    public List<ResponsePostViewCountDto> getYearlyPostViewCount(@PathVariable String postUrl, @RequestParam String start, @RequestParam String end) {
        Post post = postService.getSimplePostByUrl(postUrl);
        return postViewCountService.getYearlyPostViewCount(post.getId(), start, end);
    }
}
