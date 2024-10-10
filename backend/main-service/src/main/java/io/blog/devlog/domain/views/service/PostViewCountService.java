package io.blog.devlog.domain.views.service;

import io.blog.devlog.domain.views.dto.ResponsePostViewCountDto;

import java.time.LocalDate;
import java.util.List;

public interface PostViewCountService {
    void increaseViewCount(Long postId);
    LocalDate parseDate(String date);
    LocalDate parseStartMonth(String month);
    LocalDate parseEndMonth(String month);
    LocalDate parseStartYear(String year);
    LocalDate parseEndYear(String year);

    List<ResponsePostViewCountDto> getDailyPostViewCount(Long postId, String start, String end);
    List<ResponsePostViewCountDto> getMonthlyPostViewCount(Long postId, String start, String end);
    List<ResponsePostViewCountDto> getYearlyPostViewCount(Long postId, String start, String end);
}
