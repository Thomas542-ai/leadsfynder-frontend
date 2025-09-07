export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

export const storeToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  return !!token;
};