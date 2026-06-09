import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const ingestUrl = (url) => {
  const params = new URLSearchParams();
  params.append('url', url);
  return axios.post(`${BASE_URL}/ingest/url`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const ingestPdf = (file) => {
  const form = new FormData();
  form.append('file', file);
  return axios.post(`${BASE_URL}/ingest/pdf`, form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const sendMessage = (question) =>
  axios.post(`${BASE_URL}/chat`, { question });

export const checkIndexStatus = () =>
  axios.get(`${BASE_URL}/index-status`);
