package com.library_web.library.repository;

import com.library_web.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByTenSachAndTenTacGia(String tenSach, String tenTacGia);
}
