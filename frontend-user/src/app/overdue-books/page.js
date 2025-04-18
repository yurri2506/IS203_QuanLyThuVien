"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import ChatBox from "../components/ChatBox";
import Image from "next/image";
import useSidebarStore from "@/store/sidebarStore";

const Page = () => {
  const [bookList, setBookList] = useState([]);

  const fetchBooks = async () => {
    const test = [
      {
        MaSach: "sach1",
        TenSach: "Tuổi thơ dữ dội",
        TacGia: "Nam Cao",
        NhaXB: "Văn học Việt Nam (2019)",
        HinhAnh: "/images/logo.jpg",
        NgayMuon: "12/01/2025",
      },
      {
        MaSach: "sach2",
        TenSach: "Dế mèn phiêu lưu ký",
        TacGia: "Nam Cao",
        NhaXB: "Văn học Việt Nam (2019)",
        HinhAnh: "/images/logo.jpg",
        NgayMuon: "12/01/2025",
      },
      {
        MaSach: "sach3",
        TenSach: "Lão Hạc",
        TacGia: "Nam Cao",
        NhaXB: "Văn học Việt Nam (2019)",
        HinhAnh: "/images/logo.jpg",
        NgayMuon: "12/01/2025",
      },
    ];
    setBookList(test);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const isSidebarOpen = useSidebarStore();

  return (
    <div className="min-h-screen w-full text-foreground bg-[#EFF3FB] relative">
      {/* Sidebar */}
      <LeftSideBar />

      {/* Nội dung chính cố định */}
      <div
        className={`fixed top-16 mt-2 right-0 bottom-0 transition-all duration-300 ${
          isSidebarOpen ? "left-[206px]" : "left-0"
        }`}
      >
        <div className="bg-white rounded-lg shadow-md pt-8 pl-8 pr-0 pb-0 h-full overflow-auto">
          {/* Header */}
          <p className="px-3 py-1 w-fit bg-[#6CB1DA] rounded-xl text-white text-lg font-medium mb-7">
            Sách quá hạn
          </p>
          {/* Danh sách sách */}
          <div className="grid grid-cols-2 gap-x-0 gap-y-6">
            {bookList.map((book) => (
              <div
                key={book.MaSach}
                className="flex flex-row gap-6 p-5 rounded-lg" //them khung: bg-gray-100
              >
                <Image
                  src={book.HinhAnh}
                  width={100}
                  height={150}
                  alt={book.TenSach}
                  className="rounded-md"
                />
                <div className="flex flex-col gap-2">
                  <div className="px-2 py-1/2 bg-red-500 text-white text-sm w-fit rounded-lg font-semibold">
                    Quá hạn
                  </div>
                  <h3 className="font-semibold">{book.TenSach}</h3>
                  <p className="text-sm text-black">Tác giả: {book.TacGia}</p>
                  <p className="text-sm text-black">NXB: {book.NhaXB}</p>
                  <p className="text-sm text-black">Ngày mượn: {book.NgayMuon}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed flex items-center right-4 bottom-4 z-50">
        <ChatBox />
      </div>
    </div>
  );
};

export default Page;
