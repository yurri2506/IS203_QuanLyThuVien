package com.library_web.library.controller;

import com.library_web.library.dto.BookWithQuantity;
import com.library_web.library.dto.BookDTO;
import com.library_web.library.model.Book;
import com.library_web.library.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/book")
@CrossOrigin
public class BookController {
        private final BookService service;

        public BookController(BookService service) {
                this.service = service;
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
                // b.updateTrangThai();
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
        public List<BookDTO> searchBooks(
                        @RequestParam(required = false) String all,
                        @RequestParam(required = false) String title,
                        @RequestParam(required = false) String author,
                        @RequestParam(required = false) String category,
                        @RequestParam(required = false) String publisher,
                        @RequestParam(required = false) Integer year,
                        @RequestParam(defaultValue = "false") boolean sortByBorrowCount) {
                return service.searchBooks(all, title, author, category, publisher, year, sortByBorrowCount).stream()
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

        @GetMapping("/search2")
        public ResponseEntity<List<Book>> searchBooks(@RequestParam String query) {
                List<Book> books = service.searchBooks2(query);
                return books.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(books);
        }
}