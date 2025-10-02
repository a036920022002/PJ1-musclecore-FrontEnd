import React, { useEffect, useState } from "react";
import axios from "axios";
import UserProfileForm from "./UserProfileFrom";
import ChangePasswordForm from "./ChangePasswordPage";
import OrderList from "./OrderList";

interface UserProfile {
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
  phone: string;
  email: string;
}

interface Order {
  _id: string;
  products: { name: string; quantity: number; price: number }[];
  status: string;
  createdAt: string;
}

const UserCenterPage: React.FC = () => {
  const token = localStorage.getItem("token") || "";
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 取得會員資料
    axios
      .get("http://localhost:3000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }, 
      })
      .then((res) => setProfile(res.data))
      .catch(() => setMessage("載入會員資料失敗"));

    // 取得訂單列表
    axios
      .get("http://localhost:3000/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` }, // 使用 token 認證
      })
      .then((res) => setOrders(res.data))
      .catch(() => setMessage("載入訂單失敗"));
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">會員中心</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>
      )}

      {profile && (
        <>
          <UserProfileForm
            profile={profile}
            token={token}
            onUpdate={(updatedProfile) => {
              setProfile(updatedProfile);
              setMessage("會員資料更新成功");
            }}
            onError={(msg) => setMessage(msg)}
          />

          <ChangePasswordForm
            token={token}
            onSuccess={() => setMessage("密碼變更成功")}
            onError={(msg) => setMessage(msg)}
          />

          <OrderList orders={orders} />
        </>
      )}
    </div>
  );
};

export default UserCenterPage;
