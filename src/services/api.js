// API Configuration
const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || '/api';

// Auth header helper — reads JWT from sessionStorage (where App.tsx stores it)
const getAuthHeaders = (includeContentType = true) => {
  const token = sessionStorage.getItem('notehub_token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (includeContentType) headers['Content-Type'] = 'application/json';
  return headers;
};

// Notes API
export const notesAPI = {
  getVerifiedNotes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      // Handle paginated response: { notes: [...], pagination: {...} }
      return Array.isArray(data) ? data : (data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  },

  getAllNotes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/all`);
      if (!response.ok) throw new Error('Failed to fetch all notes');
      const data = await response.json();
      // Handle paginated response
      return Array.isArray(data) ? data : (data.notes || []);
    } catch (error) {
      console.error('Error fetching all notes:', error);
      return [];
    }
  },

  getNoteById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch note');
      return await response.json();
    } catch (error) {
      console.error('Error fetching note:', error);
      throw error;
    }
  },

  getNotesBySubject: async (subject) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/subject/${subject}`);
      if (!response.ok) throw new Error('Failed to fetch notes by subject');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notes by subject:', error);
      throw error;
    }
  },

  uploadNote: async (formData) => {
    try {
      const token = sessionStorage.getItem('notehub_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      // Don't set Content-Type for FormData — browser sets it with boundary
      const response = await fetch(`${API_BASE_URL}/notes/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload note');
      return await response.json();
    } catch (error) {
      console.error('Error uploading note:', error);
      throw error;
    }
  },

  verifyNote: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/verify`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to verify note');
      return await response.json();
    } catch (error) {
      console.error('Error verifying note:', error);
      throw error;
    }
  },

  downloadNote: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/download`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to update download count');
      return await response.json();
    } catch (error) {
      console.error('Error updating download count:', error);
      throw error;
    }
  },

  likeNote: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/like`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to like note');
      return await response.json();
    } catch (error) {
      console.error('Error liking note:', error);
      throw error;
    }
  },

  rateNote: async (id, rating) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/rate`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating })
      });
      if (!response.ok) throw new Error('Failed to rate note');
      return await response.json();
    } catch (error) {
      console.error('Error rating note:', error);
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete note');
      return await response.json();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
};

// Users API
export const usersAPI = {
  getUserById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/email/${email}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (response.status === 409) throw new Error('Email already exists');
      if (!response.ok) throw new Error('Failed to create user');
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to update user profile');
      return await response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  updateUserPoints: async (id, points) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/points`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ points })
      });
      if (!response.ok) throw new Error('Failed to update user points');
      return await response.json();
    } catch (error) {
      console.error('Error updating user points:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Login failed');
      }
      const data = await response.json();
      // Store JWT for subsequent requests (matching App.tsx sessionStorage key)
      if (data.token) sessionStorage.setItem('notehub_token', data.token);
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  googleLogin: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (!response.ok) throw new Error('Google login failed');
      const data = await response.json();
      // Store JWT for subsequent requests (matching App.tsx sessionStorage key)
      if (data.token) sessionStorage.setItem('notehub_token', data.token);
      return data;
    } catch (error) {
      console.error('Error during Google login:', error);
      throw error;
    }
  },

  sendHeartbeat: async (userId, sessionToken) => {
    try {
      await fetch(`${API_BASE_URL}/users/heartbeat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, sessionToken }),
        keepalive: true
      });
    } catch (error) {
      // Silent fail for heartbeat
    }
  },

  setOffline: async (userId) => {
    try {
      await fetch(`${API_BASE_URL}/users/${userId}/offline`, {
        method: 'POST',
        headers: getAuthHeaders(),
        keepalive: true
      });
    } catch (error) {
      console.error('Failed to set offline status', error);
    }
  }
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  getUserRank: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user rank');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw error;
    }
  },

  updateLeaderboard: async (userId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/update/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      throw error;
    }
  }
};

// Messages API
export const messagesAPI = {
  getGroupMessages: async (groupName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/group/${groupName}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(messageData)
      });
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  getGroups: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/groups`);
      if (!response.ok) throw new Error('Failed to fetch groups');
      return await response.json();
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  }
};

// Career API
export const careerAPI = {
  chat: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/career/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get career advice');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching career advice:', error);
      throw error;
    }
  }
};
