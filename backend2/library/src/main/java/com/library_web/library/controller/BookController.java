package com.library_web.library.controller;

import com.library_web.library.dto.BookWithQuantity;
import com.library_web.library.dto.BookDTO;
import com.library_web.library.model.Book;
import com.library_web.library.service.BookService;
import com.library_web.library.service.BorrowCardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/book")
@CrossOrigin
public class BookController {
    private final BookService service;
    private final BorrowCardService borrowCardService; // Declare as a field

    public BookController(BookService service, BorrowCardService borrowCardService) {
        this.service = service;
        this.borrowCardService = borrowCardService; // Inject BorrowCardService
    }

    @GetMapping
    public List<BookDTO> getAll() {
        return service.getAllBooks().stream()
                .map(b -> new BookDTO(
                        b.getMaSach(), b.getTenSach(), b.getMoTa(),
                        b.getTenTacGia(), b.getNxb(), b.getNam(),
                        b.getTrongLuong(), b.getDonGia(),
                        b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
                        b.getTrangThai().name(), b.getHinhAnh(),
                        b.getCategoryChild().getId(), b.getCategoryChild().getName(),
                        b.getCategoryChild().getCategoryName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public BookDTO getById(@PathVariable Long id) {
        Book b = service.getBookbyID(id);
        return new BookDTO(
                b.getMaSach(), b.getTenSach(), b.getMoTa(),
                b.getTenTacGia(), b.getNxb(), b.getNam(),
                b.getTrongLuong(), b.getDonGia(),
                b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
                b.getTrangThai().name(), b.getHinhAnh(),
                b.getCategoryChild().getId(), b.getCategoryChild().getName(),
                b.getCategoryChild().getCategoryName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookDTO add(@RequestBody BookWithQuantity payload) {
        Book book = payload.getBook();
        int initialQuantity = payload.getQuantity();
        Book b = service.addBook(book, initialQuantity);
        return new BookDTO(
                b.getMaSach(),
                b.getTenSach(),
                b.getMoTa(),
                b.getTenTacGia(),
                b.getNxb(),
                b.getNam(),
                b.getTrongLuong(),
                b.getDonGia(),
                b.getTongSoLuong(),
                b.getSoLuongMuon(),
                b.getSoLuongXoa(),
                b.getTrangThai().name(),
                b.getHinhAnh(),
                b.getCategoryChild().getId(),
                b.getCategoryChild().getName(),
                b.getCategoryChild().getCategoryName());
    }

    @PatchMapping("/{id}")
    public BookDTO update(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Book b = service.updateBook(id, updates);
        return new BookDTO(
                b.getMaSach(), b.getTenSach(), b.getMoTa(),
                b.getTenTacGia(), b.getNxb(), b.getNam(),
                b.getTrongLuong(), b.getDonGia(),
                b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
                b.getTrangThai().name(), b.getHinhAnh(),
                b.getCategoryChild().getId(), b.getCategoryChild().getName(),
                b.getCategoryChild().getCategoryName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delBook(id);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BookDTO>> searchBooks(
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String publisher,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "false") boolean sortByBorrowCount,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> booksPage = service.searchBooks(author, category, publisher, year, title, sortByBorrowCount,
                pageable);
        Page<BookDTO> bookDTOPage = booksPage.map(b -> new BookDTO(
                b.getMaSach(), b.getTenSach(), b.getMoTa(),
                b.getTenTacGia(), b.getNxb(), b.getNam(),
                b.getTrongLuong(), b.getDonGia(),
                b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
                b.getTrangThai().name(), b.getHinhAnh(),
                b.getCategoryChild().getId(), b.getCategoryChild().getName(),
                b.getCategoryChild().getCategoryName()));
        return ResponseEntity.ok(bookDTOPage);
    }

    @GetMapping("/category/{categoryChildId}")
    public List<BookDTO> getByCategory(
            @PathVariable String categoryChildId) {
        return service.getBooksByCategoryChild(categoryChildId).stream()
                .map(b -> new BookDTO(
                        b.getMaSach(), b.getTenSach(), b.getMoTa(),
                        b.getTenTacGia(), b.getNxb(), b.getNam(),
                        b.getTrongLuong(), b.getDonGia(),
                        b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
                        b.getTrangThai().name(), b.getHinhAnh(),
                        b.getCategoryChild().getId(),
                        b.getCategoryChild().getName(),
                        b.getCategoryChild().getCategoryName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total books
        long totalBooks = service.getTotalBooks();
        stats.put("totalBooks", totalBooks);

        // Total book quantity
        long totalBookQuantity = service.getTotalBookQuantity();
        stats.put("totalBookQuantity", totalBookQuantity);

        // New books this week
        long newBooksThisWeek = service.getNewBooksThisWeek();
        stats.put("newBooksThisWeek", newBooksThisWeek);

        // Borrow stats last week
        // Placeholder since borrowCardService is not injected yet
        Map<String, Object> borrowStartLastWeek = new HashMap<>();
        borrowStartLastWeek.put("totalBorrows", 0L);
        borrowStartLastWeek.put("bookDetails", List.of());
        stats.put("borrowStartLastWeek", borrowStartLastWeek);

        // Books needing restock
        List<BookDTO> booksToRestock = service.findBooksNeedingRestock(5).stream()
                .map(b -> new BookDTO(
                        b.getMaSach(), b.getTenSach(), b.getMoTa(),
                        b.getTenTacGia(), b.getNxb(), b.getNam(),
                        b.getTrongLuong(), b.getDonGia(),
                        b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
                        b.getTrangThai().name(), b.getHinhAnh(),
                        b.getCategoryChild().getId(), b.getCategoryChild().getName(),
                        b.getCategoryChild().getCategoryName()))
                .collect(Collectors.toList());
        stats.put("booksToRestock", booksToRestock);

        return ResponseEntity.ok(stats);
    }
}