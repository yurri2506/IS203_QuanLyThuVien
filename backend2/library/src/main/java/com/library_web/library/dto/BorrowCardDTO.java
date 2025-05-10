package com.library_web.library.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BorrowCardDTO {
  private Long id;
  private String userId;
  private List<String> bookIds;
  private LocalDateTime borrowDate;
  private LocalDateTime dueDate;
  private LocalDateTime getBookDate;
  private String status;
}