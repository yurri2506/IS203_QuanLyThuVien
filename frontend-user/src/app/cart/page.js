"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import BookCard from "./book";
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

const page = () => {
  const [selected, setSelected] = useState([]);
  const [books, setBooks] = useState(""); // Giỏ hàng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const user = JSON.parse(localStorage.getItem("persist:root")); // lấy thông tin người dùng từ localStorage
  let cartId = "";

  // Lấy giỏ hàng từ API theo userId
  const fetchCart = async () => {
    try {
      setLoading(true); // Bắt đầu tải dữ liệu
      const response = await fetch(
        `http://localhost:8080/api/cart/${user.id}` // Endpoint API lấy giỏ hàng theo userId
      ); // Endpoint API lấy giỏ hàng theo userId

      if (response.ok) {
        const data = await response.json();
        cartId=data.id; 
        setBooks(data.data); // Giả sử API trả về đối tượng có key 'books'
      } else {
        console.error("Lỗi khi lấy giỏ hàng");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    } finally {
      setLoading(false); // Hoàn tất việc gọi API
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user.id]);

  // tick / bỏ tick 1 cuốn
  const toggleBook = (idx, checked) => {
    setSelected((prev) =>
      checked ? [...prev, idx] : prev.filter((i) => i !== idx)
    );
  };

  // tick / bỏ tick tất cả
  const allChecked = selected.length === books?.length;
  const toggleAll = (checked) =>
    setSelected(checked ? books.map((_, i) => i) : []);
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <main className="pt-16 flex">
        <LeftSideBar />
        <section className="self-stretch pr-[1.25rem] md:pl-64 ml-[1.25rem] my-auto w-full max-md:max-w-full mt-2">
          <div className="flex flex-col p-5 w-full bg-white rounded-xl max-md:max-w-full">
            <div className="flex items-center justify-center gap-3">
              <h2 className="gap-2.5 self-center px-[1.25rem] py-[0.625rem] text-[1.5rem] text-[#062D76] font-semibold rounded-lg">
                Giỏ sách
              </h2>
            </div>
            <div className="grid grid-cols-1 max-sm:grid-cols-1 gap-5 items-start mt-5 w-full max-md:max-w-full">
              {Array.isArray(books) &&
                books.map((book, index) => (
                  <BookCard
                    key={book.bookId}
                    id={book.bookId}
                    imageSrc={book.hinhAnh[0]}
                    available={(book.tongSoLuong - book.soLuongMuon - book.soLuongXoa) > 0 ? "Còn sẵn" : "Hết sách"}
                    title={book.tenSach}
                    author={book.tenTacGia}
                    publisher={book.nxb}
                    borrowCount={book.soLuongMuon}
                    checked={selected.includes(index)}
                    onCheck={(c) => toggleBook(index, c)}
                  />
                ))}
            </div>
          </div>
          {selected.length > 0 && (
            <footer className="fixed bottom-0 self-stretch mr-[1.25rem] md:left-64 ml-[1.25rem] right-0 bg-[#E6EAF1] shadow-lg p-4 flex justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-[#F7302E] cursor-pointer"
                  checked={allChecked}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
                <span className="text-sm font-medium text-[#062D76]">
                  Chọn tất cả ({books.length})
                </span>
              </div>
              <button className="px-4 py-2 bg-[#062D76] text-white rounded">
                Đăng ký mượn ({selected.length})
              </button>
            </footer>
          )}
        </section>
      </main>
    </div>
  );
};

export default page;