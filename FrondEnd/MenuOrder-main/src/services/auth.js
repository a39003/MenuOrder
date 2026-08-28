import { API_URL } from "../config";

const ACCESS_TOKEN_KEY = "accessToken";
const LEGACY_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "currentUser";

export const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

export const saveSession = (data) => {
  const accessToken = data?.accessToken || data?.jwt;
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(LEGACY_TOKEN_KEY, accessToken);
  }
  if (data?.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  if (data?.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

export const clearSession = () => {
  [ACCESS_TOKEN_KEY, LEGACY_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].forEach((key) =>
    localStorage.removeItem(key),
  );
};

const parseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

let refreshRequest = null;
export const refreshSession = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error("Phiên đăng nhập đã hết hạn");
  if (!refreshRequest) {
    refreshRequest = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        const data = await parseBody(response);
        if (!response.ok || !(data?.accessToken || data?.jwt)) {
          throw new Error(data?.message || "Phiên đăng nhập đã hết hạn");
        }
        saveSession(data);
        return data.accessToken || data.jwt;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
};

export const apiFetch = async (path, options = {}, retry = true) => {
  const headers = new Headers(options.headers || {});
  const accessToken = getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  const response = await fetch(path.startsWith("http") ? path : `${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (response.status === 401 && retry) {
    try {
      await refreshSession();
      return apiFetch(path, options, false);
    } catch (error) {
      clearSession();
      window.dispatchEvent(new CustomEvent("session-expired", { detail: error.message }));
      throw error;
    }
  }
  return response;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  try {
    if (refreshToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    clearSession();
  }
};

export const hasAnyRole = (roles = []) => {
  const role = getCurrentUser()?.role;
  return roles.length === 0 || roles.includes(role);
};
