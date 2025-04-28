package com.library_web.library.controller;

import com.library_web.library.model.BookChild;
import com.library_web.library.service.BookChildService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/bookchild")
public class BookChildController {
    private final BookChildService service;
    public BookChildController(BookChildService service) { this.service = service; }

    @PostMapping("/book/{bookId}/add")
    public BookChild addOne(@PathVariable Long bookId) {
        return service.addChild(bookId);
    }
// lay tat ca sach con theo sach cha
    @GetMapping("/book/{bookId}")
    public List<BookChild> getByBook(@PathVariable Long bookId) {
        return service.getChildrenByBook(bookId);
    }
/*
    @PatchMapping("/{id}")
    public BookChild updateChild(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return service.updateChild(id, updates);
    }
*/
    @DeleteMapping("/{id}")
    public void deleteChild(@PathVariable String id) {
        service.deleteChild(id);
    }

    @PatchMapping("/borrow/{id}")
    public BookChild borrow(@PathVariable String id) {
        return service.borrowChild(id);
    }

    @PatchMapping("/return/{id}")
    public BookChild returnBook(@PathVariable String id) {
        return service.returnChild(id);
    }
}