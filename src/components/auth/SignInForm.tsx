import { useState,useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import { getToken, setToken,  isTokenExpired,decodeToken } from "../../utils/token"
import { useNavigate } from "react-router";
// import axios from "axios";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { jwtDecode } from "jwt-decode";


const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
    const user = decodeToken(token);
    console.log(user?.id, user?.email);
  } else {
    console.log('Token expired or missing');
  }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    console.log("formData",formData);

    try {
      const response = await fetch("http://localhost:3000/members/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),        
      });

      const data = await response.json();
      
      if (!response.ok){
      throw new Error(data.message || "登入失敗");
    }
      if (!data.token) {
      throw new Error("後端未回傳 token");
    } 
    
    setToken(data.token);

    const payload: any = jwtDecode(data.token);
    console.log("登入成功，Token 過期時間:", payload.exp);

    navigate("/member");     
     
    } catch (err: any) {
        alert(err.message || "登入失敗，請確認帳密");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          返回首頁
        </Link>
      </div>
    
        <button className="absolute right-4 top-4  flex justify-end px-4 z-40 flex items-center bg-gray-900 text-white py-2 rounded-full shadow-lg hover:bg-gray-100  hover:text-gray-900 transition ">
        <Link
          to="/admin/signin">
          管理者身分登入
        </Link>
      </button>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">會員登入</h2>
          <p className="mt-2 text-sm text-gray-600">歡迎回來，請登入您的帳號</p>
        </div>

            <div>
            </div>

             {/* 表單加 onSubmit */}
             <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                電子信箱
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="請輸入您的電子信箱"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密碼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="請輸入您的密碼"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                忘記密碼？
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  登入中...
                </div>
              ) : (
                "登入"
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                還沒有帳號嗎？{" "}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  立即註冊
                </Link>
              </p>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;