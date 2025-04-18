package com.library_web.library.service;

import com.library_web.library.model.Book;
import com.library_web.library.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    
    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    
    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    @Override
    public Book addBook(Book book) {
        Optional<Book> existingBookOpt = bookRepository.findByTenSachAndMaTacGia(
            book.gettenSach(), book.getmaTacGia()
        );
        if (existingBookOpt.isPresent()) {
            Book existingBook = existingBookOpt.get();
            existingBook.setsoLTK(existingBook.getsoLTK() + book.getsoLTK());
            return bookRepository.save(existingBook);
        } else {
            return bookRepository.save(book);
        }
    }
    
    @Override
    public void delBook(Long maSach) {
        if (!bookRepository.existsById(maSach)) {
            throw new RuntimeException("Không tìm thấy sách có mã sách là: " + maSach);
        }
        bookRepository.deleteById(maSach);
    }
    
    @Override
    public Book getBookbyID(Long maSach) {
        return bookRepository.findById(maSach)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách có mã sách là: " + maSach));
    }
    
    @Override
    public Book updateBook(Long maSach, Map<String, Object> updates) {
        Book book = bookRepository.findById(maSach).orElseThrow(() -> new RuntimeException("Không tìm thấy sách có mã sách là: " + maSach));
        
        updates.forEach((key, value) -> {
            switch (key) {
                case "tenSach" -> book.settenSach((String) value);
                case "moTa" -> book.setmoTa((String) value);
                case "maTheLoai" -> book.setmaTheLoai((String) value);
                case "maTacGia" -> book.setmaTacGia((String) value);
                case "maNXB" -> book.setmaNXB((String) value);
                case "namXB" -> {
                    if (value instanceof Number num) {
                        book.setnamXB(num.intValue());
                    }
                }
                case "trongLuong" -> {
                    if (value instanceof Number num) {
                        book.settrongLuong(num.intValue());
                    }
                }
                case "tinhTrang" -> book.settinhTrang((String) value);
                case "soLTK" -> {
                    if (value instanceof Number num) {
                        book.setsoLTK(num.intValue());
                    }
                }
                case "donGia" -> {
                    if (value instanceof Number num) {
                        book.setdonGia(num.intValue());
                    }
                }
                case "soLuongMuon" -> {
                    if (value instanceof Number num) {
                        book.setsoLuongMuon(num.intValue());
                    }
                }
                case "hinhAnh" -> {
                    if (value instanceof java.util.List<?> list) {
                        // Chuyển các phần tử trong list sang String
                        List<String> newImages = new ArrayList<>();
                    for (Object obj : list) {
                        newImages.add(obj.toString());
                    }
                    book.setHinhAnh(newImages);

                    }
                }
                default -> {}
            }
        });
        
        return bookRepository.save(book);
    }
}