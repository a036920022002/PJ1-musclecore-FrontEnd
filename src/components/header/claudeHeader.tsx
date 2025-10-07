'use client'

import { useState } from 'react'
import { Link } from 'react-router'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react'

// 類別資料
const categories = [
  {
    name: '運動器材',
    subItems: ['重訓器材', '瑜珈用品' ],
  },
  {
    name: '運動配件',
    subItems: ['水壺', '毛巾' ],
  },
  {
    name: '服飾',
    subItems: ['上衣', '褲子', '外套'],
  },
  {
    name: '鞋款',
    subItems: ['跑鞋', '訓練鞋', '休閒鞋'],
  },
]

interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  quantity: number;
}

interface UseCartReturn {
  cartItems: CartItem[]
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  showSuccess: boolean
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (id: number, delta: number) => void
  removeItem: (id: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}
// 購物車 Hook
const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

   const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      )
    } else {
      const newItem: CartItem = { ...product, quantity }
      setCartItems(prev => [...prev, newItem])
    }
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
    showSuccess,
    addToCart,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice
  };
};

// 購物車按鈕組件
interface CartButtonProps {
  totalItems: number
  onClick: () => void
}

const CartButton: React.FC<CartButtonProps> = ({ totalItems, onClick }) => (
  <button
    onClick={onClick}
    className="relative bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
  >
    <ShoppingCart className="w-5 h-5" />
    <span className="hidden sm:inline">購物車</span>
    {totalItems > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
        {totalItems}
      </span>
    )}
  </button>
)

// 購物車抽屜組件
interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (id: number, delta: number) => void
  onRemoveItem: (id: number) => void
  totalPrice: number
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* 背景遮罩 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      )}

      {/* 側邊抽屜 */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* 抽屜 Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6" />
            <span>購物車 ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 抽屜內容 */}
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>購物車是空的</p>
                <p className="text-sm mt-2">快去選購喜歡的商品吧！</p>
              </div>
            </div>
          ) : (
            <>
              {/* 商品清單 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex space-x-3">
                      <img 
                        src={item.image || 'https://via.placeholder.com/64'} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.category}</p>
                        <p className="text-indigo-600 font-bold">NT$ {item.price.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* 數量控制 */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-800">
                        NT$ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 底部結帳區 */}
              <div className="border-t p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">總計:</span>
                  <span className="text-xl font-bold text-indigo-600">
                    NT$ {totalPrice.toLocaleString()}
                  </span>
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors">
                  前往結帳
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
interface SuccessNotificationProps {
  show: boolean;
  message?: string;
}
// 成功通知組件
const SuccessNotification: React.FC<SuccessNotificationProps> = ({ show, message = "成功加入購物車！" })  => {
  if (!show) return null;

  return (
    <div className="fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in">
      <Check className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};

export default function NewHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
    showSuccess,
    addToCart,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice
  } = useCart();

  // 測試用：模擬加入商品到購物車
  const handleTestAddToCart = () => {
    const testProduct = {
      id: Date.now(), // 簡單的 ID 生成
      name: "經典運動 T-shirt",
      price: 890,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      category: "服飾"
    };
    addToCart(testProduct, 1);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          {/* LOGO + TEXT */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="-m-1.5 p-1.5">
              <img
                alt="logo"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </Link>
            <span className="text-lg font-bold text-gray-800">MuscleCore</span>
          </div>

          {/* 桌面版選單 */}
          <nav className="hidden lg:flex space-x-8 pr-10">
            {categories.map((category) => (
              <div key={category.name} className="group relative pr-2">
                <Link
                  to={`/products/${encodeURIComponent(category.name)}`}
                  className="text-gray-800 font-medium hover:text-indigo-600"
                >
                  {category.name}
                </Link>
                {/* 下拉子選單 */}
                <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg mt--1 rounded z-50 whitespace-nowrap ">
                  {category.subItems.map((sub) => (
                    <Link
                      key={sub}
                      to={`/products/${encodeURIComponent(category.name)}/${encodeURIComponent(sub)}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* 右側按鈕區 */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* 測試按鈕 - 你可以移除這個 */}
            <button 
              onClick={handleTestAddToCart}
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              測試加入商品
            </button>
            
            {/* 購物車按鈕 */}
            <CartButton 
              totalItems={getTotalItems()}
              onClick={() => setIsDrawerOpen(true)}
            />
            
            <Link to="/signin" className="text-gray-800 font-medium hover:text-indigo-600">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* 漢堡選單按鈕 */}
          <div className="lg:hidden flex items-center space-x-2">
            <CartButton 
              totalItems={getTotalItems()}
              onClick={() => setIsDrawerOpen(true)}
            />
            <button onClick={() => setMobileOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* 手機版選單 */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-lg font-bold text-gray-800">MuscleCore</span>
              <button onClick={() => setMobileOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            <nav className="space-y-2 px-4 pb-4">
              {categories.map((category) => (
                <div key={category.name}>
                  <Link
                    to={`/products/${encodeURIComponent(category.name)}`}
                    className="block text-gray-800 font-semibold py-1"
                  >
                    {category.name}
                  </Link>
                  <div className="pl-4 space-y-1">
                    {category.subItems.map((sub) => (
                      <Link
                        key={sub}
                        to={`/products/${encodeURIComponent(category.name)}/${encodeURIComponent(sub)}`}
                        className="block text-sm text-gray-600"
                      >
                        - {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                onClick={handleTestAddToCart}
                className="block w-full text-left bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded mt-2"
              >
                測試加入商品
              </button>
              <Link to="/signin" className="block text-gray-800 font-medium mt-4">
                Log in →
              </Link>
            </nav>
          </div>
        )}

        {/* 公告橫幅 */}
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
              }}
              className="aspect-[577/310] w-[144.25px] h-64 bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
              }}
              className="aspect-[577/310] w-[144.25px] h-64 bg-gradient-to-r from-[#1222a1] to-[#9089fc] opacity-30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm/6 text-gray-900">
              <strong className="font-semibold">MuscleCore 2025 新會員專屬禮遇</strong>
              <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              首次註冊MuscleCore會員即贈送價值500元的電子優惠券，並享有全館95折優惠！
            </p>
            <a
              href="#"
              className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              馬上註冊! <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <div className="flex flex-1 justify-end">
            <button type="button" className="-m-3 p-3 focus-visible:-outline-offset-4">
              <span className="sr-only">Dismiss</span>
              <XMarkIcon aria-hidden="true" className="size-5 text-gray-900" />
            </button>
          </div>
        </div>
      </header>

      {/* 購物車抽屜 */}
      <CartDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        totalPrice={getTotalPrice()}
      />

      {/* 成功通知 */}
      <SuccessNotification show={showSuccess} />

      <style>{`
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`}</style>
    </>
  )
}