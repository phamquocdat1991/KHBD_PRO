import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LessonProvider, useLesson } from './context/LessonContext';
import { AppHeader } from './components/layout/AppHeader';
import { SidebarNav } from './components/layout/SidebarNav';
import { LessonLibraryView } from './components/dashboard/LessonLibraryView';
import { PedagogicalGuidelinesView } from './components/guidelines/PedagogicalGuidelinesView';
import { LessonConfigForm } from './components/studio/LessonConfigForm';
import { A4DocumentPreview } from './components/editor/A4DocumentPreview';
import { CopilotPanel } from './components/studio/CopilotPanel';
import { LoginModal } from './components/auth/LoginModal';
import { TeacherProfileModal } from './components/auth/TeacherProfileModal';
import { FileEdit, Eye, Award } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, activeLesson, studioTab, setStudioTab, generationError } = useLesson();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <AppHeader />

      {generationError && studioTab !== 'form' && <div role="alert" className="no-print bg-rose-50 p-3 text-rose-800 text-sm">{generationError}</div>}
      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left 3-Column Sidebar */}
        <SidebarNav />

        {/* Dynamic Center/Right Views */}
        {activeView === 'library' && <LessonLibraryView />}
        {activeView === 'guidelines' && <PedagogicalGuidelinesView />}
        <div style={{display: activeView === 'studio' ? undefined : 'none'}} className="flex-1 min-w-0 flex flex-col xl:flex-row overflow-hidden">
            {/* Center Column: Form or A4 Live Document Preview */}
            <div className="flex-1 min-w-0 flex flex-col overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
              {/* Studio Tab Switcher */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 no-print">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                    Chế độ làm việc:
                  </span>
                  <div className="flex rounded-xl bg-slate-200/80 p-1 border border-slate-300/60 shadow-xs">
                    <button
                      onClick={() => setStudioTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        studioTab === 'preview'
                          ? 'bg-white text-sky-800 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-sky-600" />
                      <span>Xem & Biên Tập Trang A4</span>
                    </button>
                    <button
                      onClick={() => setStudioTab('form')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        studioTab === 'form'
                          ? 'bg-white text-sky-800 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileEdit className="w-4 h-4 text-sky-600" />
                      <span>Soạn Bài Dạy Mới</span>
                    </button>
                  </div>
                </div>

                {activeLesson && (
                  <div className="text-xs text-slate-600 font-medium truncate max-w-xs sm:max-w-md hidden md:block">
                    Đang xem: <strong className="text-slate-900">{activeLesson.title}</strong> ({activeLesson.grade})
                  </div>
                )}
              </div>

              {/* Dynamic Center Content */}
              <div style={{display: studioTab === 'form' ? undefined : 'none'}} className="max-w-3xl mx-auto w-full no-print">
                <LessonConfigForm />
              </div>
              {studioTab === 'preview' && <div className="w-full"><A4DocumentPreview key={activeLesson?.id} /></div>}
            </div>

            {/* Right Column: AI Pedagogical Copilot & Live Mindmap */}
            <div className="w-full xl:w-[420px] 2xl:w-[460px] p-4 md:p-6 border-t xl:border-t-0 xl:border-l border-slate-200 shrink-0 overflow-y-auto no-print bg-slate-50/50">
              <CopilotPanel key={activeLesson?.id} />
            </div>
          </div>
      </div>

      {/* Modals */}
      <LoginModal />
      <TeacherProfileModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LessonProvider>
        <MainLayout />
      </LessonProvider>
    </AuthProvider>
  );
}

export default App;
