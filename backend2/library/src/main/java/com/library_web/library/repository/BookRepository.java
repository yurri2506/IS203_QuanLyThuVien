package com.library_web.library.repository;

import com.library_web.library.model.Book;
import com.library_web.library.model.Book.TrangThai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByTenSachAndTenTacGia(String tenSach, String tenTacGia);
    List<Book> findByCategoryChild_Id(String categoryChildId);
    // List<Book> findAllById(List<Long> bookIds);
    List<Book> findByCreatedAtAfter(LocalDate date);
    List<Book> findByTrangThaiNot(TrangThai trangThai);
    List<Book> findByCreatedAtAfterAndTrangThaiNot(LocalDate date, TrangThai trangThai);

    // New method for paginated and filtered search
    @Query("SELECT b FROM Book b WHERE " +
           "(:author IS NULL OR LOWER(b.tenTacGia) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
           "(:category IS NULL OR LOWER(b.categoryChild.name) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
           "(:publisher IS NULL OR LOWER(b.nxb) LIKE LOWER(CONCAT('%', :publisher, '%'))) AND " +
           "(:year IS NULL OR b.nam = :year) AND " +
           "(:title IS NULL OR LOWER(b.tenSach) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "b.trangThai != 'DA_XOA'")
    List<Book> searchBooks(
            @Param("author") String author,
            @Param("category") String category,
            @Param("publisher") String publisher,
            @Param("year") Integer year,
            @Param("title") String title
    );

    // New method for finding books needing restocking
    @Query("SELECT b FROM Book b WHERE b.tongSoLuong < :quantity OR b.trangThai != 'CON_SAN'")
    List<Book> findBooksNeedingRestock(@Param("quantity") int quantity);

}
