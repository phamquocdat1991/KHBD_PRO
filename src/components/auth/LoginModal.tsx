import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, Mail, Lock, Key, ShieldCheck, Award } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithGoogle, loginWithEmail, loginAsGuestByok, geminiApiKey } = useAuth();

  const [activeTab, setActiveTab] = useState<'account' | 'byok'>('byok');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customKey, setCustomKey] = useState(geminiApiKey);
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleByokSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsGuestByok(customKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl animate-slide-up">
        {/* Close Button */}
        <button
          aria-label="Đóng cấu hình đăng nhập"
          onClick={closeLoginModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md shadow-sky-500/25 mb-3">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            KHBD AI PRO <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold">2.0</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Không gian làm việc Trí tuệ Nhân tạo dành riêng cho Giáo viên Việt Nam
          </p>
          <div className="mt-2 text-[11px] font-semibold text-sky-800 bg-sky-50 py-1 px-3 rounded-full inline-flex items-center gap-1.5 border border-sky-200">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Phát triển bởi: Anh Giáo PHẠM QUỐC ĐẠT</span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'account'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Nhập Tài Khoản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('byok')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'byok'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chế độ BYOK (API Key)
          </button>
        </div>

        {activeTab === 'account' ? (
          <div className="p-4 bg-amber-50 rounded-xl text-sm text-amber-900">
            Đăng nhập Google/email chưa được kết nối dịch vụ xác thực. Hiện tại thầy/cô dùng chế độ BYOK và hồ sơ lưu trên trình duyệt này.
          </div>
        ) : (
          /* BYOK Mode */
          <form onSubmit={handleByokSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
              💡 <strong>Chế độ Khách (BYOK)</strong>: Thầy/Cô có thể dán API Key cá nhân từ Google AI Studio để sử dụng ngay mà không cần tạo tài khoản.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Google AI Studio API Key</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  aria-label="Gemini API Key"
                  required
                  autoComplete="off"
                  placeholder="AIzaSy... hoặc dán key tại đây"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
                />
              </div>
              <div className="flex justify-between items-center mt-1.5 text-[11px]">
                <a
                  href="https://aistudio.google.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 hover:underline font-medium"
                >
                  Lấy API Key tại AI Studio →
                </a>
                <span className="text-slate-400">Cần có để dùng AI</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all"
            >
              Tiếp Tục Với Key Này
            </button>
          </form>
        )}

        {/* Pedagogical Verified Badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Giáo viên kiểm tra nội dung AI trước khi sử dụng.</span>
        </div>
      </div>
    </div>
  );
};
