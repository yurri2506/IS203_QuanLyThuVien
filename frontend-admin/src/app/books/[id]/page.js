"use client";
import React, { useEffect, useState } from "react";
import useSidebarStore from "@/store/sideBarStore";
import Sidebar from "../../components/sidebar/Sidebar";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Undo2, Upload,Trash2, CircleCheck } from "lucide-react";

export default function EditBook() {
  const { id } = useParams();
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();

  const [bookData, setBookData] = useState(null);

  const handleBack = () => {
    router.push(`/books`);
  };

  useEffect(() => {
    fetchBook();
  }, [id]); // Chạy lại mỗi khi ID thay đổi

  const fetchBook = async () => {
    const test = [
      {
        MaSach: 1,
        TenSach: "Tên sách 1",
        MoTa: "Mo ta mau",
        MaTheLoai: "ma the loai",
        MaTacGia: "ma tac gia",
        MaNXB: "ma nha xuat ban",
        NamXB: "nam xuat ban",
        TrongLuong: "trong luong",
        TinhTrang: "tinh trang",
        SoLTK: "so luu tru kho",
        DonGia: "don gia",
        HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
        SoLuongTon: 70,
        SoLuongMuon: 3,
      },
      {
        MaSach: 2,
        TenSach: "Tên sách 2",
        MoTa: "Mo ta mau",
        MaTheLoai: "ma the loai",
        MaTacGia: "ma tac gia",
        MaNXB: "ma nha xuat ban",
        NamXB: "nam xuat ban",
        TrongLuong: "trong luong",
        TinhTrang: "tinh trang",
        SoLTK: "so luu tru kho",
        DonGia: "don gia",
        HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
        SoLuongTon: 70,
        SoLuongMuon: 3,
      },
      {
        MaSach: 3,
        TenSach: "Tên sách 3",
        MoTa: "Mo ta mau",
        MaTheLoai: "ma the loai",
        MaTacGia: "ma tac gia",
        MaNXB: "ma nha xuat ban",
        NamXB: "nam xuat ban",
        TrongLuong: "trong luong",
        TinhTrang: "tinh trang",
        SoLTK: "so luu tru kho",
        DonGia: "don gia",
        HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
        SoLuongTon: 70,
        SoLuongMuon: 3,
      },
      {
        MaSach: 4,
        TenSach: "Tên sách 4",
        MoTa: "Mo ta mau",
        MaTheLoai: "ma the loai",
        MaTacGia: "ma tac gia",
        MaNXB: "ma nha xuat ban",
        NamXB: "nam xuat ban",
        TrongLuong: "trong luong",
        TinhTrang: "tinh trang",
        SoLTK: "so luu tru kho",
        DonGia: "don gia",
        HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
        SoLuongTon: 70,
        SoLuongMuon: 3,
      },
    ];

    const bookId = Number(id);
    const foundBook = test.find((book) => book.MaSach === bookId); // Sửa books thành test
    setBookData(foundBook || null);

    // Nếu không tìm thấy sách, redirect về trang /books
    if (!foundBook) {
      console.error("Không tìm thấy sách với ID:", id);
      router.push("/books");
    }
  };

  return (
    <div className="flex bg-[#F4F7FE] min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 py-6 px-10 transition-all duration-300 ${
          isSidebarOpen ? "ml-0 md:ml-64" : "ml-0"
        }`}
      >
        {/* Nút quay lại */}
        <Button
          className="px-4 py-2 bg-[#6CB1DA] rounded-full"
          onClick={handleBack}
        >
          <Undo2 className="w-10 h-10 text-white" />
        </Button>

        {/* Nội dung chính */}
        {bookData ? (
          <div className="flex flex-col w-full bg-white p-8 mt-6 rounded-[10px] border-[2px] border-gray-300">
            <p className="font-bold mb-2">ID (Tự Động)</p>
            <Input
              value={bookData.MaSach}
              readOnly
              className="bg-gray-200 cursor-not-allowed"
            />
            <p className="font-bold mb-2 mt-4">Tên sách</p>
            <Input value={bookData.TenSach} className="" />
            <p className="font-bold mb-2 mt-4">Tác giả</p>
            <Input value={bookData.MaTacGia} className="" />

            <div className="flex  justify-center gap-8">
              <div className="flex flex-col w-1/2 ">
                <p className="font-bold mb-2 mt-4">Năm xuất bản</p>
                <Input value={bookData.NamXB} className="" />
                <p className="font-bold mb-2 mt-4">Số lượng</p>
                <Input value={bookData.SoLuongTon} className="" />
              </div>

              <div className="flex flex-col w-1/2">
                <p className="font-bold mb-2 mt-4">Nhà xuất bản</p>
                <Input value={bookData.MaNXB} className="" />
                <p className="font-bold mb-2 mt-4">Thể loai</p>
                <div className="flex justify-between">
                <Input value={bookData.MaTheLoai} className="" />
                <Button>
                  Quản lý thể loại
                </Button>

                </div>
              </div>
            </div>

            <p className="font-bold mb-2 mt-4">Mô tả</p>
            <Input value={bookData.MoTa} className="" />

            <p className="font-bold mb-2 mt-4">Hình ảnh</p>
            {/* Sài khi dữ liệu đã có săn ảnh sách */}
            {/* <div className="flex">
              {bookData.HinhAnh.map((image, index) => (
                <div key={index} className="mr-4">
                  <img
                    src={image}
                    alt={`Hình ảnh ${index + 1}`}
                    className="w-[145px] h-[205px]"
                  />
                  <Button className="flex items-center w-full bg-[#6CB1DA] mt-2">
                    <Upload className="" />
                    <p className="font-bold">Tải ảnh bìa</p>
                  </Button>
                </div>
              ))}
            </div> */}

            {/* Sài để test */}
            <div className="flex justify-between ">
              {bookData.HinhAnh.map(() => (
                <div className="mr-4">
                  <img
                    src="/test.webp" // Ví dụ ảnh thay thế khi chưa có dữ liệu
                    alt="HinhAnh[0]" // Dùng một alt cố định
                    className="w-[145px] h-[205px] rounded-[10px] border-[2px] border-gray-300"
                  />
                  <Button className="flex items-center w-full bg-[#6CB1DA] mt-2">
                    <Upload className="" />
                    <p className="font-bold">Tải ảnh bìa</p>
                  </Button>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <p className="mt-6">Đang tải dữ liệu...</p>
        )}
            {/* Footer */}
            <div className="flex justify-end items-center w-full  bg-white p-6 mt-6 rounded-[10px] border-[2px] border-gray-300">
              <Button className="mr-4 text-lg  p-4 bg-[#6CB1DA]">
                <Trash2 className="mr-1" />
                Xóa
              </Button>
              <Button className="mr-4 text-lg p-4  bg-[#6CB1DA]">
                <CircleCheck className="mr-1" />
                Hoàn tất
              </Button>
            </div>
      </div>
    </div>
  );
}
