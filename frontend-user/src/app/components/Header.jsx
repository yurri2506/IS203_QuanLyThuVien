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
import { Menu as MenuIcon, X, Bell, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import axios from "axios";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Thể loại", href: "/Categories" },
  { name: "Giới thiệu", href: "/About" },
  { name: "Hỗ trợ", href: "/Help" },
];

const CartBadge = ({ count }) => {
  return (
    <div
      className="absolute self-center items-center right-0.5 px-1 text-[0.65rem] font-medium text-center justify-center text-white bg-[#F7302E] rounded-full"
      role="status"
      aria-label={`${count} items`}
    >
      {count}
    </div>
  );
};

const NotificationBadge = ({ count }) => {
  return (
    <div
      className="absolute self-center items-center right-0.5 px-1 text-[0.65rem] font-medium text-center justify-center text-white bg-[#F7302E] rounded-full"
      role="status"
      aria-label={`${count} unread notifications`}
    >
      {count}
    </div>
  );
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load read status from localStorage
  const [readStatus, setReadStatus] = useState(() => {
    const saved = localStorage.getItem("notificationReadStatus");
    return saved ? JSON.parse(saved) : {};
  });

  // Save read status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("notificationReadStatus", JSON.stringify(readStatus));
  }, [readStatus]);

  const user = JSON.parse(localStorage.getItem("persist:root")) || { id: "54" }; // Default to 54 if no user

  // Fetch cart
  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const booksInCart = data.data || [];
        setCartCount(booksInCart.length);
      } else {
        console.error("Lỗi khi lấy giỏ hàng");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy giỏ hàng:", error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    const notificationList = [];
    try {
      // console.log("Fetching new books...");
      const newBooksResponse = await axios.get("http://localhost:8080/api/book/new-books-this-week");
      if (newBooksResponse.status === 200) {
        const newBooksCount = newBooksResponse.data;
        // console.log("New books count:", newBooksCount);
        if (newBooksCount > 0) {
          notificationList.push({
            id: `new-books-${new Date().toISOString()}`,
            type: "new-books",
            message: `Có ${newBooksCount} sách mới trong tuần này!`,
            link: "/Homepage",
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        console.log("New books API failed:", newBooksResponse.status);
      }

      const userId = user.id;
      // console.log("Fetching borrow cards for userId:", userId);
      const borrowCardsResponse = await axios.post(`http://localhost:8080/api/borrow-cards/user/${userId}`);
      if (borrowCardsResponse.status === 200) {
        const borrowCards = borrowCardsResponse.data;
        // console.log("Borrow cards data:", borrowCards);
        const currentDate = new Date(); // May 19, 2025, 06:46 PM +07

        for (const card of borrowCards) {
          // console.log("Processing card:", card);
          if (card.borrowedBooks && Array.isArray(card.borrowedBooks)) {
            for (const borrowedBook of card.borrowedBooks) {
              // console.log("Processing borrowed book:", borrowedBook);
              const bookResponse = await axios.get(`http://localhost:8080/api/book/${borrowedBook.bookId}`);
              const bookName = bookResponse.status === 200 ? bookResponse.data.tenSach : `Sách ${borrowedBook.bookId}`;
              // console.log("Book name fetched:", bookName);
              const dueDate = card.dueDate ? new Date(card.dueDate) : null;
              const daysDiff = dueDate ? Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24)) : null;
              const daysSinceDue = dueDate ? Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24)) : null;

              if (card.status === "Đã yêu cầu") {
                notificationList.push({
                  id: `borrow-request-${card.id}-${borrowedBook.bookId}`,
                  type: "borrow-request",
                  message: `Bạn đã yêu cầu mượn sách ${bookName} thành công.`,
                  link: `/borrowed-card/${card.id}`,
                  timestamp: card.borrowDate || new Date().toISOString(),
                });
              }

              if (card.status === "Đang mượn") {
                notificationList.push({
                  id: `borrow-success-${card.id}-${borrowedBook.bookId}`,
                  type: "borrow-success",
                  message: `Bạn đã mượn sách ${bookName} thành công.`,
                  link: `/borrowed-card/${card.id}`,
                  timestamp: card.getBookDate || new Date().toISOString(),
                });

                if (daysDiff === 7 || daysDiff === 1) {
                  notificationList.push({
                    id: `due-reminder-${card.id}-${borrowedBook.bookId}-${daysDiff}`,
                    type: "due-reminder",
                    message: `Sách ${bookName} đã gần tới hạn mượn sách. Hãy gia hạn hoặc trả sách.`,
                    link: `/borrowed-card/${card.id}`,
                    timestamp: new Date().toISOString(),
                  });
                }

                if (daysSinceDue === 1) {
                  notificationList.push({
                    id: `overdue-${card.id}-${borrowedBook.bookId}`,
                    type: "overdue",
                    message: `Bạn đã quá hạn mượn sách ${bookName}!`,
                    link: `/borrowed-card/${card.id}`,
                    timestamp: new Date().toISOString(),
                  });
                }
              }

              if (card.status === "Đã trả") {
                notificationList.push({
                  id: `return-success-${card.id}-${borrowedBook.bookId}`,
                  type: "return-success",
                  message: `Bạn đã trả sách ${bookName} thành công.`,
                  link: `/borrowed-card/${card.id}`,
                  timestamp: card.dueDate || new Date().toISOString(),
                });
              }
            }
          } else {
            console.log("No borrowedBooks array found in card:", card);
          }
        }
      } else {
        console.log("Borrow cards API failed:", borrowCardsResponse.status, borrowCardsResponse.data);
      }

      const sortedNotifications = notificationList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(sortedNotifications);
      const unread = sortedNotifications.filter((n) => !readStatus[n.id]).length;
      setUnreadCount(unread);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchNotifications();
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("persist:root");
    router.push("/user-login");
  };

  const handleNotificationClick = (notificationId, link) => {
    setReadStatus((prev) => ({ ...prev, [notificationId]: true }));
    router.push(link);
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
              <div className="hidden sm:flex space-x-6">
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
                    <CartBadge count={cartCount} />
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

                {/* Notification Dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton
                    className={`relative p-2 rounded-full cursor-pointer hover:bg-white hover:text-[#052259] ${
                      pathname === "/notifications"
                        ? "bg-white text-[#052259]"
                        : "hover:bg-white hover:text-[#052259]"
                    }`}
                  >
                    {unreadCount > 0 && <NotificationBadge count={unreadCount} />}
                    <Bell
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        strokeWidth: "1.5px",
                      }}
                      className="size-6"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black/5 max-h-96 overflow-y-auto">
                    {loading && (
                      <div className="px-4 py-2 text-gray-500 w-full">Đang tải thông báo...</div>
                    )}
                    {error && (
                      <div className="px-4 py-2 text-red-500 w-full">Lỗi: {error}</div>
                    )}
                    {!loading && !error && notifications.length === 0 && (
                      <div className="px-4 py-2 text-gray-500 w-full">Không có thông báo nào.</div>
                    )}
                    {!loading && !error && notifications.length > 0 && (
                      notifications.map((notification) => (
                        <MenuItem key={notification.id}>
                          {({ active }) => (
                            <div
                              className={`w-full h-16 px-4 py-2 text-gray-700 cursor-pointer flex items-center justify-between ${
                                active ? "bg-gray-100" : ""
                              } ${readStatus[notification.id] ? "opacity-75" : "font-semibold"}`}
                              onClick={() => handleNotificationClick(notification.id, notification.link)}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{notification.message}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {!readStatus[notification.id] && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></span>
                              )}
                            </div>
                          )}
                        </MenuItem>
                      ))
                    )}
                  </MenuItems>
                </Menu>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full">
                    <Image
                      alt="User"
                      src="/images/logo.jpg"
                      width={40}
                      height={40}
                      className="size-10 rounded-full border-2 border-white cursor-pointer"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          href="/user-profile"
                          className={`block px-4 py-2 text-gray-700 ${
                            active && "bg-gray-100"
                          }`}
                        >
                          Hồ sơ của bạn
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          href="/settings"
                          className={`block px-4 py-2 text-gray-700 ${
                            active && "bg-gray-100"
                          }`}
                        >
                          Cài đặt
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 text-gray-700 ${
                            active && "bg-gray-100"
                          }`}
                        >
                          Đăng xuất
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
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

export default Header;