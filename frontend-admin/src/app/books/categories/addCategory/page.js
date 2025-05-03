"use client";

import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import axios from "axios";
import { PlusCircle, Undo2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [childrenNames, setChildrenNames] = useState([""]);
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleAddChild = () => {
    setChildrenNames([...childrenNames, ""]);
  };

  const handleChildChange = (index, value) => {
    const updatedChildren = [...childrenNames];
    updatedChildren[index] = value;
    setChildrenNames(updatedChildren);
  };

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const payload = {
      name,
      childrenNames: childrenNames.filter((child) => child.trim() !== ""),
    };

    try {
      await axios.post("http://localhost:8080/api/category", payload);
      toast.success("Thêm danh mục thành công");
      router.push("/books/categories");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      toast.error("Thêm danh mục thất bại");
    }
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#EFF3FB]">
      <Sidebar />

      {/* Nút Quay Lại */}
      <div className="absolute top-5 left-5 md:left-57 fixed">
        <Button
          title={"Quay Lại"}
          className="bg-[#062D76] rounded-3xl w-10 h-10"
          onClick={handleGoBack}
        >
          <Undo2 className="w-12 h-12" color="white" />
        </Button>
      </div>

      {/* Form thêm danh mục */}
      <div className="flex flex-col py-6 w-full md:ml-52 px-10">
        <h1 className="text-2xl font-bold mb-6">📚 Thêm danh mục sách</h1>

        <div className="bg-white rounded-xl shadow p-6 w-full max-w-2xl">
          <label className="block mb-2 font-medium">Tên danh mục chính</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-4 py-2 w-full mb-4"
            placeholder="Nhập tên danh mục chính"
          />

          <label className="block mb-2 font-medium">Tên danh mục con</label>
          {childrenNames.map((child, index) => (
            <input
              key={index}
              type="text"
              value={child}
              onChange={(e) => handleChildChange(index, e.target.value)}
              className="border rounded px-4 py-2 w-full mb-2"
              placeholder={`Danh mục con ${index + 1}`}
            />
          ))}

          <Button
            onClick={handleAddChild}
            className="bg-blue-500 text-white rounded-xl px-4 py-2 mt-2"
          >
            + Thêm danh mục con
          </Button>

          <Button
            onClick={handleSubmit}
            className="bg-[#062D76] text-white rounded-xl px-6 py-2 mt-6 block"
          >
            Lưu danh mục
          </Button>
        </div>
      </div>
    </div>
  );
}
