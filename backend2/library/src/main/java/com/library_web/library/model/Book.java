package com.library_web.library.model;
import jakarta.persistence.*;
import java.util.List;
@Entity

public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maSach;
   // private int id;
    private String tenSach;
    private String moTa;
    private String maTheLoai;
    private String maTacGia;
    private String maNXB;
    private Integer namXB;
    private Integer trongLuong;
    private String tinhTrang;
    private Integer soLTK;
    private Integer donGia;
    private Integer soLuongMuon;

    @ElementCollection
    private List<String> hinhAnh;
    
    public Book(){};
    public Long getmaSach(){
        return maSach;
    }
    public void setmaSach(Long maSach){
        this.maSach= maSach;
    }
    public String gettenSach(){
        return tenSach;
    }
    public void settenSach(String tenSach){
        this.tenSach= tenSach;
    }
    public String getmoTa(){
        return moTa;
    }
    public void setmoTa(String moTa){
        this.moTa= moTa;
    }
    public String getmaTheLoai(){
        return maTheLoai;
    }
    public void setmaTheLoai(String maTheLoai){
        this.maTheLoai= maTheLoai;
    }
    public String getmaTacGia(){
        return maTacGia;
    }
    public void setmaTacGia(String maTacGia){
        this.maTacGia= maTacGia;
    }
    public String getmaNXB(){
        return maNXB;
    }
    public void setmaNXB(String maNXB){
        this.maNXB= maNXB;
    }
    public Integer getnamXB(){
        return namXB;
    }
    public void setnamXB(Integer namXB){
        this.namXB= namXB;
    }
    public Integer gettrongLuong(){
        return trongLuong;
    }
    public void settrongLuong(Integer trongLuong){
        this.trongLuong= trongLuong;
    }
    public String gettinhTrang(){
        return tinhTrang;
    }
    public void settinhTrang(String tinhTrang){
        this.tinhTrang= tinhTrang;
    }
    public Integer getsoLTK(){
        return soLTK;
    }
    public void setsoLTK(Integer soLTK){
        this.soLTK= soLTK;
    }
    public Integer getdonGia(){
        return donGia;
    }
    public void setdonGia(Integer donGia){
        this.donGia= donGia;
    }

    public Integer getsoLuongMuon(){
        return soLuongMuon;
    }
    public void setsoLuongMuon(Integer soLuongMuon){
        this.soLuongMuon= soLuongMuon;
    }

    public List<String> getHinhAnh() {
        return hinhAnh;
    }
    
    public void setHinhAnh(List<String> hinhAnh) {
        this.hinhAnh = hinhAnh;
    }
    
}