import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { useEffect, useState } from "react";
import {PencilIcon,TrashBinIcon} from "../../../icons/";
import EditProductModal from "./EditProductModal" ;
import DeleteProductModal from "./DeleteProductModel"; 


interface product {
  productId:string;
  productImage: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  productPrice: number;
  productInventory: number;
  productStatus: string;
}

export default function BasicTableOne() {
  const [tableData, setTableData] = useState<product[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
  fetch("http://localhost:3000/products") // 換成你後端實際的 URL
    .then((res) => res.json())
    .then((data) => {
      const setStatus=data.map((item:product)=>{
        const productStatus = item.productInventory > 0 ? "上架中" : "已無庫存"; // 
        const fullImagePath = item.productImage 
        return{
          ...item,
        productStatus:productStatus,
        productImage:fullImagePath
      }
      })
      setTableData(setStatus);
    })
    .catch((error) => {
      console.error("載入資料失敗", error);
    });
}, []);

const confirmDelete = (productId: string) => {
  // 呼叫刪除 API
  fetch(`http://localhost:3000/products/${productId}`, {
    method: "DELETE",
  })
    .then(res => {
      if (!res.ok) throw new Error("刪除失敗");
      setTableData(prev => prev.filter(item => item.productId !== productId));
      setShowDeleteModal(false);
      setDeleteProductId(null);
    })
    .catch(err => {
      alert("刪除失敗");
      console.error(err);
    });
};

    const editProduct = (productId: string) => {
    setEditingProductId(productId);
    setShowEditModal(true); 
};

  const deleteProduct=(productId: string) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
    console.log(productId)

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
                  名稱
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  描述
                </TableCell>
                <TableCell
                  isHeader
                  className="p-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  庫存
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  販售狀態
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
                  編輯/刪除
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
                <TableRow key={order.productId}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden">
                        <img
                          // width={40}
                          // height={40}
                          src={order.productImage}
                          alt={order.productName}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.productName}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order.productCategory}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.productDescription}
                  </TableCell>
                 
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.productInventory}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.productStatus === "上架中"
                          ? "success"
                            : order.productStatus === "已無庫存"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.productStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    ${order.productPrice}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <button onClick={()=>editProduct(order.productId)}>
                      <PencilIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    {showEditModal && editingProductId && (
                        <EditProductModal
                        productId={editingProductId}
                        onClose={() => setShowEditModal(false)}
                        />
                        )}
                    <button onClick={()=>deleteProduct(order.productId)}>
                      <TrashBinIcon className="w-4 h-4 text-gray-500" />
                    </button>  
                    {showDeleteModal && deleteProductId && (
                        <DeleteProductModal
                        productId={deleteProductId}
                        onCancel={() => setShowDeleteModal(false)}
                        onConfirm={confirmDelete}
                        />
                        )}               
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
