import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, User } from 'lucide-react';

// 定義型別介面
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

const ShoppingCartSystem = () => {
  // 購物車狀態管理 - 移除 localStorage 相關程式碼
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<string>('');

  // 模擬商品資料
  const products: Product[] = [
    { id: 1, name: '經典白T恤', price: 590, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', category: '服飾' },
    { id: 2, name: '牛仔褲', price: 1280, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop', category: '服飾' },
    { id: 3, name: '運動鞋', price: 2350, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop', category: '鞋類' },
    { id: 4, name: '背包', price: 1650, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop', category: '配件' },
  ];

  // 結帳表單狀態
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'ecpay'
  });

  // 加入商品到購物車
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 } // 增加數量
            : item // 
        );
      }
      return [...prevItems, { ...product, quantity: 1 }]; // 新增商品到購物車
    });
  };

  // 更新商品數量
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 移除商品
  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 計算總價
  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // 計算總數量
  const calculateTotalItems = (): number => {
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
  const handleCheckout = () => {
    // 簡單驗證
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      alert('請填寫完整資訊');
      return;
    }

    setOrderStatus('processing');

    // 模擬 API 呼叫
    setTimeout(() => {
      const orderData = {
        items: cartItems,
        total: calculateTotal(),
        customerInfo: checkoutForm,
        timestamp: new Date().toISOString()
      };

      console.log('訂單資料:', orderData);
      
      // 模擬綠界回傳成功
      setOrderStatus('success');
      setCartItems([]); // 清空購物車
      
      // 實際專案中，這裡會重導向到綠界支付頁面
      alert('模擬綠界金流處理中...\n實際開發時會重導向到綠界支付頁面');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-gray-900">購物商城</div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {calculateTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {calculateTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 商品列表 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">NT$ {product.price.toLocaleString()}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 購物車側邊欄 */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="border-b p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">購物車</h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    購物車是空的
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-600 text-sm">NT$ {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">總計：</span>
                    <span className="font-bold text-lg">NT$ {calculateTotal().toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    前往結帳
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>NT$ {(item.price * item.quantity).toLocaleString()}</span>
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
                        <User className="w-4 h-4 mr-2" />
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
                        <CreditCard className="w-4 h-4 mr-2" />
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
      )}
    </div>
  );
};

export default ShoppingCartSystem;