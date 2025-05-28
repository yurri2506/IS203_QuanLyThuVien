"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar/Sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [deleteOne, setDeleteOne] = useState(null);
  const router = useRouter();

  // Fetch users from the backend using axios
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
          "Accept": "*/*",
        },
      });
      setUserList(response.data.data || []);
      setFilteredUsers(response.data.data || []);
      toast.success("Lấy danh sách người dùng thành công", {
        style: { background: "#d1fae5", color: "#065f46" },
      });
    } catch (error) {
      console.error("Error fetching users:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : "No response data",
      });
      toast.error("Không thể tải danh sách người dùng", {
        style: { background: "#fee2e2", color: "#991b1b" },
      });
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = userList.filter(
        (user) =>
          user.id.toString().includes(searchQuery) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      if (filtered.length === 0) {
        toast.error("Không tìm thấy người dùng", {
          style: { background: "#fee2e2", color: "#991b1b" },
        });
      }
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(userList);
    }
  };

  // Handle delete user using axios
  const handleDelete = async (user) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.", {
          style: { background: "#fee2e2", color: "#991b1b" },
        });
        router.push("/login");
        return;
      }

      const response = await axios.delete(`http://localhost:8080/api/admin/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "*/*",
        },
      });

      toast.success("Xóa người dùng thành công", {
        style: { background: "#d1fae5", color: "#065f46" },
      });
      setPopUpOpen(false);
      setDeleteOne(null);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        } : "No response data",
      });

      const errorMessage = error.response?.data?.message || "Không thể xóa người dùng";
      toast.error(errorMessage, {
        style: { background: "#fee2e2", color: "#991b1b" },
      });
      setPopUpOpen(false);
    }
  };

  // Navigate to add user page
  const handleAddUser = () => {
    router.push("/users/addUser");
  };

  // Navigate to edit user page
  const handleEdit = (userId) => {
    router.push(`/users/${userId}`);
  };

  // UserCard component
  const UserCard = ({ user }) => {
    return (
      <div className="flex bg-white w-full rounded-lg mt-2 drop-shadow-lg p-5 gap-5 md:gap-10 items-center">
        <img
          src={user.avatar_url || "/default-avatar.png"}
          alt={user.username}
          className="w-[145px] h-[205px] object-cover rounded"
        />
        <div className="flex flex-col gap-3 w-full">
          <p>ID: {user.id}</p>
          <p className="font-bold">{user.username}</p>
          <p>Email: {user.email || "N/A"}</p>
          <p>Số điện thoại: {user.phone || "N/A"}</p>
          <p>Vai trò: {user.role || "USER"}</p>
          <div className="flex justify-end gap-5">
            <Button
              className="w-10 md:w-40 h-10 bg-[#062D76] hover:bg-gray-700 cursor-pointer"
              onClick={() => handleEdit(user.id)}
            >
              <Pencil className="w-5 h-5" color="white" />
              <p className="hidden md:block">Sửa người dùng</p>
            </Button>
            <Button
              className="w-10 md:w-40 h-10 bg-[#D66766] hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setDeleteOne(user);
                setPopUpOpen(true);
              }}
            >
              <Trash2 className="w-5 h-5" color="white" />
              <p className="hidden md:block">Xóa người dùng</p>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-[#EFF3FB]">
      <Toaster position="top-center" reverseOrder={false} />
      <Sidebar />
      <div className="flex w-full flex-col py-6 md:ml-52 mt-5 gap-2 items-center px-10">
        <div className="flex w-full items-center justify-between mb-10">
          <div className="flex gap-5">
            <Input
              type="text"
              placeholder="Tìm kiếm người dùng (ID, tên, email, số điện thoại)"
              className="w-full md:w-96 h-10 font-thin italic text-black text-lg bg-white rounded-[10px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className="w-10 h-10 bg-[#062D76] hover:bg-gray-700 rounded-[10px] cursor-pointer"
              onClick={handleSearch}
            >
              <Search className="w-6 h-6" color="white" />
            </Button>
          </div>
          <Button
            className="w-40 h-10 bg-[#062D76] hover:bg-gray-700 rounded-[10px] cursor-pointer"
            onClick={handleAddUser}
          >
            <Plus className="w-5 h-5" color="white" />
            Thêm người dùng
          </Button>
        </div>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <p className="text-gray-500">Không có người dùng nào để hiển thị</p>
        )}
        {popUpOpen && deleteOne && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="w-full h-full bg-black opacity-80 absolute top-0 left-0"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10">
              <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
              <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
              <div className="flex bg-white w-full rounded-lg mt-2 p-5 gap-5 items-center">
                <img
                  src={deleteOne.avatar_url || "/default-avatar.png"}
                  alt={deleteOne.username}
                  className="w-[145px] h-[205px] object-cover rounded"
                />
                <div className="flex flex-col gap-3 w-full">
                  <p>ID: {deleteOne.id}</p>
                  <p className="font-bold">{deleteOne.username}</p>
                  <p>Email: {deleteOne.email || "N/A"}</p>
                  <p>Số điện thoại: {deleteOne.phone || "N/A"}</p>
                  <p>Vai trò: {deleteOne.role || "USER"}</p>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-4">
                <Button
                  className="bg-gray-500 hover:bg-gray-700 text-white cursor-pointer"
                  onClick={() => setPopUpOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-700 text-white cursor-pointer"
                  onClick={() => handleDelete(deleteOne)}
                >
                  Xóa
                </Button> 
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;