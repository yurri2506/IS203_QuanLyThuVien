"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Undo2, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams(); // 👈 lấy từ dynamic route
  const tenTheLoaiCon = params?.id; // sẽ được decode sẵn nếu là string
  
  const [formData, setFormData] = useState({
    tenTheLoaiCha: "",
    tenTheLoaiCon: "",
    viTri: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const encoded = encodeURIComponent(tenTheLoaiCon);
        const res = await fetch(`http://localhost:8081/books/categories/${encoded}`);
  
        if (!res.ok) {
          toast.error("Không tìm thấy thể loại");
          return;
        }
  
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        toast.error("Không thể tải dữ liệu thể loại");
      }
    };
  
    if (tenTheLoaiCon) {
      fetchCategory();
    } else {
      console.warn("Thiếu tham số truy vấn URL con"); // 👈 kiểm tra thiếu
    }
  }, [tenTheLoaiCon]);
  

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/books/categories/updateCategory/{id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Cập nhật thất bại");

      toast.success("✅ Cập nhật thành công");
      router.push("/books/categories");
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật thể loại");
    }
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#EFF3FB]">
      <Sidebar />
      <div className="flex flex-col w-full md:ml-52 px-10 pt-10 gap-6">
        <div className="flex gap-3 items-center">
          <Button
            className="bg-[#062D76] rounded-xl w-10 h-10"
            onClick={() => router.back()}
          >
            <Undo2 color="white" />
          </Button>
          <h1 className="text-2xl font-bold text-[#062D76]">
            Chỉnh sửa thể loại
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            name="tenTheLoaiCha"
            value={formData.tenTheLoaiCha}
            onChange={handleChange}
            placeholder="Tên danh mục cha"
          />
          <Input
            name="tenTheLoaiCon"
            value={formData.tenTheLoaiCon}
            onChange={handleChange}
            placeholder="Tên danh mục con"
          />
          <Input
            name="viTri"
            value={formData.viTri}
            onChange={handleChange}
            placeholder="Vị trí"
          />
        </div>

        <Button
          className="w-fit bg-[#062D76] rounded-xl px-6 py-2 flex gap-2"
          onClick={handleSave}
        >
          <Save />
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}