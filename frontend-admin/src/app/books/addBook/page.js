"use client";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowUpFromLine, ChevronDown, CircleCheck, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";

function page() {
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const handleGoBack = () => {
    route.back();
  };
  const [bookname, setBookname] = useState(""); // Tên sách
  const [author, setAuthor] = useState(""); //Tên tác giả
  const [publisher, setPublisher] = useState(""); //NXB
  const [year, setYear] = useState(""); //Năm XB
  const [quantity, setQuantity] = useState(""); //SL
  const [description, setDescription] = useState(""); // Mô tả
  const [category, setCategory] = useState("");
  const [category2, setCategory2] = useState("");
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const [image, setImage] = useState([
    {
      filePreview: null,
      selectedFile: null,
    },
    {
      filePreview: null,
      selectedFile: null,
    },
    {
      filePreview: null,
      selectedFile: null,
    },
    {
      filePreview: null,
      selectedFile: null,
    },
  ]);
  const [totalCate, setTotalCate] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [cate2List, setCate2List] = useState([]);
  useEffect(() => {
    const fetchCategory = async() =>{
      const response = await fetch("http://localhost:8081/books/categories");
      const data = await response.json();
      setTotalCate(data)
      setCateList([...new Set(data.map(item => item.tenTheLoaiCha))])
    } 
    fetchCategory()
  }, []);
  useEffect(()=>{
    if(category != ""){
      const tmp = totalCate.filter(cate => cate.tenTheLoaiCha === category).map(cate => cate.tenTheLoaiCon);
      setCate2List(tmp)
      setCategory2("")
    }
    
  },[category])
  const [isCateListOpen, setIsCateListOpen] = useState(false);
  const [isCateList2Open, setIsCateList2Open] = useState(false);
  const openCategoryList = () => {
    setIsCateListOpen(!isCateListOpen);
  };
  const openCategory2List = () => {
    setIsCateList2Open(!isCateList2Open);
  };
  const handleFileChange = (number, event) => {
    const file = event.target.files[0];
    setImage((prev) => {
      const updated = [...prev]; // copy mảng cũ
      updated[number] = {
        ...updated[number], // giữ lại các giá trị cũ nếu không muốn ghi đè hết
        filePreview: URL.createObjectURL(file),
        selectedFile: file,
      };
      return updated;
    });
  };
  /*  upload các ảnh lên cloudinary để lấy link => up hết */
  const uploadImagesToCloudinary = async () => {
    const formData = new FormData();
    image.forEach((img) => {
      if (img.selectedFile) {
        formData.append("file", img.selectedFile); // gửi với key "file"
      }
    });
    const res = await fetch("http://localhost:8081/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload thất bại");
    }

    const data = await res.json();
    return data
  };
  const handleSubmit = async () => {
    if (
      bookname === "" ||
      author === "" ||
      year === "" ||
      publisher === "" ||
      description === "" ||
      category === "" ||
      category2 === "" ||
      quantity === ""
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (quantity < 1) {
      toast.error("Số lượng sách phải lớn hơn 0");
      return;
    }
    if (!image[0].filePreview) {
      toast.error("Vui lòng tải ít nhất hình ảnh bìa");
      return;
    }
    setLoading(true);
    const newImages = await uploadImagesToCloudinary();

    const updatedImages = image.map((img) => {
      if (img.selectedFile) {
        return {
          ...img,
          filePreview: newImages.shift(), // lấy ra từng url
          selectedFile: null,
        };
      }
      return img;
    });
    const finalCategory = totalCate.find(
      cate =>
        cate.tenTheLoaiCha === category &&
        cate.tenTheLoaiCon === category2
    );
    const finalImageURLs = updatedImages
      .filter((img) => img.filePreview)
      .map((img) => img.filePreview);
    const bookData = {
      tenSach: bookname,
      moTa: description,
      hinhAnh: finalImageURLs,
      theLoai: finalCategory.id,
      tenTacGia: author,
      nam: year,      
      nxb: publisher,      
      tongSoLuong: quantity,
      soLuongMuon: 0,
      soLuongXoa : 0,      
    };
    try {
      console.log(bookData)
      const res = await fetch("http://localhost:8081/addBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
  
      if (!res.ok) {
        throw new Error("Thêm sách thất bại");
      }
  
      const data = await res.json();
      console.log("Sách đã thêm:", data);
      setLoading(false);
      toast.success("Thêm sách thành công");
      handleGoBack();
    } catch (error) {
      console.error("Lỗi:", error.message);
    }
  };

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
          {/*Nút Back*/}
          <div className="absolute top-5 left-5 md:left-57 fixed">
            <Button
              title={"Quay Lại"}
              className="bg-[#062D76] rounded-3xl w-10 h-10"
              onClick={() => {
                handleGoBack();
              }}
            >
              <Undo2 className="w-12 h-12" color="white" />
            </Button>
          </div>
          {/*Dòng tên sách*/}
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
          {/*Dòng tên tg*/}
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
          {/*Dòng năm xuất bản và nhà xuất bản */}
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
          {/*Dòng số lượng và thể loại */}
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
                onClick={() => {
                  openCategoryList();
                }}
              >
                {category !== "" ? category : "Chọn Thể Loại Chính"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isCateListOpen && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg">
                  {cateList?.map((cate, index) => {
                    return (
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
                    );
                  })}
                </div>
              )}
            </div>
          {/*Thể loại 2*/}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px] space-y-2 relative inline-block text-left">
              <p className="font-semibold text-lg mt-3">Thể Loại Phụ</p>
              <Button
                title={"Thể Loại Phụ"}
                className="bg-white text-black rounded-lg w-full h-10 hover:bg-gray-300 flex justify-between"
                onClick={() => {
                  openCategory2List();
                }}
              >
                {category2 !== "" ? category2 : "Chọn Thể Loại Phụ"}
                <ChevronDown className="w-12 h-12" color="#062D76" />
              </Button>
              {isCateList2Open && (
                <div className="absolute bg-white rounded-lg w-full z-50 shadow-lg">
                  {cate2List?.map((cate, index) => {
                    return (
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
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/*Dòng mô tả*/}
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
          {/*Dòng hình ảnh*/}
          <div className="flex flex-col w-full gap-[5px] md:gap-[10px]">
            <p className="font-semibold text-lg mt-3">Hình ảnh</p>
            <div className="grid grid-cols-4 gap-4">
              {/*Cột ảnh bìa*/}
              <div className="flex flex-col space-y-3">
                {image[0].filePreview ? ( //size sách thường là 14.5 x 20.5
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
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Bìa
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden input-new-file"
                    onChange={(e) => handleFileChange(0, e)}
                    ref={fileInputRef}
                  />
                </Button>
              </div>
              {/*Cột ảnh 1*/}
              <div className="flex flex-col space-y-3">
                {image[1].filePreview ? ( //size sách thường là 14.5 x 20.5
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
                  onClick={() => {
                    fileInputRef1.current.click();
                  }}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden input-new-file"
                    onChange={(e) => handleFileChange(1, e)}
                    ref={fileInputRef1}
                  />
                </Button>
              </div>
              {/*Cột ảnh 2*/}
              <div className="flex flex-col space-y-3">
                {image[2].filePreview ? ( //size sách thường là 14.5 x 20.5
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
                  onClick={() => {
                    fileInputRef2.current.click();
                  }}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden input-new-file"
                    onChange={(e) => handleFileChange(2, e)}
                    ref={fileInputRef2}
                  />
                </Button>
              </div>
              {/*Cột ảnh 3*/}
              <div className="flex flex-col space-y-3">
                {image[3].filePreview ? ( //size sách thường là 14.5 x 20.5
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
                  onClick={() => {
                    fileInputRef3.current.click();
                  }}
                >
                  <ArrowUpFromLine className="w-12 h-12" color="white" />
                  Tải Ảnh Xem Trước
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden input-new-file"
                    onChange={(e) => handleFileChange(3, e)}
                    ref={fileInputRef3}
                  />
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full bottom-0 px-10 left-0 md:left-52 md:w-[calc(100%-208px)] fixed h-18 bg-white flex items-center justify-between">
            {/*Control Bar*/}
            <div></div>
            <Button
              title={"Hoàn Tất"}
              className={`rounded-3xl w-40 h-12 bg-[#062D76]`}
              onClick={() => {
                handleSubmit();
              }}
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

export default page;