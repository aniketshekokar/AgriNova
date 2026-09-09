import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

async function request(path, options = {}) {
  const token = await AsyncStorage.getItem('agrinova-token');
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export const api = {
  get: path => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
};

export async function login(identifier, password, role = 'FARMER') {
  const result = await api.post('/auth/login', { phoneOrEmail: identifier, password, role });
  if (result?.data?.token) await AsyncStorage.setItem('agrinova-token', result.data.token);
  if (result?.data?.user) await AsyncStorage.setItem('agrinova-user', JSON.stringify(result.data.user));
  return result;
}

export async function logout() {
  await AsyncStorage.multiRemove(['agrinova-token', 'agrinova-user']);
}
