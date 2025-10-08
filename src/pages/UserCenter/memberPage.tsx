import React, { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import Header from "../../components/header/newHeader"; // 假設有一個 Header 組件
import {getToken,isTokenExpired} from "../../utils/token"
import {UserCircleIcon,PadLockIcon,ShoppingBagIcon } from "../../icons";
import NavButton from "../../components/UserProfile/NavButton";
import MemberCenter from "../../components/UserProfile/MemberCenter";
import ChangePassword from "../../components/UserProfile/ChangePassword";
import MemberOrder from "../../components/UserProfile/MemberOrder";
import { useNavigate } from "react-router-dom";

type ActiveTab = 'member' | 'password' | 'orders';

interface Member {
  _id: string;
  firstName: string;
  lastName:string;
  gender?: "Male" | "Female" | "Other";
  email:string;
  birth: Date;
  phone: string;
  password: string; 
  role:string;
  isActive:boolean;
  createdAt:Date; 
}

// Main User Center Page
const UserCenterPage: React.FC = () => {
  
  const [member, setMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('member');
  const navigate = useNavigate();

  useEffect(() => {
    const token=getToken()
    if (!token || isTokenExpired(token) ) {
      console.error('請先登入');
      setTimeout(() => {
      navigate("/signin"); 
    }, 1000);
    return;
    }
    const fetchProfile = async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      
      try {
        const response = await fetch(`${API_URL}/members/user`, {
          headers:{Authorization: `Bearer ${token}`},
        });
        
        if (response.ok) {
          const data = await response.json();
          setMember(data);
          console.log(member)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">會員中心</h1>
              <p className="text-gray-600">管理您的個人資料、密碼和訂單記錄</p>
            </div>
          </div>
          <div className="flex gap-6">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6 w-1/4">
            <nav className="space-y-4">
               <NavButton
              icon={<UserCircleIcon className="w-6 h-6" />}
              label="個人資料"
              active={activeTab === 'member'}
              onClick={() => setActiveTab('member')}
              />             
              <NavButton
              icon={<PadLockIcon className="w-6 h-6" />}
              label="修改密碼"
              active={activeTab === 'password'}
              onClick={() => setActiveTab('password')}
              />
              <NavButton
              icon={<ShoppingBagIcon className="w-6 h-6" />}
              label="訂單紀錄"
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              />
            </nav>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6 flex-1">
            {activeTab === 'member'&& <MemberCenter /> }
            {activeTab === 'password'&& <ChangePassword />}
            {activeTab === 'orders'&& <MemberOrder /> }
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCenterPage;