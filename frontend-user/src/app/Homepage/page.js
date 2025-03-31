"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBox from "../components/ChatBox";

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

const HomePage = () => {
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

  return (
    <div className="min-h-screen pt-16 flex w-full text-foreground bg-[#E6EAF1] relative">
      <LeftSideBar />

      <div className="flex flex-col w-full ml-63 mt-4  bg-[#E6EAF1] rounded-xl">
        {/*Thanh tim kiem*/}
        <div className="flex w-full items-center border border-gray-300 rounded-full px-3 py-1 bg-white">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full outline-none border-none bg-transparent text-gray-600 px-2"
          />
          <Button className="text-blue-400 bg-white">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/*Khung 3 muc vuong*/}
        <div className="flex mt-6 w-full p-0">
          {/* Thời gian phục vụ */}
          <div className="flex-1 p-3 ml-0 bg-white rounded-xl flex flex-col justify-start items-start gap-2">
            <p className="px-6 py-3 bg-blue-400 rounded-2xl flex justify-center items-center gap-3 text-white text-16 font-normal font-montserrat">
              Thời gian phục vụ
            </p>
            <div className="text-black text-l font-montserrat">
              <span className="font-semibold">Thứ 2 - Thứ 6</span>: 7:30 - 16:30{" "}
              <br />
              <span className="font-semibold">Thứ 7</span>: 8:00 - 16:00 <br />
              Thư viện không phục vụ vào chủ nhật, ngày lễ, tết theo quy định và
              các ngày nghỉ đột xuất khác (có thông báo).
            </div>
            <Image
              src="/images/goctimdo.png"
              width={272}
              height={68}
              alt="Library Schedule"
              className="w-[350px] h-[100px]"
            />
          </div>

          {/* Tài liệu số */}
          <div className="flex flex-col items-center w-1/3 ml-[25px]  bg-teal-500 rounded-xl  ">
            <div className="flex  bg-gray-50 w-full rounded-tl-xl rounded-tr-xl h-[200px]"></div>
            <div className="flex w-full justify-between px-6  items-center mt-6  ">
              <div className=" flex flex-col">
                <div className="text-white text-l font-medium font-montserrat">
                  Bộ sưu tập
                </div>
                <div className="text-white text-xl font-semibold font-montserrat">
                  Tài liệu số
                </div>
              </div>
              <Button className="flex items-center rounded-full bg-white text-teal-500 hover:opacity-80 hover:bg-white">
                Truy cập
              </Button>
            </div>
          </div>

          {/* Sách */}
          <div className="flex flex-col items-center w-1/3 ml-[25px]  bg-sky-600 rounded-xl  ">
            <div className="flex  bg-gray-50 w-full rounded-tl-xl rounded-tr-xl h-[200px]"></div>
            <div className="flex w-full justify-between px-6  items-center mt-6  ">
              <div className=" flex flex-col">
                <div className="text-white text-l font-medium font-montserrat">
                  Bộ sưu tập
                </div>
                <div className="text-white text-xl font-semibold font-montserrat">
                  Tài liệu số
                </div>
              </div>
              <Button className="flex items-center rounded-full bg-white text-sky-600 hover:opacity-80 hover:bg-white">
                Truy cập
              </Button>
            </div>
          </div>
        </div>

        {/*Khung sach*/}
        <div className="flex flex-col p-6 mt-4 bg-white rounded-2xl ">
          <div>
            <p className="px-6 py-3 w-fit bg-blue-400 rounded-2xl flex justify-center items-center gap-3 text-white text-16 font-normal font-montserrat">
              Sách mới về
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

export default HomePage;
