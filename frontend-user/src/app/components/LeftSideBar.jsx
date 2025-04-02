"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSidebarStore from "@/store/sidebarStore";

import {
  Bell,
  BookText,
  CircleAlert,
  LockKeyhole,
  LogOut,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LeftSideBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path, item) => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-full w-64 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
        isSidebarOpen
          ? "translate-x-0 bg-white shadow-lg "
          : " -translate-x-full"
      } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
    >
      <div className="flex flex-col h-[630px] overflow-y-auto bg-white rounded-lg">
        {/* navigation menu yaha pr */}
        <nav className="space-y-4 flex-grow">
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/user-profile")}
            className={`full justify-start w-full ${
              pathname === "/user-profile"
                ? "bg-blue-400 text-white hover:bg-blue-400"
                : ""
            }`}
          >
            <User className="mr-4" /> Hồ sơ cá nhân
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleNavigation("/borrowed-books")}
            className={`full justify-start w-full ${
              pathname === "/borrowed-books"
                ? "bg-blue-400 text-white hover:bg-blue-400"
                : ""
            }`}
          >
            <BookText className="mr-4" /> Sách đang mượn
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleNavigation("/overdue-books")}
            className={`full justify-start w-full ${
              pathname === "/overdue-books"
                ? "bg-blue-400 text-white hover:bg-blue-400"
                : ""
            }`}
          >
            <CircleAlert className="mr-4" /> Sách quá hạn
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/change-password")}
            className={`full justify-start w-full ${
              pathname === "/change-password"
                ? "bg-blue-400 text-white hover:bg-blue-400"
                : ""
            }`}
          >
            <LockKeyhole className="mr-4" /> Đổi mật khẩu
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/notification")}
            className={`full justify-start w-full ${
              pathname === "/notification"
                ? "bg-blue-400 text-white hover:bg-blue-400"
                : ""
            }`}
          >
            <Bell className="mr-4" /> Thông báo
          </Button>
        </nav>

        {/* footer section */}

        <div className="mb-5">
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground space-y-1">
            <Button variant="ghost" className="cursor-pointer ml-10 ">
              <LogOut />{" "}
              <span className="ml-2 font-bold text-md">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
