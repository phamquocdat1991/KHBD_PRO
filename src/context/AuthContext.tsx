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

const DEFAULT_TEACHER: TeacherProfile = {
  id: 'teacher-default',
  name: 'Thầy Nguyễn Nam',
  email: 'nguyennam@hanoi-amsterdam.edu.vn',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  schoolName: 'THPT Chuyên Hà Nội - Amsterdam',
  department: 'Tổ Toán - Tin học',
  province: 'Hà Nội',
  role: 'teacher',
  authProvider: 'google',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'khbd_current_user_v2';
const API_KEY_STORAGE = 'khbd_byok_api_key_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<TeacherProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_TEACHER;
    } catch {
      return DEFAULT_TEACHER;
    }
  });

  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [currentUser]);

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  };

  const loginWithGoogle = async () => {
    // Simulate real Google OAuth popup & user response
    await new Promise((resolve) => setTimeout(resolve, 600));
    const googleUser: TeacherProfile = {
      id: 'google-user-' + Date.now(),
      name: 'Thầy Trần Minh Hoàng',
      email: 'hoangtm.edu@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      schoolName: 'THPT Chu Văn An',
      department: 'Tổ Tự Nhiên',
      province: 'Hà Nội',
      role: 'teacher',
      authProvider: 'google',
    };
    setCurrentUser(googleUser);
    setIsLoginModalOpen(false);
  };

  const loginWithEmail = async (email: string, _pass: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const emailUser: TeacherProfile = {
      id: 'email-user-' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      schoolName: 'Trường THCS & THPT Thực Nghiệm',
      department: 'Tổ Chuyên Môn',
      province: 'Hà Nội',
      role: 'teacher',
      authProvider: 'email',
    };
    setCurrentUser(emailUser);
    setIsLoginModalOpen(false);
  };

  const loginAsGuestByok = (apiKey: string) => {
    if (apiKey) {
      setGeminiApiKey(apiKey);
    }
    const guestUser: TeacherProfile = {
      id: 'guest-' + Date.now(),
      name: 'Giáo viên Khách (BYOK)',
      email: 'guest@khbd-ai-pro.vn',
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
