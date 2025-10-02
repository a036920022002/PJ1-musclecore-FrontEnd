import React, { useEffect, useState } from "react";
import { User, Lock, Package, AlertCircle, CheckCircle, Loader, Settings } from "lucide-react";
import Header from "../../components/header/newHeader"; // 假設有一個 Header 組件
import {setToken,removeToken,getToken} from "../../utils/token"

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
// export { Member, fetchMember };

// interface Order {
//   _id: string;
//   products: { name: string; quantity: number; price: number }[];
//   status: string;
//   createdAt: string;
// }



// Tab Navigation Component
// const TabNavigation: React.FC<{
//   activeTab: ActiveTab;
//   onTabChange: (tab: ActiveTab) => void;
// }> = ({ activeTab, onTabChange }) => {
//   const tabs = [
//     { id: 'member' as ActiveTab, label: '個人資料', icon: User },
//     { id: 'password' as ActiveTab, label: '密碼變更', icon: Lock },
//     { id: 'orders' as ActiveTab, label: '訂單記錄', icon: Package },
//   ];

//   return (
//     <div className="border-b border-gray-200 bg-white rounded-t-lg">
//       <nav className="flex space-x-0">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.id;
          
//           return (
//             <button
//               key={tab.id}
//               onClick={() => onTabChange(tab.id)}
//               className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
//                 isActive
//                   ? 'border-blue-500 text-blue-600 bg-blue-50'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <Icon className="w-5 h-5" />
//               <span>{tab.label}</span>
//             </button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// Profile Tab Component
// const ProfileTab: React.FC<{
//   profile: UserProfile;
//   onUpdate: (updatedProfile: UserProfile) => void;
//   onError: (msg: string) => void;
// }> = ({ profile, onUpdate, onError }) => {
//   const [formData, setFormData] = useState(profile);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     setFormData(profile);
//   }, [profile]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
    
//     try {
//       const response = await fetch('/api/user/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const updatedProfile = await response.json();
//         onUpdate(updatedProfile);
//       } else {
//         const error = await response.json();
//         onError(error.message || '更新會員資料失敗');
//       }
//     } catch (error) {
//       onError('網路錯誤，更新失敗');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
    
//     <div className="p-8 bg-white rounded-b-lg">
     
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">個人資料管理</h2>
//         <p className="text-gray-600">更新您的基本資料和聯絡方式</p>
//       </div>
      
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">名字</label>
//             <input 
//               name="firstName" 
//               value={formData.firstName} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//               disabled={isSubmitting}
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">姓氏</label>
//             <input 
//               name="lastName" 
//               value={formData.lastName} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//               disabled={isSubmitting}
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
//             <select 
//               name="gender" 
//               value={formData.gender} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={isSubmitting}
//             >
//               <option value="">選擇性別</option>
//               <option value="male">男</option>
//               <option value="female">女</option>
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">生日</label>
//             <input 
//               name="birthday" 
//               type="date" 
//               value={formData.birthday} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//               disabled={isSubmitting}
//             />
//           </div>
          
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">手機號碼</label>
//             <input 
//               name="phone" 
//               value={formData.phone} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//               disabled={isSubmitting}
//             />
//           </div>
          
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
//             <input 
//               name="email" 
//               value={formData.email} 
//               disabled 
//               className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500" 
//             />
//             <p className="text-sm text-gray-500 mt-1">電子郵件無法修改</p>
//           </div>
//         </div>
        
//         <div className="pt-6 border-t border-gray-200">
//           <button 
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className={`px-8 py-3 rounded-lg font-medium transition-colors ${
//               isSubmitting 
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                 : 'bg-blue-500 text-white hover:bg-blue-600'
//             }`}
//           >
//             {isSubmitting ? (
//               <span className="flex items-center space-x-2">
//                 <Loader className="w-4 h-4 animate-spin" />
//                 <span>更新中...</span>
//               </span>
//             ) : (
//               '儲存變更'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Password Tab Component
// const PasswordTab: React.FC<{
//   onSuccess: () => void;
//   onError: (msg: string) => void;
// }> = ({ onSuccess, onError }) => {
//   const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(false);

//   const validatePassword = (password: string) => {
//     // At least 8 characters, contains uppercase, lowercase, and numbers
//     const minLength = password.length >= 8;
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumbers = /\d/.test(password);
    
//     return minLength && hasUpperCase && hasLowerCase && hasNumbers;
//   };

//   const validate = () => {
//     const newErrors: { [key: string]: string } = {};
    
//     if (!form.currentPassword) {
//       newErrors.currentPassword = "請輸入目前密碼";
//     }
    
//     if (!form.newPassword) {
//       newErrors.newPassword = "請輸入新密碼";
//     } else if (!validatePassword(form.newPassword)) {
//       newErrors.newPassword = "新密碼至少8位數，需包含大小寫字母和數字";
//     }
    
//     if (form.newPassword !== form.confirmPassword) {
//       newErrors.confirmPassword = "確認密碼不一致";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
    
//     // Clear corresponding error
//     if (errors[name]) {
//       setErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[name];
//         return copy;
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
    
//     setLoading(true);
//     try {
//       const response = await fetch('/api/user/change-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//           currentPassword: form.currentPassword,
//           newPassword: form.newPassword,
//         }),
//       });

//       if (response.ok) {
//         setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//         onSuccess();
//       } else {
//         const error = await response.json();
//         onError(error.message || '密碼變更失敗');
//       }
//     } catch (error) {
//       onError('網路錯誤，變更失敗');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-white rounded-b-lg">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">密碼變更</h2>
//         <p className="text-gray-600">為了帳戶安全，請定期更新您的密碼</p>
//       </div>
      
//       <div className="max-w-md space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">目前密碼</label>
//           <input
//             type="password"
//             name="currentPassword"
//             value={form.currentPassword}
//             onChange={handleChange}
//             className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//               errors.currentPassword ? "border-red-500" : "border-gray-300"
//             }`}
//             disabled={loading}
//             placeholder="請輸入目前密碼"
//           />
//           {errors.currentPassword && (
//             <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
//           )}
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">新密碼</label>
//           <input
//             type="password"
//             name="newPassword"
//             value={form.newPassword}
//             onChange={handleChange}
//             className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//               errors.newPassword ? "border-red-500" : "border-gray-300"
//             }`}
//             disabled={loading}
//             placeholder="至少8位數，包含大小寫字母和數字"
//           />
//           {errors.newPassword && (
//             <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
//           )}
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">確認新密碼</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={form.confirmPassword}
//             onChange={handleChange}
//             className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//               errors.confirmPassword ? "border-red-500" : "border-gray-300"
//             }`}
//             disabled={loading}
//             placeholder="再次輸入新密碼"
//           />
//           {errors.confirmPassword && (
//             <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
//           )}
//         </div>
        
//         <div className="pt-6 border-t border-gray-200">
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`px-8 py-3 rounded-lg font-medium transition-colors ${
//               loading
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
//                 : "bg-green-600 text-white hover:bg-green-700"
//             }`}
//           >
//             {loading ? (
//               <span className="flex items-center space-x-2">
//                 <Loader className="w-4 h-4 animate-spin" />
//                 <span>變更中...</span>
//               </span>
//             ) : (
//               "變更密碼"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Orders Tab Component
// const OrdersTab: React.FC<{ orders: Order[] }> = ({ orders }) => {
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(false);
  
//   const filteredOrders = orders.filter(order => {
//     if (filter === 'all') return true;
//     return order.status === filter;
//   });

//   const getStatusBadge = (status: string) => {
//     const statusMap = {
//       '已完成': 'bg-green-100 text-green-800',
//       '處理中': 'bg-yellow-100 text-yellow-800',
//       '已取消': 'bg-red-100 text-red-800',
//       '待付款': 'bg-blue-100 text-blue-800',
//     };
//     return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className="p-8 bg-white rounded-b-lg">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">訂單記錄</h2>
//         <p className="text-gray-600">查看您的所有訂單狀態和詳細資訊</p>
//       </div>
      
//       {loading ? (
//         <div className="text-center py-16">
//           <Loader className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">載入訂單資料中...</h3>
//         </div>
//       ) : (
//         <>
//           <div className="mb-6">
//             <div className="flex space-x-4">
//               {['all', '處理中', '已完成', '已取消'].map(status => (
//                 <button
//                   key={status}
//                   onClick={() => setFilter(status)}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                     filter === status
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   {status === 'all' ? '全部' : status}
//                   <span className="ml-2 text-sm">
//                     ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {filteredOrders.length === 0 ? (
//             <div className="text-center py-16">
//               <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 {filter === 'all' ? '沒有訂單記錄' : `沒有${filter}的訂單`}
//               </h3>
//               <p className="text-gray-500">您目前還沒有符合條件的訂單</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredOrders.map((order) => (
//                 <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="font-semibold text-lg text-gray-900">訂單 #{order._id}</h3>
//                       <p className="text-sm text-gray-500">
//                         {new Date(order.createdAt).toLocaleDateString('zh-TW', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric',
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </p>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h4 className="font-medium text-gray-700">訂單內容：</h4>
//                     {order.products.map((product, index) => (
//                       <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
//                         <div>
//                           <span className="font-medium">{product.name}</span>
//                           <span className="text-gray-500 ml-2">× {product.quantity}</span>
//                         </div>
//                         <span className="font-medium">NT$ {product.price.toLocaleString()}</span>
//                       </div>
//                     ))}
//                   </div>
                  
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">總金額：</span>
//                       <span className="text-lg font-bold text-gray-900">
//                         NT$ {order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// Main User Center Page
const UserCenterPage: React.FC = () => {
  
  const [member, setMember] = useState<Member | null>(null);
  // const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  // const [orders, setOrders] = useState<Order[]>([]);
  // const [message, setMessage] = useState("");
  // const [loading, setLoading] = useState(true);
  // const clearMessage = () => {
  //   setTimeout(() => setMessage(""), 5000);
  // };
  // Fetch user profile data
  useEffect(() => {
    const token=getToken()
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/members/user', {
          headers:{Authorization: `Bearer ${token}`},
        });
        
        if (response.ok) {
          const data = await response.json();
          setMember(data);
          console.log("member",member);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Fetch user orders data
  // useEffect(() => {
  //    const token=getToken()
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/members', {
  //         headers:{Authorization: `Bearer ${token}`},
  //       });
        
  //       if (response.ok) {
  //         const data = await response.json();
  //         setOrders(data);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch orders:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, []);

  // const handleProfileUpdate = (updatedProfile: UserProfile) => {
  //   setProfile(updatedProfile);
  //   setMessage("會員資料更新成功！");
  //   clearMessage();
  // };

  // const handlePasswordSuccess = () => {
  //   setMessage("密碼變更成功！");
  //   clearMessage();
  // };

  // const handleError = (msg: string) => {
  //   setMessage(msg);
  //   clearMessage();
  // };

  // const renderActiveTab = () => {
  //   switch (activeTab) {
  //     case 'profile':
  //       return (
  //         <ProfileTab
  //           profile={profile}
  //           onUpdate={handleProfileUpdate}
  //           onError={handleError}
  //         />
  //       );
  //     case 'password':
  //       return (
  //         <PasswordTab
  //           onSuccess={handlePasswordSuccess}
  //           onError={handleError}
  //         />
  //       );
  //     case 'orders':
  //       return <OrdersTab orders={orders} />;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">會員中心</h1>
          </div>
          <p className="text-gray-600">管理您的個人資料、密碼和訂單記錄</p>
        </div>

        {/* {message && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center space-x-2 ${
            message.includes('成功') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.includes('成功') ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )} */}

        {/* <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
          
          {renderActiveTab()}
        </div> */}
      </div>
    </div>

    </>
  );
};

export default UserCenterPage;