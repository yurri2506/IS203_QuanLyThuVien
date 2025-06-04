"use client";
import { usePathname } from "next/navigation";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
} from "@headlessui/react";
import { Menu as MenuIcon, X, Bell, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import didYouMean from "didyoumean";
import { useEffect, useState } from "react";
import Image from "next/image";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Thể loại", href: "/Categories" },
  { name: "Giới thiệu", href: "/About" },
  { name: "Tin sách", href: "/News" },
];

const HeaderNoLogin = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookTitles, setBookTitles] = useState([]);
  const [bookAuthors, setBookAuthors] = useState([]);

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    // Lọc sách tên chứa từ khóa (case-insensitive)
    // let filtered = books.filter(
    //   (book) =>
    //     book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     book.author.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    const normalizedTerm = removeVietnameseTones(searchTerm);
    let filtered = books.filter(
      (book) =>
        removeVietnameseTones(book.title).includes(normalizedTerm) ||
        removeVietnameseTones(book.author).includes(normalizedTerm)
    );

    // Nếu không có kết quả thì sửa lỗi chính tả với didyoumean
    // if (filtered.length === 0) {
    //   const correction = didYouMean(searchTerm, bookTitles ) || didYouMean(searchTerm, bookAuthors);
    //   if (correction) {
    //     filtered = books.filter(book => book.title === correction) || books.filter(book => book.author === correction);
    //   }
    // }
    if (filtered.length === 0) {
      // const correctionTitle = didYouMean(searchTerm, bookTitles);
      const correctionTitle = didYouMean(
        normalizedTerm,
        bookTitles.map(removeVietnameseTones)
      );
      // const correctionAuthor = didYouMean(searchTerm, bookAuthors);
      const correctionAuthor = didYouMean(
        normalizedTerm,
        bookAuthors.map(removeVietnameseTones)
      );

      if (correctionTitle) {
        filtered = books.filter((book) => book.title === correctionTitle);
      } else if (correctionAuthor) {
        filtered = books.filter((book) => book.author === correctionAuthor);
      }
    }

    setSuggestions(filtered);
  }, [searchTerm, books, bookTitles, bookAuthors]);

  const MAX_KEYWORDS = 5;

  const saveSearchTermToCache = (term) => {
    if (!term.trim()) return;

    // Lấy danh sách từ khóa hiện tại
    const stored = JSON.parse(localStorage.getItem("searchKeywords") || "[]");

    // Xóa nếu đã tồn tại
    const updated = stored.filter((item) => item !== term);

    // Thêm từ khóa mới vào đầu mảng
    updated.unshift(term);

    // Giới hạn số lượng từ khóa
    const limited = updated.slice(0, MAX_KEYWORDS);

    // Lưu lại vào localStorage
    localStorage.setItem("searchKeywords", JSON.stringify(limited));
  };

  // 3. Khi chọn 1 sách trong gợi ý
  const handleSelect = (book) => {
    console.log("Selected book:", book);
    setSearchTerm(book.title);
    setSuggestions([]);
    // console.log("Tìm kiếm:", id);
    // handleSearch();
    router.push(`/book-detail/${book.id}`); // Chuyển hướng đến trang sách
  };

  const handleSearch = async () => {
    try {
      let res;

      if (!searchTerm.trim()) {
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/book`);
      } else {
        res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/book/search2`,
          {
            params: { query: searchTerm },
          }
        );
      }
      saveSearchTermToCache(searchTerm.trim());
      const data = res?.data || [];

      const convertedBooks = Array.isArray(data)
        ? data.map((book) => ({
            id: book.maSach,
            imageSrc: book.hinhAnh[0],
            available:
              book.tongSoLuong - book.soLuongMuon - book.soLuongXoa > 0,
            title: book.tenSach,
            author: book.tenTacGia,
            publisher: book.nxb,
            borrowCount: book.soLuongMuon,
          }))
        : [];

      setBooks(convertedBooks);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách:", error);
      setBooks([]); // Nếu có lỗi cũng để trống
    }
  };

  const handleLogin = () => {
    router.push("/user-login");
  };
  useEffect(() => {
    setSearchTerm("");
    setSuggestions([]);
  }, [pathname]);

  return (
    <header className="bg-white text-blue-300 shadow-lg fixed top-0 left-0 w-full z-50 h-[64px] border-b-2 border-blue-300">
      <Disclosure as="nav" className="mx-auto">
        {({ open }) => (
          <>
            <div className="flex justify-between items-center h-14 px-2 md:px-5">
              {/* Logo */}
              <div className="flex items-center ml-16">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/logoN.png"
                    alt="Logo"
                    width={100}
                    height={55}
                  />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:flex space-x-15 ml-20">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-lg font-medium transition duration-200 ${
                      pathname === item.href
                        ? "bg-blue-200 text-white"
                        : "hover:bg-blue-200 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right Icons */}
              <div className="flex items-center space-x-4">
                <div className="hidden lg:flex mx-4 items-center justify-center ml-8 mr-8 w-[300px]">
                  <div className="relative w-[300px]">
                    <div className="flex items-center px-4 py-2 bg-white border border-blue-300 rounded-full shadow-md">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/669888cc237b300e928dbfd847b76e4236ef4b5a?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
                        alt="Search icon"
                        className="w-5 h-5"
                      />
                      <input
                        type="search"
                        id="search-input"
                        placeholder="Tìm kiếm sách"
                        className="flex-1 text-sm bg-transparent border-none outline-none px-2 text-gray-400 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                      />
                    </div>

                    {suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-[250px] overflow-y-auto">
                        {suggestions.map((book, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleSelect(book)}
                            onMouseDown={(e) => e.preventDefault()}
                            className="px-4 py-2 cursor-pointer hover:bg-[#f2f2f2] transition-colors text-black"
                          >
                            <strong>{book.title}</strong>
                            {book.author && ` — ${book.author}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <Menu as="div" className="relative">
                  <Menu.Button
                    onClick={handleLogin}
                    className="text-blue-300 font-medium px-4 py-2 rounded-md hover:bg-blue-100 transition mr-6"
                  >
                    Đăng nhập / Đăng ký
                  </Menu.Button>
                </Menu>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <DisclosureButton className="p-2 rounded-md hover:bg-blue-700">
                  {open ? (
                    <X className="size-6" />
                  ) : (
                    <MenuIcon className="size-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <DisclosurePanel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                      pathname === item.href
                        ? "bg-white text-[#052259]"
                        : "hover:bg-blue-700 hover:text-gray-100"
                    }`}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </header>
  );
};

export default HeaderNoLogin;
