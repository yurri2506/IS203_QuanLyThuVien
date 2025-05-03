"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import ChatBox from "../components/ChatBoxButton";
import Image from "next/image";
import useSidebarStore from "@/store/sideBarStore";

const BookStatus = ({ status }) => {
  return (
    <div
      className={`px-2 py-1 text-white w-fit text-sm font-medium rounded-lg flex items-center gap-1 ${
        status === "Còn sẵn" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <span>{status}</span>
      <span
        className={`w-2 h-2 rounded-full ${
          status === "Còn sẵn" ? "bg-green-300" : "bg-red-300"
        }`}
      ></span>
    </div>
  );
};

const Page = () => {
  const [bookList, setBookList] = useState([]);

  const fetchBook = async () => {
    const test = [
      {
        MaSach: "id sach",
        TenSach: "Tên sách 1",
        MoTa: "Mo ta mau",
        MaTheLoai: "ma the loai",
        MaTacGia: "ma tac gia",
        NhaXB: "nha xuat ban",
        HinhAnh: ["/images/test.webp", "3133331", "313213131", "31313123"],
        SoLuongTon: 70,
        SoLuongMuon: 3,
      },
      {
        MaSach: "id sach2",
        TenSach: "Tên sách 2",
        MoTa: "Mo ta mau",
        MaTheLoai: "ma the loai",
        MaTacGia: "ma tac gia",
        NhaXB: "nha xuat ban",
        HinhAnh: ["/images/test.webp", "3133331", "313213131", "31313123"],
        SoLuongTon: 70,
        SoLuongMuon: 3,
      },
      {
        MaSach: "id sach3",
        TenSach: "Tên sách 3",
        MoTa: "Mo ta mau",
        MaTheLoai: "ma the loai",
        MaTacGia: "ma tac gia",
        NhaXB: "nha xuat ban",
        HinhAnh: ["/images/test.webp", "3133331", "313213131", "31313123"],
        SoLuongTon: 70,
        SoLuongMuon: 3,
      },
      {
        MaSach: "id sach4",
        TenSach: "Tên sách 4",
        MoTa: "Mo ta mau",
        MaTheLoai: "ma the loai",
        MaTacGia: "ma tac gia",
        NhaXB: "nha xuat ban",
        HinhAnh: ["/images/test.webp", "3133331", "313213131", "31313123"],
        SoLuongTon: 70,
        SoLuongMuon: 3,
      },
    ];
    setBookList(test);
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const isSidebarOpen = useSidebarStore();

  return (
    <div className="min-h-screen pt-16 flex w-full text-foreground bg-[#E6EAF1] relative">
      <LeftSideBar />

      <div
        className={`flex-1 py-4 px-0 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <div className="flex flex-col p-6 bg-white rounded-2xl ">
          <div>
            <p className="px-6 py-3 w-fit bg-blue-400 rounded-2xl flex justify-center items-center gap-3 text-white text-16 font-normal font-montserrat">
              Sách đang mượn
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-3">
            {bookList.map((book) => (
              <div
                key={book.MaSach}
                className="flex flex-row w-[450px] gap-6 bg-white p-4 rounded-lg shadow-md"
              >
                <Image
                  src={book.HinhAnh[0]}
                  width={100}
                  height={150}
                  alt={book.TenSach}
                />
                <div className="flex flex-col gap-3">
                  <BookStatus
                    status={book.SoLuongTon > 0 ? "Còn sẵn" : "Đã mượn"}
                  />
                  <h3 className="font-semibold">{book.TenSach}</h3>
                  <p className="text-sm text-gray-600">
                    Tác giả: {book.MaTacGia}
                  </p>
                  <p className="text-sm text-gray-600">NXB: {book.NhaXB}</p>
                  <p className="text-sm text-gray-600">Lượt mượn:</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed flex items-center right-4 bottom-4 z-50 ">
        <ChatBox />
      </div>
    </div>
  );
};

export default Page;
