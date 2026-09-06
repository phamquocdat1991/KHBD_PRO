import React, { useState } from 'react';
import { lessonPlainText } from '../../services/lessonPresentation';
import { useLesson } from '../../context/LessonContext';
import { useAuth } from '../../context/AuthContext';
import { DocxExportService } from '../../services/docxExportService';
import { PptxExportService } from '../../services/pptxExportService';
import { FileText, Presentation, Printer, Copy, Check } from 'lucide-react';

export const FloatingActionDock: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeLesson } = useLesson();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!activeLesson) return null;

  const handleExportWord = async () => {
    setError('');
    try { await DocxExportService.exportLessonPlanToDocx(activeLesson, currentUser); } catch { setError('Không xuất được Word. Hãy thử lại.'); }
  };

  const handleExportPptx = async () => {
    setError('');
    try { await PptxExportService.exportSlideDeck(activeLesson); } catch(error) { setError(error instanceof Error ? error.message : 'Không xuất được PowerPoint.'); }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    setError('');
    try {
      await navigator.clipboard.writeText(lessonPlainText(activeLesson));
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    } catch { setError('Trình duyệt không cho phép sao chép. Thầy/cô có thể chọn nội dung và sao chép thủ công.'); }
  };

  return (
    <div className="sticky top-20 z-30 flex flex-col items-center justify-center my-4 no-print animate-fade-in">
      {error && <p role="alert" className="text-xs text-rose-700 p-2">{error}</p>}
      <div className="flex flex-wrap justify-center items-center gap-2 p-2 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-xl">
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
