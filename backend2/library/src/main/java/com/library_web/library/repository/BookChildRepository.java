package com.library_web.library.repository;

import com.library_web.library.model.BookChild;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookChildRepository extends JpaRepository<BookChild, String> {
    List<BookChild> findByBookMaSachOrderByIdAsc(Long bookId);
}