"use client";
import { usePathname } from "next/navigation";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
} from "@headlessui/react";
import { Menu as MenuIcon, X, Bell, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Thể loại", href: "/Categories" },
  { name: "Giới thiệu", href: "/About" },
  { name: "Hỗ trợ", href: "/Help" },
];

const HeaderNoLogin = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/user-login");
  };


  return (
    <header className="bg-[#062D76] text-white shadow-lg fixed top-0 left-0 w-full z-50">
      <Disclosure as="nav" className="mx-auto">
        {({ open }) => (
          <>
            <div className="flex justify-between items-center h-14 px-2 md:px-5">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/">
                  <h1 className="text-3xl font-bold text-white font-[Moul]">
                    OurLogo
                  </h1>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:flex space-x-20">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-lg font-medium transition duration-200 ${
                      pathname === item.href
                        ? "bg-white text-[#052259]"
                        : "hover:bg-white hover:text-[#052259]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right Icons */}
              <div className="flex items-center space-x-4">
                <button
                  className={`relative pr-2 pl-1.5 py-2 rounded-full cursor-pointer hover:bg-white hover:text-[#052259] ${
                    pathname === "/cart"
                      ? "bg-white text-[#052259]"
                      : "hover:bg-white hover:text-[#052259]"
                  }`}
                >
                  <Link href="/cart">
                    {/* <CartBadge count={cartCount} /> */}
                    <ShoppingCart
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        strokeWidth: "1.5px",
                      }}
                      className="size-6"
                    />
                  </Link>
                </button>
                <button
                  className={`relative pr-2 pl-1.5 py-2 rounded-full cursor-pointer hover:bg-white hover:text-[#052259] ${
                    pathname === "/cart"
                      ? "bg-white text-[#052259]"
                      : "hover:bg-white hover:text-[#052259]"
                  }`}
                >
                  <Link href="/cart">
                    {/* <CartBadge count={cartCount} /> */}
                    <Bell
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        strokeWidth: "1.5px",
                      }}
                      className="size-6"
                    />
                  </Link>
                </button>

                <Menu as="div" className="relative">
                  <Menu.Button
                    onClick={handleLogin}
                    className="text-white font-medium px-4 py-2 rounded-md hover:bg-gray-700 transition"
                  >
                    Đăng nhập / Đăng ký
                  </Menu.Button>
                </Menu>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <DisclosureButton className="p-2 rounded-md hover:bg-blue-700">
                  {open ? (
                    <X className="size-6" />
                  ) : (
                    <MenuIcon className="size-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <DisclosurePanel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                      pathname === item.href
                        ? "bg-white text-[#052259]"
                        : "hover:bg-blue-700 hover:text-gray-100"
                    }`}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </header>
  );
};

export default HeaderNoLogin;
