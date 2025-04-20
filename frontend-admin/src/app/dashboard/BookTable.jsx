import React from "react";
import BookTableRow from "./BookTableRow";

const BookTable = () => {
  return (
    <section className="flex flex-col mt-6 w-full text-[1rem] text-neutral-900 max-md:max-w-full">
      <header className="flex shrink overflow-hidden w-full rounded-t-3xl bg-[#05245E] min-h-[3rem] max-md:max-w-full">
        <div className="flex basis-1/4 min-w-0 justify-center items-center bg-[#EBF1F9]">
          <h3 className="gap-2.5 self-stretch text-center my-auto">ID</h3>
        </div>
        <div className="flex basis-1/4 min-w-0 justify-center items-center text-white">
          <h3 className="gap-2.5 self-stretch text-center my-auto">Tên sách</h3>
        </div>
        <div className="flex basis-1/4 min-w-0 justify-center items-center bg-[#EBF1F9]">
          <h3 className="gap-2.5 self-stretch text-center my-auto">Số lượng</h3>
        </div>
        <div className="flex basis-1/4 min-w-0 justify-center items-center text-white">
          <h3 className="gap-2.5 self-stretch text-center my-auto">Trạng thái</h3>
        </div>
      </header>

      <div className="flex flex-col gap-2.5 mt-2.5">
        <BookTableRow id="1" title="Nam Cao" quantity="23" status="available" />
        <BookTableRow id="2" title="Nam Cao" quantity="23" status="available" />
        <BookTableRow
          id="3"
          title="Nam Cao"
          quantity="23"
          status="unavailable"
        />
        <BookTableRow
          id="4"
          title="Nam Cao"
          quantity="23"
          status="unavailable"
        />
        <BookTableRow
          id="5"
          title="Nam Cao"
          quantity="23"
          status="unavailable"
        />
        <BookTableRow
          id="6"
          title="Nam Cao"
          quantity="23"
          status="unavailable"
        />
        <BookTableRow
          id="7"
          title="Nam Cao"
          quantity="23"
          status="unavailable"
        />
      </div>

      <button className="flex gap-3 justify-center items-start self-center px-3 py-5 mt-2.5 max-w-full leading-none bg-indigo-50 rounded-lg w-[278px]">
        <span className="gap-2.5 self-stretch">Xem tất cả</span>
      </button>
    </section>
  );
};

export default BookTable;