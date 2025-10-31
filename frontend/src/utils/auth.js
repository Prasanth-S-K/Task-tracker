export function getToken() {
  return localStorage.getItem("token");
}

export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.reload();
}
