package com.library_web.library.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "borrowed_books")
public class BorrowedBook {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "borrow_card_id", nullable = false)
  private BorrowCard borrowCard; // Quan hệ ngược với BorrowCard

  @Column(name = "book_id")
  private Long bookId;

  @Column(name = "child_book_id")
  private String childBookId;

  public BorrowedBook(Long bookId, String childBookId) {
    this.bookId = bookId;
    this.childBookId = childBookId;
  }

  public void setBookId(Long bookId) {
    this.bookId = bookId;
  }

  public void setChildBookId(String childBookId) {
    this.childBookId = childBookId;
  }

  public Long getBookId() {
    return bookId;
  }

  public String getChildBookId() {
    return childBookId;
  }

  // The constructor is removed because @AllArgsConstructor generates it
  // automatically.
}