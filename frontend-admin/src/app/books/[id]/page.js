"use client";
import React, { useEffect, useState } from "react";
import useSidebarStore from "@/store/sideBarStore";
import Sidebar from "../../components/sidebar/Sidebar";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Undo2, Upload, Trash2, CircleCheck } from "lucide-react";
import toast from "react-hot-toast";
export default function EditBook() {
  const { id } = useParams();
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [deleteOne, setDeleteOne] = useState(null);

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

  // Cho nhập thông tin để cập nhật
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleUpdate = () =>{
    toast.success ('Đã cập nhật sách thành công.') 
  }
  const openDeletePopup = (book) => {
    if (!book) return;
    setDeleteOne(book);
    setPopUpOpen(true);
  };

  const handleDelete = () => {
    if (!deleteOne) return;
    toast.success(`Đã xóa sách: ${deleteOne.TenSach}`);
    setPopUpOpen(false);
    setDeleteOne(null);
    handleBack();
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
          className="px-4 py-2 bg-[#6CB1DA]  hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer rounded-full"
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
            <Input
              className={``}
              name="TenSach"
              value={bookData.TenSach || ""}
              onChange={handleChange}
            />
            <p className="font-bold mb-2 mt-4">Tác giả</p>
            <Input
              className={``}
              name="MaTacGia"
              value={bookData.MaTacGia || ""}
              onChange={handleChange}
            />

            <div className="flex  justify-center gap-8">
              <div className="flex flex-col w-1/2 ">
                <p className="font-bold mb-2 mt-4">Năm xuất bản</p>
                <Input
                  className={``}
                  name="NamXB"
                  value={bookData.NamXB || ""}
                  onChange={handleChange}
                />
                <p className="font-bold mb-2 mt-4">Số lượng</p>
                <Input
                  className={``}
                  name="SoLuongTon"
                  value={bookData.SoLuongTon || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col w-1/2">
                <p className="font-bold mb-2 mt-4">Nhà xuất bản</p>
                <Input
                  className={``}
                  name="MaNXB"
                  value={bookData.MaNXB || ""}
                  onChange={handleChange}
                />
                <p className="font-bold mb-2 mt-4">Thể loai</p>
                <div className="flex justify-between">
                  <Input
                    className={`mr-8`}
                    name="MaTheLoai"
                    value={bookData.MaTheLoai || ""}
                    onChange={handleChange}
                  />
                  <Button
                    className={` bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer`}
                  >
                    Quản lý thể loại
                  </Button>
                </div>
              </div>
            </div>

            <p className="font-bold mb-2 mt-4">Mô tả</p>
            <Input
              className={`h-10`}
              name="MoTa"
              value={bookData.MoTa || ""}
              onChange={handleChange}
            />

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
                  <Button className="flex items-center w-full bg-[#6CB1DA]  hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer mt-2">
                    <Upload className="" />
                    <p className="font-bold">Tải ảnh bìa</p>
                  </Button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center w-full  bg-white mt-20 ">
              <Button
                className="mr-4 text-lg  p-4 bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer"
                onClick={() => openDeletePopup(bookData)}
              >
                <Trash2 className="mr-1" />
                Xóa
              </Button>
              <Button 
                className="ml-4 text-lg p-4  bg-[#6CB1DA]  hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer"
                onClick = {handleUpdate }>
                <CircleCheck className="mr-1" />
                Hoàn tất
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-6">Đang tải dữ liệu...</p>
        )}
      </div>

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
              <div className="flex flex-col gap-[10px] relative w-full">
                <p className="">ID: {deleteOne.MaSach}</p>
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
