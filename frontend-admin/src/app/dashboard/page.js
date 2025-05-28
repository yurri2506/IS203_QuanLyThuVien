"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import StatisticsCard from "./StatisticsCard";
import BookTable from "./BookTable";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalBookQuantity, setTotalBookQuantity] = useState(0);
  const [newBooksThisWeek, setNewBooksThisWeek] = useState(0);
  const [borrowStartLastWeek, setBorrowStartLastWeek] = useState({ totalBorrows: 0, bookDetails: [] });
  const [showBorrowDetails, setShowBorrowDetails] = useState(false); // State để điều khiển hiển thị chi tiết

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalBooksResponse = await axios.get("http://localhost:8080/api/book/total-books");
        console.log("Total Books:", totalBooksResponse.data);
        setTotalBooks(totalBooksResponse.data);

        const totalBookQuantityResponse = await axios.get("http://localhost:8080/api/book/total-book-quantity");
        console.log("Total Book Quantity:", totalBookQuantityResponse.data);
        setTotalBookQuantity(totalBookQuantityResponse.data);

        const newBooksThisWeekResponse = await axios.get("http://localhost:8080/api/book/new-books-this-week");
        console.log("New Books This Week:", newBooksThisWeekResponse.data);
        setNewBooksThisWeek(newBooksThisWeekResponse.data);

        const getBorrowStartLastWeekResponse = await axios.get("http://localhost:8080/api/borrow-cards/stats/last-week");
        console.log("Borrow Start Last Week:", getBorrowStartLastWeekResponse.data);
        setBorrowStartLastWeek(getBorrowStartLastWeekResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
        toast.error("Không thể lấy dữ liệu dashboard. Vui lòng kiểm tra kết nối hoặc cơ sở dữ liệu.");
      }
    };

    fetchData();
  }, []);

  // Hàm để bật/tắt hiển thị chi tiết
  const toggleBorrowDetails = () => {
    setShowBorrowDetails(!showBorrowDetails);
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
      <Sidebar />
      <main className="self-stretch pr-[1.25rem] md:pl-52 ml-[1.25rem] my-auto w-full max-md:max-w-full py-[2rem] ">
        <section className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 self-stretch shrink gap-4 justify-between items-center w-full leading-none text-white h-full max-md:max-w-full">
          <StatisticsCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/e444cbee3c99f14768fa6c876faa966d9bede995?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
            title="Tổng đầu sách"
            value={totalBooks}
          />
          <StatisticsCard
            title="Tổng số lượng sách"
            value={totalBookQuantity}
          />
          <StatisticsCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/70bb6ff8485146e65b19f58221ee1e5ce86c9519?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
            title="Tổng Đầu Sách Mới Tuần Này"
            value={newBooksThisWeek}
          />
          <div onClick={toggleBorrowDetails} className="cursor-pointer">
            <StatisticsCard
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/70bb6ff8485146e65b19f58221ee1e5ce86c9519?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
              title="Sách Mượn Tuần Trước"
              value={borrowStartLastWeek.totalBorrows || 0}
            />
          </div>
        </section>

        {/* Hiển thị chi tiết sách mượn tuần trước khi bấm vào */}
        {showBorrowDetails && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4 ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết sách mượn tuần trước</h2>
            {borrowStartLastWeek.bookDetails.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-gray-700">Mã sách</th>
                    <th className="p-3 text-gray-700">Tên sách</th>
                    <th className="p-3 text-gray-700">Tác giả</th>
                    <th className="p-3 text-gray-700">Số lượt mượn</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowStartLastWeek.bookDetails.map((book, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{book.bookId}</td>
                      <td className="p-3">{book.tenSach}</td>
                      <td className="p-3">{book.tenTacGia}</td>
                      <td className="p-3">{book.borrowCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">Không có sách nào được mượn trong tuần trước.</p>
            )}
          </div>
        )}

        <div className="gap-2.5 self-start px-5 py-2.5 mt-6 text-[1.25rem] text-white bg-[#062D76] rounded-lg w-fit">
          <h1>Danh sách các sách</h1>
        </div>

        <BookTable />
      </main>
    </div>
  );
};

export default Dashboard;