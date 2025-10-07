import { useState,useEffect } from "react";
import { Link } from "react-router";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { LogoutIcon,UserCircleIcon,LoginIcon,ShoppingcartIcon } from "../../icons";
import CartDrawer from "../../components/cart/cartdrawer";
import { useCart } from "../../context/CartContext";
// import UserDropdown from "../../components/header/UserDropdown";
// 類別資料
const categories = [
  {
    name: "運動器材",
    subItems: ["重訓器材", "瑜珈用品"],
  },
  {
    name: "運動配件",
    subItems: ["水壺", "毛巾"],
  },
  {
    name: "服飾",
    subItems: ["上衣", "褲子", "外套"],
  },
  {
    name: "鞋款",
    subItems: ["跑鞋", "訓練鞋", "休閒鞋"],
  },
];

export default function NewHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // 假設有 token 就表示已登入 !!localStorage.getItem("token")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { calculateTotalItems } = useCart();
  
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // 監聽 localStorage 變化（例如登入頁 setItem）
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const totalItems = calculateTotalItems();

  const handleLogout=()=>{
    localStorage.removeItem("token");  // 清除 token
    setIsLoggedIn(false);              // 更新 Header 狀態
    window.location.href = "/";        // 可選：導回首頁
  }

  return (
    <header className="sticky top-0 bg-white z-50 shadow">
      {/* 公告橫幅 */}
      <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 p-2 sm:px-3.5 sm:before:flex-1">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        >
          <div
            style={{
              /* 使用裁剪方式创建元素的可显示区域 */
              clipPath:
                "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
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
                "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
            }}
            className="aspect-[577/310] w-[144.25px] h-64 bg-gradient-to-r from-[#1222a1] to-[#9089fc] opacity-30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm/6 text-gray-900">
            <strong className="font-semibold">
              MuscleCore 2025 新會員專屬禮遇
            </strong>
            <svg
              viewBox="0 0 2 2"
              aria-hidden="true"
              className="mx-2 inline size-0.5 fill-current"
            >
              <circle r={1} cx={1} cy={1} />
            </svg>
            首次註冊MuscleCore會員即贈送價值500元的電子優惠券！
          </p>
          <a
            href="/signup" //網址跳到註冊頁面
            className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            馬上註冊! <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="flex flex-1 justify-end">
          <button
            type="button"
            className="-m-3 p-3 focus-visible:-outline-offset-4"
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon aria-hidden="true" className="size-5 text-gray-900" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-0 flex justify-between items-center">
        {/* LOGO + TEXT */}
        <Link to="/" className="-m-1.5 p-1.5">
          <div className="flex items-center space-x-2">
            <img
              alt="logo"
              src="../../../images/logo/MuscleImgLogo.png" // 確保這個路徑正確
              className="h-20 w-auto"
            />
            <span className="text-lg font-bold text-gray-800">MuscleCore</span>
          </div>
        </Link>

        {/* 桌面版搜尋欄 */}

        {/* 桌面版選單 */}
        <nav className="hidden ml-6 lg:flex space-x-8 pr-10 text-sm">
          {categories.map((category) => (
            <div key={category.name} className="group relative pr-2">
              <Link
                to={`/products/category/${encodeURIComponent(category.name)}`}
                className="text-gray-800 font-medium hover:text-indigo-600"
              >
                {category.name}
              </Link>
              {/* 下拉子選單 */}
              {/*mt(margin-top)要是負的才不會選不到*/}
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg mt--1 rounded z-50 whitespace-nowrap ">
                {category.subItems.map((sub) => (
                  <Link
                    key={sub}
                    to={`/products/category/${encodeURIComponent(
                      category.name
                    )}?sub=${encodeURIComponent(sub)}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* 桌面板 */}
        <div className="flex items-center gap-3 text-white px-5 py-3">
          {isLoggedIn ? (
           <>
            <div className="flex items-center space-x-4">
              {/* 會員中心 */}
              <Link
              to="/member"
              className="flex items-center space-x-1 text-gray-800 font-medium hover:text-indigo-600"
              >
                <UserCircleIcon className="w-6 h-6 text-gray-600" />
                <span>會員中心</span>
              </Link>
              {/* 登出 */}
              <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-800 font-medium hover:text-red-600"
              >
                <LogoutIcon className="w-6 h-6 text-gray-600" />
                <span>登出</span>
              </button>
            </div>
          </>
            
          ) : (
            <Link
              to="/signin"
              className="flex items-center space-x-1 text-gray-800 font-medium hover:text-indigo-600"
              >
                <LoginIcon className="w-6 h-6 text-gray-600" />
                <span>登入</span>
            </Link>
          )}
          
          {/* <Link
            to="/signin"
            className="text-gray-800 font-medium hover:text-indigo-600 px-2"
          >
           
             <span aria-hidden="true">&rarr;</span>Log in
          </Link> */}

          {/* <UserDropdown /> */}

          {/* 購物車按鈕 */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            setIsCheckoutOpen={setIsCheckoutOpen}
          />
          {/* 漂亮的購物車按鈕 */}
          <button
            onClick={() => setIsCartOpen(true)}
            className=" relative mr-6 z-40 flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-full shadow-lg hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <ShoppingcartIcon className="w-6 h-6 text-gray-600"/>
            <span>購物車</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs shadow z-50">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* 漢堡選單按鈕 */}
        <div className="lg:hidden">
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
                  to={`/products/category/${encodeURIComponent(category.name)}`}
                  className="block text-gray-800 font-semibold py-1"
                  onClick={() => setMobileOpen(false)} // 點擊後關閉選單
                >
                  {category.name}
                </Link>
                <div className="pl-4 space-y-1">
                  {category.subItems.map((sub) => (
                    <Link
                      key={sub}
                      to={`/products/category/${encodeURIComponent(
                        category.name
                      )}?sub=${encodeURIComponent(sub)}`}
                      className="block text-sm text-gray-600"
                      onClick={() => setMobileOpen(false)} // 點擊後關閉選單
                    >
                      - {sub}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link to="/signin" className="block text-gray-800 font-medium mt-4">
              Log in →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
