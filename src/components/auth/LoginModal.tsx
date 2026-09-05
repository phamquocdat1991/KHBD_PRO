import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, Mail, Lock, Key, ShieldCheck, Award } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithGoogle, loginWithEmail, loginAsGuestByok, geminiApiKey } = useAuth();

  const [activeTab, setActiveTab] = useState<'account' | 'byok'>('account');
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
          <div>
            {/* Google 1-Click Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all border border-slate-300 shadow-xs hover:shadow-sm mb-5 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {loading ? 'Đang xử lý...' : 'Đăng nhập với Google'}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-semibold">Hoặc</span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email ngành giáo dục</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="thayco@...edu.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all mt-2"
              >
                {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
              </button>
            </form>
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
                  Lấy key miễn phí tại AI Studio →
                </a>
                <span className="text-slate-400">Không bắt buộc</span>
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
          <span>Bảo chứng chuẩn <strong>Công văn 5512</strong> & <strong>Thông tư 02/2025/TT-BGDĐT</strong></span>
        </div>
      </div>
    </div>
  );
};
