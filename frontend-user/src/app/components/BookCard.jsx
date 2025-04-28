"use client";
import React from "react";
import { useRouter } from "next/navigation";
const StatusIndicator = ({ available }) => {
  return (
    <div className="flex gap-1.5 justify-center items-center self-start px-2 py-1 rounded bg-slate-200">
      <span className="self-stretch my-auto text-sm font-medium text-[#062D76]">
        {available ? "Còn sẵn" : "Đã hết"}
      </span>
      <div className="self-stretch my-auto w-4">
        <div
          className={`flex shrink-0 w-4 h-4 ${
            available ? "bg-green-400" : "bg-[#F7302E]"
          } rounded-full`}
        />
      </div>
    </div>
  );
};

const BookCard = ({
  id,
  imageSrc,
  available,
  title,
  author,
  publisher,
  borrowCount,
}) => {
  const router = useRouter();
  const slugifyTitle = (str) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')      // Thay dấu cách thành dấu "-"
      .replace(/[^\w\-]+/g, '')  // Loại bỏ ký tự đặc biệt
      .replace(/\-\-+/g, '-')    // Xử lý dấu gạch nối dư thừa
      .replace(/^-+/, '')        // Loại bỏ dấu gạch nối ở đầu
      .replace(/-+$/, '');       // Loại bỏ dấu gạch nối ở cuối
  };

  const handleCardClick = () => { 
    router.push(`/book-detail/${id}`);  
  };

  return (
    <article
      className="flex grow shrink gap-3 min-w-60 cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={imageSrc}
        alt={title}
        className="object-cover shrink rounded-sm aspect-[0.67] w-[100px]"
      />
      <div className="flex flex-col flex-1 shrink self-end basis-0">
        <StatusIndicator available={available} />
        <h3 className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-[1.125rem] font-medium text-black basis-0">
          {title}
        </h3>
        <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
          Tác giả: {author}
        </p>
        <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
          NXB: {publisher}
        </p>
        <p className="flex-1 shrink gap-2.5 self-stretch mt-2 w-full text-base text-black basis-0">
          Lượt mượn: {borrowCount}
        </p>
      </div>
    </article>
  );
};

export default BookCard;