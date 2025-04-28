package com.library_web.library.service;
import com.library_web.library.model.Book;
import com.library_web.library.model.BookChild;
import com.library_web.library.model.CategoryChild;
import com.library_web.library.repository.BookRepository;
import com.library_web.library.repository.CategoryRepository;
import com.library_web.library.repository.CategoryChildRepository;


import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class BookServiceImpl implements BookService {
    private final BookRepository repo;
  //  private final CategoryRepository categoryRepo;
    private final CategoryChildRepository childRepo;
  //  private final Long defaultParentId = 1L;
    //public BookServiceImpl(BookRepository repo) { this.repo = repo; }
    public BookServiceImpl(
        BookRepository repo,
        CategoryRepository categoryRepo,
        CategoryChildRepository childRepo
    ) {
        this.repo = repo;
      //  this.categoryRepo = categoryRepo;
        this.childRepo = childRepo;
    }

    @Override
    public List<Book> getAllBooks() {
        return repo.findAll();
    }

    @Override
    @Transactional
    public void delBook(Long maSach) {
        if (!repo.existsById(maSach)) {
            throw new RuntimeException("Không tìm thấy sách có mã: " + maSach);
        }
        repo.deleteById(maSach);
    }

    @Override
    public Book getBookbyID(Long maSach) {
        return repo.findById(maSach)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách có mã: " + maSach));
    }
/*
 * @Override
    public Book addBook(Book book, int initialQuantity) {
        book.setTongSoLuong(initialQuantity);
        // Lưu trước để sinh ra maSach (ID)
        Book savedBook = repo.save(book);
        for (int i = 0; i < initialQuantity; i++) {
            char suffix = (char) ('a' + i);
            BookChild child = new BookChild(savedBook, String.valueOf(suffix));
            savedBook.addChild(child);
        }
        return repo.save(savedBook);
}
 */
@Override
@Transactional
public Book addBook(Book book, int initialQuantity) {
    if (initialQuantity <= 0) {
        throw new IllegalArgumentException("Số lượng sách phải lớn hơn 0");
    }
    Optional<Book> existingOpt = repo
      .findByTenSachAndTenTacGia(book.getTenSach(), book.getTenTacGia())
      .filter(b -> Objects.equals(b.getNam(), book.getNam())
                && Objects.equals(b.getNxb(), book.getNxb()));
    if (existingOpt.isPresent()) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Sách đã tồn tại. Chuyển sang cập nhật dùm đi.");
    }

    if (book.getCategoryChild() == null
        || book.getCategoryChild().getId() == null
        || book.getCategoryChild().getId().isBlank()) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Thiếu ID thể loại con cho sách.");
    }
    String childId = book.getCategoryChild().getId();
    CategoryChild child = childRepo.findById(childId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Không tìm thấy thể loại con với id: " + childId));
    book.setCategoryChild(child);
    Book saved = repo.save(book);
    for (int i = 0; i < initialQuantity; i++) {
        String suffix = generateSuffix(i);
        BookChild bc = new BookChild(saved, suffix);
        saved.addChild(bc);
    }
    return repo.save(saved);
}


    private String generateSuffix(int index) {
        StringBuilder sb = new StringBuilder();
        index++;
        while (index > 0) {
            index--;
            sb.insert(0, (char) ('a' + (index % 26)));
            index /= 26;
        }
        return sb.toString();
    }


@Override
@Transactional
public Book updateBook(Long maSach, Map<String, Object> updates) {
    Book book = getBookbyID(maSach);
    updates.forEach((key, value) -> {
        if (value == null) return;

        switch (key) {
            case "tenSach" -> book.setTenSach((String) value);
            case "moTa" -> book.setMoTa((String) value);

            case "tenTacGia" -> book.setTenTacGia((String) value);
            case "nxb" -> book.setNxb((String) value);

            case "nam" -> {
                if (value instanceof Number) {
                    book.setNam(((Number) value).intValue());
                }
            }

            case "trongLuong" -> {
                if (value instanceof Number) {
                    book.setTrongLuong(((Number) value).intValue());
                }
            }

            case "tongSoLuong" -> {
                int newQty = ((Number) value).intValue();
                int currentCount = book.getChildren().size();
                int delta = newQty - currentCount;
                if (delta > 0) {
                    for (int i = 0; i < delta; i++) {
                        String suffix = generateSuffix(currentCount + i);
                        BookChild child = new BookChild(book, suffix);
                        book.addChild(child);
                    }
                }else if (delta < 0) {
                    throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Không thể cập nhật, số sách đang bị giảm. " +
                        "Để xóa, vui lòng chuyển qua chi tiết sách.");
                }
                
            
            }

            case "donGia" -> {
                if (value instanceof Number) {
                    book.setDonGia(((Number) value).intValue());
                }
            }

            case "soLuongMuon" -> {
                if (value instanceof Number) {
                    book.setSoLuongMuon(((Number) value).intValue());
                }
            }

            case "trangThai" -> {
                try {
                    if (value instanceof String) {
                        book.setTrangThai(
                            Book.TrangThai.fromString((String) value)
                        );
                    } else {
                        book.setTrangThai(
                            Book.TrangThai.valueOf(value.toString())
                        );
                    }
                } catch (IllegalArgumentException e) {
                    System.err.println(
                        "Giá trị không hợp lệ cho enum TrangThai: " + value
                    );
                }
            }

            case "hinhAnh" -> {
                if (value instanceof List<?>) {
                    List<String> imgs = ((List<?>) value).stream()
                        .map(Object::toString)
                        .toList();
                    book.setHinhAnh(imgs);
                }
            }
            case "category" -> {
                if (value instanceof Map<?, ?> mapValue) {
                    Object nameObj = mapValue.get("name");
                    if (nameObj instanceof String categoryName) {
                        if (!categoryName.isBlank()) {
                            CategoryChild child = childRepo.findByName(categoryName)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy thể loại: " + categoryName));
                            book.setCategoryChild(child);
                        }
                    }
                }
            }
            
        }
    });

    return repo.save(book);
}

@Override
public List<Book> searchBooks(String author, String category, String publisher, Integer year, boolean sortByBorrowCount) {
    List<Book> books = repo.findAll();

    if (author != null && !author.isBlank()) {
        String a = author.toLowerCase();
        books = books.stream()
            .filter(b -> b.getTenTacGia() != null && b.getTenTacGia().toLowerCase().contains(a))
            .toList();
    }
    if (category != null && !category.isBlank()) {
        String c = category.toLowerCase();
        books = books.stream()
            .filter(b -> b.getCategoryChild() != null && b.getCategoryChild().getName().toLowerCase().contains(c)).toList();
    }
    if (publisher != null && !publisher.isBlank()) {
        String p = publisher.toLowerCase();
        books = books.stream()
            .filter(b -> b.getNxb() != null && b.getNxb().toLowerCase().contains(p))
            .toList();
    }
    if (year != null) {
        books = books.stream()
            .filter(b -> b.getNam() != null && b.getNam().equals(year))
            .toList();
    }

    if (sortByBorrowCount) {
        books = books.stream()
            .sorted(Comparator.comparing(Book::getSoLuongMuon).reversed())
            .toList();
    }

    return books;
}

}
