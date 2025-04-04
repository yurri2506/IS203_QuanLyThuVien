"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import useSidebarStore from "@/store/sideBarStore";

const SidebarItem = ({ path, icon, label }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const [isHovered, setIsHovered] = useState(false);

  const isActive =
    path === "/borrow"
      ? pathname.startsWith("/borrow") || pathname.startsWith("/return")
      : pathname.startsWith(path);

  const handleClick = () => {
    router.push(path);
    if (isSidebarOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start mb-2 cursor-pointer flex items-center text-[15px] font-medium rounded-md py-2 px-4 transition-all duration-200 ${
        isActive
          ? "text-white bg-[#062D76]"
          : "text-black bg-transparent hover:bg-gray-100"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={icon}
        alt={label}
        className={`mr-3 w-5 h-5 ${
          isActive && !isHovered ? "filter brightness-0 invert" : ""
        }`}
      />
      <span>{label}</span>
    </Button>
  );
};

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)"); // Dưới 48rem (768px)
    const handleResize = () => {
      setIsMobileView(mediaQuery.matches);
      if (mediaQuery.matches && isSidebarOpen) {
        toggleSidebar(); // Đóng sidebar khi chuyển sang mobile
      } else if (!mediaQuery.matches && !isSidebarOpen) {
        toggleSidebar(); // Mở sidebar khi chuyển sang desktop
      }
    };

    mediaQuery.addEventListener("change", handleResize);
    handleResize();

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  const menuItems = [
    { path: "/dashboard", icon: "/svg/dashboard.svg", label: "Dashboard" },
    { path: "/users", icon: "/svg/user_admin.svg", label: "Người dùng" },
    { path: "/books", icon: "/svg/book_admin.svg", label: "Sách" },
    { path: "/borrow", icon: "/svg/return_admin.svg", label: "Mượn/Trả" },
    { path: "/fine", icon: "/svg/fine_admin.svg", label: "Phiếu phạt" },
    { path: "/setting", icon: "/svg/setting.svg", label: "Cài đặt" },
  ];

  return (
    <aside
      className={`w-64 bg-white shadow-md flex flex-col z-50 fixed top-0 left-0 h-screen transition-all duration-200 ${
        isMobileView
          ? `${isSidebarOpen ? "block" : "hidden"}`
          : "block"
      }`}
    >
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/images/logo.jpg" alt="Vibely Logo" className="w-32" />
        </div>

        {/* Navigation */}
        <nav className="flex-grow">
          {menuItems.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </nav>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="w-full justify-start cursor-pointer flex items-center text-[15px] font-medium rounded-md py-2 px-4 text-black bg-transparent hover:bg-gray-100 transition-all duration-200"
        >
          <LogOut className="mr-3 w-5 h-5" />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;