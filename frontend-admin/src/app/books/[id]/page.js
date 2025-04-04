"use client";
import React, { useEffect, useState } from "react";
import useSidebarStore from "@/store/sideBarStore";
import Sidebar from "../../components/sidebar/Sidebar";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Undo2, Upload, Trash2, CircleCheck, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";

export default function EditBook() {
  const { id } = useParams(); // Lấy ID từ URL params
  const { isSidebarOpen, toggleSidebar } = useSidebarStore(); // Lấy trạng thái sidebar từ store
  const router = useRouter(); // Dùng router để điều hướng
  const [popUpOpen, setPopUpOpen] = useState(false); // Quản lý trạng thái popup xóa
  const [deleteOne, setDeleteOne] = useState(null); // Quản lý sách cần xóa
  const [bookData, setBookData] = useState(null); // Dữ liệu sách cần chỉnh sửa

  const handleBack = () => {
    router.push(`/books`); // Quay lại danh sách sách
  };

  useEffect(() => {
    fetchBook(); // Lấy dữ liệu sách khi component mount hoặc khi ID thay đổi
  }, [id]);

  const fetchBook = async () => {
    // Dữ liệu giả để mô phỏng việc lấy thông tin sách
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

    const bookId = Number(id); // Chuyển ID sang số
    const foundBook = test.find((book) => book.MaSach === bookId); // Tìm sách theo ID
    setBookData(foundBook || null); // Cập nhật dữ liệu sách

    if (!foundBook ) {
      toast.error("Không tìm thấy sách với ID: " + id); // Chỉ hiển thị toast một lần
      
      router.push("/books"); // Nếu không tìm thấy sách, quay lại trang danh sách sách
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // Lấy name và value từ input
    setBookData((prevData) => ({
      ...prevData,
      [name]: value, // Cập nhật dữ liệu sách theo name
    }));
  };

  const handleUpdate = () => {
    toast.success('Đã cập nhật sách thành công.'); // Thông báo cập nhật thành công
  };

  const openDeletePopup = (book) => {
    if (!book) return;
    setDeleteOne(book); // Cập nhật sách cần xóa
    setPopUpOpen(true); // Mở popup xóa
  };

  const handleDelete = () => {
    if (!deleteOne) return;
    toast.success(`Đã xóa sách: ${deleteOne.TenSach}`); // Thông báo xóa thành công
    setPopUpOpen(false); // Đóng popup xóa
    setDeleteOne(null); // Xóa sách khỏi state
    handleBack(); // Quay lại danh sách sách
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
          className="px-4 py-2 bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer rounded-full"
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
            <p className="font-bold mb-2 mt-8">Tên sách</p>
            <Input
              name="TenSach"
              value={bookData.TenSach || ""}
              onChange={handleChange}
            />
            <p className="font-bold mb-2 mt-8">Tác giả</p>
            <Input
              name="MaTacGia"
              value={bookData.MaTacGia || ""}
              onChange={handleChange}
            />

            <div className="flex justify-center gap-8">
              <div className="flex flex-col w-1/2">
                <p className="font-bold mb-2 mt-8">Năm xuất bản</p>
                <Input
                  name="NamXB"
                  value={bookData.NamXB || ""}
                  onChange={handleChange}
                />
                <p className="font-bold mb-2 mt-8">Số lượng</p>
                <Input
                  name="SoLuongTon"
                  value={bookData.SoLuongTon || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col w-1/2">
                <p className="font-bold mb-2 mt-8">Nhà xuất bản</p>
                <Input
                  name="MaNXB"
                  value={bookData.MaNXB || ""}
                  onChange={handleChange}
                />
                <p className="font-bold mb-2 mt-8">Thể loai</p>
                <div className="flex justify-between">
                  <Input
                    className="mr-8"
                    name="MaTheLoai"
                    value={bookData.MaTheLoai || ""}
                    onChange={handleChange}
                  />
                  <Button
                    className="bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer"
                  >
                    <LayoutGrid />
                    Quản lý thể loại
                  </Button>
                </div>
              </div>
            </div>

            <p className="font-bold mb-2 mt-8">Mô tả</p>
            <Input
              className="h-10"
              name="MoTa"
              value={bookData.MoTa || ""}
              onChange={handleChange}
            />

            <p className="font-bold mb-2 mt-8">Hình ảnh</p>
            <div className="flex">
              {bookData.HinhAnh.map((image, index) => (
                <div key={index} className="flex flex-col justify-between items-center w-40 mr-10">
                  <img
                    //src={image} //Khi nào có dữ liệu ảnh thì sài cái này 
                    src={"/test.webp"} // Placeholder image
                    alt={`Hình ảnh ${index + 1}`}
                    className="rounded-[10px] border-[2px] border-gray-300"
                  />
                  <Button className="flex items-center w-full bg-[#6CB1DA] mt-4 hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer">
                    <Upload />
                    <p className="font-bold">{index === 0 ? "Tải ảnh bìa" : "Tải ảnh xem trước"}</p>
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end items-center w-full mt-20">
              <Button
                className="mr-4 text-lg p-4 bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer"
                onClick={() => openDeletePopup(bookData)}
              >
                <Trash2 className="mr-1" />
                Xóa
              </Button>
              <Button
                className="ml-4 text-lg p-4 bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer"
                onClick={handleUpdate}
              >
                <CircleCheck className="mr-1" />
                Hoàn tất
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-6">Đang tải dữ liệu...</p>
        )}
      </div>

      {/* Popup xác nhận xóa */}
      {popUpOpen && deleteOne && (
        <div className="fixed inset-0 items-center justify-center z-40 flex">
          <div className="w-full h-full bg-black opacity-[80%] absolute top-0 left-0"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-120 fixed z-50">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa sách này không?</p>
            <div className="flex bg-white w-full rounded-lg mt-2 relative p-5 gap-[20px] md:gap-[50px] items-center">
              <img
                src={deleteOne.HinhAnh?.[0] || "/test.webp"}
                className="w-[145px] h-[205px]"
              />
              <div className="flex flex-col gap-[10px] w-full">
                <p>ID: {deleteOne.MaSach}</p>
                <p className="font-bold">{deleteOne.TenSach}</p>
                <p className="italic">{deleteOne.MaTacGia}</p>
                <p className="italic">{deleteOne.MaTheLoai}</p>
                <p className="italic">Số lượng tồn: {deleteOne.SoLuongTon}</p>
                <p className="italic">Số lượng mượn: {deleteOne.SoLuongMuon}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                className="bg-gray-500 hover:bg-gray-700 text-white"
                onClick={() => setPopUpOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-700 text-white"
                onClick={() => handleDelete(deleteOne)}
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
