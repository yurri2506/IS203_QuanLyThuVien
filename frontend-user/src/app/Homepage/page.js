"use client";

import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import BookCard from "../components/BookCard";
import CollectionCard from "./CollectionCard";
import ServiceHoursCard from "./ServiceHoursCard";
import ChatBotButton from "../components/ChatBoxButton";
import axios from "axios";

const books = [
  {
    id: "DRPN001",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/9b777cb3ef9abb920d086e97e27ac4f6f3559695",
    available: true,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    id: "DRPN002",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/fc01b7cf44e0ca2f23258dcc0ad69329b2612af0?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: false,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    id: "DRPN003",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5e8a0f3fd4681a9512313c2c1c6dae1285bcf0a6?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: true,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    id: "DRPN004",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d854294877ea4263cf3494a98eecfd64cd148327?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: false,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    id: "DRPN005",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/acf848c9260bfc86d1f9094e17e14ec25f3ec193?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: true,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    id: "DRPN006",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d854294877ea4263cf3494a98eecfd64cd148327?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: false,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
];

const HomePage = () => {
  // const [books, setBooks] = useState([]);

  // useEffect(() => {
  //   // gọi API lấy toàn bộ sách
  //   const fetchBooks = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8081/books"); // đổi thành URL thật
  //       // console.log("Dữ liệu sách:", response.data);
  //       const convertedBooks = response.data.map((book) => ({
  //         id: book.id,
  //         imageSrc:book.hinhAnh[0],
  //         available: (book.tongSoLuong - book.soLuongMuon - book.soLuongXoa) > 0,
  //         title: book.tenSach,
  //         author: book.tenTacGia,
  //         publisher: book.nxb,
  //         borrowCount: book.soLuongMuon,
  //       }));
  //       setBooks(convertedBooks);
  //     } catch (error) {
  //       console.error("Lỗi khi fetch sách:", error);
  //     }
  //   };

  //   fetchBooks();
  // }, []);

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <main className="pt-16 flex">
        <LeftSideBar />
        <section className="self-stretch pr-[1.25rem] md:pl-64 ml-[1.25rem] my-auto w-full max-md:max-w-full mt-2">
          <div className="flex flex-wrap gap-3 items-center px-3 py-2.5 w-full text-[1.25rem] leading-none text-[#062D76] bg-white backdrop-blur-[100px] min-h-[50px] rounded-[100px] max-md:max-w-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/669888cc237b300e928dbfd847b76e4236ef4b5a?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
              alt="Search icon"
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[30px]"
            />
            <input
              type="search"
              id="search-input"
              placeholder="Tìm kiếm"
              className="flex-1 md:text-[1.25rem] bg-transparent border-none outline-none placeholder-[#062D76] text-[#062D76] focus:ring-2 focus:ring-red-dark focus:ring-opacity-50"
            />
          </div>
          <div className="flex lg:flex-row justify-between flex-col gap-3.5 mt-5 w-full max-md:max-w-full">
            <ServiceHoursCard />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-3.5 items-center mt-3 lg:w-2/3 h-full self-stretch max-md:max-w-full">
              <CollectionCard
                title="Tài liệu số"
                category="Bộ sưu tập"
                imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/9b777cb3ef9abb920d086e97e27ac4f6f3559695"
                bgColor="bg-teal-500"
                buttonTextColor="text-teal-500"
              />
              <CollectionCard
                title="Sách"
                category="Bộ sưu tập"
                imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/9b777cb3ef9abb920d086e97e27ac4f6f3559695"
                bgColor="bg-sky-600"
                buttonTextColor="text-sky-600"
              />
            </div>
          </div>
          <section className="flex flex-col p-5 mt-3 w-full bg-white rounded-xl max-md:max-w-full">
            <h2 className="gap-2.5 self-start px-5 py-2.5 text-[1.25rem] text-white bg-[#062D76] rounded-lg">
              Sách mới về
            </h2>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 items-start mt-5 w-full max-md:max-w-full">
              {books.map((book, index) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  imageSrc={book.imageSrc}
                  available={book.available}
                  title={book.title}
                  author={book.author}
                  publisher={book.publisher}
                  borrowCount={book.borrowCount}
                />
              ))}
            </div>
          </section>
        </section>
        <ChatBotButton />
      </main>
    </div>
  );
};

export default HomePage;