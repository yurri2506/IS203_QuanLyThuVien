// "use client";
// import React, { useEffect, useState } from "react";
// import useSidebarStore from "@/store/sideBarStore";
// import Sidebar from "../../components/sidebar/Sidebar";
// import { useRouter, useParams } from "next/navigation";
// import { Button } from "@/app/components/ui/button";
// import { Input } from "@/app/components/ui/input";
// import { Undo2, Upload, Trash2, CircleCheck, LayoutGrid } from "lucide-react";
// import toast from "react-hot-toast";

// export default function EditBook() {
//   const { id } = useParams(); // Lấy ID từ URL params
//   const { isSidebarOpen, toggleSidebar } = useSidebarStore(); // Lấy trạng thái sidebar từ store
//   const router = useRouter(); // Dùng router để điều hướng
//   const [popUpOpen, setPopUpOpen] = useState(false); // Quản lý trạng thái popup xóa
//   const [deleteOne, setDeleteOne] = useState(null); // Quản lý sách cần xóa
//   const [bookData, setBookData] = useState(null); // Dữ liệu sách cần chỉnh sửa

//   const handleBack = () => {
//     router.push(`/books`); // Quay lại danh sách sách
//   };

//   useEffect(() => {
//     fetchBook(); // Lấy dữ liệu sách khi component mount hoặc khi ID thay đổi
//   }, [id]);

//   const fetchBook = async () => {
//     // Dữ liệu giả để mô phỏng việc lấy thông tin sách
//     const test = [
//       {
//         MaSach: 1,
//         TenSach: "Tên sách 1",
//         MoTa: "Mo ta mau",
//         MaTheLoai: "ma the loai",
//         MaTacGia: "ma tac gia",
//         MaNXB: "ma nha xuat ban",
//         NamXB: "nam xuat ban",
//         TrongLuong: "trong luong",
//         TinhTrang: "tinh trang",
//         SoLTK: "so luu tru kho",
//         DonGia: "don gia",
//         HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
//         SoLuongTon: 70,
//         SoLuongMuon: 3,
//       },
//       {
//         MaSach: 2,
//         TenSach: "Tên sách 2",
//         MoTa: "Mo ta mau",
//         MaTheLoai: "ma the loai",
//         MaTacGia: "ma tac gia",
//         MaNXB: "ma nha xuat ban",
//         NamXB: "nam xuat ban",
//         TrongLuong: "trong luong",
//         TinhTrang: "tinh trang",
//         SoLTK: "so luu tru kho",
//         DonGia: "don gia",
//         HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
//         SoLuongTon: 70,
//         SoLuongMuon: 3,
//       },
//       {
//         MaSach: 3,
//         TenSach: "Tên sách 3",
//         MoTa: "Mo ta mau",
//         MaTheLoai: "ma the loai",
//         MaTacGia: "ma tac gia",
//         MaNXB: "ma nha xuat ban",
//         NamXB: "nam xuat ban",
//         TrongLuong: "trong luong",
//         TinhTrang: "tinh trang",
//         SoLTK: "so luu tru kho",
//         DonGia: "don gia",
//         HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
//         SoLuongTon: 70,
//         SoLuongMuon: 3,
//       },
//       {
//         MaSach: 4,
//         TenSach: "Tên sách 4",
//         MoTa: "Mo ta mau",
//         MaTheLoai: "ma the loai",
//         MaTacGia: "ma tac gia",
//         MaNXB: "ma nha xuat ban",
//         NamXB: "nam xuat ban",
//         TrongLuong: "trong luong",
//         TinhTrang: "tinh trang",
//         SoLTK: "so luu tru kho",
//         DonGia: "don gia",
//         HinhAnh: ["/test.webp", "3133331", "313213131", "31313123"],
//         SoLuongTon: 70,
//         SoLuongMuon: 3,
//       },
//     ];

//     const bookId = Number(id); // Chuyển ID sang số
//     const foundBook = test.find((book) => book.MaSach === bookId); // Tìm sách theo ID
//     setBookData(foundBook || null); // Cập nhật dữ liệu sách

//     if (!foundBook ) {
//       toast.error("Không tìm thấy sách với ID: " + id); // Chỉ hiển thị toast một lần
      
//       router.push("/books"); // Nếu không tìm thấy sách, quay lại trang danh sách sách
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target; // Lấy name và value từ input
//     setBookData((prevData) => ({
//       ...prevData,
//       [name]: value, // Cập nhật dữ liệu sách theo name
//     }));
//   };

//   const handleUpdate = () => {
//     toast.success('Đã cập nhật sách thành công.'); // Thông báo cập nhật thành công
//   };

//   const openDeletePopup = (book) => {
//     if (!book) return;
//     setDeleteOne(book); // Cập nhật sách cần xóa
//     setPopUpOpen(true); // Mở popup xóa
//   };

//   const handleDelete = () => {
//     if (!deleteOne) return;
//     toast.success(`Đã xóa sách: ${deleteOne.TenSach}`); // Thông báo xóa thành công
//     setPopUpOpen(false); // Đóng popup xóa
//     setDeleteOne(null); // Xóa sách khỏi state
//     handleBack(); // Quay lại danh sách sách
//   };

//   return (
//     <div className="flex bg-[#F4F7FE] min-h-screen">
//       <Sidebar />
//       <div
//         className={`flex-1 py-6 px-10 transition-all duration-300 ${
//           isSidebarOpen ? "ml-0 md:ml-64" : "ml-0"
//         }`}
//       >
//         {/* Nút quay lại */}
//         <Button
//           className="px-4 py-2 bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer rounded-full"
//           onClick={handleBack}
//         >
//           <Undo2 className="w-10 h-10 text-white" />
//         </Button>

//         {/* Nội dung chính */}
//         {bookData ? (
//           <div className="flex flex-col w-full bg-white p-8 mt-6 rounded-[10px] border-[2px] border-gray-300">
//             <p className="font-bold mb-2">ID (Tự Động)</p>
//             <Input
//               value={bookData.MaSach}
//               readOnly
//               className="bg-gray-200 cursor-not-allowed"
//             />
//             <p className="font-bold mb-2 mt-8">Tên sách</p>
//             <Input
//               name="TenSach"
//               value={bookData.TenSach || ""}
//               onChange={handleChange}
//             />
//             <p className="font-bold mb-2 mt-8">Tác giả</p>
//             <Input
//               name="MaTacGia"
//               value={bookData.MaTacGia || ""}
//               onChange={handleChange}
//             />

//             <div className="flex justify-center gap-8">
//               <div className="flex flex-col w-1/2">
//                 <p className="font-bold mb-2 mt-8">Năm xuất bản</p>
//                 <Input
//                   name="NamXB"
//                   value={bookData.NamXB || ""}
//                   onChange={handleChange}
//                 />
//                 <p className="font-bold mb-2 mt-8">Số lượng</p>
//                 <Input
//                   name="SoLuongTon"
//                   value={bookData.SoLuongTon || ""}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="flex flex-col w-1/2">
//                 <p className="font-bold mb-2 mt-8">Nhà xuất bản</p>
//                 <Input
//                   name="MaNXB"
//                   value={bookData.MaNXB || ""}
//                   onChange={handleChange}
//                 />
//                 <p className="font-bold mb-2 mt-8">Thể loai</p>
//                 <div className="flex justify-between">
//                   <Input
//                     className="mr-8"
//                     name="MaTheLoai"
//                     value={bookData.MaTheLoai || ""}
//                     onChange={handleChange}
//                   />
//                   <Button
//                     className="bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer"
//                   >
//                     <LayoutGrid />
//                     Quản lý thể loại
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <p className="font-bold mb-2 mt-8">Mô tả</p>
//             <Input
//               className="h-10"
//               name="MoTa"
//               value={bookData.MoTa || ""}
//               onChange={handleChange}
//             />

//             <p className="font-bold mb-2 mt-8">Hình ảnh</p>
//             <div className="flex">
//               {bookData.HinhAnh.map((image, index) => (
//                 <div key={index} className="flex flex-col justify-between items-center w-40 mr-10">
//                   <img
//                     //src={image} //Khi nào có dữ liệu ảnh thì sài cái này 
//                     src={"/test.webp"} // Placeholder image
//                     alt={`Hình ảnh ${index + 1}`}
//                     className="rounded-[10px] border-[2px] border-gray-300"
//                   />
//                   <Button className="flex items-center w-full bg-[#6CB1DA] mt-4 hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer">
//                     <Upload />
//                     <p className="font-bold">{index === 0 ? "Tải ảnh bìa" : "Tải ảnh xem trước"}</p>
//                   </Button>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-end items-center w-full mt-20">
//               <Button
//                 className="mr-4 text-lg p-4 bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer"
//                 onClick={() => openDeletePopup(bookData)}
//               >
//                 <Trash2 className="mr-1" />
//                 Xóa
//               </Button>
//               <Button
//                 className="ml-4 text-lg p-4 bg-[#6CB1DA] hover:bg-[#6CB1DA] hover:opacity-50 cursor-pointer"
//                 onClick={handleUpdate}
//               >
//                 <CircleCheck className="mr-1" />
//                 Hoàn tất
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <p className="mt-6">Đang tải dữ liệu...</p>
//         )}
//       </div>

//       {/* Popup xác nhận xóa */}
//       {popUpOpen && deleteOne && (
//         <div className="fixed inset-0 items-center justify-center z-40 flex">
//           <div className="w-full h-full bg-black opacity-[80%] absolute top-0 left-0"></div>
//           <div className="bg-white p-6 rounded-lg shadow-lg w-120 fixed z-50">
//             <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
//             <p>Bạn có chắc chắn muốn xóa sách này không?</p>
//             <div className="flex bg-white w-full rounded-lg mt-2 relative p-5 gap-[20px] md:gap-[50px] items-center">
//               <img
//                 src={deleteOne.HinhAnh?.[0] || "/test.webp"}
//                 className="w-[145px] h-[205px]"
//               />
//               <div className="flex flex-col gap-[10px] w-full">
//                 <p>ID: {deleteOne.MaSach}</p>
//                 <p className="font-bold">{deleteOne.TenSach}</p>
//                 <p className="italic">{deleteOne.MaTacGia}</p>
//                 <p className="italic">{deleteOne.MaTheLoai}</p>
//                 <p className="italic">Số lượng tồn: {deleteOne.SoLuongTon}</p>
//                 <p className="italic">Số lượng mượn: {deleteOne.SoLuongMuon}</p>
//               </div>
//             </div>
//             <div className="flex justify-end mt-4 gap-4">
//               <Button
//                 className="bg-gray-500 hover:bg-gray-700 text-white"
//                 onClick={() => setPopUpOpen(false)}
//               >
//                 Hủy
//               </Button>
//               <Button
//                 className="bg-red-500 hover:bg-red-700 text-white"
//                 onClick={() => handleDelete(deleteOne)}
//               >
//                 Xóa
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowUpFromLine, ChevronDown, CircleCheck, Undo2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";

function page() {
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const handleGoBack = () => {
    route.back();
  };
  const { id } = useParams();
  const [bookname, setBookname] = useState(""); // Tên sách
  const [author, setAuthor] = useState(""); //Tên tác giả
  const [publisher, setPublisher] = useState(""); //NXB
  const [year, setYear] = useState(""); //Năm XB
  const [quantity, setQuantity] = useState(""); //tongSL
  const [description, setDescription] = useState(""); // Mô tả
  const [category, setCategory] = useState(null);
  const [category2, setCategory2] = useState(null);
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const [originQuantity, setOrigin] = useState("");
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
    const getBook = async() =>{
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8081/books/categories");
        const cates = await res.json();
        setTotalCate(cates)
        setCateList([...new Set(cates.map(item => item.tenTheLoaiCha))])  
        const response = await fetch(`http://localhost:8081/book/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error(`Lỗi khi lấy sách: ${response.status}`);
        }
    
        const data = await response.json();
        if(!data) return;
        setBookname(data.tenSach);
        setAuthor(data.tenTacGia);
        setDescription(data.moTa);
        setPublisher(data.nxb);
        setYear(data.nam);
        setQuantity(data.tongSoLuong);
        setOrigin(data.tongSoLuong);
        setImage((prev) =>
        prev.map((item, index) => ({
        ...item,
        filePreview: data.hinhAnh[index] || null, // Nếu thiếu ảnh thì gán null
      }))
      );
        setCategory(data.tenTheLoaiCha);
        setCategory2(data.tenTheLoaiCon);  
        setLoading(false);
      } catch (error) {
        console.error('Lỗi fetch:', error);
        return null;
      }
    }
    getBook();    
  }, []);
  const isFirstRender = useRef(true);
  useEffect(()=>{
    if(category !== ""){
      const tmp = totalCate.filter(cate => cate.tenTheLoaiCha === category).map(cate => cate.tenTheLoaiCon);
      setCate2List(tmp)      
    }   
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Bỏ qua lần render đầu tiên
    } 
    setCategory2("")
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
    var flag = false
    const formData = new FormData();
    image.forEach((img) => {
      if (img.selectedFile) {
        formData.append("file", img.selectedFile); // gửi với key "file"
        flag = true
      }
    });
    if(!flag) return [];  
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
    if (quantity < originQuantity) {
      toast.error("Số mới phải lớn hơn số cũ. Số lượng cũ: ",originQuantity);
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
      tongSoLuong : quantity, 
    };
    try {
      const res = await fetch(`http://localhost:8081/book/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
  
      if (!res.ok) {
        throw new Error("Sửa sách thất bại");
      }
  
      const data = await res.json();
      console.log("Sách đã sửa:", data);
      setLoading(false);
      toast.success("Sửa sách thành công");
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