
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import  { getToken, isTokenExpired}  from "../../utils/token"
import ComponentCard from "../common/ComponentCard";

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
  orderId:string,
  items:OrderItem[],
  total:number,
  customerInfo:customerInfo,
  paymentMethod:string,
  status:string,
  userId:string,
  createdAt: string
}

export default function MyOrder() {
   const [error,setError]=useState<string | null>(null);
   const [order, setOrder] = useState<Order[] | []>([]);
   const navigate = useNavigate();
   const API_URL = import.meta.env.VITE_API_URL;
   
   useEffect(() => {
    const token=getToken();
    if(!token || isTokenExpired(token)){
        setError("請先登入")
        setTimeout(() => {
        navigate("/signin");
      }, 1000);
      return;
    }
   

   fetch(`${API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        console.log("data",data);
        console.log("order",order)
    })
      .catch(() => setError("取得訂單失敗"));
  }, [navigate]);

  if (error) return <div>{error}</div>;

    
  return (
    <div className="overflow-hidden rounded-xl bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="max-w-full">
            {order.map((order) => (
                <ComponentCard
                key={order.orderId}
                title={`訂單編號: ${order.orderId}`}
                desc={`狀態: ${order.status} | 總金額: $${order.total}`}
                className="mb-4"
                >
            {order.items.map((item, index) => (
              <div key={index}>
                {item.productName} x {item.quantity} - ${item.productPrice}
              </div>
            ))}
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              收件人: {order.customerInfo.name} / {order.customerInfo.address} / {order.customerInfo.phone}
            </div>
            <div className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              下單時間: {new Date(order.createdAt).toLocaleString()}
            </div>
          </ComponentCard>
            ))}
                      
           
        </div>
      </div>

      
    </div>
  );
}
