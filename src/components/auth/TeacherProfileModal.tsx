import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, User, School, BookOpen, MapPin, Key, LogOut, Check, Award } from 'lucide-react';

export const TeacherProfileModal: React.FC = () => {
  const { currentUser, isProfileModalOpen, closeProfileModal, updateProfile, geminiApiKey, setGeminiApiKey, logout, openLoginModal } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [schoolName, setSchoolName] = useState(currentUser?.schoolName || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [province, setProvince] = useState(currentUser?.province || '');
  const [apiKey, setApiKey] = useState(geminiApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isProfileModalOpen) {
      setName(currentUser?.name || ''); setSchoolName(currentUser?.schoolName || '');
      setDepartment(currentUser?.department || ''); setProvince(currentUser?.province || '');
      setApiKey(geminiApiKey); setSavedSuccess(false);
    }
  }, [isProfileModalOpen, currentUser, geminiApiKey]);
  if (!isProfileModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      schoolName,
      department,
      province,
    });
    setGeminiApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeProfileModal();
    }, 800);
  };

  const handleLogout = () => {
    logout();
    closeProfileModal();
    openLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl animate-slide-up">
        {/* Close Button */}
        <button
          aria-label="Đóng hồ sơ giáo viên"
          onClick={closeProfileModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500 shadow-sm"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentUser?.name || 'Giáo viên'}</h2>
            <p className="text-xs text-sky-700 font-mono">{currentUser?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
              Hồ sơ trên trình duyệt này
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên Giáo viên</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-sm text-slate-900 focus:outline-none"
                  placeholder="Thầy/Cô Nguyễn Văn A"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tỉnh / Thành phố</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-sm text-slate-900 focus:outline-none"
                  placeholder="Hà Nội, TP.HCM..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị Trường công tác</label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-sm text-slate-900 focus:outline-none"
                  placeholder="THPT Chuyên..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tổ chuyên môn</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-sm text-slate-900 focus:outline-none"
                  placeholder="Tổ Toán - Tin..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cấu hình Gemini API Key riêng</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Dán Gemini API Key để dùng AI"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-sm text-slate-900 font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Author Badge */}
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Đơn vị phát triển:</span>
            <span className="font-bold text-sky-800 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              Anh Giáo PHẠM QUỐC ĐẠT
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất / Chuyển tài khoản
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Đã Lưu Thành Công
                </>
              ) : (
                'Lưu Thay Đổi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
