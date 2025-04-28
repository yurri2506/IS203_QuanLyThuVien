package com.library_web.library.service;

import com.library_web.library.model.Category;
import com.library_web.library.model.CategoryChild;
import com.library_web.library.dto.CategoryWithChildrenNames;
import com.library_web.library.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepo;

    public CategoryServiceImpl(CategoryRepository categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    @Override
    public List<Category> getAll() {
        return categoryRepo.findAll();
    }

    @Override
    public Category addCategory(CategoryWithChildrenNames payload) {
        Category category = new Category();
        category.setName(payload.getName());
        Category saved = categoryRepo.save(category);  // generate ID

        List<String> names = payload.getChildrenNames();
        for (int i = 0; i < names.size(); i++) {
            String suffix = generateSuffix(i);
            CategoryChild child = new CategoryChild(saved, suffix, names.get(i));
            saved.addChild(child);
        }
        return categoryRepo.save(saved);
    }

    @Override
    public Category updateCategory(Long id, Map<String, String> updates) {
        Category category = categoryRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + id));
        if (updates.containsKey("name")) {
            category.setName(updates.get("name"));
        }
        return categoryRepo.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepo.deleteById(id);
    }

    private String generateSuffix(int index) {
        StringBuilder sb = new StringBuilder();
        index++; // 1-based
        while (index > 0) {
            index--;
            sb.insert(0, (char) ('a' + (index % 26)));
            index /= 26;
        }
        return sb.toString();
    }
}