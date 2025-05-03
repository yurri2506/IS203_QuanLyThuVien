"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowUpFromLine, ChevronDown, CircleCheck, Undo2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import axios from "axios";

function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  // State cho thông tin sách
  const [bookname, setBookname] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [category2, setCategory2] = useState(null);
  const [originQuantity, setOrigin] = useState("");

  // Dropdown state for categories
  const [isCateListOpen, setIsCateListOpen] = useState(false);
  const [isCateList2Open, setIsCateList2Open] = useState(false);
  const openCategoryList = () => setIsCateListOpen(open => !open);
  const openCategory2List = () => setIsCateList2Open(open => !open);

  // State cho hình ảnh
  const [image, setImage] = useState([
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
    { filePreview: null, selectedFile: null },
  ]);

  // State cho danh sách thể loại
  const [totalCate, setTotalCate] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [cate2List, setCate2List] = useState([]);

  // Ref để kiểm tra lần render đầu tiên khi cập nhật phụ
  const isFirstRender = useRef(true);

  // Ref cho input file
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);

  // Hàm quay lại trang trước
  const handleGoBack = () => router.back();

  // Lấy dữ liệu ban đầu khi component mount
  useEffect(() => {
    console.log("editing book id =", id);
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách thể loại
        const categoriesResponse = await axios.get("http://localhost:8080/api/category");
        const categories = categoriesResponse.data;
        setTotalCate(categories);
        setCateList(categories.map(c => c.name));

        // Lấy thông tin sách
        if (!id) return;
        const bookResponse = await axios.get(`http://localhost:8080/api/book/${id}`);
        const data = bookResponse.data;
        if (!data) return;

        setBookname(data.tenSach);
        setAuthor(data.tenTacGia);
        setDescription(data.moTa);
        setPublisher(data.nxb);
        setYear(data.nam);
        setQuantity(data.tongSoLuong);
        setOrigin(data.tongSoLuong);
        setImage(prev => prev.map((item, idx) => ({
          ...item,
          filePreview: data.hinhAnh?.[idx] || null,
        })));
        setCategory(data.categoryChild?.parent?.name || null);
        setCategory2(data.categoryChild?.name || null);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể tải dữ liệu sách hoặc thể loại");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Cập nhật danh sách thể loại con khi thể loại cha thay đổi
  useEffect(() => {
    if (category) {
      const sel = totalCate.find(c => c.name === category);
      if (sel) {
        setCate2List(sel.children.map(child => child.name));
      }
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCategory2(null);
  }, [category, totalCate]);

  // Xử lý chọn file ảnh
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          filePreview: URL.createObjectURL(file),
          selectedFile: file,
        };
        return updated;
      });
    }
  };

  // Upload ảnh lên Cloudinary
  const uploadImagesToCloudinary = async () => {
    const formData = new FormData();
    let hasFiles = false;
    image.forEach(img => {
      if (img.selectedFile) {
        formData.append("file", img.selectedFile);
        hasFiles = true;
      }
    });
    if (!hasFiles) return [];
    try {
      const res = await axios.post("http://localhost:8080/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("Lỗi upload:", err);
      throw new Error("Upload ảnh thất bại");
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      toast.error("Không tìm thấy ID sách");
      return;
    }
    // build updates
    const updates = {};
    if (bookname) updates.tenSach = bookname;
    if (description) updates.moTa = description;
    if (author) updates.tenTacGia = author;
    if (publisher) updates.nxb = publisher;
    if (year && !isNaN(+year)) updates.nam = +year;
    if (quantity && !isNaN(+quantity)) updates.tongSoLuong = +quantity;

    // upload ảnh
    const newImgs = await uploadImagesToCloudinary();
    if (newImgs.length) {
      const final = image.map((img) =>
        img.selectedFile ? newImgs.shift() : img.filePreview
      );
      updates.hinhAnh = final.filter(Boolean);
    }

    // categoryChildId
    if (category2) {
      const selCat = totalCate.find((c) => c.name === category);
      const sel = selCat?.children.find((ch) => ch.name === category2);
      if (sel) updates.categoryChildId = sel.id; // id là string
    }

    console.log("PATCH payload:", updates);

    setLoading(true);
    try {
      const res = await axios.patch(
        `http://localhost:8080/api/book/${id}`,
        updates,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Update OK:", res.data);
      toast.success("Cập nhật sách thành công");
      router.back();
    } catch (err) {
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
        toast.error(`Lỗi ${err.response.status}: ${JSON.stringify(err.response.data)}`);
      } else {
        console.error(err);
        toast.error("Không thể kết nối server");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="md:ml-52 flex-1 flex items-center justify-center min-h-screen">
          <ThreeDot color="#062D76" size="large" text="Loading..." variant="bounce" />
        </div>
      </div>
    );
  }

  
  return (
    <div className="flex flex-row w-full h-full min-h-screen bg-[#EFF3FB] pb-15">
      <Sidebar />
      {loading ? (
        <div className="flex md:ml-52 w-full h-screen justify-center items-center">
          <ThreeDot
            color="#062D76"
            size="large"
            text="Vui lòng chờ"
            variant="bounce"
            textColor="#062D76"
          />
        </div>
      ) : (
        <div className="flex w-full flex-col py-6 md:ml-52 relative mt-10 gap-2 items-center px-10">
          {/* Nút Back */}
          <div className="absolute top-5 left-5 md:left-57 fixed">
            <Button
              title={"Quay Lại"}
              className="bg-[#062D76] rounded-3xl w-10 h-10"
              onClick={handleGoBack}
            >
              <Undo2 className="w-12 h-12" color="white" />
            </Button>
          </div>

          {/* Form nhập liệu */}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Tên Sách</p>
            <Input
              type="text"
              placeholder="Nhập tên sách"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={bookname}
              onChange={(e) => setBookname(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Tên Tác Giả</p>
            <Input
              type="text"
              placeholder="Nhập tên tác giả"
              className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Năm Xuất Bản</p>
              <Input
                type="number"
                placeholder="Nhập năm xuất bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Nhà Xuất Bản</p>
              <Input
                type="text"
                placeholder="Nhập tên nhà xuất bản"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              />
            </div>
          </div>

          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col w-2/3 gap-[5px] md:gap-[10px]">
              <p className="font-semibold text-lg mt-3">Số lượng</p>
              <Input
                type="number"
                placeholder="Nhập số lượng"
                className="font-semibold rounded-lg w-full h-10 flex items-center px-5 bg-white"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px] space-y-2 relative inline-block text-left">
              <p className="font-semibold text-lg mt-3">Thể Loại Chính</p>
              <Button
                title={"Thể Loại Chính"}
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={openCategoryList}
              >
                {category || "Chọn Thể Loại Chính"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isCateListOpen && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg">
                  {cateList.map((cate, index) => (
                    <Button
                      key={index}
                      className="flex justify-start block w-full px-4 py-2 text-left bg-white text-black hover:bg-gray-300 items-center gap-2"
                      onClick={() => {
                        setCategory(cate);
                        setIsCateListOpen(false);
                      }}
                    >
                      {cate}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col w-full gap-[5px] md:gap-[10px] space-y-2 relative inline-block text-left">
              <p className="font-semibold text-lg mt-3">Thể Loại Phụ</p>
              <Button
                title={"Thể Loại Phụ"}
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={openCategory2List}
              >
                {category2 || "Chọn Thể Loại Phụ"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isCateList2Open && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg">
                  {cate2List.map((cate, index) => (
                    <Button
                      key={index}
                      className="flex justify-start block w-full px-4 py-2 text-left bg-white text-black hover:bg-gray-300 items-center gap-2"
                      onClick={() => {
                        setCategory2(cate);
                        setIsCateList2Open(false);
                      }}
                    >
                      {cate}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Mô Tả</p>
            <Input
              type="text"
              placeholder="Nhập mô tả sách"
              className="font-semibold rounded-lg w-full h-10 flex px-5 bg-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Hình ảnh</p>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col space-y-3">
                {image[0].filePreview ? (
                  <img
                    src={image[0].filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={"Ảnh Bìa"}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRef.current.click()}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Bìa
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(0, e)}
                    ref={fileInputRef}
                  />
                </Button>
              </div>
              <div className="flex flex-col space-y-3">
                {image[1].filePreview ? (
                  <img
                    src={image[1].filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={"Ảnh Xem Trước 1"}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRef1.current.click()}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(1, e)}
                    ref={fileInputRef1}
                  />
                </Button>
              </div>
              <div className="flex flex-col space-y-3">
                {image[2].filePreview ? (
                  <img
                    src={image[2].filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={"Ảnh Xem Trước 2"}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRef2.current.click()}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(2, e)}
                    ref={fileInputRef2}
                  />
                </Button>
              </div>
              <div className="flex flex-col space-y-3">
                {image[3].filePreview ? (
                  <img
                    src={image[3].filePreview}
                    className="w-[290px] h-[410px] rounded-lg"
                    width={145}
                    height={205}
                    alt={"Ảnh Xem Trước 3"}
                  />
                ) : (
                  <div className="w-[290px] h-[410px] bg-gray-300 rounded-lg flex justify-center items-center text-gray-700">
                    Không có hình ảnh
                  </div>
                )}
                <Button
                  className="flex w-[290px] bg-[#062D76]"
                  onClick={() => fileInputRef3.current.click()}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(3, e)}
                    ref={fileInputRef3}
                  />
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full bottom-0 px-10 left-0 md:left-52 md:w-[calc(100%-208px)] fixed h-18 bg-white flex items-center justify-between">
            <div></div>
            <Button
              title={"Hoàn Tất"}
              className="rounded-3xl w-40 h-12 bg-[#062D76]"
              onClick={handleSubmit}
            >
              <CircleCheck className="w-12 h-12" color="white" />
              Hoàn Tất
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;