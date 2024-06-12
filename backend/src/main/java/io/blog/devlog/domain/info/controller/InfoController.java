package io.blog.devlog.domain.info.controller;

import io.blog.devlog.domain.info.dto.InfoDto;
import io.blog.devlog.domain.info.service.InfoService;
import io.blog.devlog.global.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/info")
public class InfoController {
    private final ErrorResponse errorResponse;
    private final InfoService infoService;

    @GetMapping
    public InfoDto getInfo() {
        return infoService.getBlogInfo();
    }

    @PostMapping
    public void updateInfo(HttpServletRequest request, HttpServletResponse response, @RequestBody InfoDto infoDto) throws IOException {
        boolean isSuccess = infoService.createBlogInfo(infoDto);
        if (!isSuccess) {
            Integer status = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
            String error = "정보를 업로드하는데 실패했습니다.";
            String path = request.getRequestURI();
            errorResponse.setResponse(response, status, error, path);
        }
    }
}
