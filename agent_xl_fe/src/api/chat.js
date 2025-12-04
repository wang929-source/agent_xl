import axios from "../util/axios";

export const createConversation = (data) => {
  return axios.post('/create_conversation', data);
};

export const chatQuery = (data) => {
  return fetch('/api/v1/chat_query_v2', { // axios不支持流式内容，所以此处只能用fetch
    method: 'POST',
    headers: {
      'accept': 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
};

export const getAppPreview = (data) => {
  return axios.post('/get_app_config_preview', data);
};