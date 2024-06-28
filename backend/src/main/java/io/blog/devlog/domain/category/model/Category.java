package io.blog.devlog.domain.category.model;

import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.global.time.CreateTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class Category extends CreateTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Setter
    @NotNull
    private long layer; // 카테고리 순서
    @Setter
    @NotNull
    private String name;
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "write_post_auth")
    private Role writePostAuth;
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "write_comment_auth")
    private Role writeCommentAuth; // NOTE: 최소 필요권한, Atleast 개념
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "read_category_auth")
    private Role readCategoryAuth;
}
