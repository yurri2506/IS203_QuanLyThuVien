"use client";
import React, { useState, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import { useRouter } from "next/navigation";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Load read status from localStorage
  const [readStatus, setReadStatus] = useState(() => {
    const saved = localStorage.getItem("notificationReadStatus");
    return saved ? JSON.parse(saved) : {};
  });

  // Save read status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("notificationReadStatus", JSON.stringify(readStatus));
  }, [readStatus]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationList = [];
      try {
        // Fetch new books this week
        console.log("Fetching new books...");
        const newBooksResponse = await axios.get("http://localhost:8080/api/book/new-books-this-week");
        if (newBooksResponse.status === 200) {
          const newBooksCount = newBooksResponse.data;
          console.log("New books count:", newBooksCount);
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

        // Fetch borrow cards for the user with book details
        const userId = localStorage.getItem("userId") || "54"; // Default to 54 from the image
        console.log("Fetching borrow cards for userId:", userId);
        const borrowCardsResponse = await axios.post(`http://localhost:8080/api/borrow-cards/user/${userId}`);
        if (borrowCardsResponse.status === 200) {
          const borrowCards = borrowCardsResponse.data;
          console.log("Borrow cards data:", borrowCards);
          const currentDate = new Date(); // 08:18 PM +07, May 18, 2025

          for (const card of borrowCards) {
            console.log("Processing card:", card);
            if (card.borrowedBooks && Array.isArray(card.borrowedBooks)) {
              for (const borrowedBook of card.borrowedBooks) {
                console.log("Processing borrowed book:", borrowedBook);
                // Fetch book name
                const bookResponse = await axios.get(`http://localhost:8080/api/book/${borrowedBook.bookId}`);
                const bookName = bookResponse.status === 200 ? bookResponse.data.tenSach : `Sách ${borrowedBook.bookId}`;
                console.log("Book name fetched:", bookName);
                const dueDate = card.dueDate ? new Date(card.dueDate) : null;
                const daysDiff = dueDate ? Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24)) : null;
                const daysSinceDue = dueDate ? Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24)) : null;

                // Đã yêu cầu (Pending)
                if (card.status === "Đã yêu cầu") {
                  notificationList.push({
                    id: `borrow-request-${card.id}-${borrowedBook.bookId}`,
                    type: "borrow-request",
                    message: `Bạn đã yêu cầu mượn sách ${bookName} thành công.`,
                    link: `/borrowed-card/${card.id}`,
                    timestamp: card.borrowDate || new Date().toISOString(),
                  });
                }

                // Đang mượn (Borrowed)
                if (card.status === "Đang mượn") {
                  notificationList.push({
                    id: `borrow-success-${card.id}-${borrowedBook.bookId}`,
                    type: "borrow-success",
                    message: `Bạn đã mượn sách ${bookName} thành công.`,
                    link: `/borrowed-card/${card.id}`,
                    timestamp: card.getBookDate || new Date().toISOString(),
                  });

                  // Due date reminders (7 days and 1 day before)
                  if (daysDiff === 7 || daysDiff === 1) {
                    notificationList.push({
                      id: `due-reminder-${card.id}-${borrowedBook.bookId}-${daysDiff}`,
                      type: "due-reminder",
                      message: `Sách ${bookName} đã gần tới hạn mượn sách. Hãy gia hạn hoặc trả sách.`,
                      link: `/borrowed-card/${card.id}`,
                      timestamp: new Date().toISOString(),
                    });
                  }

                  // Overdue check (current date - due_date = 1 day)
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

                // Đã trả (Returned)
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

        setNotifications(notificationList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handle notification click
  const handleNotificationClick = (notificationId, link) => {
    setReadStatus((prev) => ({ ...prev, [notificationId]: true }));
    router.push(link);
  };

  return (
    <div className="mt-12 md:ml-60 min-h-screen flex">
      <LeftSideBar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Thông báo</h1>
        {loading && <p className="text-gray-500">Đang tải thông báo...</p>}
        {error && <p className="text-red-500">Lỗi: {error}</p>}
        {!loading && !error && notifications.length === 0 && (
          <p className="text-gray-500">Không có thông báo nào.</p>
        )}
        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg shadow-md cursor-pointer transition-colors ${
                  readStatus[notification.id]
                    ? "bg-gray-300 hover:bg-gray-400"
                    : "bg-blue-100 hover:bg-blue-300"
                }`}
                onClick={() =>
                  handleNotificationClick(notification.id, notification.link)
                }
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!readStatus[notification.id] && (
                    <span className="w-3 h-3 bg-blue-500 rounded-full ml-4"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;