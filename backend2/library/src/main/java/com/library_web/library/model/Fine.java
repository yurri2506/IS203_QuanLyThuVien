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

  private String orderId;

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

  public String getOrderId() {
    return orderId;
  }

  public void setOrderId(String orderId) {
    this.orderId = orderId;
  }
  public TrangThai getTrangThai() {
    return trangThai;
  }
  public void setTrangThai(TrangThai trangThai) {
    this.trangThai = trangThai;
  }
  public LocalDateTime getNgayThanhToan() {
    return ngayThanhToan;
  }
  public void setNgayThanhToan(LocalDateTime ngayThanhToan) {
    this.ngayThanhToan = ngayThanhToan;
  }
  public User getUserId() {
    return userId;
  }
  public void setUserId(User userId) {
    this.userId = userId;
  }
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public double getSoTien() {
    return soTien;
  }
  public void setSoTien(double soTien) {
    this.soTien = soTien;
  }
  public String getNoiDung() {
    return noiDung;
  }
  public void setNoiDung(String noiDung) {
    this.noiDung = noiDung;
  }
  public BorrowCard getCardId() {
    return cardId;
  }
  public void setCardId(BorrowCard cardId) {
    this.cardId = cardId;
}
}