package com.library_web.library.service;

import com.library_web.library.model.Book;
import java.util.List;
import java.util.Map;

public interface BookService {

    List<Book> getAllBooks();
    Book addBook(Book book);
    void delBook(Long maSach);
    Book getBookbyID(Long maSach);
    Book updateBook(Long maSach, Map<String, Object> updates);
}