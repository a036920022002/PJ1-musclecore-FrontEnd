import React from "react";
import { Package, FileText, Users, Sun, SmilePlus} from "lucide-react";
import { useNavigate } from "react-router";

interface AdminWelcomeProps {
  adminName?: string;
}

const AdminWelcome: React.FC<AdminWelcomeProps> = ({ adminName = "管理員" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[600px] bg-gray-700 text-white rounded-xl shadow-lg flex flex-col items-center justify-center p-8">
      <div className="text-center text-white mb-4">
        <div className="mb-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 inline-flex mb-2">
            <Sun className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-3xl font-bold mb-4">WELCOME!!!</h1>
        <h2 className="text-xl md:text-1xl font-light mb-6 text-blue-100">
          歡迎回來 {adminName}
        </h2>
        <p className="text-lg text-blue-100 opacity-90">
          準備好管理您的電商平台了嗎？
        </p>
      </div>

      {/* 導航按鈕區域 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* 商品總覽 */}
        <button
          onClick={() => navigate("/ProductTables")}
          className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-500/20 rounded-full p-4 mb-4 group-hover:bg-blue-500/30 transition-colors">
              <Package className="h-8 w-8 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">商品總覽</h3>
            <p className="text-sm text-blue-100 opacity-80">
              管理商品庫存、價格與描述
            </p>
          </div>
        </button>

        {/* 訂單總覽 */}
        <button
          onClick={() => navigate("/OrderTable")}
          className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-500/20 rounded-full p-4 mb-4 group-hover:bg-green-500/30 transition-colors">
              <FileText className="h-8 w-8 text-green-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">訂單總覽</h3>
            <p className="text-sm text-blue-100 opacity-80">
              處理訂單狀態與客戶需求
            </p>
          </div>
        </button>

        {/* 會員總覽 */}
        <button
          onClick={() => navigate("/MemberTable")}
          className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-500/20 rounded-full p-4 mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Users className="h-8 w-8 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">會員總覽</h3>
            <p className="text-sm text-blue-100 opacity-80">
              查看會員資料與購買記錄
            </p>
          </div>
        </button>
         {/* 會員總覽 */}
        <button
          onClick={() => navigate("/admin/table")}
          className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-500/20 rounded-full p-4 mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Users className="h-8 w-8 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">管理者資訊</h3>
            <p className="text-sm text-blue-100 opacity-80">
              查看管理者資料與權限設定
            </p>
          </div>
           </button>

        <button
          onClick={() => navigate("/admin/table/new")}
          className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-500/20 rounded-full p-4 mb-4 group-hover:bg-orange-500/30 transition-colors">
              <SmilePlus className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">新增管理者</h3>
            <p className="text-sm text-blue-100 opacity-80">
              管理者資料與身分設定
            </p>
          </div>
        </button>

      </div>
    </div>
  );
};

export default AdminWelcome;
