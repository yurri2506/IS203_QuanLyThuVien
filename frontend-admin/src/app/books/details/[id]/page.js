"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useParams } from "next/navigation";
import { CalendarClock, Check, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import Sidebar from "@/app/components/sidebar/Sidebar";

const page = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchPage = async () => {
      try {
        //lấy chi tiết sách
        const response = await fetch(`http://localhost:8081/book/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Lỗi khi lấy sách: ${response.status}`);
        }
        const data = await response.json();
        if (!data) return;
        setBook(data);
        // lấy ds sách con từ id cha
        const res = await fetch(`http://localhost:8081/childrenOf/${data.id}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Không thể lấy danh sách sách");
        }

        const books = await res.json();
        setChildBookList(books);
      } catch (error) {
        console.error("Lỗi fetch:", error);
        return null;
      }
    };
    fetchPage();
    setLoading(false);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [childBookList, setChildBookList] = useState(null);
  const [filterBooks, setFilterBooks] = useState([]);

  const handleSearch = () => {
    if (searchQuery) {
      const filterBook = childBookList?.filter((book) =>
        book.id === searchQuery.trim() //tìm theo id
          ? book
          : null
      );
      if (filterBook.length < 1) toast.error("Không tìm thấy kết quả");
      setFilterBooks(filterBook);
    } else {
      setFilterBooks([]);
    }
  };
  const BookCard = ({ book }) => {
    return (
      <div className="flex bg-white w-full rounded-lg relative drop-shadow-lg px-5 py-3 gap-[10px] md:gap-[30px] items-center">
        <img src={`${book.hinhAnh[0]}`} className="w-[145px] h-[205px]" />
        <div className="flex flex-col gap-[10px] relative w-full">
          <p className="">ID:&nbsp;{book.id}</p>
          <p className="font-bold">Tên sách:&nbsp;{book.tenSach}</p>
          <p className="italic">Tên tác giả: &nbsp;{book.tenTacGia}</p>
          <p className="">Tổng số lượng:&nbsp;{book.tongSoLuong}</p>
          <p className="">
            Còn sẵn:&nbsp;
            {book.tongSoLuong - book.soLuongMuon - book.soLuongXoa}
          </p>
        </div>
        <div className="flex flex-col gap-[10px] relative w-full">
          <p className="">ID thể loại:&nbsp;{book.theLoai}</p>
          <p className="">Thể loại chính:&nbsp;{book.tenTheLoaiCha}</p>
          <p className="">Thể loại phụ&nbsp;{book.tenTheLoaiCon}</p>
          <p className="">Số lượng mượn:&nbsp;{book.soLuongMuon}</p>
          <p className="">Số lượng xóa:&nbsp;{book.soLuongXoa}</p>
        </div>
      </div>
    );
  };
  const ChildBookCard = ({ book }) => {
    return (
      <div className="flex bg-white w-full rounded-lg relative drop-shadow-lg justify-between">
        <div className="flex w-full p-3 gap-2">
          <p className="">ID:&nbsp;{book.id}</p>
          {book.trangThai === "Còn sẵn" ? (
            <Check className="w-5 h-5" color="#2ab23a" />
          ) : book.trangThai === "Đang mượn" ? (
            <CalendarClock className="w-5 h-5" color="#fe9501" />
          ) : (
            <X className="w-5 h-5" color="#f50000" />
          )}
      </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row w-full min-h-screen h-full  bg-[#EFF3FB]">
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
        <div className="flex w-full flex-col py-6 md:ml-52 relative mt-5 gap-2 items-center px-10">
          <div className="flex w-full items-center h-[10px] justify-between mb-5">
            <div className="flex gap-5">
              <Input
                type="text"
                placeholder="Tìm kiếm"
                className="w-sm md:w-3xl h-10 font-thin italic text-black text-2xl bg-white rounded-[10px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                className="w-10 h-10 cursor-pointer text-[20px] bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px] overflow-hidden"
                onClick={() => {
                  handleSearch();
                }}
              >
                <Search className="w-10 h-10" color="white" />
              </Button>
            </div>
          </div>
          {book && <BookCard book={book} />}
          <div className="grid grid-cols-4 gap-4">
            {childBookList &&
              (filterBooks.length > 0 //nếu đang search thì hiện danh sách lọc
                ? filterBooks.map((book) => {
                    return <ChildBookCard key={book?.id} book={book} />;
                  })
                : childBookList.map((book) => {
                    return <ChildBookCard key={book?.id} book={book} />;
                  }))}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;