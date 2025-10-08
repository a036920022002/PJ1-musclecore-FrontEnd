import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useState} from "react";
import ComponentCard from "../../components/common/ComponentCard";
// import MultiSelect from "../../components/form/MultiSelect";


export default function FormElements() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) { // 提交表單
    e.preventDefault(); // 防止表單默認提交
    const Admindata = {employeeNumber,
      name,
      password,
      role,
    };

    console.log("新增的員工資料：", Admindata);
    try { // 提交表單
      const res = await fetch(`${API_URL}/admin/new`, { // 假設後端 API 路徑
        method: "POST", // 使用 POST 方法
        headers: {
          "Content-Type": "application/json", // 設定為 JSON 格式
        },
        body: JSON.stringify(Admindata), // 傳送表單數據
      });

      const result = await res.json(); // 解析 JSON 響應
      if (res.ok) { // 檢查是否成功
        alert("人員已新增！");
        setEmployeeNumber(""); // 清空表單
        setName(""); // 
        setPassword("");
        setRole("Employee");
      } else {
        alert("儲存失敗：" + result.message);
      }
    } catch (err) {
      console.error("傳送錯誤", err);
    }
  }

  const Role = [
    { value: "Employee", label: "一般員工"},
    { value: "Boss", label: "老闆"},
  ];

  return (
    <div>
      <PageMeta
        title="新增人員 | MuscleCore 管理後台"
        description="MuscleCore 新增與管理員的頁面"
      />
      <ComponentCard title="新增人員">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Label htmlFor="employeeNumber">員工編號</Label>
                <Input
                  id="employeeNumber"
                  name="employeeNumber"
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>密碼</Label>
                <Input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>    
              <div>
                <Label>人員類別</Label>
                <Select defaultValue="Employee"
                 options={Role}
                 placeholder="人員類別"
                 onChange={(selectedOption: any) => {
                  setRole(selectedOption.value); // 確保只存 value
                  }}
                />
              </div>
              <button
                  type="submit" // 提交按鈕
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  儲存新增
                </button> 
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
