import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useNavigate } from "react-router";

import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 可加入基本驗證邏輯
    if (!employeeNumber || !password) {
      alert("請填寫完整資訊！");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeNumber,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("登入失敗");
      }
      const data = await res.json();
      console.log(data);
      alert(`登入成功 ${employeeNumber} ${data.message.name}`);
      navigate("/admin"); //這邊要再改要跳轉的路徑  ok
    } catch (err) {
      console.error("登入錯誤", err);
      alert("登入失敗，請確認帳號密碼");
    }
    // 執行登入邏輯或 API 請求
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          返回登入頁面
        </Link>
      </div>
      <div className="w-full max-w-md  mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          返回首頁
        </Link>
      </div>

      {/* LOGO跳轉首頁 */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div
          className="bg-black shadow rounded-lg p-6 "
          style={{
            backgroundImage: "url('/images/logo/MuscleLogo.png')",
          }}
        >
          <Link to="/">
            <img
              src="../../../public/images/logo/MuscleWhiteLogo.png" // 確保這個路徑正確
              alt="logo"
              className="w-24 h-24 mx-auto"
            />
          </Link>
        </div>

        <br />
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              管理者身分登入
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              請輸入您的員工編號和密碼以登入後台系統！
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    員工編號 <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    value={employeeNumber}
                    onChange={(e) => setEmployeeNumber(e.target.value)}
                    placeholder="請輸入員工編號"
                  />
                </div>
                <div>
                  <Label>
                    密碼 <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="請輸入密碼"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"></div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    忘記密碼?
                  </Link>
                </div>
                <div>
                  <Button
                    className="w-full  bg-gray-800 hover:bg-gray-600"
                    size="sm"
                    type="submit"
                  >
                    {" "}
                    {/*加入 onClick={() => navigate("/admin")} 可直接跳轉  */}
                    登入
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
