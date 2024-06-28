package io.blog.devlog.domain.category.dto;

import io.blog.devlog.domain.user.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private Long id;
    private long layer; // 카테고리 순서
    private String name;

//    public ofCategory() {
//
//    }
}
