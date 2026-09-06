import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLesson } from '../../context/LessonContext';
import { Sparkles, Library, FileText, Bot, User, LogIn, ChevronDown, Heart } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { currentUser, isAuthenticated, openLoginModal, openProfileModal } = useAuth();
  const { activeView, setActiveView, library, selectedModel, setSelectedModel } = useLesson();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl no-print shadow-xs">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 min-h-16 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('studio')}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                KHBD AI PRO
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                v2.0.3
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span>Trợ lý Sư phạm 5512</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded text-[10.5px]">
                Phát triển bởi: Anh Giáo PHẠM QUỐC ĐẠT
              </span>
            </div>
          </div>
        </div>

        {/* Center View Switcher */}
        <nav className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200/60 shadow-inner">
          <button
            onClick={() => setActiveView('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'studio'
                ? 'bg-white text-sky-700 shadow-sm font-bold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Studio Soạn Bài</span>
          </button>

          <button
            onClick={() => setActiveView('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'library'
                ? 'bg-white text-sky-700 shadow-sm font-bold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Thư Viện Bài Dạy</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-700 font-bold">
              {library.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('guidelines')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'guidelines'
                ? 'bg-white text-sky-700 shadow-sm font-bold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Chuẩn Sư Phạm</span>
          </button>
        </nav>

        {/* Right: Model Selector & Teacher Profile */}
        <div className="flex items-center gap-3">
          {/* AI Model Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <Bot className="w-4 h-4 text-sky-600 animate-pulse-subtle" />
            <select
              aria-label="Mô hình Gemini"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-transparent text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.8-flash" className="bg-white text-slate-800">Gemini 3.8 Flash (Khuyên dùng)</option>
              <option value="gemini-3.6-flash" className="bg-white text-slate-800">Gemini 3.6 Flash (Tiết kiệm)</option>
              <option value="gemini-2.5-flash" className="bg-white text-slate-800">Gemini 2.5 Flash (Tốc độ)</option>
            </select>
          </div>

          {/* Teacher Auth / Profile Button */}
          {isAuthenticated && currentUser ? (
            <button
              onClick={openProfileModal}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-sky-400"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{currentUser.schoolName}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
