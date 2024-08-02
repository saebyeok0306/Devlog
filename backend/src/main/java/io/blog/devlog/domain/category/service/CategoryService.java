package io.blog.devlog.domain.category.service;

import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.category.repository.CategoryRepository;
import io.blog.devlog.domain.user.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static io.blog.devlog.global.utils.SecurityUtils.getPrincipalRole;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    public List<Category> sortCategories(List<Category> categories) {
        return categories.stream().sorted(Comparator.comparingLong(Category::getLayer)).collect(Collectors.toList());
    }

    public List<Category> getCategories() {
        Role role = getPrincipalRole();
        if (role == null) {
            return Collections.emptyList();
        }
        return categoryRepository.findAll()
                .stream()
                .filter(category -> category.getReadCategoryAuth().getKey() <= role.getKey())
                .sorted(Comparator.comparingLong(Category::getLayer))
                .collect(Collectors.toList());
    }

    public List<Category> updateCategories(List<Category> categories) {
        return categoryRepository.saveAll(categories);
    }

    public void cleanUpCategories() {
        categoryRepository.truncate();
    }
}
