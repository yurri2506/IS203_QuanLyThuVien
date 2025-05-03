package com.library_web.library.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maSach;             
    private String tenSach;
    private String moTa;
    private String tenTacGia;
    private String nxb;
    private Integer nam;
    private Integer trongLuong;
    private Integer donGia;
    private Integer tongSoLuong = 0;
    private Integer soLuongMuon = 0;
    private Integer soLuongXoa = 0;

    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    @ElementCollection
    private List<String> hinhAnh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_child_id")
    private CategoryChild categoryChild;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookChild> children = new ArrayList<>();

    public enum TrangThai {
        CON_SAN("Còn sẵn"),
        DA_XOA("Đã xóa"),
        DA_HET("Đã hết"); 

        private final String moTa;
        TrangThai(String moTa) { this.moTa = moTa; }
        public String getMoTa() { return moTa; }
        public static TrangThai fromString(String name) {
            try { return TrangThai.valueOf(name.toUpperCase()); }
            catch (IllegalArgumentException e) { throw new IllegalArgumentException("Trạng thái không hợp lệ: " + name); }
        }
    }

    public Book() {
        this.trangThai = TrangThai.CON_SAN;
    }

    // getters & setters
    public Long getMaSach() { return maSach; }
    public String getTenSach() { return tenSach; }
    public void setTenSach(String tenSach) { this.tenSach = tenSach; }
    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }
    public String getTenTacGia() { return tenTacGia; }
    public void setTenTacGia(String tenTacGia) { this.tenTacGia = tenTacGia; }
    public String getNxb() { return nxb; }
    public void setNxb(String nxb) { this.nxb = nxb; }
    public Integer getNam() { return nam; }
    public void setNam(Integer nam) { this.nam = nam; }
    public Integer getTrongLuong() { return trongLuong; }
    public void setTrongLuong(Integer trongLuong) { this.trongLuong = trongLuong; }
    public Integer getDonGia() { return donGia; }
    public void setDonGia(Integer donGia) { this.donGia = donGia; }
    public Integer getTongSoLuong() { return tongSoLuong; }
    public void setTongSoLuong(Integer tongSoLuong) { this.tongSoLuong = tongSoLuong; }
    public Integer getSoLuongMuon() { return soLuongMuon; }
    public void setSoLuongMuon(Integer soLuongMuon) { this.soLuongMuon = soLuongMuon; }
    public TrangThai getTrangThai() { return trangThai; }
    public void setTrangThai(TrangThai trangThai) { this.trangThai = trangThai; }
    public List<String> getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(List<String> hinhAnh) { this.hinhAnh = hinhAnh; }
    public List<BookChild> getChildren() { return children; }
    public void setChildren(List<BookChild> children) { this.children = children; }
    public Integer getSoLuongXoa() { return soLuongXoa; }
    public void setSoLuongXoa(Integer soLuongXoa) { this.soLuongXoa = soLuongXoa; }

    public CategoryChild getCategoryChild() { return categoryChild; }
    public void setCategoryChild(CategoryChild categoryChild) { this.categoryChild = categoryChild; }
    
    // helper methods
    public void addChild(BookChild c) {
        if (!children.contains(c)) {
            children.add(c);
            c.setBook(this);
            tongSoLuong++;
        }
    }

    public void decreaseTotalQuantity() {
        if (tongSoLuong > 0) {
            tongSoLuong--;
        }
    }

    

    public void onBorrow() {
        if (tongSoLuong - getCurrentBorrowedCount() < 0) {
            throw new IllegalStateException("Hết sách để mượn");
        }
        soLuongMuon++;
    }

    public int getCurrentBorrowedCount() {
        return (int) children.stream().filter(c -> c.getStatus() == BookChild.Status.BORROWED).count();
    }

    public void onReturn() {
        if (soLuongMuon <= 0) throw new IllegalStateException("Không có sách nào đang mượn");
    }
    public void updateTrangThai() {
        int borrowed = this.getCurrentBorrowedCount();
        int available = this.getTongSoLuong() - borrowed;
    
        int soLuongXoa = this.getSoLuongXoa() != null ? this.getSoLuongXoa() : 0;
    
        if (this.getTongSoLuong() == 0 || available == 0) {
            this.trangThai = TrangThai.DA_HET;
        } else if (soLuongXoa >= this.getTongSoLuong()) {
            this.trangThai = TrangThai.DA_XOA;
        } else {
            this.trangThai = TrangThai.CON_SAN;
        }
    }
    
    
}
