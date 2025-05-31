"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import StatisticsCard from "./StatisticsCard";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalBookQuantity, setTotalBookQuantity] = useState(0);
  const [newBooksThisWeek, setNewBooksThisWeek] = useState(0);
  const [borrowStartLastWeek, setBorrowStartLastWeek] = useState({
    totalBorrows: 0,
    bookDetails: [],
  });
  const [showBorrowDetails, setShowBorrowDetails] = useState(false);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 10;
  const [searchParams, setSearchParams] = useState({
    author: "",
    category: "",
    publisher: "",
    year: "",
    title: "",
    mode: "all",
    status: "all",
    sortByBorrowCount: false,
  });
  const [booksToRestock, setBooksToRestock] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/api/book/dashboard",
          { headers: { "Cache-Control": "no-cache" } }
        );
        console.log("Dashboard data:", response.data);

        setTotalBooks(response.data.totalBooks || 0);
        setTotalBookQuantity(response.data.totalBookQuantity || 0);
        setNewBooksThisWeek(response.data.newBooksThisWeek || 0);
        setBorrowStartLastWeek(response.data.borrowStartLastWeek || { totalBorrows: 0, bookDetails: [] });
        setBooksToRestock(response.data.booksToRestock || []);

        await fetchBooks(currentPage);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Không thể tải dữ liệu dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchParams]);

  const fetchBooks = async (page) => {
    try {
      setLoading(true);
      console.log(`Fetching books for page ${page} with params:`, {
        ...searchParams,
        page: page - 1,
        size: booksPerPage,
      });
      const params = {
        page: page - 1, // Backend expects 0-based page index
        size: booksPerPage,
      };

      // Map mode to the appropriate search parameter
      if (searchParams.mode !== "all" && searchParams.mode !== "restock") {
        if (searchParams.mode === "title" && searchParams.title) params.title = searchParams.title;
        else if (searchParams.mode === "author" && searchParams.author) params.author = searchParams.author;
        else if (searchParams.mode === "category" && searchParams.category) params.category = searchParams.category;
        else if (searchParams.mode === "publisher" && searchParams.publisher) params.publisher = searchParams.publisher;
        else if (searchParams.mode === "year" && searchParams.year) {
          if (/^\d{4}$/.test(searchParams.year.trim())) {
            params.year = Number(searchParams.year.trim());
          } else {
            toast.error("Nhập năm theo dạng YYYY");
            return;
          }
        }
      }
      if (searchParams.status !== "all") params.status = searchParams.status;
      params.sortByBorrowCount = searchParams.sortByBorrowCount;

      const response = await axios.get(
        "http://localhost:8080/api/book/search",
        {
          params,
          headers: { "Cache-Control": "no-cache" },
        }
      );
      console.log("Books fetched:", response.data.content);
      setBooks(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Không thể tải danh sách sách.");
      setBooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    console.log(`Navigating to page ${page}`);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted with params:", searchParams);
    setCurrentPage(1); // Reset to first page on new search
    fetchBooks(1);
  };

  const toggleBorrowDetails = () => {
    setShowBorrowDetails(!showBorrowDetails);
  };

  const BookCard = ({ book }) => {
    const isAvailable = book.trangThai === "CON_SAN";
    return (
      <div className="flex bg-white w-full rounded-lg mt-2 p-5 gap-5 md:gap-10 drop-shadow-lg items-center">
        <img
          src={book.hinhAnh?.[0] || "/placeholder.png"}
          className="w-[145px] h-[205px] object-cover"
        />
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold">{book.tenSach}</p>
          <p className="italic">{book.tenTacGia}</p>
          <p>Tổng số lượng: {book.tongSoLuong}</p>
          <p>Số lượng mượn: {book.soLuongMuon}</p>
          <p>Số lượng xóa: {book.soLuongXoa}</p>
          <p className="font-semibold">
            Trạng thái:{" "}
            <span
              className={
                book.trangThai === "DA_XOA"
                  ? "text-red-500"
                  : book.trangThai === "DA_HET"
                  ? "text-[#5C4033]"
                  : "text-green-600"
              }
            >
              {book.trangThai === "DA_XOA"
                ? "Đã xóa"
                : book.trangThai === "DA_HET"
                ? "Đã hết"
                : "Còn sẵn"}
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
      <Sidebar />
      <main className="self-stretch pr-[1.25rem] md:pl-52 ml-[1.25rem] my-auto w-full max-md:max-w-full py-[2rem]">
        {/* Loading Indicator */}
        {loading && <div className="text-center py-4">Đang tải dữ liệu...</div>}

        {/* Statistics Section */}
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

        {/* Borrow Details Section */}
        {showBorrowDetails && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Chi tiết sách mượn tuần trước
            </h2>
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
              <p className="text-gray-600">
                Không có sách nào được mượn trong tuần trước.
              </p>
            )}
          </div>
        )}

        {/* Search Form */}
        <div className="flex gap-2 p-2 mt-8 rounded-md w-full items-center justify-center">
          <select
            name="mode"
            onChange={handleSearchChange}
            value={searchParams.mode}
            className="border border-gray-300 bg-gray rounded-md shadow p-2 font-thin italic cursor-pointer"
          >
            <option value="all">Tất cả</option>
            <option value="title">Tên sách</option>
            <option value="author">Tác giả</option>
            <option value="category">Thể loại</option>
            <option value="publisher">Nhà xuất bản</option>
            <option value="year">Năm xuất bản</option>
            <option value="restock">Sách cần bổ sung</option>
          </select>
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={
              searchParams.mode === "title"
                ? searchParams.title
                : searchParams.mode === "author"
                ? searchParams.author
                : searchParams.mode === "category"
                ? searchParams.category
                : searchParams.mode === "publisher"
                ? searchParams.publisher
                : searchParams.mode === "year"
                ? searchParams.year
                : ""
            }
            name={
              searchParams.mode === "title"
                ? "title"
                : searchParams.mode === "author"
                ? "author"
                : searchParams.mode === "category"
                ? "category"
                : searchParams.mode === "publisher"
                ? "publisher"
                : searchParams.mode === "year"
                ? "year"
                : "title"
            }
            onChange={handleSearchChange}
            className="flex-1 p-3 text-black bg-white shadow font-thin italic cursor-text"
          />
          <Button
            onClick={handleSearchSubmit}
            className="w-10 h-10 bg-[#062D76] hover:bg-gray-700 shadow rounded-md cursor-pointer"
          >
            <Search className="w-5 h-5" color="white" />
          </Button>
        </div>

        {/* Books Needing Restocking - Display only when mode is "restock" */}
        {searchParams.mode === "restock" && booksToRestock.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sách cần bổ sung
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-gray-700">Mã sách</th>
                  <th className="p-3 text-gray-700">Tên sách</th>
                  <th className="p-3 text-gray-700">Tác giả</th>
                  <th className="p-3 text-gray-700">Số lượng</th>
                  <th className="p-3 text-gray-700">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {booksToRestock.map((book, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{book.maSach}</td>
                    <td className="p-3">{book.tenSach}</td>
                    <td className="p-3">{book.tenTacGia}</td>
                    <td className="p-3">{book.tongSoLuong}</td>
                    <td className="p-3">{book.trangThai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Book List with Pagination */}
        <div className="gap-2.5 self-start px-5 py-2.5 mt-6 mb-6 text-[1.25rem] text-white bg-[#062D76] rounded-lg w-fit">
          <h1>Danh sách các sách</h1>
        </div>

        {books.map((book) => (
          <BookCard key={book.maSach} book={book} />
        ))}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#062D76] text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Trang trước
          </button>
          <span className="px-4 py-2 text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#062D76] text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Trang sau
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;