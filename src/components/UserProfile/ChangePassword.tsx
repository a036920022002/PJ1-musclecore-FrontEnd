import React, { useState } from "react";
import { getToken } from "../../utils/token";
import { Eye, EyeOff} from "lucide-react";

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  
  const handleSubmit = async ()=>{
    const token = getToken();
    if(!token) return;
    console.log("oldPassword",oldPassword);
    console.log("newPassword",newPassword);

    setIsSubmitting(true);
    try{
    const res = await fetch('http://localhost:3000/members/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    body: JSON.stringify({ oldPassword, newPassword }),
    })
  if (res.ok) {
        alert('密碼更新成功');
        setOldPassword('');
        setNewPassword('');
      } else {
        const data = await res.json();
        alert(`更新失敗: ${data.message || res.status}`);
      }
    } catch (error) {
      console.error(error);
      alert('更新失敗');
    }
    setIsSubmitting(false);

};

  return (
    <div className="max-w-md mx-auto space-y-4 p-4"> 
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            請輸入舊密碼
            </label>
            <div className="relative">
                <input
                  id="oldpassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="請輸入舊密碼"
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
            </div>
        </div>
      <div>
        <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700 mb-1">
            請輸入新密碼
            </label>
            <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="請輸入新密碼"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
            </div>
        </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full px-8 py-3 rounded-lg font-medium transition-colors ${
          isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? '更新中...' : '儲存變更'}
      </button>
  
    </div>
  );
};

export default ChangePassword;
