package com.library_web.library.dto;

import java.time.LocalDateTime;

public class FineDTO {
  private Long userId;
  private Long borrowCardId;
  private String noiDung;
  private int soTien;
  private TrangThai trangThai;
  private LocalDateTime ngayThanhToan;

  public FineDTO() {
  }
  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Long getBorrowCardId() {
    return borrowCardId;
  }

  public void setBorrowCardId(Long borrowCardId) {
    this.borrowCardId = borrowCardId;
  }

  public String getNoiDung() {
    return noiDung;
  }

  public void setNoiDung(String noiDung) {
    this.noiDung = noiDung;
  }

  public int getSoTien() {
    return soTien;
  }

  public void setSoTien(int soTien) {
    this.soTien = soTien;
  }

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