"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Undo2, Save } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    tenTheLoaiCha: "",
    tenTheLoaiCon: "",
    viTri: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/category/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        toast.error("Không thể tải dữ liệu danh mục");
      }
    };
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:8080/api/category/${id}`, formData);
      toast.success("Cập nhật danh mục thành công");
      router.push("/books/categories");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      toast.error("Cập nhật danh mục thất bại");
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
            Chỉnh sửa danh mục
          </h1>
        </div>

        <div className="flex flex-col gap-4 max-w-xl">
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
