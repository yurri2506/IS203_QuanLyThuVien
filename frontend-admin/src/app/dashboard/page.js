import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import StatisticsCard from "./StatisticsCard";
import BookTable from "./BookTable";


const Dashboard = () => {
  return (
    <div className="flex flex-row w-full h-screen bg-[#F4F7FE]">
      <Sidebar />
      <main className="self-stretch pr-[1.25rem] md:pl-52 ml-[1.25rem] my-auto w-full max-md:max-w-full py-[2rem]">
        <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 self-stretch shrink gap-4 justify-between items-center w-full leading-none text-white h-full max-md:max-w-full">
          <StatisticsCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/e444cbee3c99f14768fa6c876faa966d9bede995?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
            title="Tổng đầu sách"
            value="3685"
            percentage="60"
          />
          <StatisticsCard
            title="Tổng số lượng sách"
            value="36852"
            percentage="60"
          />
          <StatisticsCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/70bb6ff8485146e65b19f58221ee1e5ce86c9519?placeholderIfAbsent=true&apiKey=d911d70ad43c41e78d81b9650623c816"
            title="Đầu Sách Mới Tuần Này"
            value="5"
            percentage="20"
          />
        </section>

        <div className="gap-2.5 self-start px-5 py-2.5 mt-6 text-[1.25rem] text-white bg-[#062D76] rounded-lg w-fit">
          <h1>Danh sách các sách</h1>
        </div>

        <BookTable />
      </main>
    </div>
  );
};

export default Dashboard;