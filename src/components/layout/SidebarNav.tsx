import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLesson } from '../../context/LessonContext';
import { Folder, PlusCircle, ChevronRight, ChevronLeft, BookOpen, Settings, Home, LayoutGrid, GraduationCap, LogOut, UserRound, MoreHorizontal } from 'lucide-react';

export const SidebarNav: React.FC = () => {
  const { currentUser, openProfileModal, openLoginModal, geminiApiKey, logout } = useAuth();
  const { library, activeView, activeLesson, setActiveLesson, setActiveView, startNewLesson, setStudioTab, setFilterSubject, setFilterGrade, setSearchQuery } = useLesson();
  const [collapsed, setCollapsed] = useState(false);
  const subjectCounts = library.reduce<Record<string, number>>((acc, lesson) => {
    acc[lesson.subject] = (acc[lesson.subject] || 0) + 1;
    return acc;
  }, { 'Toán': 0, 'Ngữ văn': 0, 'Khoa học tự nhiên': 0 });
  const profileAction = currentUser ? openProfileModal : openLoginModal;
  const recent = [...library].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 6);

  return (
    <aside className={`studio-sidebar no-print ${collapsed ? 'is-collapsed' : ''}`}>
      <nav className="icon-rail" aria-label="Lối tắt">
        <button title="Trang soạn bài" aria-label="Trang soạn bài" aria-current={activeView === 'studio' ? 'page' : undefined} onClick={() => setActiveView('studio')}><Home /></button>
        <button title="Mở thư viện" aria-label="Mở thư viện" aria-current={activeView === 'library' ? 'page' : undefined} onClick={() => setActiveView('library')}><LayoutGrid /></button>
        <button title="Hướng dẫn sư phạm" aria-label="Hướng dẫn sư phạm" aria-current={activeView === 'guidelines' ? 'page' : undefined} onClick={() => setActiveView('guidelines')}><GraduationCap /></button>
        <button title="Soạn bài mới" aria-label="Soạn bài mới" onClick={startNewLesson}><PlusCircle /></button>
        <button title="Cài đặt tài khoản và API" aria-label="Cài đặt tài khoản và API" onClick={profileAction}><Settings /></button>
        <div className="rail-spacer" />
        <button title={collapsed ? 'Mở thanh bên' : 'Thu gọn thanh bên'} aria-label={collapsed ? 'Mở thanh bên' : 'Thu gọn thanh bên'} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <ChevronRight /> : <ChevronLeft />}</button>
        {currentUser && <button title="Đăng xuất" aria-label="Đăng xuất" onClick={logout}><LogOut /></button>}
      </nav>
      {!collapsed && <div className="sidebar-content">
        <button onClick={profileAction} className="teacher-card">
          <MoreHorizontal className="profile-more" size={20} />
          <span className="teacher-avatar">{currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} alt="" /> : <UserRound size={44} strokeWidth={1.5} />}</span>
          <strong>{currentUser?.name || 'Thầy / Cô giáo'}</strong>
          <span>{currentUser?.department || 'Cùng tạo bài dạy đầy cảm hứng'}</span>
        </button>
        <button onClick={startNewLesson} className="new-plan"><PlusCircle size={17} /><span>+ Soạn Bài Dạy Mới</span></button>
        <section aria-labelledby="subjects-heading">
          <h2 id="subjects-heading">Môn học <Folder size={16} /></h2>
          <div className="subject-folders">{Object.entries(subjectCounts).map(([subject, count], index) => <button
            key={subject} className={`subject-folder tone-${index % 3}`}
            onClick={() => { setFilterSubject(subject); setFilterGrade('all'); setSearchQuery(''); setActiveView('library'); }}>
            <Folder size={28} strokeWidth={1.5} /><span>{subject === 'Khoa học tự nhiên' ? 'KHTN' : subject}</span><small>{count}</small>
          </button>)}</div>
        </section>
        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading">Bài soạn gần đây <MoreHorizontal size={18} /></h2>
          <div className="recent-lessons">{recent.map((lesson, index) => <button key={lesson.id}
            className={`recent-lesson tone-${index % 3} ${activeLesson?.id === lesson.id ? 'selected' : ''}`}
            onClick={() => { setActiveLesson(lesson); setStudioTab('preview'); setActiveView('studio'); }}>
            <span className="recent-icon"><BookOpen size={26} /></span>
            <span><strong>{lesson.title}</strong><small>{lesson.grade} · {new Date(lesson.updatedAt).toLocaleDateString('vi-VN')}</small></span>
          </button>)}{!recent.length && <p className="sidebar-empty">Chưa có bài soạn. Tạo bài đầu tiên để lưu tại đây.</p>}</div>
        </section>
        <footer className="sidebar-footer"><span>{geminiApiKey.trim() ? 'Đã cấu hình API Key' : 'Chưa cấu hình API Key'}</span><small>Phát triển bởi</small><strong>Anh Giáo PHẠM QUỐC ĐẠT</strong></footer>
      </div>}
    </aside>
  );
};
