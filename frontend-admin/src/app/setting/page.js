"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { ThreeDot } from "react-loading-indicators";
import toast from "react-hot-toast";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { CircleCheck } from "lucide-react";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [fine, setFine] = useState(0);
  const [wait, setWait] = useState(0);
  const [borrow, setBorrow] = useState(0);
  const [startMail, setStartMail] = useState(0);
  const fetchSetting = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/settings", {
        method: "GET",
      });
      if (!res.ok) throw new Error("Không thể tải cài đặt.");
      const result = await res.json();
      setFine(result?.finePerDay?result?.finePerDay:3000)
      setWait(result?.waitingToTake?result?.waitingToTake:3)
      setBorrow(result?.borrowDay?result?.borrowDay:21)
      setStartMail(result?.startToMail?result?.startToMail:3)
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    setLoading(true);
    fetchSetting();
    setLoading(false);
  }, []);
  const handleSubmit = async()=>{
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          finePerDay:fine,
          waitingToTake:wait,
          borrowDay:borrow,
          startToMail: startMail
        }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      const data = await res.json();
      setFine(data?.finePerDay);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    fetchSetting()
    setLoading(false);
    toast.success("Lưu cài đặt thành công")
  }
  return (
    <div className="flex flex-row w-full min-h-screen h-full bg-[#EFF3FB]">
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
        <div className="flex w-full flex-col py-6 md:ml-52 relative mt-10 gap-2 items-center px-10">
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Số tiền phạt/ngày</p>
            <Input
              type="number"
              placeholder="Nhập số tiền phạt"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={fine}
              onChange={(e) => setFine(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Số ngày chờ nhận sách tối đa</p>
            <Input
              type="number"
              placeholder="Nhập số ngày chờ"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={wait}
              onChange={(e) => setWait(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Số ngày mượn sách tối đa</p>
            <Input
              type="number"
              placeholder="Nhập số tiền phạt"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={borrow}
              onChange={(e) => setBorrow(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Số ngày bắt đầu gửi email</p>
            <Input
              type="number"
              placeholder="Nhập số tiền phạt"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={startMail}
              onChange={(e) => setStartMail(e.target.value)}
            />
          </div>

          <div className="w-full bottom-0 px-10 right-0 md:w-[calc(100%-208px)] fixed h-18 bg-white flex items-center justify-end">
            {/*Control Bar*/}
            <Button
              title={"Hoàn Tất"}
              className={`rounded-3xl w-40 h-12 bg-[#062D76]`}
              onClick={() => {
                handleSubmit();
              }}
            >
              <CircleCheck className="w-12 h-12" color="white" />
              Hoàn Tất
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;