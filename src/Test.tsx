import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, ShoppingCart, User, Heart, Star, Plus, Minus, Trash2, Package, Filter, Grid, List } from 'lucide-react';

// Context for global state management
const AppContext = createContext();

// 假資料
const mockProducts = [
  {
    id: 1,
    name: "無線藍牙耳機",
    price: 2990,
    originalPrice: 3990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    category: "電子產品",
    stock: 15,
    rating: 4.5,
    description: "高音質無線藍牙耳機，支援主動降噪功能，續航力長達30小時。"
  },
  {
    id: 2,
    name: "智能手錶",
    price: 8990,
    originalPrice: 10990,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop",
    category: "電子產品",
    stock: 8,
    rating: 4.3,
    description: "多功能智能手錶，支援健康監測、運動追蹤等功能。"
  },
  {
    id: 3,
    name: "咖啡豆禮盒",
    price: 1200,
    originalPrice: 1500,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    category: "食品",
    stock: 25,
    rating: 4.8,
    description: "精選單品咖啡豆，來自哥倫比亞高海拔產區。"
  },
  {
    id: 4,
    name: "運動背包",
    price: 1890,
    originalPrice: 2390,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "服飾配件",
    stock: 12,
    rating: 4.2,
    description: "防潑水運動背包，大容量設計，適合戶外活動。"
  }
];

// 假使用者資料
const mockUser = {
  id: 1,
  name: "張小明",
  email: "user@example.com",
  phone: "0912345678",
  address: "台北市信義區信義路五段7號"
};

// 假訂單資料
const mockOrders = [
  {
    id: "ORD001",
    date: "2024-08-01",
    status: "已出貨",
    total: 5980,
    items: [
      { name: "無線藍牙耳機", quantity: 2, price: 2990 }
    ]
  },
  {
    id: "ORD002",
    date: "2024-07-28",
    status: "已完成",
    total: 1200,
    items: [
      { name: "咖啡豆禮盒", quantity: 1, price: 1200 }
    ]
  }
];

// App Provider Component
const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const login = (email, password) => {
    // Mock login - in real app, call your Express API
    setUser(mockUser);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const value = {
    currentPage, setCurrentPage,
    cart, addToCart, removeFromCart, updateCartQuantity,
    user, isLoggedIn, login, logout,
    favorites, toggleFavorite,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedProduct, setSelectedProduct
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Header Component
const Header = () => {
  const { 
    currentPage, setCurrentPage, 
    cart, isLoggedIn, logout, 
    searchQuery, setSearchQuery 
  } = useContext(AppContext);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            ElectroShop
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜尋商品..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage('profile')}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                </button>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  登出
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                登入
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { addToCart, favorites, toggleFavorite, setCurrentPage, setSelectedProduct } = useContext(AppContext);
  
  const isFavorite = favorites.includes(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleProductClick = () => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={handleProductClick}
        />
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
          } hover:scale-110 transition-transform`}
        >
          <Heart className="w-4 h-4" />
        </button>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            -{discount}%
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 
          className="font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-red-600">NT$ {product.price.toLocaleString()}</span>
            {product.price < product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                NT$ {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">庫存: {product.stock}</span>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.stock === 0 ? '已售完' : '加入購物車'}</span>
        </button>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  const { searchQuery, selectedCategory, setSelectedCategory } = useContext(AppContext);
  
  const categories = ['all', '電子產品', '服飾配件', '食品'];
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">商品分類</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? '全部商品' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">找不到符合條件的商品</h3>
          <p className="text-gray-500">試試調整搜尋條件或瀏覽其他分類</p>
        </div>
      )}
    </div>
  );
};

// Product Detail Page Component
const ProductDetailPage = () => {
  const { selectedProduct, addToCart, favorites, toggleFavorite, setCurrentPage } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) {
    setCurrentPage('home');
    return null;
  }

  const isFavorite = favorites.includes(selectedProduct.id);
  const discount = Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setQuantity(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => setCurrentPage('home')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center space-x-2"
      >
        <span>← 返回商品列表</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img 
            src={selectedProduct.image} 
            alt={selectedProduct.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h1>
            <button
              onClick={() => toggleFavorite(selectedProduct.id)}
              className={`p-2 rounded-full ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              } hover:scale-110 transition-transform`}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-gray-600 ml-2">({selectedProduct.rating})</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-3xl font-bold text-red-600">
                NT$ {selectedProduct.price.toLocaleString()}
              </span>
              {selectedProduct.price < selectedProduct.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  NT$ {selectedProduct.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-gray-600">庫存: {selectedProduct.stock} 件</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">商品描述</h3>
            <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">數量</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={quantity >= selectedProduct.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-lg font-medium"
            disabled={selectedProduct.stock === 0}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{selectedProduct.stock === 0 ? '已售完' : '加入購物車'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Cart Page Component
const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, setCurrentPage } = useContext(AppContext);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">購物車</h1>
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">購物車是空的</h3>
          <p className="text-gray-500 mb-6">快去挑選你喜歡的商品吧！</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            繼續購物
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">購物車</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">NT$ {item.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 border border-gray-300 rounded min-w-[50px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      NT$ {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">訂單摘要</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">小計</span>
                <span>NT$ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">運費</span>
                <span>{shipping === 0 ? '免費' : `NT$ ${shipping}`}</span>
              </div>
              {shipping === 0 && subtotal < 1000 && (
                <p className="text-sm text-green-600">滿 NT$ 1,000 免運費</p>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>總計</span>
                <span className="text-red-600">NT$ {total.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              前往結帳
            </button>
            
            <button
              onClick={() => setCurrentPage('home')}
              className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              繼續購物
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Page Component
const LoginPage = () => {
  const { login, setCurrentPage } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      // Mock registration
      login(email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isRegister ? '註冊會員' : '會員登入'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電子郵件
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                確認密碼
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isRegister ? '註冊' : '登入'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isRegister ? '已有帳號？立即登入' : '沒有帳號？立即註冊'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-gray-600 hover:text-gray-800"
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Page Component
const ProfilePage = () => {
  const { user, setCurrentPage } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    setCurrentPage('login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">會員中心</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-medium text-gray-800">{user.name}</h3>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                個人資料
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                訂單查詢
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'favorites' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                收藏商品
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'profile' && <ProfileTab user={user} />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'favorites' && <FavoritesTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address
  });

  const handleSave = () => {
    // In real app, call API to update user data
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">個人資料</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? '取消' : '編輯'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{user.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{user.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">電話</label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{user.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">地址</label>
          {isEditing ? (
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          ) : (
            <p className="text-gray-800">{user.address}</p>
          )}
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            保存修改
          </button>
        )}
      </div>
    </div>
  );
};

// Orders Tab Component
const OrdersTab = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case '已完成': return 'text-green-600 bg-green-100';
      case '已出貨': return 'text-blue-600 bg-blue-100';
      case '處理中': return 'text-yellow-600 bg-yellow-100';
      case '已取消': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">訂單查詢</h2>
      
      <div className="space-y-4">
        {mockOrders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-800">訂單編號: {order.id}</h3>
                <p className="text-sm text-gray-600">訂單日期: {order.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>NT$ {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-medium">總金額: NT$ {order.total.toLocaleString()}</span>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                查看詳情
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Favorites Tab Component
const FavoritesTab = () => {
  const { favorites } = useContext(AppContext);
  
  const favoriteProducts = mockProducts.filter(product => 
    favorites.includes(product.id)
  );

  if (favoriteProducts.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">收藏商品</h2>
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">還沒有收藏的商品</h3>
          <p className="text-gray-500">快去挑選你喜歡的商品加入收藏吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">收藏商品</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <AppContent />
        </main>
      </div>
    </AppProvider>
  );
};

// App Content Component
const AppContent = () => {
  const { currentPage } = useContext(AppContext);

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'product-detail':
      return <ProductDetailPage />;
    case 'cart':
      return <CartPage />;
    case 'login':
      return <LoginPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return <HomePage />;
  }
};

export default App;