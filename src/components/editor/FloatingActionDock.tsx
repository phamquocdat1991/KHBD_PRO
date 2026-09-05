import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';
import { useAuth } from '../../context/AuthContext';
import { DocxExportService } from '../../services/docxExportService';
import { PptxExportService } from '../../services/pptxExportService';
import { FileText, Presentation, Printer, Copy, Check } from 'lucide-react';

export const FloatingActionDock: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeLesson } = useLesson();
  const [copied, setCopied] = useState(false);

  if (!activeLesson) return null;

  const handleExportWord = () => {
    DocxExportService.exportLessonPlanToDocx(activeLesson, currentUser);
  };

  const handleExportPptx = () => {
    PptxExportService.exportSlideDeck(activeLesson);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `KẾ HOẠCH BÀI DẠY: ${activeLesson.title}\nMôn: ${activeLesson.subject} - Lớp: ${activeLesson.grade}\nBộ sách: ${activeLesson.textbook}\n\nI. MỤC TIÊU:\n${activeLesson.objectives.knowledge.join('\n')}\n\nII. TIẾN TRÌNH DẠY HỌC:\n${activeLesson.activities.map(a => `${a.title}\n- Mục tiêu: ${a.objective}\n- Nội dung: ${a.content}`).join('\n\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="sticky top-20 z-30 flex items-center justify-center my-4 no-print animate-fade-in">
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-xl">
        <button
          onClick={handleExportWord}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <FileText className="w-4 h-4" />
          <span>Xuất Word (.docx)</span>
        </button>

        <button
          onClick={handleExportPptx}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Presentation className="w-4 h-4" />
          <span>Xuất Slide PPTX</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all hover:scale-105 active:scale-95"
        >
          <Printer className="w-4 h-4 text-sky-600" />
          <span>In / PDF</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all hover:scale-105 active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
        </button>
      </div>
    </div>
  );
};
