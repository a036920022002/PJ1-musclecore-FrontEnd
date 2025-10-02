// import products from '../../data/products';
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext"; // 引入購物車 Hook
import Alert from "../../components/ui/alert/Alert"; // 假設有一個 alert 函數來顯示提示訊息
type ProductListProps = {
  category?: string;
  subcategory?: string;
};

type Product = {
  productId: number;
  productIsNew: boolean;
  productIsSale: boolean;
  productName: string;
  productImage: string;
  productImageAlt: string;
  productCategory: string;
  productSubcategory: string;
  productPrice: number;
  productDescription: string;
  productInventory: number;
  productBrand: string;
  isActive: boolean;
  createdAt: string; // 後端 Date 會變成字串
  
};

export default function ProductList({
  category,
  subcategory,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]); // 初始產品列表
  const { addToCart ,setIsCartOpen} = useCart(); // 從 Context 取得 addToCart 函數
  const [alertMessage, setAlertMessage] = useState<string>(""); // 用於顯示提示訊息
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false); // 用於控制提示訊息的顯示狀態
  const showAlert = (message: string) => {
    // 假設有一個 alert 函數來顯示提示訊息
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 2000);
  };

  useEffect(() => {
    // 使用 useEffect 來獲取產品資料
    // 使用 axios 從後端 API 獲取產品資料
    axios
      .get("http://localhost:3000/products") //要改成實際的 API 路徑
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);


 
  // 處理加入購物車
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); // 防止 Link 導航
    e.stopPropagation(); // 防止事件冒泡

    const cartItem = {
      productId: product.productId,
      productIsNew: product.productIsNew,
      productIsSale: product.productIsSale,
      productName: product.productName,
      productImage: product.productImage,
      productImageAlt: product.productImageAlt,
      productCategory: product.productCategory,
      productSubcategory: product.productSubcategory,
      productPrice: product.productPrice,
      productDescription: product.productDescription,
      productInventory: product.productInventory,
      productBrand: product.productBrand,
      isActive: product.isActive,
      createdAt: product.createdAt,
    };

    addToCart(cartItem); // 加入購物車
      // alert(`已加入購物車：${product.productName}`); // 可選：顯示成功訊息
      setIsCartOpen(true); // 打開購物車抽屜
      showAlert(`已加入購物車：${product.productName}`);
  };

  // 過濾產品列表
  // 如果有 category 和 subcategory，則根據這些條件過濾
  const filteredProducts = products.filter((product) => {
    const matchCategory = category ? product.productCategory === category : true; // 符合分類的產品
    // 如果有 subcategory，則檢查產品的 Subcategory 是否符合
    const matchSub = subcategory ? product.productSubcategory === subcategory : true; // 符合子分類的產品
    const hasInventory = product.productInventory > 0; // 檢查是否有庫存
    return matchCategory && matchSub && hasInventory; // 符合分類和子分類的產品

  });

  return (
    <div id="product-list">
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 lg:max-w-7xl">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 text-center">此分類尚無商品</p>
          ) : (
            <div className="grid grid-cols-3 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.productId}
                  to={`/products/${product.productId}`}
                  className="group relative border rounded-lg p-2 shadow-sm bg-white block hover:shadow-lg transition"
                >
                  <img
                    alt={product.productImageAlt}
                    src={product.productImage}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover hover:opacity-65"
                  />
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-700">{product.productName}</h3>
                    <p className="text-sm font-medium text-gray-900">
                      ${product.productPrice}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-blue-200"
                      onClick={(e) => { handleAddToCart(product, e); }}
                    >
                      加入購物車
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* 顯示提示訊息 */}
          {isAlertVisible && (
            <div className="fixed bottom-4 right-4 z-50 w-80 animate-slide-up">
              <Alert
                variant="success"
                title="成功"
                message={alertMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

