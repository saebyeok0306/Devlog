package io.blog.devlog.domain.views.dto;

import io.blog.devlog.domain.views.model.PostViewCount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponsePostViewCountDto {
    private Long postId;
    private String viewDate;
    private int viewCount;

    public static ResponsePostViewCountDto of(PostViewCount postViewCount) {
        return ResponsePostViewCountDto.builder()
                .postId(postViewCount.getPostId())
                .viewDate(postViewCount.getViewDate().toString())
                .viewCount(postViewCount.getViewCount())
                .build();
    }

    public static ResponsePostViewCountDto ofDailyView(Long postId, Object[] dailyView) {
        LocalDate localDate = (LocalDate) dailyView[0];
        Long viewCount = (Long) dailyView[1];
        return ResponsePostViewCountDto.builder()
                .postId(postId)
                .viewDate(localDate.toString())
                .viewCount(viewCount.intValue())
                .build();
    }

    public static ResponsePostViewCountDto ofMonthlyView(Long postId, Object[] monthlyView) {
        Long viewCount = (Long) monthlyView[2];
        return ResponsePostViewCountDto.builder()
                .postId(postId)
                .viewDate(String.format("%d-%02d", (int) monthlyView[0], (int) monthlyView[1]))
                .viewCount(viewCount.intValue())
                .build();
    }

    public static ResponsePostViewCountDto ofYearlyView(Long postId, Object[] yearlyView) {
        Long viewCount = (Long) yearlyView[1];
        return ResponsePostViewCountDto.builder()
                .postId(postId)
                .viewDate(String.format("%d", (int) yearlyView[0]))
                .viewCount(viewCount.intValue())
                .build();
    }
}
