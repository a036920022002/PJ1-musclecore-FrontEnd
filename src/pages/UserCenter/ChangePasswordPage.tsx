import React, { useState } from "react";
import axios from "axios";
import {isTokenExpired} from "../../utils/token";
import { useNavigate } from "react-router-dom";

interface Props {
  token: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const ChangePasswordForm: React.FC<Props> = ({ token, onSuccess, onError }) => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.currentPassword) newErrors.currentPassword = "請輸入目前密碼";
    if (!form.newPassword || form.newPassword.length < 6)
      newErrors.newPassword = "新密碼至少6位數";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // 即時驗證欄位
    setErrors((prev) => {
      const copy = { ...prev };
      if (name === "currentPassword") {
        if (!value) copy.currentPassword = "請輸入目前密碼";
        else delete copy.currentPassword;
      }
      if (name === "newPassword") {
        if (!value || value.length < 6) copy.newPassword = "新密碼至少6位數";
        else delete copy.newPassword;
      }
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isTokenExpired(token) ) {
          onError('請先登入');
          setTimeout(() => {
          navigate("/signin"); 
        }, 1000);
        return;
        }
    
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.put("http://localhost:5000/api/user/change-password", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ currentPassword: "", newPassword: "" });
      onSuccess();
    } catch (err: any) {
      onError(err.response?.data?.message || "密碼變更失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-8 border p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">變更密碼</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>目前密碼</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              errors.currentPassword ? "border-red-500" : ""
            }`}
            required
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">{errors.currentPassword}</p>
          )}
        </div>
        <div>
          <label>新密碼</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.newPassword ? "border-red-500" : ""}`}
            required
            minLength={6}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "變更中..." : "變更密碼"}
        </button>
      </form>
    </section>
  );
};

export default ChangePasswordForm;
