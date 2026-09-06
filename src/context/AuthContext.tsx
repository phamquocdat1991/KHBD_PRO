import React, { createContext, useContext, useState, useEffect } from 'react';
import { TeacherProfile } from '../types';

interface AuthContextType {
  currentUser: TeacherProfile | null;
  isAuthenticated: boolean;
  isGuestByok: boolean;
  geminiApiKey: string;
  isLoginModalOpen: boolean;
  isProfileModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginAsGuestByok: (apiKey: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<TeacherProfile>) => void;
  setGeminiApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'khbd_current_user_v2';
const API_KEY_STORAGE = 'khbd_byok_api_key_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<TeacherProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved) as TeacherProfile;
      // v2.0 shipped a hard-coded teacher as if it were an authenticated user.
      // Remove only that exact demo identity; keep profiles teachers created themselves.
      if (parsed.id === 'teacher-default') {
        localStorage.removeItem(AUTH_USER_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    try { return localStorage.getItem(API_KEY_STORAGE) || ''; } catch { return ''; }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    try { if (currentUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    } catch { /* Profile remains usable in memory if browser storage is unavailable. */ }
  }, [currentUser]);

  const setGeminiApiKey = (key: string) => {
    key = key.trim();
    setGeminiApiKeyState(key);
    try { if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    } } catch { /* The key remains in memory for this session. */ }
  };

  const loginWithGoogle = async () => {
    throw new Error('Đăng nhập Google chưa được kết nối dịch vụ xác thực. Hãy dùng chế độ BYOK.');
  };
  const loginWithEmail = async (_email: string, _pass: string) => {
    throw new Error('Đăng nhập email chưa được kết nối dịch vụ xác thực. Hãy dùng chế độ BYOK.');
  };

  const loginAsGuestByok = (apiKey: string) => {
    if (apiKey) {
      setGeminiApiKey(apiKey);
    }
    const guestUser: TeacherProfile = {
      id: 'guest-' + Date.now(),
      name: 'Giáo viên Khách (BYOK)',
      email: '',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      schoolName: 'Đơn vị giáo dục cá nhân',
      department: 'Giảng dạy tự do',
      province: 'Toàn quốc',
      role: 'teacher',
      authProvider: 'byok_guest',
    };
    setCurrentUser(guestUser);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setGeminiApiKey('');
  };

  const updateProfile = (updates: Partial<TeacherProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isGuestByok: currentUser?.authProvider === 'byok_guest',
        geminiApiKey,
        isLoginModalOpen,
        isProfileModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false),
        loginWithGoogle,
        loginWithEmail,
        loginAsGuestByok,
        logout,
        updateProfile,
        setGeminiApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
