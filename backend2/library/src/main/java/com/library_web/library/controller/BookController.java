package com.library_web.library.controller;

import com.library_web.library.dto.BookWithQuantity;
import com.library_web.library.model.Book;
import com.library_web.library.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/book")
@CrossOrigin
public class BookController {
    private final BookService service;
    public BookController(BookService service) { this.service = service; }

    @GetMapping
    public List<Book> getAllBooks() { return service.getAllBooks(); }

    @GetMapping("/{maSach}")
    public Book getBook(@PathVariable Long maSach) { return service.getBookbyID(maSach); }

    @PostMapping
    public Book addBook(@RequestBody BookWithQuantity payload) {
        // Use getBook() instead of toBook()
        return service.addBook(payload.getBook(), payload.getQuantity());
    }

    @PatchMapping("/{maSach}")
    public Book updateBook(@PathVariable Long maSach, @RequestBody Map<String, Object> updates) {
        return service.updateBook(maSach, updates);
    }

    @DeleteMapping("/{maSach}")
    public void deleteBook(@PathVariable Long maSach) { service.delBook(maSach); }

    @GetMapping("/search")
public List<Book> searchBooks(
        @RequestParam(required = false) String author,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String publisher,
        @RequestParam(required = false) Integer year,
        @RequestParam(defaultValue = "false") boolean sortByBorrowCount) {
    return service.searchBooks(author, category, publisher, year, sortByBorrowCount);
}

}
