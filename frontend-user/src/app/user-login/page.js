"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const Page = () => {
  const router = useRouter();

  // Schema kiểm tra đầu vào
  const registerSchema = yup.object().shape({
    username: yup.string().required("Tên không được để trống"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu không được để trống"),
    dateOfBirth: yup.date().required("Ngày sinh không được để trống"),
    gender: yup
      .string()
      .oneOf(["male", "female", "other"], "Vui lòng chọn giới tính")
      .required("Giới tính không được để trống"),
  });

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu không được để trống"),
  });

  // Form đăng nhập
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLoginForm,
    formState: { errors: errorsLogin },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Form đăng ký
  const {
    register: registerSignUp,
    control,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUpForm,
    formState: { errors: errorsSignUp },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { gender: "male" },
  });

  // Xử lý đăng ký
  const onSubmitRegister = async (data) => {
    try {
      router.push("/");
      toast.success("Đăng ký tài khoản thành công");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmitLogin = async (data) => {
    try {
      router.push("/");
      toast.success("Đăng nhập tài khoản thành công");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Reset form khi chuyển tab
  useEffect(() => {
    resetLoginForm();
    resetSignUpForm();
  }, [resetLoginForm, resetSignUpForm]);

  return (
    <div className="min-h-screen bg-[#F9FDFF] flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-[#062D76]">
          <CardHeader>
            <CardTitle className="flex justify-center">
              <img src="/images/logo.jpg" alt="logo" className="w-20" />
            </CardTitle>
            <CardDescription className="text-center text-[#062D76]">
            Mỗi cuốn sách là một cánh cửa mở ra thế giới tri thức
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-200">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="signup">Đăng ký</TabsTrigger>
              </TabsList>

              {/* Đăng nhập */}
              <TabsContent value="login">
                <form onSubmit={handleSubmitLogin(onSubmitLogin)}>
                  <div className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        {...registerLogin("email")}
                        placeholder="Nhập email của bạn"
                      />
                      {errorsLogin.email && (
                        <p className="text-red-500">{errorsLogin.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label>Mật khẩu</Label>
                      <Input
                        type="password"
                        {...registerLogin("password")}
                        placeholder="Nhập mật khẩu của bạn"
                      />
                      {errorsLogin.password && (
                        <p className="text-red-500">{errorsLogin.password.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full bg-[#062D76] text-white">
                      <LogIn className="mr-2 w-4 h-4" /> Đăng nhập
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Đăng ký */}
              <TabsContent value="signup">
                <form onSubmit={handleSubmitSignUp(onSubmitRegister)}>
                  <div className="space-y-4">
                    <div>
                      <Label>Tên người dùng</Label>
                      <Input
                        type="text"
                        {...registerSignUp("username")}
                        placeholder="Nhập tên người dùng"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        {...registerSignUp("email")}
                        placeholder="Nhập email của bạn"
                      />
                    </div>
                    <div>
                      <Label>Mật khẩu</Label>
                      <Input
                        type="password"
                        {...registerSignUp("password")}
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                    <div>
                      <Label>Ngày sinh</Label>
                      <Input type="date" {...registerSignUp("dateOfBirth")} />
                    </div>
                    <div>
                      <Label>Giới tính</Label>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup value={field.value} onValueChange={field.onChange}>
                            <RadioGroupItem value="male" id="male" /> Nam
                            <RadioGroupItem value="female" id="female" /> Nữ
                            <RadioGroupItem value="other" id="other" /> Khác
                          </RadioGroup>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#062D76] text-white">
                      Đăng ký
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;
