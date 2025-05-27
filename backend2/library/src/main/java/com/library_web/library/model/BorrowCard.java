// package com.library_web.library.model;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.LocalDateTime;
// import java.util.List;

// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Entity
// @Table(name = "borrow_cards")
// public class BorrowCard {

//   @Id
//   @GeneratedValue(strategy = GenerationType.IDENTITY)
//   private Long id; // id tự tăng

//   @Column(name = "user_id", nullable = false)
//   private Long userId;

//   @ElementCollection
//   @CollectionTable(name = "borrowed_books", joinColumns = @JoinColumn(name = "borrow_card_id"))
//   @Column(name = "book_id")
//   private List<Long> bookIds;
//   @Column(name = "child_book_id")
//   private List<Long> childBookIds;

//   @Column(name = "borrow_date", nullable = false)
//   private LocalDateTime borrowDate;

//   @Column(name = "due_date")
//   private LocalDateTime dueDate;

//   @Column(name = "get_book_date")
//   private LocalDateTime getBookDate;

//   @Column(name = "status", nullable = false)
//   private String status;

//   public enum Status {
//     REQUESTED("Đã yêu cầu"),
//     BORROWED("Đang mượn"),
//     EXPIRED("Đã hết hạn"),
//     RETURNED("Đã trả"),
//     CANCELLED("Đã hủy");

//     private final String statusDescription;

//     Status(String statusDescription) {
//       this.statusDescription = statusDescription;
//     }

//     public String getStatusDescription() {
//       return statusDescription;
//     }
//   }

//   public void updateStatus(Status status) {
//     this.status = status.getStatusDescription();
//     if (status == Status.BORROWED && dueDate != null && LocalDateTime.now().isAfter(dueDate)) {
//       this.status = Status.EXPIRED.getStatusDescription();
//     }
//   }

//   // Constructor để khởi tạo phiếu mượn mới
//   public BorrowCard(Long userId, LocalDateTime borrowDate,int waitingToTake, List<Long> bookIds) {
//     this.userId = userId;
//     this.borrowDate = LocalDateTime.now();
//     this.getBookDate = borrowDate.plusDays(waitingToTake);
//     this.dueDate = borrowDate.plusDays(14);
//     this.bookIds = bookIds;
//     this.status = Status.REQUESTED.getStatusDescription();
//   }
// }

package com.library_web.library.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "borrow_cards")
public class BorrowCard {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;
  
  @OneToMany(mappedBy = "borrowCard", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<BorrowedBook> borrowedBooks = new ArrayList<>();

  @Column(name = "borrow_date", nullable = false)
  private LocalDateTime borrowDate;

  @Column(name = "due_date")
  private LocalDateTime dueDate;

  @Column(name = "get_book_date")
  private LocalDateTime getBookDate;

  @Column(name = "status", nullable = false)
  private String status;

  private Integer soNgayTre;

  public enum Status {
    REQUESTED("Đã yêu cầu"),
    BORROWED("Đang mượn"),
    EXPIRED("Đã hết hạn"),
    RETURNED("Đã trả"),
    CANCELLED("Đã hủy");

    private final String statusDescription;

    Status(String statusDescription) {
      this.statusDescription = statusDescription;
    }

    public String getStatusDescription() {
      return statusDescription;
    }
  }

  public void updateStatus(Status status) {
    this.status = status.getStatusDescription();
    if (status == Status.BORROWED && dueDate != null && LocalDateTime.now().isAfter(dueDate)) {
      this.status = Status.EXPIRED.getStatusDescription();
    }
  }

  // Constructor để khởi tạo phiếu mượn mới
  public BorrowCard(Long userId, LocalDateTime borrowDate, int waitingToTake, List<BorrowedBook> borrowedBooks) {
    this.userId = userId;
    this.borrowDate = LocalDateTime.now();
    this.getBookDate = borrowDate.plusDays(waitingToTake);
    this.dueDate = borrowDate.plusDays(14);
    this.borrowedBooks = borrowedBooks;
    this.status = Status.REQUESTED.getStatusDescription();
  }

  public List<String> getBookIds() {
    return borrowedBooks.stream()
        .map(BorrowedBook::getChildBookId)
        .collect(Collectors.toList());
  }

  public List<Long> getParentBookIds() {
    return borrowedBooks.stream()
        .map(BorrowedBook::getBookId)
        .collect(Collectors.toList());
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public List<BorrowedBook> getBorrowedBooks() {
    return borrowedBooks;
  }

  public void setBorrowedBooks(List<BorrowedBook> borrowedBooks) {
    this.borrowedBooks = borrowedBooks;
  }

  public LocalDateTime getBorrowDate() {
    return borrowDate;
  }

  public void setBorrowDate(LocalDateTime borrowDate) {
    this.borrowDate = borrowDate;
  }

  public LocalDateTime getDueDate() {
    return dueDate;
  }

  public void setDueDate(LocalDateTime dueDate) {
    this.dueDate = dueDate;
  }

  public LocalDateTime getGetBookDate() {
    return getBookDate;
  }

  public void setGetBookDate(LocalDateTime getBookDate) {
    this.getBookDate = getBookDate;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

}
