package io.blog.devlog.domain.category.service;

import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> getCategories() {
        List<Category> categories = categoryRepository.findAll();
        categories.sort(Comparator.comparingLong(Category::getLayer));
        return categories;
    }

    public void updateCategories(List<Category> categories) {
        categoryRepository.saveAll(categories);
    }

    public void cleanUpCategories() {
        categoryRepository.truncate();
    }
}
