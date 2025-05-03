package com.library_web.library.controller;

import com.library_web.library.model.CategoryChild;
import com.library_web.library.service.CategoryChildService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category-child")
@CrossOrigin
public class CategoryChildController {
    private final CategoryChildService service;
    public CategoryChildController(CategoryChildService service) {
        this.service = service;
    }

    @GetMapping("/category/{categoryId}")
    public List<CategoryChild> getByCategory(@PathVariable Long categoryId) {
        return service.getByCategory(categoryId);
    }

    @PostMapping("/category/{categoryId}/add")
    public CategoryChild addChild(
        @PathVariable Long categoryId,
        @RequestBody Map<String, String> body
    ) {
        return service.addChild(categoryId, body.get("name"));
    }

    @PatchMapping("/{id}")
public CategoryChild updateChild(
    @PathVariable String id,
    @RequestBody Map<String, String> body
) {
    String newName = body.get("name");
    if (newName == null || newName.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên danh mục con không được để trống.");
    }
    return service.updateChild(id, newName);
}



    @DeleteMapping("/{id}")
    public void deleteChild(@PathVariable String id) {
        service.deleteChild(id);
    }
   
}
