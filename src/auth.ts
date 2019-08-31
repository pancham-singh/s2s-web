export const loginLocal = (token) => {
  localStorage.setItem('token', token);
};

export const logoutLocal = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};
