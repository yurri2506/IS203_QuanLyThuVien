package com.library_web.library.service;

import com.library_web.library.model.Book;
import java.util.List;
import java.util.Map;

public interface BookService {
    List<Book> getAllBooks();

    List<Book> getBooksByCategoryChild(String categoryChildId);

    Book addBook(Book book, int initialQuantity);

    void delBook(Long maSach);

    Book getBookbyID(Long maSach);

    Book updateBook(Long maSach, Map<String, Object> updates);

    List<Book> searchBooks(String all, String title, String author, String category, String publisher, Integer year,
            boolean sortByBorrowCount);

    long getTotalBooks();

    long getTotalBookQuantity();

    long getNewBooksThisWeek();

    List<Book> findBooksNeedingRestock(int quantity);

    List<Book> searchBooks2(String query);
}