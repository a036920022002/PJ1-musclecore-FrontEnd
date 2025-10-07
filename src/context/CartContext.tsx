import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {getToken} from "../utils/token"

//設定購物車商品類型
//CartItem 定義了購物車中每個商品的結構，包括 id、名稱、價格、圖片、數量和可選的類別
interface CartItem {
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
  createdAt: string; 
  quantity: number; // 商品數量
}
//設定購物車上下文類型
//包含購物車商品、添加商品、更新數量、移除商品、計算總金額和總商品數量的方法
//CartContextType 定義了購物車上下文的結構和方法
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void; // ✅ quantity 可選
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  calculateTotal: () => number;
  calculateTotalItems: () => number;

  isCartOpen: boolean; // 是否顯示購物車抽屜
  setIsCartOpen: (isOpen: boolean) => void; // 設置
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (isOpen: boolean) => void;
}

//建立購物車上下文
//使用 createContext 創建一個新的上下文，初始值為 undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);// 初始購物車商品列表
  const [checkoutForm, setCheckoutForm] = useState({ // 初始結帳表單
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'ecpay'
  });
  // 抽屜狀態
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false); // 是否顯示購物車抽屜
  // 訂單狀態
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);// 是否顯示結帳頁面
  // 訂單處理狀態
  const [orderStatus, setOrderStatus] = useState<string>('');// 處理中、成功或失敗
  // 結帳表單狀態


  // 載入 localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('載入購物車資料失敗:', error);
      }
    }
  }, []);

  // 儲存 localStorage
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);


  // 新增商品到購物車
  // 如果商品已存在，則增加數量
 const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => { //omit 用來排除 quantity 屬性
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.productId);
      if (existingItem) {
        return prevItems.map(item => 
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity } // 增加數量
            : item // 
        );
      }
      return [...prevItems, { ...product, quantity }]; // 新增商品到購物車
    });
  };

  // 更新購物車商品數量
  // 如果數量小於等於0，則移除該商品
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id); // 如果數量小於等於0，則移除該商品
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.productId === id ? { ...item, quantity } : item)) // 更新數量
    );
  };

  // 移除購物車商品
  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.productId !== id));
  };

  // 計算總金額
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  };

  // 計算總商品數量
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }; 

 // 處理結帳表單輸入
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value
    });
  };

  // 處理結帳
  const handleCheckout = async () => {
    // 簡單驗證
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      alert('請填寫完整資訊');
      return;
    }

    setOrderStatus('processing');

    
    const orderData = {
    items: cartItems,
    total: calculateTotal(),
    customerInfo: checkoutForm,
    timestamp: new Date().toISOString(),
  };
    
   try {
    const token = getToken(); // 嘗試拿 token（可能是 null）
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // 如果有 token 就加上
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error(`送出訂單失敗：${response.status}`);

    const data = await response.json();
    console.log('後端回傳:', data);

    setOrderStatus('success');
    setCartItems([]); // 清空購物車
  } catch (error) {
    console.error(error);
    setOrderStatus('failed');
    alert('訂單送出失敗');
  }
      // 模擬綠界回傳成功
      // setOrderStatus('success');
      // setCartItems([]); // 清空購物車
      
      // 實際專案中，這裡會重導向到綠界支付頁面
    //   alert('模擬綠界金流處理中...\n實際開發時會重導向到綠界支付頁面');
    // }, 2000);
  };


  return (
    <CartContext.Provider /* 提供購物車上下文給子組件 */
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        calculateTotal,
        calculateTotalItems,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}

      {/* 這裡可以添加購物車抽屜和結帳頁面的組件 */}
      {/* 例如：<CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
      {/* 例如：<CheckoutPage isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} /> */}

 {/* 結帳頁面 */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">結帳</h2>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {orderStatus === 'processing' ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>處理中...</p>
                  </div>
                ) : orderStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">訂單完成！</h3>
                    <p className="text-gray-600">感謝您的購買，我們會盡快處理您的訂單。</p>
                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        setOrderStatus('');
                      }}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      繼續購物
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 訂單摘要 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">訂單摘要</h3>
                      <div className="space-y-2">
                        {cartItems.map(item => (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span>{item.productName} × {item.quantity}</span>
                            <span>NT$ {(item.productPrice * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>總計</span>
                          <span>NT$ {calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* 顧客資訊 */}
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        {/*  可以用useUser context */}
                        顧客資訊
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="姓名"
                          value={checkoutForm.name}
                          onChange={handleFormChange}
                          required
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="電子信箱"
                          value={checkoutForm.email}
                          onChange={handleFormChange}
                          required
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="手機號碼"
                          value={checkoutForm.phone}
                          onChange={handleFormChange}
                          required
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          name="address"
                          placeholder="送貨地址"
                          value={checkoutForm.address}
                          onChange={handleFormChange}
                          required
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* 付款方式 */}
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        {/* <CreditCard className="w-4 h-4 mr-2" /> */}
                        付款方式
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="ecpay"
                            checked={checkoutForm.paymentMethod === 'ecpay'}
                            onChange={handleFormChange}
                            className="mr-2"
                          />
                          綠界科技 (信用卡/ATM/超商)
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={checkoutForm.paymentMethod === 'cash'}
                            onChange={handleFormChange}
                            className="mr-2"
                          />
                          貨到付款
                        </label>
                      </div>
                    </div>

{/* POST送資料到後端 */}
                    <button  
                    
                      type="button"
                      onClick={handleCheckout}
                      className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
                    >
                      確認訂購 NT$ {calculateTotal().toLocaleString()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


               ) }</CartContext.Provider>

  );
}

// 匯出 useCart Hook
//這個 Hook 讓我們可以在任何子組件中使用購物車上下文
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart 必須在 CartProvider 內使用');
  return context;
};
