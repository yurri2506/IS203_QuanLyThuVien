package com.library_web.library.service;

import com.library_web.library.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface BookService {
    List<Book> getAllBooks();
    List<Book> getBooksByCategoryChild(String categoryChildId);
    Book addBook(Book book, int initialQuantity);
    void delBook(Long maSach);
    Book getBookbyID(Long maSach);
    Book updateBook(Long maSach, Map<String, Object> updates);
    Page<Book> searchBooks(String author, String category, String publisher, Integer year, String title, boolean sortByBorrowCount, Pageable pageable);
    long getTotalBooks();
    long getTotalBookQuantity();
    long getNewBooksThisWeek();
    List<Book> findBooksNeedingRestock(int quantity);
}