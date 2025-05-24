"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSidebarStore from "@/store/sidebarStore";
import axios from "axios";

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "Chưa cập nhật",
    studentId: "Chưa cập nhật",
    email: "Chưa cập nhật",
    birthdate: "Chưa cập nhật",
    phone: "Chưa cập nhật",
    joinDate: "Chưa cập nhật",
    avatar_url: null, // Sử dụng null thay vì "Chưa cập nhật"
  });

  // Hàm định dạng ngày từ yyyy-MM-dd sang dd/MM/yyyy
  const formatDateForDisplay = (date) => {
    if (!date || date === "Chưa cập nhật") return date;
    try {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return "Chưa cập nhật";
    }
  };

  // Hàm kiểm tra và trả về URL ảnh hợp lệ
  const getValidImageUrl = (url) => {
    if (!url) return null; // Trả về null nếu không có URL
    return url.startsWith("http") ? url : `http://localhost:8080${url}`; // Chuyển URL tương đối thành tuyệt đối
  };

  // Hàm validate dữ liệu
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{3,11}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (formData.email && !emailRegex.test(formData.email)) {
      setMessage("Email không hợp lệ");
      setIsError(true);
      return false;
    }
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setMessage("Số điện thoại không hợp lệ (10-11 số)");
      setIsError(true);
      return false;
    }
    if (
      formData.birthdate &&
      formData.birthdate !== "Chưa cập nhật" &&
      !dateRegex.test(formData.birthdate)
    ) {
      setMessage("Ngày sinh phải có định dạng yyyy-MM-dd");
      setIsError(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const user = response.data;
        setFormData({
          fullName: user.fullname || "Chưa cập nhật",
          studentId: user.id || "Chưa cập nhật",
          email: user.email || "Chưa cập nhật",
          birthdate: user.birthdate || "Chưa cập nhật",
          phone: user.phone || "Chưa cập nhật",
          joinDate: user.joined_date || "Chưa cập nhật",
          avatar_url: user.avatar_url || null, // Gán null nếu avatar_url là null
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        if (error.response?.status === 401) {
          setMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          // TODO: Chuyển hướng đến trang đăng nhập
        } else {
          setMessage("Không thể tải thông tin người dùng");
        }
        setIsError(true);
      }
    };

    if (id) {
      fetchUserInfo();
    } else {
      setMessage("Không tìm thấy ID người dùng");
      setIsError(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
      setMessage("");
    } else {
      setMessage("Vui lòng chọn file ảnh (JPG, PNG, v.v.)");
      setIsError(true);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const id = localStorage.getItem("id");
    const updates = {
      fullname: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      birthdate: formData.birthdate,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/user/${id}`,
        updates,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      if (data.message.includes("OTP")) {
        setShowOtpInput(true);
        setMessage("Vui lòng nhập OTP được gửi tới email mới");
        setIsError(false);
      } else {
        setFormData((prev) => ({
          ...prev,
          fullName: data.data.fullname || prev.fullName,
          phone: data.data.phone || prev.phone,
          email: data.data.email || prev.email,
          birthdate: data.data.birthdate || prev.birthdate,
          avatar_url: data.data.avatar_url || null,
        }));

        const persistedRoot = JSON.parse(
          localStorage.getItem("persist:root") || "{}"
        );
        localStorage.setItem(
          "persist:root",
          JSON.stringify({
            ...persistedRoot,
            fullname: data.data.fullname,
            phone: data.data.phone,
            email: data.data.email,
            birthdate: data.data.birthdate,
            avatar_url: data.data.avatar_url || null,
          })
        );

        setMessage("Cập nhật thông tin thành công");
        setIsError(false);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      if (error.response?.status === 401) {
        setMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        // TODO: Chuyển hướng đến trang đăng nhập
      } else {
        setMessage(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật thông tin"
        );
      }
      setIsError(true);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setMessage("Vui lòng chọn file ảnh");
      setIsError(true);
      return;
    }

    const id = localStorage.getItem("id");
    if (!id) {
      setMessage("Không tìm thấy thông tin ID người dùng");
      setIsError(true);
      return;
    }

    console.log("Uploading avatar for ID:", id); // Debug log

    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", avatarFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/upload-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        avatar_url: response.data.data.avatar_url,
      }));

      setMessage("Upload ảnh đại diện thành công");
      setIsError(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      const errorMsg =
        error.response?.data?.message || "Có lỗi xảy ra khi upload ảnh";
      setMessage(errorMsg);
      setIsError(true);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/verify-email-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email: formData.email, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Xác thực OTP thất bại");
        setIsError(true);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        email: data.data.email,
      }));

      const persistedRoot = JSON.parse(
        localStorage.getItem("persist:root") || "{}"
      );
      localStorage.setItem(
        "persist:root",
        JSON.stringify({
          ...persistedRoot,
          email: data.data.email,
        })
      );

      setMessage("Xác thực email thành công");
      setIsError(false);
      setShowOtpInput(false);
      setOtp("");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi xác thực OTP:", error);
      if (error.response?.status === 401) {
        setMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setMessage(
          error.response?.data?.message || "Có lỗi xảy ra khi xác thực OTP"
        );
      }
      setIsError(true);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setMessage("");
    setShowOtpInput(false);
    setOtp("");
    setAvatarFile(null);
  };

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

  return (
    <div
      className={`flex-1 py-4 px-0 transition-all duration-300 ${
        isSidebarOpen ? "md:ml-64" : "md:ml-0"
      }`}
    >
      <div className="p-15 bg-white rounded-2xl flex flex-col overflow-y-auto">
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="w-full flex justify-between items-start">
          <div className="flex items-center gap-3.5">
            {formData.avatar_url ? (
              <img
                src={getValidImageUrl(formData.avatar_url)}
                alt="User Avatar"
                width={100}
                height={100}
                className="w-[100px] h-[100px] rounded-full object-cover"
                onError={() =>
                  setFormData((prev) => ({ ...prev, avatar_url: null }))
                }
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Avatar
              </div>
            )}
            <div className="flex flex-col gap-3">
              <h2 className="text-neutral-900 text-xl font-semibold">
                {formData.fullName}
              </h2>
              <p className="text-neutral-900 text-opacity-50 text-l font-medium">
                {formData.email}
              </p>
            </div>
          </div>
          <Button
            onClick={isEditing ? handleSave : toggleEdit}
            className="w-20 p-3 bg-blue-300 rounded-2xl text-white text-l font-medium hover:bg-blue-400"
          >
            {isEditing ? "Lưu" : "Sửa"}
          </Button>
        </div>

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
            isEditing={false}
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
            name="birthdate"
            value={formatDateForDisplay(formData.birthdate)}
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
            value={formatDateForDisplay(formData.joinDate)}
            isEditing={false}
          />
        </Section>

        {isEditing && (
          <div className="mt-4">
            <label className="text-black text-l font-medium">
              Upload ảnh đại diện
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="px-2.5 py-3.5 border-black bg-gray-100 text-black text-m font-normal w-full"
            />
            <Button
              onClick={handleUploadAvatar}
              className="mt-2 w-20 p-3 bg-blue-300 rounded-2xl text-white text-l font-medium hover:bg-blue-400"
            >
              Upload
            </Button>
          </div>
        )}

        {showOtpInput && (
          <div className="mt-4">
            <label className="text-black text-l font-medium">Nhập OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-2.5 py-3.5 border-black bg-gray-100 text-black text-m font-normal w-full"
              placeholder="Nhập mã OTP"
            />
            <Button
              onClick={handleVerifyOtp}
              className="mt-2 w-20 p-3 bg-blue-300 rounded-2xl text-white text-l font-medium hover:bg-blue-400"
            >
              Xác thực
            </Button>
          </div>
        )}

        <Section title="Thông tin mượn sách">
          <div className="flex gap-3">
            <StatCard number={8} label="Tài liệu đang mượn" />
            <StatCard number={4} label="Tài liệu quá hạn" />
          </div>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-7 w-full">
    <div className="bg-slate-200 w-fit text-center px-6 py-3 mt-4 rounded-lg text-sky-900 text-[18px]">
      {title}
    </div>
    <div className="grid grid-cols-2 gap-10">{children}</div>
  </div>
);

const InfoRow = ({ label, name, value, isEditing, onChange }) => (
  <div className="flex flex-col gap-3">
    <label className="text-black text-l font-medium">{label}</label>
    {isEditing ? (
      <input
        type={name === "birthdate" ? "date" : "text"}
        name={name}
        value={
          name === "birthdate" ? value.split("/").reverse().join("-") : value
        }
        onChange={onChange}
        className="px-2.5 py-3.5 border-black bg-gray-100 text-black text-m font-normal"
      />
    ) : (
      <div className="px-2.5 py-3.5 border-b border-black">
        <p className="text-black text-m font-normal">{value}</p>
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

const Page = () => {
  return (
    <div className="pt-16 ml-60 flex flex-1 gap-5 bg-[#E6EAF1]">
      <LeftSideBar />
      <ProfileCard />
    </div>
  );
};

export default Page;
