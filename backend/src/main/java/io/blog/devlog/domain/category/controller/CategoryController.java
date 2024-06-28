package io.blog.devlog.domain.category.controller;

import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.category.service.CategoryService;
import io.blog.devlog.global.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final ErrorResponse errorResponse;
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryService.getCategories();
        return ResponseEntity.ok()
                .eTag(categories.toString())
                .body(categories);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public void updateCategories(HttpServletRequest request, HttpServletResponse response, @RequestBody List<Category> categories) throws IOException {
        long idx = -1;
        var isDuplic = false;
        for (Category category : categories) {
            System.out.println(category);
            if (idx == -1) {
                idx = category.getLayer();
            }
            if (category.getLayer() == idx) {
                idx ++;
            }
            else {
                isDuplic = true;
                break;
            }
        }

        if (!isDuplic) {
            categoryService.cleanUpCategories();
            categoryService.updateCategories(categories);
        }
        else {
            Integer status = HttpServletResponse.SC_BAD_REQUEST;
            String error = "잘못된 입력 정보입니다.";
            String path = request.getRequestURI();
            errorResponse.setResponse(response, status, error, path);
        }
    }
}
