import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import {PageIcon} from "../../../../src/icons";
import { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail"; 
import { Plus, Minus } from "lucide-react"
import React from "react";

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

export default function BasicTableOne() {
  const [tableData,setTableData]=useState<Order[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  useEffect(() => {
    fetch("http://localhost:3000/orders") 
      .then((res) => res.json())
      .then((data) => {
        setTableData(data); // 假設後端返回的數據格式符合 Order 接口
        console.log(data)
      })
      .catch((error) => {
        console.error("載入資料失敗", error);
      });
  }, []);

  const orderDetail=(orderId: string) => { // 點擊訂單編號時觸發
    setOrderId(orderId);  // 設置當前訂單 ID
    setShowOrderModal(true); // 顯示訂單詳情模態框
    console.log("orderId",orderId)// 可以在這裡進行其他操作，例如獲取訂單詳情

  }
    
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  訂單編號
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  訂單內容
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  數量
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  價格
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  狀態
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  收件人/配送資訊
                </TableCell>
              </TableRow>
            </TableHeader>


            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
                <React.Fragment key={order.orderId}>
                  {/* 主訂單列 */}
                  <TableRow>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <button
                        onClick={() => toggleExpand(order.orderId.toString())}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                          {expandedOrderId === order.orderId.toString() ? (
                          <Minus className="w-4 h-4" />
                          ) : (
                          <Plus className="w-4 h-4" />
                          )}
                        </button>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.orderId}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {expandedOrderId === order.orderId.toString()
                      ? "商品明細"
                      : "點 + 查看商品"}
                    </TableCell>
                    
                    {/* 總數量 */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </TableCell>
                    
                    {/* 總價 */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                      NT$ {order.total}
                    </TableCell>
                    
                    <TableCell className="px-4 py-3">{order.status}</TableCell>
                    <TableCell className="px-4 py-3">
                      {/* {order.customerInfo.name} */}
                      <PageIcon 
                      onClick={() => orderDetail(order.orderId.toString())} 
                      className="cursor-pointer"
                      />
                    </TableCell>
                  </TableRow>

      {/* 展開的商品列 */}
      {expandedOrderId === order.orderId.toString() &&
        order.items.map((item) => (
          <TableRow
            key={item.productId}
            className="bg-gray-50 dark:bg-gray-800/40"
          >
            {/* 空白，對齊訂單編號 */}
            <TableCell>{""}</TableCell>

            {/* 商品名稱 */}
            <TableCell className="px-4 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {item.productName}
              <div className="text-gray-400 text-xs">ID: {item.productId}</div>
            </TableCell>

            {/* 數量 */}
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
              {item.quantity}
            </TableCell>

            {/* 單價 */}
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
              NT$ {item.productPrice}
            </TableCell>

            {/* 狀態、配送資訊保留空白 */}
            <TableCell>{""}</TableCell>
            <TableCell>{""}</TableCell>
          </TableRow>
        ))}
    </React.Fragment>
  ))}
</TableBody>




          </Table>
        </div>
      </div>

      {showOrderModal && orderId && (
        <OrderDetail
          orderId={orderId}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}
