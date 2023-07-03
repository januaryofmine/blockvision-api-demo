import axios from 'axios';
import { stringify } from 'query-string';

const authorizedRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE',
    'Cache-Control': 'no-cache',
    'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY,
  },

  paramsSerializer: {
    serialize: stringify,
  },
});

authorizedRequest.interceptors.request.use((config) => {
  const newConfig = { ...config };
  newConfig.headers['Authorization'] = '';

  return newConfig;
});

authorizedRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw error;
  }
);

export default authorizedRequest;
