package com.library_web.library.repository;

import com.library_web.library.model.Category;
import com.library_web.library.model.CategoryChild;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
   
}
