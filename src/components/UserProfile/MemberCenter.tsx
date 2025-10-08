import React, { useEffect, useState } from "react";
import { getToken,isTokenExpired } from "../../utils/token";
import {Loader} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Member {
  _id: string;
  firstName: string;
  lastName:string;
  gender?: "Male" | "Female" | "Other";
  email:string;
  birth: string;
  phone: string;
  password: string; 
  role:string;
  isActive:boolean;
  createdAt:Date; 
}

const MemberProfile: React.FC = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = getToken();
    

    if (!token || isTokenExpired(token) ) {
          console.error('請先登入');
          setTimeout(() => {
          navigate("/signin"); 
        }, 1000);
        return;
        }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/members/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMember(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!member) return <p>載入中...</p>;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setMember(prev => ({
    ...prev,
    [name]: value
  } as Member)); // 告訴 TS 我保證這裡仍是 Member
};

  const handleSubmit= async ()=>{
    const token = getToken();
    if (!member) return; // 如果沒有產品資料，則不進行更新
    try { // 嘗試更新產品資料
      const response = await fetch(`${API_URL}/members/user`, {
        method: "PUT", // 使用PUT方法更新
        headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
        }, // 告訴後端傳送 JSON 格式的資料&攜帶token
        body: JSON.stringify(member), // 將產品資料轉換為 JSON 字串
      });
      const data = await response.json(); // 解析回應
      if (!response.ok) throw new Error("更新失敗"); // 如果回應不是200，則拋出錯誤
      setMember(data);
      
      alert("更新成功！"); 
    } catch (error) { 
      console.error(error);
      alert("更新失敗，請稍後再試");
    }
    
    console.log("handleSubmit member",member)
    console.log("handleSubmit token",token)
    setIsSubmitting(false);
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <p>{member.email}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">姓氏</label>
        <input 
        name="firstName" 
        value={member.firstName} 
        onChange={handleChange} 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        disabled={isSubmitting}
        />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">名</label>
        <input 
        name="lastName" 
        value={member.lastName} 
        onChange={handleChange} 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
        <select
        name="gender"
        value={member.gender || ""}
        onChange={handleChange}
        >
          <option value="">請選擇</option>
          <option value="Male">男</option>
          <option value="Female">女</option>
          <option value="Other">其他</option>
        </select>
  </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">生日</label>
        <input 
        name="birthday" 
        type="date" 
        value={member.birth ? new Date(member.birth).toISOString().split("T")[0] : ""} 
        onChange={handleChange} 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">連絡電話</label>
        <input 
        name="phone" 
        value={member.phone} 
        onChange={handleChange} 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        disabled={isSubmitting}
        />
      </div>
      <div className="pt-6 border-t border-gray-200">
        <button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
          isSubmitting
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>更新中...</span>
              </span>
            ) : (
              '儲存變更'
            )}
          </button>
        </div>
  </div>
  );
};

export default MemberProfile;
