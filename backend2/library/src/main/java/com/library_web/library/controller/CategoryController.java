package com.library_web.library.controller;

import com.library_web.library.model.Category;
import com.library_web.library.dto.CategoryWithChildrenNames;
import com.library_web.library.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
@CrossOrigin
public class CategoryController {
    private final CategoryService service;
    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Category> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Category add(@RequestBody CategoryWithChildrenNames payload) {
        return service.addCategory(payload);
    }

    @PatchMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        return service.updateCategory(id, updates);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteCategory(id);
    }
}