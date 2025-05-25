package com.library_web.library.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "fine")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fine {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User userId;

  private double soTien;
  private String noiDung;

  @ManyToOne
  @JoinColumn(name = "borrow_card_id")
  private BorrowCard cardId;

  private TrangThai trangThai;
  private LocalDateTime ngayThanhToan;

  public enum TrangThai {
    CHUA_THANH_TOAN("Chưa Thanh Toán"),
    DA_THANH_TOAN("Đã Thanh Toán");

    private final String moTa;

    TrangThai(String moTa) {
      this.moTa = moTa;
    }

    public String getMoTa() {
      return moTa;
    }
  }
}
