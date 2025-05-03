"use client";

import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { ChevronDown, PlusCircle, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        toast.error("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Nhóm theo tên thể loại cha
  const grouped = categories.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = [];
    }
    acc[curr.name].push(...curr.children);
    return acc;
  }, {});

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#EFF3FB]">
      <Sidebar />
      {/*Nút Back*/}
      <div className="absolute top-5 left-5 md:left-57 fixed">
        <Button
          title={"Quay Lại"}
          className="bg-[#062D76] rounded-3xl w-10 h-10"
          onClick={handleGoBack}
        >
          <Undo2 className="w-12 h-12" color="white" />
        </Button>
      </div>
      <div className="flex flex-col py-6 w-full md:ml-52 px-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📚 Danh mục sách</h1>
          <Button
            className="bg-[#062D76] rounded-xl flex gap-2"
            onClick={() => router.push("/books/categories/addCategory")}
          >
            <PlusCircle className="w-5 h-5" />
            Thêm danh mục
          </Button>
        </div>

        {loading ? (
          <p>Đang tải danh mục...</p>
        ) : (
          Object.entries(grouped).map(([parentName, children]) => (
            <div
              key={parentName}
              className="bg-white rounded-xl shadow p-5 mb-4"
            >
              <div className="text-lg font-semibold flex items-center gap-2 text-[#062D76]">
                <ChevronDown className="w-4 h-4" />
                {parentName}
              </div>
              <ul className="ml-6 mt-2 list-disc">
                {children.map((child, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 cursor-pointer hover:underline"
                    onClick={() =>
                      router.push(
                        `/books/categories/${encodeURIComponent(child.id)}`
                      )
                    }
                  >
                    {child.name} – {child.suffix}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}