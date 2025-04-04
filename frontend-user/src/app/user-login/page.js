"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import * as yup from "yup";
/*
const loginSchema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
  password: yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
});

const registerSchema = yup.object().shape({
  username: yup.string().required("Tên không được để trống"),
  email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
  password: yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
});
*/
const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    password: yup
      .string()
      .required("Mật khẩu không được để trống")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  });


  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Logging in with:", email, password);
  };
   
  // Form đăng nhập
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLoginForm,
    formState: { errors: errorsLogin },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmitLogin = async (data) => {
    setIsLoading(true);
    try {
      router.push("/");
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetLoginForm();
  }, [resetLoginForm]);

  //xu ly X
  const handleClose = () => {
    router.push("/");
  };
  return (
    // Thêm pt-16 để đẩy nội dung xuống dưới header (header cao 64px)
    <div className="bg-[#EFF3FB] min-h-screen pt-16 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[450px]">
        <div className="flex justify-end">
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">✖</button>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-semibold text-center text-gray-900">ĐĂNG NHẬP</h2>
        <p className="text-center text-gray-600 mt-1">
          Chưa có tài khoản? <a href="/user-signup" className="text-blue-500 underline">Đăng ký</a>
        </p>

        {/* Dòng "Hoặc" */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-gray-500 px-3">Hoặc</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        {/* Form nhập email/mật khẩu */}
        <form onSubmit={handleSubmitLogin(onSubmitLogin)}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <Input
              {...registerLogin("email")}
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nhập email"
              /*value={email}
              onChange={(e) => setEmail(e.target.value)}
              required*/
            />
            {errorsLogin.email && <p className="text-red-500 text-xs">{errorsLogin.email.message}</p>}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-gray-600 text-sm">Mật khẩu</label>
              <button
                type="button"
                className="flex items-center text-gray-600 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5 ml-1" /> : <Eye className="w-5 h-5 ml-1" />}
                {showPassword ? "Hide" : " Show"}
              </button>
            </div>
            <Input
              {...registerLogin("password")}
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nhập mật khẩu"
            />
            {errorsLogin.password && <p className="text-red-500 text-xs">{errorsLogin.password.message}</p>}
          </div>

          {/* Quên mật khẩu */}
          <div className="text-right text-blue-500 text-sm mb-4">
            <a href="/change-password" className="underline">Quên mật khẩu?</a>
          </div>

          {/* Nút Đăng nhập */}
          <Button type="submit" className="w-full bg-[#6CB1DA] text-white hover:bg-[#5A9BCF] transition rounded-full">
            Đăng nhập
          </Button>
        </form>

        {/* Đăng nhập với mạng xã hội */}
        <div className="mt-4">
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 text-gray-700 hover:bg-gray-100">
            <FaFacebook className="text-blue-600 text-xl mr-2" />
            Đăng nhập với Facebook
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 mt-2 text-gray-700 hover:bg-gray-100">
            <FcGoogle className="text-xl mr-2" />
            Đăng nhập với Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default Page;