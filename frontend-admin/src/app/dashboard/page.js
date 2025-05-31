"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { ThreeDot } from "react-loading-indicators";
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
  const [booksToRestock, setBooksToRestock] = useState([]);
  const [showBorrowDetails, setShowBorrowDetails] = useState(false);
  const [showRestockDetails, setShowRestockDetails] = useState(false);
  const [allBooks, setAllBooks] = useState([]); // Lưu tất cả sách từ API
  const [filteredBooks, setFilteredBooks] = useState([]); // Sách sau khi lọc
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
    sortByBorrowCount: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu dashboard
        const dashboardResponse = await axios.get(
          "http://localhost:8080/api/book/dashboard",
          { headers: { "Cache-Control": "no-cache" } }
        );
        console.log("Dashboard data:", dashboardResponse.data);

        setTotalBooks(dashboardResponse.data.totalBooks || 0);
        setTotalBookQuantity(dashboardResponse.data.totalBookQuantity || 0);
        setNewBooksThisWeek(dashboardResponse.data.newBooksThisWeek || 0);
        setBorrowStartLastWeek(
          dashboardResponse.data.borrowStartLastWeek || {
            totalBorrows: 0,
            bookDetails: [],
          }
        );
        setBooksToRestock(dashboardResponse.data.booksToRestock || []);

        // Lấy tất cả sách
        const booksResponse = await axios.get("http://localhost:8080/api/book", {
          headers: { "Cache-Control": "no-cache" },
        });
        console.log("All books fetched:", booksResponse.data);
        setAllBooks(booksResponse.data || []);
        applyFiltersAndSort(booksResponse.data || [], searchParams);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu.");
        setAllBooks([]);
        setFilteredBooks([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm lọc và sắp xếp sách
  const applyFiltersAndSort = (books, params) => {
    let filtered = [...books];

    // Lọc theo mode
    if (params.mode !== "all") {
      if (params.mode === "title" && params.title.trim()) {
        filtered = filtered.filter((book) =>
          book.tenSach.toLowerCase().includes(params.title.trim().toLowerCase())
        );
      } else if (params.mode === "author" && params.author.trim()) {
        filtered = filtered.filter((book) =>
          book.tenTacGia.toLowerCase().includes(params.author.trim().toLowerCase())
        );
      } else if (params.mode === "category" && params.category.trim()) {
        filtered = filtered.filter((book) =>
          book.theLoai.toLowerCase().includes(params.category.trim().toLowerCase())
        );
      } else if (params.mode === "publisher" && params.publisher.trim()) {
        filtered = filtered.filter((book) =>
          book.nhaXuatBan.toLowerCase().includes(params.publisher.trim().toLowerCase())
        );
      } else if (params.mode === "year" && params.year.trim()) {
        if (/^\d{4}$/.test(params.year.trim())) {
          filtered = filtered.filter(
            (book) => book.namXuatBan === Number(params.year.trim())
          );
        } else {
          toast.error("Vui lòng nhập năm theo định dạng YYYY (VD: 2023)");
          return;
        }
      }
    }

    // Sắp xếp theo số lượt mượn nếu được chọn
    if (params.sortByBorrowCount) {
      filtered.sort((a, b) => (b.soLuongMuon || 0) - (a.soLuongMuon || 0));
    }

    // Cập nhật danh sách sách đã lọc và tổng số trang
    setFilteredBooks(filtered);
    setTotalPages(Math.ceil(filtered.length / booksPerPage) || 1);
    setCurrentPage(1); // Reset về trang 1 khi lọc hoặc sắp xếp
  };

  // Phân trang cục bộ
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      console.log(`Navigating to page ${page}`);
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Debounce search on input change
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      applyFiltersAndSort(allBooks, { ...searchParams, [name]: type === "checkbox" ? checked : value });
    }, 500); // Delay 500ms
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchParams.mode !== "all") {
      e.preventDefault();
      applyFiltersAndSort(allBooks, searchParams);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted with params:", searchParams);
    applyFiltersAndSort(allBooks, searchParams);
  };

  const toggleBorrowDetails = () => {
    setShowBorrowDetails(!showBorrowDetails);
    if (showRestockDetails) setShowRestockDetails(false);
  };

  const toggleRestockDetails = () => {
    setShowRestockDetails(!showRestockDetails);
    if (showBorrowDetails) setShowBorrowDetails(false);
  };

  const handleBookClick = (id, type) => {
    if (type === "restock") {
      router.push(`/books/${id}`);
    } else if (type === "borrow") {
      router.push(`/borrow/${id}`);
    }
  };

  const BookCard = ({ book }) => {
    const isAvailable = book.trangThai === "CON_SAN";
    return (
      <div className="flex bg-white w-full rounded-lg mt-2 p-5 gap-5 md:gap-10 drop-shadow-lg items-center">
        <img
          src={book.hinhAnh?.[0] || "/placeholder.png"}
          alt={book.tenSach}
          className="w-[145px] h-[205px] object-cover rounded"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold text-lg">{book.tenSach}</p>
          <p className="italic text-gray-600">{book.tenTacGia}</p>
          <p>Tổng số lượng: {book.tongSoLuong || 0}</p>
          <p>Số lượng mượn: {book.soLuongMuon || 0}</p>
          <p>Số lượng xóa: {book.soLuongXoa || 0}</p>
          <p className="font-semibold">
            Trạng thái:{" "}
            <span
              className={
                book.trangThai === "DA_XOA"
                  ? "text-red-500"
                  : book.trangThai === "DA_HET"
                  ? "text-yellow-600"
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
      {loading ? (
        <div className="flex md:ml-52 w-full h-screen justify-center items-center">
          <ThreeDot
            color="#062D76"
            size="large"
            text="Vui lòng chờ"
            variant="bounce"
            textColor="#062D76"
          />
        </div>
      ) : (
        <main className="self-stretch pr-[1.25rem] md:pl-52 ml-[1.25rem] my-auto w-full max-md:max-w-full py-[2rem]">
          {/* Statistics Section */}
          <section className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-4 justify-between items-center w-full leading-none text-white h-full max-md:max-w-full">
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
            <div onClick={toggleRestockDetails} className="cursor-pointer">
              <StatisticsCard
                icon="https://cdn.builder.io/api/v1/image/assets/TEMP/70bb6ff8485146e65b19f58221ee1e5ce86c9519?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
                title="Sách Cần Bổ Sung"
                value={booksToRestock.length || 0}
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
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleBookClick(book.bookId, "borrow")}
                      >
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

          {/* Restock Details Section */}
          {showRestockDetails && (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Sách cần bổ sung
              </h2>
              {booksToRestock.length > 0 ? (
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
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleBookClick(book.maSach, "restock")}
                      >
                        <td className="p-3">{book.maSach}</td>
                        <td className="p-3">{book.tenSach}</td>
                        <td className="p-3">{book.tenTacGia}</td>
                        <td className="p-3">{book.tongSoLuong}</td>
                        <td className="p-3">
                          <span
                            className={
                              book.trangThai === "DA_XOA"
                                ? "text-red-500"
                                : book.trangThai === "DA_HET"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }
                          >
                            {book.trangThai === "DA_XOA"
                              ? "Đã xóa"
                              : book.trangThai === "DA_HET"
                              ? "Đã hết"
                              : "Còn sẵn"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">Không có sách nào cần bổ sung.</p>
              )}
            </div>
          )}

          {/* Search Form */}
          <div className="flex gap-2 p-2 mt-8 rounded-md w-full items-center justify-center">
            <select
              name="mode"
              onChange={handleSearchChange}
              value={searchParams.mode}
              className="border border-gray-300 bg-gray-100 rounded-md shadow p-2 font-thin italic cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="title">Tên sách</option>
              <option value="author">Tác giả</option>
              <option value="category">Thể loại</option>
              <option value="publisher">Nhà xuất bản</option>
              <option value="year">Năm xuất bản</option>
            </select>
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={
                searchParams[
                  searchParams.mode === "title"
                    ? "title"
                    : searchParams.mode === "author"
                    ? "author"
                    : searchParams.mode === "category"
                    ? "category"
                    : searchParams.mode === "publisher"
                    ? "publisher"
                    : "year"
                ] || ""
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
                  : "year"
              }
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="flex-1 p-3 text-black bg-white shadow font-thin italic cursor-text"
            />
            <Button
              onClick={handleSearchSubmit}
              className="w-10 h-10 bg-[#062D76] hover:bg-gray-700 shadow rounded-md cursor-pointer"
            >
              <Search className="w-5 h-5" color="white" />
            </Button>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sortByBorrowCount"
                checked={searchParams.sortByBorrowCount}
                onChange={handleSearchChange}
                className="form-checkbox h-5 w-5 text-[#062D76]"
              />
              <span className="text-gray-700">Sắp xếp theo số lượt mượn</span>
            </label>
          </div>

          {/* Books Needing Restocking - Display when mode is "restock" */}
          {searchParams.mode === "restock" && (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Sách cần bổ sung
              </h2>
              {booksToRestock.length > 0 ? (
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
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleBookClick(book.maSach, "restock")}
                      >
                        <td className="p-3">{book.maSach}</td>
                        <td className="p-3">{book.tenSach}</td>
                        <td className="p-3">{book.tenTacGia}</td>
                        <td className="p-3">{book.tongSoLuong}</td>
                        <td className="p-3">
                          <span
                            className={
                              book.trangThai === "DA_XOA"
                                ? "text-red-500"
                                : book.trangThai === "DA_HET"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }
                          >
                            {book.trangThai === "DA_XOA"
                              ? "Đã xóa"
                              : book.trangThai === "DA_HET"
                              ? "Đã hết"
                              : "Còn sẵn"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">Không có sách nào cần bổ sung.</p>
              )}
            </div>
          )}

          {/* Book List with Pagination */}
          {searchParams.mode !== "restock" && (
            <>
              <div className="gap-2.5 self-start px-5 py-2.5 mt-6 mb-6 text-[1.25rem] text-white bg-[#062D76] rounded-lg w-fit">
                <h1>Danh sách các sách</h1>
              </div>
              {paginatedBooks.length > 0 ? (
                paginatedBooks.map((book) => (
                  <BookCard key={book.maSach} book={book} />
                ))
              ) : (
                <p className="text-gray-600 text-center">
                  Không tìm thấy sách phù hợp.
                </p>
              )}
              <div className="mt-4 flex justify-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || totalPages === 1}
                  className="px-4 py-2 bg-[#062D76] text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Trang trước
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 1}
                  className="px-4 py-2 bg-[#062D76] text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Trang sau
                </Button>
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
};

export default Dashboard;