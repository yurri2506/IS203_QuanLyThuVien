"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSidebarStore from "@/store/sidebarStore";
import { Bell, BookText, CircleAlert, LockKeyhole, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

const LeftSideBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const pathname = usePathname();
  const handleNavigation = (path) => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-48 pt-2 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
        isSidebarOpen
          ? "translate-x-0 bg-white shadow-lg"
          : "-translate-x-full"
      } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
    >
      <div className="flex bg-white flex-col rounded-lg h-full overflow-y-auto">
        <nav className="space-y-4 flex-grow">
          <Button
            variant="ghost"
            className={`w-full justify-start mt-5 transition-colors ${
              pathname === "/user-profile"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/user-profile")}
          >
            <User className="mr-4" /> Hồ sơ cá nhân
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start transition-colors ${
              pathname === "/borrowed-books"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/borrowed-books")}
          >
            <BookText className="mr-4" /> Sách đang mượn
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start transition-colors ${
              pathname === "/overdue-books"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/overdue-books")}
          >
            <CircleAlert className="mr-4" /> Sách quá hạn
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start transition-colors ${
              pathname === "/change-password"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/change-password")}
          >
            <LockKeyhole className="mr-4" /> Đổi mật khẩu
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start transition-colors ${
              pathname === "/notification"
                ? "bg-[#6CB1DA] text-white"
                : "hover:bg-[#6CB1DA] hover:text-white"
            }`}
            onClick={() => handleNavigation("/notification")}
          >
            <Bell className="mr-4" /> Thông báo
          </Button>
        </nav>

        <div className="mb-4">
          <Separator className="my-3" />
          <div className="text-xs text-muted-foreground">
            <Button
              variant="ghost"
              className="ml-12 p-4 bg-[#EFF7F7] font-bold rounded-lg text-black hover:bg-[#6CB1DA] hover:text-white transition-colors"
              onClick={() => {}}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
