/* eslint-disable @typescript-eslint/no-explicit-any */

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: unknown) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredJwt = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt");
};

export const getCartStorageKey = (user = getStoredUser()) =>
  user?.email ? `cart:${String(user.email).toLowerCase()}` : "cart:guest";

export const isAdminUser = (user: any) => {
  if (!user) return false;
  return user.email === "albarreducation92@gmail.com" || user.username === "admin" || user.role?.type === "admin" || user.role?.name === "admin";
};

export const logoutUser = () => {
  if (typeof window === "undefined") return;
  const user = getStoredUser();
  localStorage.removeItem(getCartStorageKey(user));
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  localStorage.removeItem("admin_hint");
};
