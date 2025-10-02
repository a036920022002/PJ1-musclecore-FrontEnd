import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  id: string;
  email: string;
  exp: number;
  iat: number;
}

export const getToken = () => {
  return localStorage.getItem('token');
};
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};


// 判斷是否過期
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<TokenPayload>(token);;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch (err) {
    console.error("Token decode error:", err);
    return true;
  }
};
// 解析 token 取得 payload
export const decodeToken = (token: string | null): TokenPayload | null => {
  if (!token) return null;
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (err) {
    console.error('Invalid token', err);
    return null;
  }
};