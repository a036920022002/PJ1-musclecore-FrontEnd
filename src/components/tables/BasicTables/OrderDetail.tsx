import  { useEffect, useState } from "react";

import Select from "../../../components/form/Select";

interface OrderItem {
  productId: number,
  productName: string,
  productPrice: number,
  quantity: number,
  };

interface customerInfo{
  name: string,
  email: string,
  phone: string,
  address: string,
}

interface Order{
  orderId:number,
  items:OrderItem[],
  total:number,
  customerInfo:customerInfo,
  paymentMethod:string,
  status:string,
  userId:string
}

interface OrderDetail {
  orderId: string;
  onClose: () => void;
}

export default function OrderDetail({ orderId, onClose }: OrderDetail) {
  const [order, setOrder] = useState<Order | null>(null);
  const [statusChange, setStatusChange] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // 抓取訂單資料
  useEffect(() => {
    fetch(`${API_URL}/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {setOrder(data);
        console.log(data)
      })      
      .catch(err => console.error("取得訂單資料失敗", err));
  }, [orderId]);

  if (!order) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <p>載入中...</p>
      </div>
    </div>
  );
}
 const handleUpdate = async () => { 
  if (!statusChange) return;
    setIsLoading(true);
    fetch(`${API_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusChange }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data); // 更新畫面
        setIsLoading(false);
        onClose(); // 關閉彈窗
      })
      .catch((err) => {
        console.error("更新訂單失敗", err);
        setIsLoading(false);
      });
 }


const statusOption = [
    { value: "處理中", label: "處理中" },
    { value: "已寄出", label: "已寄出" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg overflow-auto min-w-0">
        <div>
          <h2 className="text-lg font-bold mb-4">訂單資訊</h2>
          <div className="space-y-3 break-words">
            <p>訂單編號：{orderId}</p>
            <p>收件人：{order.customerInfo.name}</p>
            <p>收件人電話：{order.customerInfo.phone}</p>
            <p>寄件方式：宅配</p>
            <p>收件人地址：{order.customerInfo.address}</p>
            <p>訂單狀態：{order.status}</p>
            <p>訂單更新</p>
            <Select
              options={statusOption}
              placeholder="訂單狀態"
              onChange={(value: string) => setStatusChange(value)}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
        >取消
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleUpdate}
            disabled={isLoading}
          >確定/更新
            {isLoading ? "更新中..." : "更新"}
          </button>
        </div>
      </div>
    </div>
  );
}