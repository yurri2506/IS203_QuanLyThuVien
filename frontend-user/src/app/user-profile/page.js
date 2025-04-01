"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Đỗ Mai Tường Vy",
    studentId: "22521701",
    email: "tuongvy@gmail.com",
    birthDate: "01/01/2004",
    phone: "0868882744",
    joinDate: "20/08/2023",
  });
  useEffect(() => {
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    localStorage.setItem("profileData", JSON.stringify(formData));
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="w-[1260px] h-[630px] ml-63 mt-4 p-15 bg-white rounded-2xl flex flex-col gap-12 overflow-y-auto">
      {/* Profile Header */}
      <div className="w-full flex justify-between items-start">
        <div className="flex items-center gap-3.5">
          <div className="w-25 h-25 bg-gray-300 rounded-full" />
          <Image
            src="/images/logo.jpg"
            alt="User Avatar"
            width={119}
            height={119}
            className="w-25 h-25 rounded-full"
          />
          <div className="flex flex-col gap-3">
            <h2 className="text-neutral-900 text-xl font-semibold">Vy Đỗ</h2>
            <p className="text-neutral-900 text-opacity-50 text-l font-medium">
              {formData.email}
            </p>
          </div>
        </div>
        <Button
          onClick={toggleEdit}
          className="w-20 p-3 bg-blue-300 rounded-2xl text-white text-l font-medium"
        >
          {isEditing ? "Lưu" : "Sửa"}
        </Button>
      </div>

      {/* Personal Information */}
      <Section title="Thông tin cá nhân">
        <InfoRow
          label="Họ và tên"
          name="fullName"
          value={formData.fullName}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoRow
          label="MSSV"
          name="studentId"
          value={formData.studentId}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoRow
          label="Gmail"
          name="email"
          value={formData.email}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoRow
          label="Ngày sinh"
          name="birthDate"
          value={formData.birthDate}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoRow
          label="Số điện thoại"
          name="phone"
          value={formData.phone}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoRow
          label="Ngày tham gia"
          name="joinDate"
          value={formData.joinDate}
          isEditing={false}
        />
      </Section>

      {/* Borrowing Information */}
      <Section title="Thông tin mượn sách">
        <div className="flex gap-3">
          <StatCard number={8} label="Tài liệu đang mượn" />
          <StatCard number={4} label="Tài liệu quá hạn" />
        </div>
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-7 w-full">
    <div className="bg-slate-200 w-[280px] text-center px-6 py-3 rounded-lg text-sky-900 text-2xl">
      {title}
    </div>
    <div className="grid grid-cols-2 gap-16">{children}</div>
  </div>
);

const InfoRow = ({ label, name, value, isEditing, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-black text-xl font-medium">{label}</label>
    {isEditing ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="px-2.5 py-3.5 border-b border-black bg-gray-100 text-black text-l font-normal"
      />
    ) : (
      <div className="px-2.5 py-3.5 border-b border-black">
        <p className="text-black text-l font-normal">{value}</p>
      </div>
    )}
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="flex-1 p-6 bg-slate-200 rounded-2xl flex flex-col gap-6">
    <span className="text-sky-900 text-xl font-normal">{number}</span>
    <span className="text-sky-900 text-l font-medium">{label}</span>
  </div>
);

const page = () => {
  return (
    <div className="pt-16 flex flex-1 bg-[#E6EAF1]">
      <LeftSideBar />
      <ProfileCard />
    </div>
  );
};

export default page;
