package io.blog.devlog.domain.category.service;

import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.category.repository.CategoryRepository;
import io.blog.devlog.domain.user.model.Role;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@DataJpaTest // Component Scan을 하지 않아 컨테이너에 @Component 빈들이 등록되지 않는다.
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class CategoryServiceTest {

    @Autowired
    private CategoryRepository categoryRepository;
    private CategoryService categoryService;

    @BeforeEach
    public void beforeSetUp() {
        categoryService = new CategoryService(categoryRepository);
    }

    @Test
    @DisplayName("카테고리 정렬 검증")
    public void categoriesSortTest() {
        // given
        final int MAX_SIZE = 10;
        List<Category> categories = new ArrayList<>();
        for (var i=0; i<MAX_SIZE; i++) {
            Category category = Category.builder()
                    .name(String.format("카테고리 테스트%d", i))
                    .layer(i)
                    .writePostAuth(Role.GUEST)
                    .readCategoryAuth(Role.GUEST)
                    .writeCommentAuth(Role.GUEST)
                    .build();
            categories.add(category);
        }
        Collections.shuffle(categories);
        categoryRepository.saveAll(categories);

        // when
        List<Category> categories_sort = categoryService.getCategories();
        for (Category category : categories_sort) {
            System.out.println(category);
        }

        // then
        for (var layer=0; layer<MAX_SIZE; layer++) {
            Assertions.assertThat(categories_sort.get(layer).getLayer()).isEqualTo(layer);
        }
    }

    @Test
    @DisplayName("카테고리 업데이트 검증")
    public void categoriesUpdateTest() {
        // given
        final int MAX_SIZE = 10;
        List<Category> categories = new ArrayList<>();
        for (var i=0; i<MAX_SIZE; i++) {
            Category category = Category.builder()
                    .name(String.format("카테고리 테스트%d", i))
                    .layer(i)
                    .writePostAuth(Role.GUEST)
                    .readCategoryAuth(Role.GUEST)
                    .writeCommentAuth(Role.GUEST)
                    .build();
            categories.add(category);
        }
        Collections.shuffle(categories);
        categoryRepository.saveAll(categories);

        // when
        List<Category> categories1 = categoryService.getCategories();
        for (Category category : categories1) {
            category.setName(String.format("테스트%d", category.getId()));
        }
//        categoryRepository.saveAll(categories1);

        // then
        List<Category> categories2 = categoryService.getCategories();
        for (Category category : categories2) {
            Assertions.assertThat(category.getName()).isEqualTo(String.format("테스트%d", category.getId()));
        }
    }

    @Test
    @DisplayName("카테고리 보기 권한 검증")
    public void categoriesReadAuthTest() {
        // given
        int guest_category_size = 0;
        List<Role> roles = List.of(Role.GUEST, Role.USER, Role.ADMIN);
        List<Category> categories = new ArrayList<>();
        for (var i=0; i<roles.size(); i++) {
            Role role = roles.get(i);
            if (role == Role.GUEST) {
                guest_category_size += 1;
            }
            Category category = Category.builder()
                    .name(String.format("%s 카테고리", role.name()))
                    .layer(i)
                    .writePostAuth(Role.GUEST)
                    .readCategoryAuth(role)
                    .writeCommentAuth(Role.GUEST)
                    .build();
            categories.add(category);
        }
        categoryRepository.saveAll(categories);

        // when
        // GUEST 권한으로 카테고리 조회
        List<Category> test_categories = categoryService.getCategories();

        // then
        Assertions.assertThat(test_categories.size()).isEqualTo(guest_category_size);
    }
}
