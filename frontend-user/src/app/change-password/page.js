"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import LeftSideBar from "../components/LeftSideBar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
  newPassword: yup
    .string()
    .required("Vui lòng nhập mật khẩu mới")
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .notOneOf(
      [yup.ref("currentPassword")],
      "Mật khẩu mới không được trùng mật khẩu cũ"
    ),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu mới")
    .oneOf([yup.ref("newPassword")], "Xác nhận mật khẩu không khớp"),
});

const ChangePassword = () => {
  const [user, setUser] = useState({ name: "", email: "", avatar: null });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id");
        const accessToken = localStorage.getItem("accessToken");

        if (!userId || !accessToken) {
          toast.error(
            "Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại."
          );
          setTimeout(() => handleLogin(), 1000);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const userData = response.data;
        setUser({
          name: userData.username || userData.fullname || "Người dùng",
          email: userData.email || "",
          avatar: userData.avatar_url || null,
        });
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Không thể lấy thông tin người dùng. Vui lòng thử lại."
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          setTimeout(() => handleLogin(), 1000);
        }
      }
    };

    fetchUserData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const userId = localStorage.getItem("id");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        toast.error(
          "Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại."
        );
        setTimeout(() => handleLogin(), 1000);
        return;
      }

      const response = await axios.put(
        "http://localhost:8080/api/change-password",
        {
          id: userId,
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(response.data.message || "Đổi mật khẩu thành công");
      reset();
      setTimeout(router.push("/Honepage"), 1000); //
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại."
      );
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center pt-16 ml-16">
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <LeftSideBar />
      <div className="flex-1 flex justify-end items-end">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white w-full max-w-[1100px] h-[500px] p-10 mr-0 mb-0 rounded-lg shadow-md"
        >
          <div className="flex items-center gap-4 mb-6">
            {user.avatar ? (
              <img
                className="w-20 h-20 rounded-full"
                src={user.avatar}
                alt="Avatar"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Avatar
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Mật khẩu hiện tại */}
          <div className="mb-4">
            <label className="block text-black">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="w-full p-2 border rounded-xl mt-1 pr-10"
                {...register("currentPassword")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div className="mb-4">
            <label className="block text-black">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full p-2 border rounded-xl mt-1 pr-10"
                {...register("newPassword")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="mb-6">
            <label className="block text-black">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-2 border rounded-xl mt-1 pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-[200px] mx-auto bg-[#6CB1DA] text-white p-3 rounded-lg hover:bg-blue-400"
            >
              Cập nhật tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
