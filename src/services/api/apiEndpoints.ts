import { API_BASE_URL } from '@env';

export const BASE_URL = API_BASE_URL;

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
  },
  profile: {
    get: '/profile',
    update: '/profile',
  },
  chat: {
    messages: '/chat/messages',
    conversations: '/chat/conversations',
  },
  notifications: {
    list: '/notifications',
    markRead: '/notifications/mark-read',
  },
};
