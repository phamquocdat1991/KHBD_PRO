import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLesson } from '../../context/LessonContext';
import { Folder, History, PlusCircle, ChevronRight, ChevronLeft, BookOpen, Clock, Heart, Award } from 'lucide-react';

export const SidebarNav: React.FC = () => {
  const { currentUser, openProfileModal } = useAuth();
  const { library, activeLesson, setActiveLesson, setActiveView, selectedModel } = useLesson();
  const [collapsed, setCollapsed] = useState(false);

  // Group by subjects
  const subjectCounts = library.reduce<Record<string, number>>((acc, lesson) => {
    acc[lesson.subject] = (acc[lesson.subject] || 0) + 1;
    return acc;
  }, {});

  const handleNewPlan = () => {
    setActiveView('studio');
  };

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 no-print ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Teacher Profile Card */}
      {!collapsed ? (
        <div className="p-4 border-b border-slate-100">
          <div
            onClick={openProfileModal}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-400 cursor-pointer transition-all"
          >
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="Avatar"
              className="w-10 h-10 rounded-xl object-cover border border-sky-400"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-800 truncate">{currentUser?.name || 'Giáo viên'}</div>
              <div className="text-[11px] text-sky-700 truncate">{currentUser?.department || 'Tổ bộ môn'}</div>
            </div>
          </div>

          <button
            onClick={handleNewPlan}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all hover:scale-[1.01]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Soạn Bài Dạy Mới</span>
          </button>
        </div>
      ) : (
        <div className="p-3 flex flex-col items-center border-b border-slate-100">
          <button
            onClick={handleNewPlan}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all"
            title="Soạn bài mới"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Subject Folders */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {!collapsed && (
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              <span>Thư mục môn học</span>
              <Folder className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="space-y-1">
              {Object.entries(subjectCounts).map(([subj, count]) => (
                <div
                  key={subj}
                  onClick={() => setActiveView('library')}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-sky-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span className="truncate">{subj}</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-mono">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Lesson History */}
        <div>
          {!collapsed && (
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              <span>Lịch sử bài soạn</span>
              <History className="w-3.5 h-3.5 text-slate-400" />
            </div>
          )}
          <div className="space-y-1">
            {library.slice(0, 6).map((lesson) => {
              const isSelected = activeLesson?.id === lesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson);
                    setActiveView('studio');
                  }}
                  title={lesson.title}
                  className={`group flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50 border border-sky-300 text-sky-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate">{lesson.title}</span>}
                  </div>
                  {!collapsed && (
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {lesson.grade.replace('Lớp ', 'K')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Author & Creator Information Footnote */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px] text-slate-700 font-bold">{selectedModel}</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Online
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tác giả nền tảng</div>
              <div className="font-bold text-sky-800 flex items-center gap-1 mt-0.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Anh Giáo PHẠM QUỐC ĐẠT</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Phát triển bởi: Anh Giáo PHẠM QUỐC ĐẠT">
            <Award className="w-4 h-4 text-amber-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
