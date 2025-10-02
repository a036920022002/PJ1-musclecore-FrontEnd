import React, { useEffect, useState } from "react";


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

interface EditMemberProp {
  _id: string;
  onClose: () => void;
}

export default function EditMember({ _id, onClose }: EditMemberProp) {
  // const [email, setEmail] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMember] = useState<Member | null>(null);

  // 抓取產品資料
  useEffect(() => {
    fetch(`http://localhost:3000/members/${_id}`)
      .then(res => res.json())
      .then(data => {
        setMember(data)})
      .catch(err => console.error("取得會員資料失敗", err));
  }, [_id]);

  //表單變更處理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!member) return;
    const { name, value } = e.target;
      setMember({
        ...member,
        [name]: value,
      });
    }
  ;

  //送出更新請求 put
  const handleSubmit = async () => { 
    if (!member) return; // 如果沒有產品資料，則不進行更新
    setIsLoading(true); 
    console.log(member)

    try { // 嘗試更新產品資料
      const response = await fetch(`http://localhost:3000/members/${_id}`, {
        method: "PUT", // 使用PUT方法更新
        headers: { "Content-Type": "application/json" }, // 告訴後端傳送 JSON 格式的資料
        body: JSON.stringify(member), // 將產品資料轉換為 JSON 字串
      });

      if (!response.ok) throw new Error("更新失敗"); // 如果回應不是200，則拋出錯誤

      alert("更新成功！"); 
      onClose(); // 關閉視窗
    } catch (error) { 
      console.error(error);
      alert("更新失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  if (!member) return <div className="p-4">載入中...</div>; // 如果沒有產品資料，則顯示載入中


  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">編輯會員</h2>
        <div className="space-y-3">
          <span>Email</span>
          <p>{member?.email|| ""}</p>

          <p>姓</p>
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="firstName"
            value={member?.firstName|| ""}
            onChange={handleChange}
          />

          <p>名</p>
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="lastName"
            value={member?.lastName|| ""}
            onChange={handleChange}
          />

          <p>性別</p>
          <p>{member?.gender|| ""}</p>

          <p>電話</p>
          <input
            className="w-full border p-2 rounded"
            type="string"
            name="phone"
            value={member?.phone|| ""}
            onChange={handleChange}
          />

          <p>帳號狀態</p>
          <select
            className="w-full border p-2 rounded"
            name="role"
            value={member?.role|| ""}
            onChange={(e) => setMember(prev => prev ? { ...prev, role: e.target.value } : prev)}
          >
            <option value="">請選擇</option>
            <option value="customer">正常會員</option>
            <option value="canceled">已停用</option>
            <option value="other">其他</option>            
            </select>
         
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={isLoading}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "更新中..." : "更新"}
          </button>
        </div>
      </div>
    </div>
  );
}

