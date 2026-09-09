import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';
import { useAuth } from '../../context/AuthContext';
import { DocxExportService } from '../../services/docxExportService';
import { Search, Plus, Eye, Download, Share2, Trash2, BookOpen, Clock, CheckCircle2, Award } from 'lucide-react';
import { LessonPlan } from '../../types';

export const LessonLibraryView: React.FC = () => {
  const { currentUser } = useAuth();
  const [exportError, setExportError] = useState('');
  const {
    library,
    startNewLesson,
    setStudioTab,
    setActiveLesson,
    setActiveView,
    deleteLessonPlan,
    searchQuery,
    setSearchQuery,
    filterGrade,
    setFilterGrade,
    filterSubject,
    setFilterSubject,
  } = useLesson();

  const grades = ['all', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'THCS', 'Tiểu học'];
  const subjects = ['all', 'Toán', 'Ngữ văn', 'Khoa học tự nhiên', 'Vật lí', 'Hóa học', 'Lịch sử', 'Tin học'];

  const filteredLessons = library.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.textbook.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.coreContent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      filterGrade === 'all'
        ? true
        : filterGrade === 'THCS'
        ? ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'].includes(lesson.grade)
        : filterGrade === 'Tiểu học'
        ? ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'].includes(lesson.grade)
        : lesson.grade === filterGrade;

    const matchesSubject = filterSubject === 'all' ? true : lesson.subject === filterSubject;

    return matchesSearch && matchesGrade && matchesSubject;
  });

  const handleOpenLesson = (lesson: LessonPlan) => {
    setActiveLesson(lesson);
    setStudioTab('preview');
    setActiveView('studio');
  };

  const handleExportDocx = async (e: React.MouseEvent, lesson: LessonPlan) => {
    e.stopPropagation();
    setExportError('');
    try {
      await DocxExportService.exportLessonPlanToDocx(lesson, currentUser);
    } catch(error) {
      setExportError(`Không xuất được Word. ${error instanceof Error ? error.message : 'Bài dạy vẫn được giữ trong thư viện; hãy thử lại.'}`);
    }
  };

  const handleShare = (e: React.MouseEvent, lesson: LessonPlan) => {
    e.stopPropagation();
    alert('Bài dạy đang lưu trên trình duyệt này. Để chia sẻ đúng nội dung, hãy xuất Word và gửi tệp cho đồng nghiệp. Chưa có dịch vụ chia sẻ trực tuyến.');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Thầy/Cô có chắc chắn muốn xóa bài dạy này khỏi thư viện trên trình duyệt này?')) {
      deleteLessonPlan(id);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Kho Kế Hoạch Bài Dạy</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold">
              {filteredLessons.length} bài soạn
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bài dạy lưu trên trình duyệt này. Xuất Word để sao lưu hoặc chia sẻ với đồng nghiệp.
          </p>
        </div>

        <button
          onClick={startNewLesson}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          <span>+ Soạn Bài Dạy Mới</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bài dạy, môn học, bộ sách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 shadow-xs transition-all"
          />
        </div>

        {/* Grade filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">Khối lớp:</span>
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => setFilterGrade(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterGrade === g
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {g === 'all' ? 'Tất cả' : g}
            </button>
          ))}
        </div>

        {/* Subject filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">Môn học:</span>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSubject(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterSubject === s
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s === 'all' ? 'Tất cả' : s}
            </button>
          ))}
        </div>
      </div>

      {exportError && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{exportError}</p>}
      {/* Grid of Lesson Cards */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleOpenLesson(lesson)}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-sky-400 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              {/* Header Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {lesson.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {lesson.grade}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Đã hoàn thành
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 mb-2">
                  {lesson.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {lesson.coreContent || 'Nội dung kế hoạch bài dạy chuẩn mực theo quy chuẩn sư phạm Bộ GD&ĐT.'}
                </p>

                {/* Badges CV 5512 & NLS */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {lesson.textbook}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    CV 5512
                  </span>
                  {lesson.options.nls && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      ⚡ Năng lực số 2025
                    </span>
                  )}
                  {lesson.options.gdqpan && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      🛡️ GDQP&AN
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lesson.periodsCount} tiết</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLesson(lesson);
                    }}
                    title="Xem chi tiết"
                    className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleExportDocx(e, lesson)}
                    title="Xuất Word .DOCX"
                    className="p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleShare(e, lesson)}
                    title="Chia sẻ Tổ chuyên môn"
                    className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, lesson.id)}
                    title="Xóa bài dạy"
                    className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">Không tìm thấy bài dạy nào phù hợp</h4>
          <p className="text-xs text-slate-400 mt-1">Thầy/Cô hãy thử tìm kiếm với từ khóa khác hoặc bấm Soạn bài mới</p>
        </div>
      )}

      {/* Author Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Hệ thống Kế hoạch bài dạy chuẩn Công văn 5512 & Thông tư 02/2025/TT-BGDĐT</span>
        </div>
        <div className="font-semibold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
          Phát triển bởi: Anh Giáo PHẠM QUỐC ĐẠT
        </div>
      </div>
    </div>
  );
};
