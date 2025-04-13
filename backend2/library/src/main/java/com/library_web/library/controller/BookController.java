package com.library_web.controller;
import com.library_web.model.Book;
import com.library_web.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/book")

@CrossOrigin
public class BookController {

    private final BookService bookService;
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }
/*
 * @PutMapping("/{maSach}")
    public Book updateBook(@PathVariable Long maSach, @RequestBody Book book) {
        return bookService.updateBook(maSach, book);
    }
 */
    
    @PatchMapping("/{maSach}")
    public Book patchBook(@PathVariable Long maSach, @RequestBody Map<String, Object> updates) {
    return bookService.updateBook(maSach, updates);
    }


    @DeleteMapping("/{maSach}")
    public void deleteBook(@PathVariable Long maSach) {
        bookService.delBook(maSach);
    }
}
