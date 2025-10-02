import React, { useState } from "react";
import axios from "axios";

interface Props {
  profile: {
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
    phone: string;
    email: string;
  };
  token: string;
  onUpdate: (updatedProfile: Props["profile"]) => void;
  onError: (msg: string) => void;
}

const UserProfileForm: React.FC<Props> = ({ profile, token, onUpdate, onError }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(res.data);
    } catch (err: any) {
      onError("更新會員資料失敗");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-10">
      <h2 className="text-xl font-semibold">更新會員資料</h2>
      <div className="grid grid-cols-2 gap-4">
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="名字" className="p-2 border rounded" />
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="姓氏" className="p-2 border rounded" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded col-span-2">
          <option value="">性別</option>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
        <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} className="p-2 border rounded col-span-2" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="手機" className="p-2 border rounded col-span-2" />
        <input name="email" value={formData.email} disabled className="p-2 border rounded col-span-2 bg-gray-100" />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">儲存</button>
    </form>
  );
};

export default UserProfileForm;
