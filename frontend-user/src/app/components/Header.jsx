"use client";
import { usePathname } from "next/navigation";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Menu as MenuIcon, X, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const commonNavigation = [
  { name: "Giới thiệu", href: "/About" },
  { name: "Liên hệ", href: "/Contact" },
];

const defaultNavigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Thể loại", href: "/Categories" },
];

const loginSignupNavigation = [
  { name: "Đăng nhập", href: "/user-login" },
  { name: "Đăng ký", href: "/user-signup" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/user-login" || pathname === "/user-signup";

  const navigation = isAuthPage
    ? loginSignupNavigation.concat(commonNavigation)
    : defaultNavigation.concat(commonNavigation);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#7DBDE3] shadow-md z-50">
  {/* Container logo riêng */}
  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pl-4">
    <Image
      src="/images/logo.jpg"
      alt="Logo"
      width={40}
      height={40}
      className="h-8 w-auto"
    />
  </div>

  {/* Container chính cho navigation */}
  <Disclosure as="nav">
    {({ open }) => (
      <>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-right">
            {/* Navigation links */}
            <div className="hidden sm:flex items-center ml-17 space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <span className="relative inline-block px-3 py-2 text-sm font-medium text-white hover:bg-[#345F79] hover:text-white">
                    {item.name}
                    {pathname === item.href && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-0 mt-1 block w-[70%] border-b-2 border-white" />
                    )}
                  </span>
                </Link>
              ))}
            </div>

                {/* Icon thông báo và Menu người dùng được đẩy sang phải */}
                {!isAuthPage && (
                  <div className="hidden sm:flex items-center ml-auto space-x-8
                  ">
                    <button
                      type="button"
                      className="rounded-full bg-white p-1 text-blue-400"
                    >
                      <Bell className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Menu as="div" className="relative">
                      <div>
                        <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
                          <Image
                            className="h-8 w-8 rounded-full"
                            src="/images/logo.jpg"
                            alt="User Avatar"
                            width={32}
                            height={32}
                          />
                        </MenuButton>
                      </div>
                      <MenuItems className=" right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Hồ sơ của bạn
                            </a>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Cài đặt
                            </a>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Đăng xuất
                            </a>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                )}

                {/* Nút menu Mobile */}
                <div className="sm:hidden ml-auto">
                  <DisclosureButton className="inline-flex items-center justify-center p-2 text-white hover:bg-[#345F79]">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <MenuIcon className="h-6 w-6" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? "bg-[#345F79] text-white"
                        : "text-white hover:bg-[#345F79] hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
                {/* Mobile: Container chứa icon thông báo và avatar */}
                {!isAuthPage && (
                  <div className="flex items-center justify-evenly mt-4">
                    <button
                      type="button"
                      className="rounded-full bg-white p-1 text-blue-400"
                    >
                      <Bell className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Menu as="div" className="relative">
                      <div>
                        <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
                          <Image
                            className="h-8 w-8 rounded-full"
                            src="/images/logo.jpg"
                            alt="User Avatar"
                            width={32}
                            height={32}
                          />
                        </MenuButton>
                      </div>
                      <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Hồ sơ của bạn
                            </a>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Cài đặt
                            </a>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Đăng xuất
                            </a>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                )}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </header>
  );
};

export default Header;