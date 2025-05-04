"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LeftSideBar from "../../components/LeftSideBar";
import ChatBotButton from "../../components/ChatBoxButton";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import BookReview from "../../../components/ui/bookreview";
import axios from "axios";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  // map enum sang label
  const statusMap = {
    CON_SAN: { label: "Còn sẵn", icon: <CheckCircle className="text-green-500" />, available: true },
    DA_HET:  { label: "Đã hết",   icon: <XCircle className="text-red-500" />,   available: false },
    DA_XOA:  { label: "Đã xóa",   icon: <XCircle className="text-red-500" />,   available: false },
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data: book } = await axios.get(
          `http://localhost:8080/api/book/${id}`
        );

        setDetails({
          ...book,
        });
      } catch (err) {
        console.error("Lỗi khi fetch chi tiết sách:", err);
      }
    };
    fetchBook();
  }, [id]);

  if (!details) {
    return (
      <div className="flex items-center justify-center h-64">
        <span>Loading...</span>
      </div>
    );
  }

  const { label, icon, available } = statusMap[details.trangThai] || statusMap.CON_SAN;

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <main className="pt-16 flex">
        <LeftSideBar />
        <section className="flex-1 pr-5 md:pl-64 ml-5 mt-2">
          {/* Chi tiết chính */}
          <div className="flex flex-col p-6 bg-white rounded-xl shadow-md md:flex-row gap-6">
            <img
              src={details.hinhAnh?.[0] || ""}
              alt={details.tenSach}
              className="w-40 md:w-52 rounded-lg shadow-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-blue-900">
                {details.tenSach}
              </h1>
              <p className="text-gray-700 font-semibold">
                Tác giả: {details.tenTacGia}
              </p>
              <p>
                <span className="font-semibold">Thể loại:</span> {details.categoryChild?.tenTheLoaiCon || details.categoryChild?.name || "—"}
              </p>
              <p>
                <span className="font-semibold">NXB:</span> {details.nxb}
              </p>
              <p className="flex items-center gap-2 font-semibold">
                {icon} Trạng thái: {label}
              </p>
              <p>
                <span className="font-semibold">Lượt mượn:</span> {details.soLuongMuon} lượt
              </p>
              <Button
                disabled={!available}
                className={`mt-4 font-semibold py-2 px-4 rounded-lg ${available ? 'bg-[#062D76] hover:bg-[#E6EAF1] hover:text-[#062D76] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              >
                Mượn sách
              </Button>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-medium bg-[#E6EAF1] text-[#062D76] p-2 rounded-lg w-fit">
              Thông tin chi tiết
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <p>
                <span className="font-semibold">Mã sách:</span>{" "}
                {details.maSach}
              </p>
              <p>
                <span className="font-semibold">Năm XB:</span> {details.nam}
              </p>
              <p>
                <span className="font-semibold">Trọng lượng:</span>{" "}
                {details.trongLuong} g
              </p>
              <p>
                <span className="font-semibold">Đơn giá:</span>{" "}
                {details.donGia} đ
              </p>
              <p>
                <span className="font-semibold">Tổng số lượng:</span>{" "}
                {details.tongSoLuong}
              </p>
            </div>
          </div>

          {/* Giới thiệu */}
          <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-medium bg-[#E6EAF1] text-[#062D76] p-2 rounded-lg w-fit">
              Giới thiệu
            </h2>
            <p className="mt-6 text-gray-800 leading-relaxed">
              {details.moTa || "Chưa có mô tả."}
            </p>
          </div>

          {/* Reviews */}
          <div className="mt-6">
              <BookReview bookId={details.maSach} /> </div>
            </section>
            <ChatBotButton />       
      </main>
    </div>
  );
};

export default BookDetailsPage;