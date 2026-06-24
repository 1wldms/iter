export const saveToken = (token) => localStorage.setItem('access_token', token);
export const getToken = () => localStorage.getItem('access_token');
export const removeToken = () => localStorage.removeItem('access_token');

export const authFetch = (url, options = {}) => {
  const token = getToken();

  return fetch(url, {
    ...options,
    headers: {
      ...(options.body ? {'Content-Type':'application/json'} : {}),
      ...(token ? {
        Authorization: `Bearer ${token}`
      } : {}),
      ...options.headers,
    },
  });
};