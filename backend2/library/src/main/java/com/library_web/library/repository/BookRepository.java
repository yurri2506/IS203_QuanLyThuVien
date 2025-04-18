package com.library_web.library.repository;
import com.library_web.library.model.Book;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long>{
    Optional<Book> findByTenSachAndMaTacGia(String tenSach, String maTacGia);
}