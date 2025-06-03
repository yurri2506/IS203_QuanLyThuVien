"use client";

import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import BookCard from "../components/BookCard";
import CollectionCard from "./CollectionCard";
import ServiceHoursCard from "./ServiceHoursCard";
import ChatBotButton from "../components/ChatBoxButton";
import axios from "axios";
import { ThreeDot } from "react-loading-indicators";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BookRecommend from "../components/BookRecomend";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  const [loading, setLoading] = useState(false);

  const sliderRecommendSettings = {
    dots: false, // Hiển thị chấm điều hướng
    dotsClass: "slick-dots slick-thumb", // Thêm class để tùy chỉnh chấm
    arrows: true,
    arrowsClass: "slick-arrow slick-arrow-recommend bg-blue-300",
    infinite: true, // Vòng lặp vô hạn
    speed: 200, // Tốc độ chuyển slide (ms)
    slidesToShow: 3, // Hiển thị 3 slide cùng lúc
    slidesToScroll: 1, // Chuyển 1 slide mỗi lần
    autoplay: true, // Tự động chuyển slide
    autoplaySpeed: 3000, // Chuyển slide mỗi 3 giây
    ltr: true,
  };

  // Cấu hình slider
  const sliderSettings = {
    dots: false, // Hiển thị chấm điều hướng
    dotsClass: "slick-dots slick-thumb", // Thêm class để tùy chỉnh chấm
    arrows: false,
    infinite: true, // Vòng lặp vô hạn
    speed: 200, // Tốc độ chuyển slide (ms)
    slidesToShow: 2, // Hiển thị 2 slide cùng lúc trên màn hình lớn
    slidesToScroll: 1, // Chuyển 1 slide mỗi lần
    autoplay: true, // Tự động chuyển slide
    autoplaySpeed: 3000, // Chuyển slide mỗi 3 giây
    ltr: true,
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (mode === "all") {
      fetchAll();
    }
  }, [mode, currentPage]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8080/api/book");
      const normalizedData = normalize(data);
      setBooks(normalizedData);
      setTotalPages(Math.ceil(normalizedData.length / itemsPerPage) || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (arr) =>
    arr
      ?.filter((b) => b.trangThai !== "DA_XOA")
      .map((b) => ({
        id: b.maSach,
        imageSrc: b.hinhAnh?.[0] || "",
        status: b.trangThai,
        remaining: b.soLuongCon,
        title: b.tenSach,
        author: b.tenTacGia,
        publisher: b.nxb,
        borrowCount: b.soLuongMuon,
      }));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (mode === "all") {
      setQ("");
      fetchAll();
      setCurrentPage(1);
      return;
    }

    const params = {};
    if (mode === "topBorrowed") params.sortByBorrowCount = true;
    else if (mode === "author") params.author = q;
    else if (mode === "category") params.category = q;
    else if (mode === "publisher") params.publisher = q;
    else if (mode === "year") {
      if (/^\d{4}$/.test(q.trim())) params.year = Number(q.trim());
      else {
        alert("Nhập năm theo dạng YYYY");
        return;
      }
    } else if (mode === "title") params.title = q;

    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/book/search",
        { params }
      );
      const normalizedData = normalize(data);
      setBooks(normalizedData);
      setTotalPages(Math.ceil(normalizedData.length / itemsPerPage) || 1);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paginatedBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground max-w-7xl">
      <main className="pt-18 flex">
        <LeftSideBar />
        {loading ? (
          <div className="flex ml-64 w-full h-screen justify-center items-center">
            <ThreeDot
              color="#062D76"
              size="large"
              text="Vui lòng chờ"
              variant="bounce"
              textColor="#062D76"
            />
          </div>
        ) : (
          <>
            <section className="flex-1 pr-5 md:pl-45 mt-2 items-center">
              <div className="grid grid-cols-[3fr_2fr]">
                <div className="px-4 h-[510px] w-[800px]">
                  <Slider
                    {...sliderSettings}
                    className="mb-5 max-w-5xl h-auto gap-12"
                  >
                    <ServiceHoursCard />
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
                  </Slider>
                </div>
                <div>
                  <div className="h-[116px] mb-2 border-b-2 border-blue-300">
                    <div className="grid grid-cols-[1fr_2fr] bg-white w-full h-[100px] items-center shadow-md hover:scale-105 hover:shadow-xl hover:brightness-110 transition-transform duration-300">
                      <img
                        src="https://bizweb.dktcdn.net/100/363/455/files/website-a-nh-da-i-die-n-ba-i-vie-t-16-4fe6bbb7-f06e-45f8-9907-f1d2c78af6d1.png?v=1742196045380"
                        alt=""
                        className="w-40 h-25 object-cover"
                      />
                      <h3 className="text-m text-center">
                        Ra mắt bản dịch tác phẩm &#39;Cuốn sách hoang dã&#39;
                        của tác giả Juan Villoro
                      </h3>
                    </div>
                  </div>
                  <div className="h-[116px] mt-4 mb-2 border-b-2 border-blue-300">
                    <div className="grid grid-cols-[1fr_2fr] bg-white w-full h-[100px] items-center shadow-md hover:scale-105 hover:shadow-xl hover:brightness-110 transition-transform duration-300">
                      <img
                        src="https://bizweb.dktcdn.net/100/363/455/files/website-a-nh-da-i-die-n-ba-i-vie-t-15-4a71f8dd-4865-4f04-8dea-e87f9ed34453.png?v=1742188114894"
                        alt=""
                        className="w-40 h-25 object-cover"
                      />
                      <h3 className="text-m text-center">
                        Con người và đất đai
                      </h3>
                    </div>
                  </div>
                  <div className="h-[116px] mt-4 mb-2 border-b-2 border-blue-300">
                    <div className="grid grid-cols-[1fr_2fr] bg-white w-full h-[100px] items-center shadow-md hover:scale-105 hover:shadow-xl hover:brightness-110 transition-transform duration-300">
                      <img
                        src="https://bizweb.dktcdn.net/100/363/455/files/5-a8045521-d06e-4e15-9ba1-ce202c42b17e.png?v=1739681062483"
                        alt=""
                        className="w-40 h-25 object-cover"
                      />
                      <h3 className="text-m text-center">
                        “Pha cà phê ngon tại nhà” - Một cẩm nang toàn diện để
                        pha cà phê ngon ngay trong căn bếp của bạn
                      </h3>
                    </div>
                  </div>
                  <div className="h-[116px] mt-4 mb-2 ">
                    <div className="grid grid-cols-[1fr_2fr] bg-white w-full h-[100px] items-center shadow-md hover:scale-105 hover:shadow-xl hover:brightness-110 transition-transform duration-300">
                      <img
                        src="https://bizweb.dktcdn.net/100/363/455/files/1-8a90d326-01e3-4e01-bf40-f36235474a9d.png?v=1737348355103"
                        alt=""
                        className="w-40 h-25 object-cover"
                      />
                      <h3 className="text-m text-center">
                        MAUS - làm thế nào để nói về Holocaust?
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow backdrop-blur-sm mt-5"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/669888cc237b300e928dbfd847b76e4236ef4b5a?apiKey=…"
                  alt="search"
                  className="w-6 h-6"
                />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={
                    mode === "all"
                      ? "Xem tất cả sách"
                      : mode === "topBorrowed"
                      ? "Top mượn nhiều nhất"
                      : mode === "year"
                      ? "Nhập năm (YYYY)…"
                      : mode === "title"
                      ? "Tìm theo tên sách…"
                      : `Tìm theo ${
                          mode === "author"
                            ? "tác giả"
                            : mode === "category"
                            ? "thể loại"
                            : "NXB"
                        }`
                  }
                  className="flex-1 bg-transparent outline-none"
                  disabled={mode === "all" || mode === "topBorrowed"}
                />
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="border px-2 py-1 rounded-full"
                >
                  <option value="all">Tất cả</option>
                  <option value="title">Tên sách</option>
                  <option value="author">Tác giả</option>
                  <option value="category">Thể loại</option>
                  <option value="publisher">NXB</option>
                  <option value="year">Năm</option>
                  <option value="topBorrowed">Top mượn nhiều</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded-full ml-2"
                >
                  Tìm
                </button>
              </form> */}
              <div className="bg-white rounded-xl p-5">
                <h2 className="inline-block px-4 py-2 text-white bg-blue-300 rounded-lg">
                  Có thể bạn sẽ thích
                </h2>
                <Slider {...sliderRecommendSettings} className="mt-5 max-w-6xl">
                  {books.slice(0, 6).map((book) => (
                    <div key={book.id} className="px-2">
                      <BookRecommend {...book} />
                    </div>
                  ))}
                </Slider>
              </div>

              <section className="mt-5 bg-white rounded-xl p-5">
                <h2 className="inline-block px-4 py-2 text-white bg-blue-300 rounded-lg">
                  Sách
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mt-5">
                  {paginatedBooks.map((book) => (
                    <BookCard key={book.id} {...book} />
                  ))}
                </div>
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
              </section>
            </section>
            <ChatBotButton />
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
