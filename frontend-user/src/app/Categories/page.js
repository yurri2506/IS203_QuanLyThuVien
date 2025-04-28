// "use client";
// import React, { useState, useEffect } from "react";
// import LeftSideBar from "../components/LeftSideBar";
// import Image from "next/image";
// import ChatBox from "../components/ChatBoxButton";
// import { Button } from "@/components/ui/button";
// import useSidebarStore from "@/store/sidebarStore";

// const categories = [
//   "Văn học",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
//   "Thể loại",
// ];

// const BookStatus = ({ status }) => {
//   return (
//     <div
//       className={`px-2 py-1 text-white w-fit text-sm font-medium rounded-lg flex items-center gap-1 ${
//         status === "Còn sẵn" ? "bg-green-500" : "bg-red-500"
//       }`}
//     >
//       <span>{status}</span>
//       <span
//         className={`w-2 h-2 rounded-full ${
//           status === "Còn sẵn" ? "bg-green-300" : "bg-red-300"
//         }`}
//       ></span>
//     </div>
//   );
// };

// const BookCategories = () => {
//   const [activeCategory, setActiveCategory] = useState("Sách tiếng việt");

//   return (
//     <div className="p-6 bg-white rounded-xl flex flex-col gap-3.5">
//       {/* Danh mục chính */}
//       <div className="flex gap-7">
//         <Button
//           onClick={() => setActiveCategory("Sách tiếng việt")}
//           className={`px-6 py-3 rounded-lg flex items-center justify-center text-l font-normal transition-all ${
//             activeCategory === "Sách tiếng việt"
//               ? "bg-blue-400 text-white hover:bg-blue-400"
//               : "bg-white text-sky-900 hover:bg-white"
//           }`}
//         >
//           Sách tiếng việt
//         </Button>
//         <Button
//           onClick={() => setActiveCategory("Sách ngoại ngữ")}
//           className={`px-6 py-3 rounded-lg flex items-center justify-center text-l font-normal transition-all ${
//             activeCategory === "Sách ngoại ngữ"
//               ? "bg-blue-400 text-white hover:bg-blue-400"
//               : "bg-zinc-200 text-sky-900 hover:bg-white"
//           }`}
//         >
//           Sách ngoại ngữ
//         </Button>
//       </div>

//       {/* Danh mục thể loại */}
//       <div className="py-6 border-t border-slate-300 flex flex-wrap gap-3 justify-center">
//         {categories.map((category, index) => (
//           <Button
//             onClick={() => setActiveCategory("Văn học")}
//             className={`px-6 py-3 rounded-lg flex items-center justify-center text-l font-normal transition-all ${
//               activeCategory === "Văn học"
//                 ? "bg-blue-400 text-white"
//                 : "bg-zinc-200 text-sky-900"
//             }`}
//             key={index}
//           >
//             {category}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Page = () => {
//   const [bookList, setBookList] = useState([]);

//   const fetchBook = async () => {
//     const test = [
//       {
//         MaSach: "id sach",
//         TenSach: "Tên sách 1",
//         MoTa: "Mo ta mau",
//         MaTheLoai: "ma the loai",
//         MaTacGia: "ma tac gia",
//         NhaXB: "nha xuat ban",
//         HinhAnh: ["/images/test.webp", "3133331", "313213131", "31313123"],
//         SoLuongTon: 70,
//         SoLuongMuon: 3,
//       },
//       {
//         MaSach: "id sach2",
//         TenSach: "Tên sách 2",
//         MoTa: "Mo ta mau",
//         MaTheLoai: "ma the loai",
//         MaTacGia: "ma tac gia",
//         NhaXB: "nha xuat ban",
//         HinhAnh: ["/images/test.webp", "3133331", "313213131", "31313123"],
//         SoLuongTon: 70,
//         SoLuongMuon: 3,
//       },
//       {
//         MaSach: "id sach3",
//         TenSach: "Tên sách 3",
//         MoTa: "Mo ta mau",
//         MaTheLoai: "ma the loai",
//         MaTacGia: "ma tac gia",
//         NhaXB: "nha xuat ban",
//         HinhAnh: ["/images/test.webp", "3133331", "313213131", "31313123"],
//         SoLuongTon: 70,
//         SoLuongMuon: 3,
//       },
//       {
//         MaSach: "id sach4",
//         TenSach: "Tên sách 4",
//         MoTa: "Mo ta mau",
//         MaTheLoai: "ma the loai",
//         MaTacGia: "ma tac gia",
//         NhaXB: "nha xuat ban",
//         HinhAnh: ["/images/test.webp", "3133331", "313213131", "31313123"],
//         SoLuongTon: 70,
//         SoLuongMuon: 3,
//       },
//     ];
//     setBookList(test);
//   };

//   useEffect(() => {
//     fetchBook();
//   }, []);

//   const isSidebarOpen = useSidebarStore();

//   return (
//     <div className="min-h-screen pt-16 flex w-full text-foreground bg-[#E6EAF1] relative">
//       <LeftSideBar />
//       <div
//         className={`flex-1 py-4 px-0 transition-all duration-300 ${
//           isSidebarOpen ? "md:ml-64" : "md:ml-0"
//         }`}
//       >
//         <BookCategories />
//         <div className="flex flex-col p-6 mt-4 bg-white rounded-2xl ">
//           <div>
//             <p className="px-6 py-3 w-fit bg-blue-400 rounded-xl flex justify-center items-center gap-3 text-white text-l font-normal font-montserrat">
//               Văn học
//             </p>
//           </div>
//           <div className="grid grid-cols-2 gap-4 p-3">
//             {bookList.map((book) => (
//               <div
//                 key={book.MaSach}
//                 className="flex flex-row w-[450px] gap-6 bg-white p-4 rounded-lg shadow-md"
//               >
//                 <Image
//                   src={book.HinhAnh[0]}
//                   width={100}
//                   height={150}
//                   alt={book.TenSach}
//                 />
//                 <div className="flex flex-col gap-3">
//                   <BookStatus
//                     status={book.SoLuongTon > 0 ? "Còn sẵn" : "Đã mượn"}
//                   />
//                   <h3 className="font-semibold">{book.TenSach}</h3>
//                   <p className="text-sm text-gray-600">
//                     Tác giả: {book.MaTacGia}
//                   </p>
//                   <p className="text-sm text-gray-600">NXB: {book.NhaXB}</p>
//                   <p className="text-sm text-gray-600">Lượt mượn:</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="fixed flex items-center right-4 bottom-4 z-50 ">
//         <ChatBox />
//       </div>
//     </div>
//   );
// };

// export default Page;
import React from 'react';
import ChatBotButton from '../components/ChatBoxButton';
import BookCard from "../components/BookCard";
import LeftSideBar from "../components/LeftSideBar";

const CategoryFilters =() =>{
  return (
    <section className="flex flex-col p-[1.25rem] w-full text-[1.25rem] bg-white rounded-xl max-md:max-w-full">
      <div className="flex gap-6 items-start self-start">
        <button className="gap-2.5 self-stretch px-[1.25rem] py-[0.625rem] text-white bg-sky-900 rounded-lg">
          Sách tiếng việt
        </button>
        <button className="gap-2.5 self-stretch px-[1.25rem] py-[0.625rem] text-[#062D76] rounded-lg bg-zinc-200">
          Sách ngoại ngữ
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5 justify-center content-start items-start py-5 mt-3 w-full text-[#062D76] bg-white border-t border-solid border-t-[color:var(--foundation-blue-light-active,#B2BED5)] max-md:max-w-full">
        <button className="gap-2.5 self-stretch px-[1.25rem] py-[0.625rem] text-white bg-sky-900 rounded-lg">
          Văn học
        </button>
        {Array(11)
          .fill(null)
          .map((_, index) => (
            <button
              key={index}
              className="gap-2.5 self-stretch px-[1.25rem] py-[0.625rem] rounded-lg bg-slate-200"
            >
              Thể loại
            </button>
          ))}
      </div>
    </section>
  );
}

const books = [
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b777cb3ef9abb920d086e97e27ac4f6f3559695",
    available:true,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/fc01b7cf44e0ca2f23258dcc0ad69329b2612af0?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: false,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/5e8a0f3fd4681a9512313c2c1c6dae1285bcf0a6?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: true,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d854294877ea4263cf3494a98eecfd64cd148327?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: false,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/acf848c9260bfc86d1f9094e17e14ec25f3ec193?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: true,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d854294877ea4263cf3494a98eecfd64cd148327?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816",
    available: false,
    title: "Nam cao",
    author: "Văn học",
    publisher: "Văn học Việt Nam (2019)",
    borrowCount: 120,
  },
];

const page = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground">
        <main className="pt-16 flex">
        <LeftSideBar />
        <section className="self-stretch pr-[1.25rem] md:pl-64 ml-[1.25rem] my-auto w-full max-md:max-w-full mt-2">
          <CategoryFilters />
          <div className="flex flex-col p-5 mt-3 w-full bg-white rounded-xl max-md:max-w-full">
            <h2 className="gap-2.5 self-start px-[1.25rem] py-[0.625rem] text-[1.25rem] text-white bg-[#062D76] rounded-lg">
              Văn học
            </h2>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 items-start mt-5 w-full max-md:max-w-full">
              {books.map((book, index) => (
                <BookCard
                  key={index}
                  imageSrc={book.imageSrc}
                  available={book.available}
                  title={book.title}
                  author={book.author}
                  publisher={book.publisher}
                  borrowCount={book.borrowCount}
                />
              ))}
            </div>
            </div>
        </section>
        <ChatBotButton />
        </main>
    </div>
  )
}

export default page