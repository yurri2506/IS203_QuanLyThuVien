"use client";
import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";
import useSidebarStore from "@/store/sideBarStore";

// Icons Components
const BackIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38 14V26C38 28.206 36.208 30 34 30H6V24H32V16H10V20L2 13L10 6V10H34C35.0609 10 36.0783 10.4214 36.8284 11.1716C37.5786 11.9217 38 12.9391 38 14Z"
      fill="white"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.346 0C11.7173 0 12.0734 0.1475 12.3359 0.410051C12.5985 0.672601 12.746 1.0287 12.746 1.4V4.018H27.78V1.418C27.78 1.0467 27.9275 0.690601 28.1901 0.428051C28.4526 0.1655 28.8087 0.018 29.18 0.018C29.5513 0.018 29.9074 0.1655 30.1699 0.428051C30.4325 0.690601 30.58 1.0467 30.58 1.418V4.018H36C37.0605 4.018 38.0776 4.43915 38.8277 5.18887C39.5778 5.93858 39.9995 6.95548 40 8.016V36.002C39.9995 37.0625 39.5778 38.0794 38.8277 38.8291C38.0776 39.5788 37.0605 40 36 40H4C2.93948 40 1.92237 39.5788 1.17228 38.8291C0.422192 38.0794 0.00053026 37.0625 0 36.002L0 8.016C0.00053026 6.95548 0.422192 5.93858 1.17228 5.18887C1.92237 4.43915 2.93948 4.018 4 4.018H9.946V1.398C9.94653 1.02704 10.0943 0.671462 10.3568 0.409343C10.6193 0.147225 10.975 -3.78527e-07 11.346 0Z"
      fill="white"
    />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.0001 33.3334C9.08341 33.3334 8.29897 33.0072 7.64675 32.355C6.99453 31.7028 6.66786 30.9178 6.66675 30V26.6667C6.66675 26.1945 6.82675 25.7989 7.14675 25.48C7.46675 25.1611 7.8623 25.0011 8.33341 25C8.80453 24.9989 9.20064 25.1589 9.52175 25.48C9.84286 25.8011 10.0023 26.1967 10.0001 26.6667V30H30.0001V26.6667C30.0001 26.1945 30.1601 25.7989 30.4801 25.48C30.8001 25.1611 31.1956 25.0011 31.6667 25C32.1379 24.9989 32.534 25.1589 32.8551 25.48C33.1762 25.8011 33.3356 26.1967 33.3334 26.6667V30C33.3334 30.9167 33.0073 31.7017 32.3551 32.355C31.7029 33.0084 30.9179 33.3345 30.0001 33.3334H10.0001ZM18.3334 13.0834L15.2084 16.2084C14.8751 16.5417 14.4795 16.7017 14.0217 16.6884C13.564 16.675 13.1679 16.5011 12.8334 16.1667C12.5279 15.8334 12.3679 15.4445 12.3534 15C12.339 14.5556 12.499 14.1667 12.8334 13.8334L18.8334 7.83336C19.0001 7.66669 19.1806 7.54891 19.3751 7.48003C19.5695 7.41114 19.7779 7.37614 20.0001 7.37503C20.2223 7.37391 20.4306 7.40891 20.6251 7.48003C20.8195 7.55114 21.0001 7.66891 21.1667 7.83336L27.1667 13.8334C27.5001 14.1667 27.6601 14.5556 27.6467 15C27.6334 15.4445 27.4734 15.8334 27.1667 16.1667C26.8334 16.5 26.4379 16.6739 25.9801 16.6884C25.5223 16.7028 25.1262 16.5428 24.7917 16.2084L21.6667 13.0834V25C21.6667 25.4722 21.5067 25.8684 21.1867 26.1884C20.8667 26.5084 20.4712 26.6678 20.0001 26.6667C19.529 26.6656 19.1334 26.5056 18.8134 26.1867C18.4934 25.8678 18.3334 25.4722 18.3334 25V13.0834Z"
      fill="white"
    />
  </svg>
);

const DropdownIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.6665 16.6665L19.9998 24.9998L28.3332 16.6665H11.6665Z"
      fill="#D66766"
    />
  </svg>
);

const CompletedIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29.1211 11.6211L30.8789 13.3789L16.25 28.0078L9.12109 20.8789L10.8789 19.1211L16.25 24.4922L29.1211 11.6211ZM20 0C21.8359 0 23.6068 0.234375 25.3125 0.703125C27.0182 1.17188 28.6133 1.84245 30.0977 2.71484C31.582 3.58724 32.9297 4.62891 34.1406 5.83984C35.3516 7.05078 36.3932 8.40495 37.2656 9.90234C38.138 11.3997 38.8086 12.9948 39.2773 14.6875C39.7461 16.3802 39.987 18.151 40 20C40 21.8359 39.7656 23.6068 39.2969 25.3125C38.8281 27.0182 38.1576 28.6133 37.2852 30.0977C36.4128 31.582 35.3711 32.9297 34.1602 34.1406C32.9492 35.3516 31.5951 36.3932 30.0977 37.2656C28.6003 38.138 27.0052 38.8086 25.3125 39.2773C23.6198 39.7461 21.849 39.987 20 40C18.1641 40 16.3932 39.7656 14.6875 39.2969C12.9818 38.8281 11.3867 38.1576 9.90234 37.2852C8.41797 36.4128 7.07031 35.3711 5.85938 34.1602C4.64844 32.9492 3.60677 31.5951 2.73438 30.0977C1.86198 28.6003 1.19141 27.0117 0.722656 25.332C0.253906 23.6523 0.0130208 21.875 0 20C0 18.1641 0.234375 16.3932 0.703125 14.6875C1.17188 12.9818 1.84245 11.3867 2.71484 9.90234C3.58724 8.41797 4.62891 7.07031 5.83984 5.85938C7.05078 4.64844 8.40495 3.60677 9.90234 2.73438C11.3997 1.86198 12.9883 1.19141 14.668 0.722656C16.3477 0.253906 18.125 0.0130208 20 0Z"
      fill="white"
    />
  </svg>
);

// Back Button Component
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-center items-center p-2.5 bg-red-400 rounded-xl h-[60px] w-[60px]"
    aria-label="Go back"
  >
    <BackIcon />
  </button>
);

// Input Field Component
const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
}) => (
  <div className="flex flex-col gap-5">
    <label className="text-2xl font-bold text-black">{label}</label>
    {disabled ? (
      <div className="p-3 w-full text-2xl rounded-xl shadow-sm bg-zinc-300 h-[53px] text-neutral-500">
        {value}
      </div>
    ) : (
      <div className="flex items-center p-3 w-full bg-white rounded-xl shadow-sm h-[53px]">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full text-2xl text-black bg-transparent border-[nonepx]"
        />
      </div>
    )}
  </div>
);

// Date Picker Field Component
const DatePickerField = ({ value, onChange }) => (
  <div className="flex flex-col gap-5 w-[580px] max-md:w-full">
    <label className="text-2xl font-bold text-black">Ngày Sinh</label>
    <div className="flex gap-5">
      <div className="flex items-center p-3 bg-white rounded-xl shadow-sm h-[53px] w-[500px]">
        <input
          type="text"
          placeholder="Chọn ngày sinh"
          value={value}
          onChange={onChange}
          className="w-full text-2xl text-black bg-transparent border-[nonepx]"
        />
      </div>
      <button
        className="flex justify-center items-center p-2.5 bg-red-400 rounded-xl h-[60px] w-[60px]"
        aria-label="Open calendar"
      >
        <CalendarIcon />
      </button>
    </div>
  </div>
);

// Avatar Upload Component
const AvatarUpload = ({ avatarUrl, onUpload }) => (
  <div className="flex flex-col gap-5 w-[380px]">
    <h2 className="text-2xl font-bold text-black">Ảnh Đại Diện</h2>
    <div className="flex flex-col gap-8 items-center">
      <div
        className="border border-red-400 bg-zinc-300 h-[200px] rounded-[100px] w-[200px]"
        style={
          avatarUrl
            ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover" }
            : {}
        }
      />
      <button
        onClick={onUpload}
        className="flex gap-5 justify-center items-center p-2.5 bg-red-400 rounded-xl h-[60px] w-[300px]"
      >
        <UploadIcon />
        <span className="text-xl font-bold text-white">Tải ảnh đại diện</span>
      </button>
    </div>
  </div>
);

// Role Selector Component
const RoleSelector = ({ value, onChange }) => (
  <div className="flex flex-col gap-5 w-[500px] max-md:w-full">
    <label className="text-2xl font-bold text-black">Vai Trò</label>
    <button
      onClick={onChange}
      className="flex justify-between items-center p-3 w-full bg-white rounded-xl shadow-sm h-[53px]"
    >
      <span className="text-2xl text-black">{value}</span>
      <DropdownIcon />
    </button>
  </div>
);

// Complete Button Component
const CompleteButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex gap-5 justify-center p-5 h-20 bg-red-400 rounded-xl w-[350px]"
  >
    <CompletedIcon />
    <span className="text-3xl font-bold text-white">Hoàn Tất</span>
  </button>
);

// Main Component
function page() {
  const { isSidebarOpen } = useSidebarStore();
  const [formData, setFormData] = useState({
    id: "125",
    username: "",
    email: "",
    phone: "",
    birthDate: "",
    avatar: "",
    role: "Người Dùng",
  });

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAvatarUpload = () => {
    // Implement avatar upload logic
  };

  const handleComplete = () => {
    // Implement form submission logic
  };

  const handleBack = () => {
    // Implement navigation logic
  };

  return (
    <div className="flex flex-row w-full h-full bg-[#EFF3FB] ">
      <Sidebar />
      <main
        className={`flex-1 py-6 px-10 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-6" : "md:ml-0"
        }`}
      >
        <section className="flex flex-col gap-5 p-8">
          <BackButton onClick={handleBack} />

          <form className="flex flex-col gap-5 w-full max-w-[1351px]">
            <div className="flex flex-col gap-5">
              <InputField label="ID (Tự Động)" value={formData.id} disabled />

              <InputField
                label="Tên Người Dùng"
                placeholder="Nhập tên người dùng..."
                value={formData.username}
                onChange={handleInputChange("username")}
              />

              <InputField
                label="Email"
                type="email"
                placeholder="Nhập email..."
                value={formData.email}
                onChange={handleInputChange("email")}
              />

              <div className="flex flex-wrap gap-5 max-md:flex-col">
                <div className="flex flex-col gap-5 w-[500px] max-md:w-full">
                  <InputField
                    label="Số Điện Thoại"
                    type="tel"
                    placeholder="Nhập số điện thoại..."
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                  />
                </div>

                <DatePickerField
                  value={formData.birthDate}
                  onChange={handleInputChange("birthDate")}
                />
              </div>

              <div className="flex flex-wrap gap-52 max-md:flex-col max-md:gap-5">
                <AvatarUpload
                  avatarUrl={formData.avatar}
                  onUpload={handleAvatarUpload}
                />

                <RoleSelector
                  value={formData.role}
                  onChange={() => {
                    /* Implement role selection logic */
                  }}
                />
              </div>
            </div>
          </form>
        </section>

        <footer className="fixed bottom-0 left-[250px] w-[calc(100%-250px)] px-4 py-2.5 bg-white shadow-sm h-[100px] flex justify-end items-center">
          <CompleteButton onClick={handleComplete} />
        </footer>
      </main>
    </div>
  );
}

export default page;
