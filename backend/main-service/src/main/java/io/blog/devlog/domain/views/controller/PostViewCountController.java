package io.blog.devlog.domain.views.controller;

import io.blog.devlog.domain.views.dto.ResponsePostViewCountDto;
import io.blog.devlog.domain.views.service.PostViewCountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/views/post")
@RequiredArgsConstructor
public class PostViewCountController {
    private final PostViewCountService postViewCountService;

    @GetMapping("/{postId}/daily")
    public List<ResponsePostViewCountDto> getDailyPostViewCount(@PathVariable Long postId, @RequestParam String start, @RequestParam String end) {
        return postViewCountService.getDailyPostViewCount(postId, start, end);
    }

    @GetMapping("/{postId}/monthly")
    public List<ResponsePostViewCountDto> getMonthlyPostViewCount(@PathVariable Long postId, @RequestParam String start, @RequestParam String end) {
        return postViewCountService.getMonthlyPostViewCount(postId, start, end);
    }

    @GetMapping("/{postId}/yearly")
    public List<ResponsePostViewCountDto> getYearlyPostViewCount(@PathVariable Long postId, @RequestParam String start, @RequestParam String end) {
        return postViewCountService.getYearlyPostViewCount(postId, start, end);
    }
}
