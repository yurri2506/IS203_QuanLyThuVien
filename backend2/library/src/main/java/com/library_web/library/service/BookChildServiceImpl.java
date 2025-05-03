package com.library_web.library.service;

import com.library_web.library.model.Book;
import com.library_web.library.model.BookChild;
import com.library_web.library.repository.BookChildRepository;
import com.library_web.library.repository.BookRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service
public class BookChildServiceImpl implements BookChildService {
    private final BookChildRepository childRepo;
    private final BookRepository bookRepo;

    public BookChildServiceImpl(BookChildRepository childRepo, BookRepository bookRepo) {
        this.childRepo = childRepo;
        this.bookRepo = bookRepo;
    }

    @Override
    public List<BookChild> getChildrenByBook(Long bookId) {
        return childRepo.findByBookMaSachOrderByIdAsc(bookId);
    }

    @Override
    public List<BookChild> findByStatus(BookChild.Status status) {
        return childRepo.findByStatus(status);
    }

    @Override
    @Transactional
    public BookChild addChild(Long bookId) {
        Book book = bookRepo.findById(bookId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sách: " + bookId));
        List<BookChild> existing = childRepo.findByBookMaSachOrderByIdAsc(bookId);
        char suffix = (char) ('a' + existing.size());
        BookChild child = new BookChild(book, String.valueOf(suffix));
        book.addChild(child);
        bookRepo.save(book);
        return child;
    }
/*
@Override
@Transactional
public BookChild updateChild(String childId, Map<String, Object> updates) {
    BookChild child = childRepo.findById(childId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Không tìm thấy sách con: " + childId
        ));

    if (updates.containsKey("status")) {
        BookChild.Status newStatus = BookChild.Status.valueOf(
            updates.get("status").toString()
        );
        BookChild.Status oldStatus = child.getStatus();

        // Không cho chuyển từ NOT_AVAILABLE về AVAILABLE
        if (oldStatus == BookChild.Status.NOT_AVAILABLE && newStatus == BookChild.Status.AVAILABLE) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Không cho phép chuyển từ NOT_AVAILABLE về AVAILABLE"
            );
        }
        switch (newStatus) {
            case BORROWED -> child.borrow();
            case AVAILABLE -> child.returnBack();
            case NOT_AVAILABLE -> child.markNotAvailable();
        }
    }
    return childRepo.save(child);
}

*/
@Override
@Transactional
public void deleteChild(String childId) {
    BookChild child = childRepo.findById(childId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Không tìm thấy sách con: " + childId
        ));
    Book book = child.getBook();
    child.markNotAvailable();
    childRepo.save(child);
    book.decreaseTotalQuantity();
    book.setSoLuongXoa((book.getSoLuongXoa() == null ? 0 : book.getSoLuongXoa()) + 1);
    bookRepo.save(book);
}

    @Override
    @Transactional
    public BookChild borrowChild(String childId) {
        BookChild child = childRepo.findById(childId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Không tìm thấy sách con: " + childId
        ));
        try {
            child.borrow();
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
        return childRepo.save(child);
    }

    @Override
    @Transactional
    public BookChild returnChild(String childId) {
        BookChild child = childRepo.findById(childId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Không tìm thấy sách con: " + childId
            ));
        try {
            child.returnBack();
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
        return childRepo.save(child);
    }
} 
