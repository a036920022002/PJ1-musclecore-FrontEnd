import React, { useEffect, useState } from "react";

interface Product {
  productId: string;
  productImage: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  productPrice: number;
  productInventory: number;
  productStatus: string;
  productSubCategory: string;
 
}

interface EditProductModalProps {
  productId: string;
  onClose: () => void;
}

const Category = [
    { value: "運動器材", label: "運動器材" },
    { value: "運動配件", label: "運動配件" },
    { value: "服飾", label: "服飾" },
    { value: "鞋款", label: "鞋款" },
  ];

  const SubCategory = [
    { value: "重訓器材", label: "重訓器材", category: "運動器材" },
    { value: "瑜珈用品", label: "瑜珈用品", category: "運動器材" },
    { value: "水壺", label: "水壺", category: "運動配件" },
    { value: "毛巾", label: "毛巾", category: "運動配件" },
    { value: "上衣", label: "上衣", category: "服飾" },
    { value: "褲子", label: "褲子", category: "服飾" },
    { value: "外套", label: "外套", category: "服飾" },
    { value: "跑鞋", label: "跑鞋", category: "鞋款" },
    { value: "訓練鞋", label: "訓練鞋", category: "鞋款" },
    { value: "休閒鞋", label: "休閒鞋", category: "鞋款" },
  ];


export default function EditProductModal({ productId, onClose }: EditProductModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // 抓取產品資料
  useEffect(() => {
    fetch(`${API_URL}/products/${productId}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("取得產品資料失敗", err));
  }, [productId]);

  //表單變更處理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!product) return;
    const { name, value } = e.target;
     // 如果改動商品分類，子分類清空（因為可能不再符合）
    if (name === "productCategory") {
      setProduct({ // 保持其他屬性不變
        ...product,
        productCategory: value,
        productSubCategory: "", 
      });
    } else if (name === "productPrice" || name === "productInventory") {
      setProduct({ // 價格跟庫存要轉為數字
        ...product,
        [name]: Number(value),
      });
    } else { //其他不變
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  //送出更新請求 put
  const handleSubmit = async () => { 
    if (!product) return; // 如果沒有產品資料，則不進行更新
    setIsLoading(true); // 設定載入中狀態

    try { // 嘗試更新產品資料
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT", // 使用PUT方法更新
        headers: { "Content-Type": "application/json" }, // 告訴後端傳送 JSON 格式的資料
        body: JSON.stringify(product), // 將產品資料轉換為 JSON 字串
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

  if (!product) return <div className="p-4">載入中...</div>; // 如果沒有產品資料，則顯示載入中

  //過濾子分類選項 根據選的分類顯示對應的子分類選項
  const filteredSubCategories = SubCategory.filter((sub) => sub.category === product.productCategory);



  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">編輯商品</h2>
        <div className="space-y-3">
          <span>商品名稱：</span>
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            placeholder="商品名稱"
          />

        {/* 商品分類 */}
          <span>商品分類：</span>
          <select
            className="w-full border p-2 rounded"
            name="productCategory"
            value={product.productCategory}
            onChange={handleChange}
          >
            <option value="">請選擇分類</option>
            {Category.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* 商品子分類 */}
          <span>商品子分類：</span>
          <select
            className="w-full border p-2 rounded"
            name="productSubCategory"
            value={product.productSubCategory}
            onChange={handleChange}
            disabled={!product.productCategory}
          >
            <option value="">{product.productCategory ? "請選擇子分類" : "請先選擇分類"}</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.value}
              </option>
            ))}
          </select>

          <span>商品描述：</span>
          <textarea
            className="w-full border p-2 rounded"
            name="productDescription"
            value={product.productDescription}
            onChange={handleChange}
            placeholder="商品描述"
          />
          <span>價格：</span>
          <input
            className="w-full border p-2 rounded"
            type="number"
            name="productPrice"
            value={product.productPrice}
            onChange={handleChange}
            placeholder="商品價格"
          />
          <span>庫存量：</span>
          <input
            className="w-full border p-2 rounded"
            type="number"
            name="productInventory"
            value={product.productInventory}
            onChange={handleChange}
            placeholder="商品庫存"
          />
         
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

