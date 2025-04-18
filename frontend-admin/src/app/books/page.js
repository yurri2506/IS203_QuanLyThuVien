"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";
import { Menu, Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useSidebarStore from "@/store/sideBarStore";

const Page = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [bookList, setBookList] = useState(null);
  const [filterBooks, setFilterBooks] = useState([]);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [deleteOne, setDeleteOne] = useState(null);

  const handleSearch = () => {
    if (searchQuery) {
      const filterBook = bookList.filter((book) =>
        book.MaSach.toString() === searchQuery ||
        book?.TenSach.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book?.MaTheLoai?.toLowerCase().includes(searchQuery.toLowerCase())
          ? book
          : null
      );
      if (filterBook.length < 1) toast.error("Không tìm thấy kết quả");
      setFilterBooks(filterBook);
    } else {
      setFilterBooks([]);
    }
  };

  const router = useRouter();
  const handleAddBook = () => {
    router.push(`/books/addBook`);
  };
  const handleEdit = (MaSach) => {
    router.push(`/books/${MaSach}`);
  };

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
    setBookList(test);
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const handleDelete = async (book) => {
    setDeleteOne(null);
    setPopUpOpen(false);
    toast.success("Xóa sách thành công");
  };

  const BookCard = ({ book }) => {
    return (
      <div className="flex bg-white w-full rounded-lg mt-6 relative drop-shadow-lg p-5 gap-[20px] md:gap-[50px] items-center">
        <img src={`${book.HinhAnh[0]}`} className="w-[145px] h-[205px]" />
        <div className="flex flex-col gap-[10px] relative w-full">
          <p className="">ID: {book.MaSach}</p>
          <p className="font-bold">{book.TenSach}</p>
          <p className="italic">{book.MaTacGia}</p>
          <p className="italic">{book.MaTheLoai}</p>
          <p className="">Số lượng tồn: {book.SoLuongTon}</p>
          <div className="w-full flex justify-end gap-5 md:gap-10">
            <Button
              className="w-10 md:w-40 h-10 bg-[#062D76] hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                handleEdit(book.MaSach);
              }}
            >
              <Pencil className="w-5 h-5" color="white" />
              <p className="hidden md:block">Sửa sách</p>
            </Button>
            <Button
              className="w-10 md:w-40 h-10 bg-[#D66766] hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setDeleteOne(book);
                setPopUpOpen(true);
              }}
            >
              <Trash2 className="w-5 h-5" color="white" />
              <p className="hidden md:block">Xóa sách</p>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-[#EFF3FB] min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 py-6 px-10 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        {/* Nội dung chính */}
        <div className="flex w-full items-center justify-between mb-10">
          <div className="flex gap-5">
            <Input
              type="text"
              placeholder="Tìm kiếm"
              className="w-64 md:w-96 h-10 font-thin italic text-black text-lg bg-white rounded-[10px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className="w-10 h-10 cursor-pointer text-[20px] bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px] overflow-hidden"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5" color="white" />
            </Button>
          </div>
          <Button
            className="w-40 h-10 cursor-pointer bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px] overflow-hidden"
            onClick={handleAddBook}
          >
            <Plus className="w-5 h-5" color="white" />
            Thêm sách mới
          </Button>
        </div>
        {bookList &&
          (filterBooks.length > 0
            ? filterBooks.map((book) => (
                <BookCard key={book?.MaSach} book={book} />
              ))
            : bookList.map((book) => (
                <BookCard key={book?.MaSach} book={book} />
              )))}
      </div>
      {popUpOpen && (
        <div className="fixed inset-0 items-center justify-center z-40 flex">
          <div className="w-full h-full bg-black opacity-[80%] absolute top-0 left-0"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-120 fixed z-50">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa sách này không?</p>
            <div className="flex bg-white w-full rounded-lg mt-2 relative p-5 gap-[20px] md:gap-[50px] items-center">
              <img
                src={`${deleteOne.HinhAnh[0]}`}
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
};

export default Page;