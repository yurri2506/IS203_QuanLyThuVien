package com.library_web.library.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;
import java.util.List;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowCard {
    @Id
    private String id; // id của phiếu mượn
    private String userId; // id của người mượn sách
    private List<String> bookIds; // danh sách id của sách được mượn
    private LocalDateTime borrowDate; // ngày mượn sách
    private LocalDateTime dueDate; // ngày trả 
    private LocalDateTime getDateBook; // ngày lấy sách
    private String status; // trạng thái của phiếu mượn

    // Enum cho trạng thái của phiếu mượn
    public enum Status {
      REQUESTED("Đã yêu cầu"),
      BORROWED("Đang mượn"),
      EXPIRED("Đã hết hạn"),
      RETURNED("Đã trả"),
      CANCELLED("Đã hủy"),

      private final String statusDescription;

      Status(String statusDescription) {
          this.statusDescription = statusDescription;
      }
      public String getStatusDescription() {
          return statusDescription;
      }
    }

    public 

    
}
