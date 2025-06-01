"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";
import { Plus, Search, ReceiptText, Timer, DollarSign } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import toast from "react-hot-toast";


const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [allFines, setAllFines] = useState([]);
  const [filterFines, setFilterFines] = useState([]); // khi tìm kiếm
  const [mode, setMode] = useState(0); // 0 là chưa thanh toán, 1 là đã thanh toán
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;




  const handleSearch = () => {
    if (searchQuery) {
      setLoading(true);
      const filterFine = filteredCards.filter((card) =>
        card.id.toString() === searchQuery || // tìm theo id
        card?.userId.toLowerCase().includes(searchQuery.toLowerCase()) // tìm theo userId
          ? card
          : null
      );
      setFilterFines(filterFine);
      setTotalPages(Math.ceil(filterFine.length / itemsPerPage));
      setLoading(false);
      if (filterFine.length < 1) toast.error("Không tìm thấy kết quả");
    } else {
      setFilterFines([]);
      setTotalPages(Math.ceil(filteredCards.length / itemsPerPage));
    }
  };

  const filteredCards = allFines?.filter((card) => {
    if (mode === 0) return card.trangThai === "CHUA_THANH_TOAN";
    if (mode === 1) return card.trangThai === "DA_THANH_TOAN";
    return false;
  });

  const route = useRouter();
  const handleAddFine = () => {
    route.push(`/fine/addFine`);
  };
  const handleDetail = (MaPhat) => {
    route.push(`/fine/${MaPhat}`);
  };

  const fetchFine = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/fines`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        console.log("Không tìm thấy phiếu phạt nào");
        setLoading(false);
        return;
      }
      const res = await response.json();
      setAllFines(res);
      setTotalPages(Math.ceil(res.length / itemsPerPage));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFine();
    setMode(0);
    setSearchQuery("");
    handleSearch();
  }, []);

  const FineCard = ({ fine }) => {
    return (
      <div className="flex bg-white w-full rounded-lg mt-2 relative drop-shadow-lg p-5 gap-[20px] md:gap-[50px] items-center">
        <div className="flex flex-col gap-[10px] relative w-full">
          <p className="font-bold">ID: {fine.id}</p>
          <p className="">User ID: {fine.userId.id}</p>
          <p className="font-bold">Số Tiền: {fine.soTien} đồng</p>
          <p className="">Nội Dung: {fine.noiDung}</p>
        </div>
        <div className="w-full flex justify-end mr-10">
          <Button
            title={"Xem Chi Tiết"}
            className="w-15 md:w-60 h-10 bg-[#062D76] hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              handleDetail(fine.id);
            }}
          >
            <ReceiptText className="w-5 h-5" color="white" />
            <p className="hidden md:block">Xem chi tiết</p>
          </Button>
        </div>
      </div>
    );
  };

  // Phân trang
  const paginatedFines = (filterFines?.length > 0 ? filterFines : filteredCards)
    ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-row w-full min-h-screen h-full bg-[#EFF3FB]">
      <Sidebar />
      <div className="flex w-full flex-col py-6 md:ml-52 relative mt-5 gap-2 items-center px-10">
        <div className="flex w-full items-center h-[10px] justify-between mb-10">
          <div className="flex w-1/2 gap-10">
            <Button
              title={"Chưa Thanh Toán"}
              className={`w-50 h-10 cursor-pointer ${
                mode === 0 ? "bg-[#062D76]" : "bg-[#b6cefa]"
              } hover:bg-gray-500 font-bold rounded-[10px] overflow-hidden`}
              onClick={() => {
                setMode(0);
                setSearchQuery("");
                setFilterFines([]);
                setCurrentPage(1);
              }}
            >
              <Timer className="w-5 h-5" color="white" />
              Chưa Thanh Toán
            </Button>
            <Button
              title={"Đã Thanh Toán"}
              className={`w-50 h-10 cursor-pointer ${
                mode === 1 ? "bg-[#062D76]" : "bg-[#b6cefa]"
              } hover:bg-gray-500 font-bold rounded-[10px] overflow-hidden`}
              onClick={() => {
                setMode(1);
                setSearchQuery("");
                setFilterFines([]);
                setCurrentPage(1);
              }}
            >
              <DollarSign className="w-5 h-5" color="white" />
              Đã Thanh Toán
            </Button>
          </div>
          <div className="flex gap-5">
            <Input
              type="text"
              placeholder="Tìm kiếm"
              className="w-xs md:w-2xl h-10 font-thin italic text-black text-2xl bg-white rounded-[10px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              title={"Tìm kiếm"}
              className="w-10 h-10 cursor-pointer text-[20px] bg-[#062D76] hover:bg-gray-700 font-bold rounded-[10px] overflow-hidden"
              onClick={() => {
                handleSearch();
              }}
            >
              <Search className="w-10 h-10" color="white" />
            </Button>
          </div>
        </div>
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
        ) : paginatedFines?.length > 0 ? (
          paginatedFines.map((fine) => <FineCard key={fine?.id} fine={fine} />)
        ) : (
          <p className="text-center text-gray-600">Không có phiếu phạt nào.</p>
        )}
        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-[#062D76] text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Trang trước
          </Button>
          <span className="px-4 py-2 text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-[#062D76] text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Trang sau
          </Button>
        </div>
        {/* Nút Thêm - Floating Button */}
        <div className={`fixed bottom-10 right-10 ${mode === 0 ? "" : "hidden"}`}>
          <Button
            title={"Thêm Phiếu Phạt"}
            className="bg-[#062D76] rounded-3xl w-12 h-12"
            onClick={() => {
              handleAddFine();
            }}
          >
            <Plus className="w-24 h-24" color="white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;