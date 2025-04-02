"use client";
import React, { useEffect } from "react";
import useSidebarStore from "@/store/sideBarStore";
import Sidebar from "../../components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";

export default function EditBook() {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();

  useEffect(() => {
    console.log("Sidebar Toggled. isSidebarOpen:", isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <div className="flex bg-[#F4F7FE] min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      <div
        className={`flex-1 px-6 py-4 w-full transition-all duration-300 ${
          isSidebarOpen ? "md:ml-6" : "md:ml-0"
        }`}
      >
        <div className="text-gray-500">
          trianajnaskjafojsdoianfojasnfjanfno
        </div>
        <Button className="p-6 mt-4" onClick={toggleSidebar}>
          Change Sidebar State
        </Button>
      </div>
    </div>
  );
}