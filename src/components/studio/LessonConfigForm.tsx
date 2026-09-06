import { LESSON_TEXTBOOK } from '../../data/lessonDefaults';
import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { prepareSourceDocument, SourceDocument, MAX_SOURCE_BYTES, SOURCE_ACCEPT } from '../../services/sourceDocumentService';
import { useLesson } from '../../context/LessonContext';
import { Subject, GradeLevel, TableFormat, AdvancedOptions, LessonLanguage } from '../../types';
import { Sparkles, UploadCloud, FileText, Check, Settings2, Sliders, Loader2, Globe, Cpu, Lightbulb, Compass } from 'lucide-react';

export const LessonConfigForm: React.FC = () => {
  const { createLessonPlan, isGenerating, generationProgress, generationError } = useLesson();
  const { geminiApiKey, openProfileModal, openLoginModal, currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('Toán');
  const [grade, setGrade] = useState<GradeLevel>('Lớp 11');
  const textbook = LESSON_TEXTBOOK;
  const [periodsCount, setPeriodsCount] = useState(2);
  const [tableFormat, setTableFormat] = useState<TableFormat>('2col');
  const [language, setLanguage] = useState<LessonLanguage>('vi');
  const [coreContent, setCoreContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<SourceDocument[]>([]);
  const [fileAnalysisStatus, setFileAnalysisStatus] = useState('');
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const reading = useRef(false);
  const [isReadingFile, setIsReadingFile] = useState(false);

  // Advanced Options
  const [options, setOptions] = useState<AdvancedOptions>({
    nls: true,
    aiEducation: true,
    stemLesson: false,
    teachingMethod: 'Phương pháp dạy học tích cực',
    warmupType: 'Khởi động sôi nổi (Trò chơi / Hoạt náo tương tác)',
    customIntegration: '',
    gdqpan: false,
    timeline: true,
    mathFormulas: true,
    worksheets: true,
  });

  const subjectsList: Subject[] = [
    'Toán', 'Ngữ văn', 'Tiếng Anh', 'Khoa học tự nhiên',
    'Vật lí', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lí',
    'Tin học', 'Công nghệ', 'Giáo dục thể chất', 'Âm nhạc', 'Mĩ thuật',
    'Hoạt động trải nghiệm, hướng nghiệp'
  ];

  const gradesList: GradeLevel[] = [
    'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
    'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
    'Lớp 10', 'Lớp 11', 'Lớp 12'
  ];


  const teachingMethodsList = [
    'Phương pháp dạy học tích cực',
    'Dạy học giải quyết vấn đề',
    'Dạy học khám phá (Inquiry-based)',
    'Phương pháp Bàn tay nặn bột (Hands-on)',
    'Dạy học theo dự án (PBL)',
    'Dạy học theo trạm (Station rotation)',
    'Kỹ thuật Khăn trải bàn & KWL',
    'Dạy học phân hóa theo đối tượng'
  ];

  const warmupTypesList = [
    'Khởi động sôi nổi (Trò chơi / Hoạt náo tương tác)',
    'Trò chơi tương tác (Quiz / Rung chuông vàng)',
    'Video clip tình huống thực tế hấp dẫn',
    'Đố vui trí tuệ / Giải mã ô chữ bí mật',
    'Thí nghiệm khoa học gợi mở bất ngờ',
    'Tình huống mâu thuẫn nhận thức (PBL)',
    'Âm nhạc & Hoạt náo khởi động năng lượng'
  ];

  const addFiles = async (files: File[]) => {
    if (!files.length || reading.current || isGenerating) return;
    reading.current = true;
    setIsReadingFile(true);
    setFileErrors([]);
    setFileAnalysisStatus('Đang đọc và chuẩn bị tài liệu...');
    const accepted: SourceDocument[] = [];
    const errors: string[] = [];
    let bytes = uploadedFiles.reduce((sum, f) => sum + f.size, 0);
    try {
      for (const file of files) {
        if (bytes + file.size > MAX_SOURCE_BYTES) { errors.push(`${file.name}: tổng tài liệu vượt quá 40 MB.`); continue; }
        try { const source = await prepareSourceDocument(file); accepted.push(source); bytes += file.size; }
        catch (error) { errors.push(error instanceof Error ? error.message : `Không đọc được ${file.name}.`); }
      }
      setUploadedFiles(prev => [...prev, ...accepted]);
      setFileErrors(errors);
      setFileAnalysisStatus(accepted.length ? `Đã chuẩn bị ${accepted.length} tệp. PDF/ảnh sẽ được Gemini đọc khi tạo bài; Word/văn bản đã trích xuất chữ.` : 'Chưa có tệp mới nào đọc được.');
    } finally { reading.current = false; setIsReadingFile(false); }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    void addFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reading.current || isGenerating || fileErrors.length) return;
    if (!title.trim()) {
      alert('Vui lòng nhập Tên bài dạy!');
      return;
    }

    await createLessonPlan({
      title,
      subject,
      grade,
      textbook,
      periodsCount,
      tableFormat,
      language,
      options,
      coreContent: coreContent.trim(),
      sourceDocuments: uploadedFiles,
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-600" />
            <span>Cấu Hình Kế Hoạch Bài Dạy Mới</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chuẩn Công văn 5512 & TT 02/2025 • Phát triển bởi: Anh Giáo PHẠM QUỐC ĐẠT
          </p>
        </div>

        {/* Tùy chọn ngôn ngữ bài soạn */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <Globe className="w-4 h-4 text-sky-600 ml-2" />
          <button
            type="button"
            onClick={() => setLanguage('vi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              language === 'vi'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🇬🇧 Tiếng Anh
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên bài soạn */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Tên Bài Dạy / Chủ Đề <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Phương trình lượng giác cơ bản, Tác phẩm Vợ Nhặt, Thiết kế xe phản lực STEM..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
          />
        </div>

        {/* Grid: Môn học, Khối lớp, Số tiết */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Môn Học</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-800 focus:outline-none"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Khối Lớp</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as GradeLevel)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-800 focus:outline-none"
            >
              {gradesList.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Số Tiết Thực Hiện</label>
            <select
              value={periodsCount}
              onChange={(e) => setPeriodsCount(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-800 focus:outline-none"
            >
              <option value={1}>1 Tiết (45 phút)</option>
              <option value={2}>2 Tiết (90 phút)</option>
              <option value={3}>3 Tiết</option>
              <option value={4}>4 Tiết</option>
            </select>
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-700 mb-2">Bộ Sách Giáo Khoa</span>
          <p className="text-sm font-semibold text-sky-800">{LESSON_TEXTBOOK}</p>
        </div>

        {/* Mẫu bảng KHBD */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Định Dạng Bảng KHBD</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setTableFormat('2col')}
              className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all ${
                tableFormat === '2col'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bảng 2 Cột (GV ↔ HS)
            </button>
            <button
              type="button"
              onClick={() => setTableFormat('3col')}
              className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all ${
                tableFormat === '3col'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bảng 3 Cột (GV-HS-SP)
            </button>
            <button
              type="button"
              onClick={() => setTableFormat('4col')}
              className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all ${
                tableFormat === '4col'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bảng 4 Cột (TG-GV-HS-SP)
            </button>
            <button
              type="button"
              onClick={() => setTableFormat('1col')}
              className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all ${
                tableFormat === '1col'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dạng 1 Cột
            </button>
          </div>
        </div>

        {/* TÙY CHỌN SƯ PHẠM NÂNG CAO (THE USER'S DETAILED REQUIREMENTS) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-50 border border-slate-200 space-y-4">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-sky-600" />
              <span className="uppercase tracking-wider">Tùy Chọn Sư Phạm Nâng Cao</span>
            </span>
            <span className="text-[11px] text-sky-700 font-medium">Chuẩn quy định BGD&ĐT</span>
          </div>

          {/* Core pedagogical switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Tích hợp NLS Thông tư 02/2025 & CV 3456 */}
            <label className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-300 cursor-pointer transition-all shadow-2xs">
              <input
                type="checkbox"
                checked={options.nls}
                onChange={(e) => setOptions({ ...options, nls: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Tích hợp Năng lực số (NLS)</span>
                <span className="text-[11px] text-slate-500">Thông tư 02/2025/TT-BGDĐT & CV 3456/BGDĐT</span>
              </div>
            </label>

            {/* Tích hợp Giáo dục AI QĐ 2422 */}
            <label className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-2xs">
              <input
                type="checkbox"
                checked={options.aiEducation}
                onChange={(e) => setOptions({ ...options, aiEducation: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <span>Tích hợp Giáo dục AI</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">Mới</span>
                </span>
                <span className="text-[11px] text-slate-500">Khung Quyết định 2422/QĐ-BGDĐT</span>
              </div>
            </label>

            {/* Giáo án bài học STEM CV 3089/908 */}
            <label className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all shadow-2xs">
              <input
                type="checkbox"
                checked={options.stemLesson}
                onChange={(e) => setOptions({ ...options, stemLesson: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Giáo án Bài học STEM</span>
                <span className="text-[11px] text-slate-500">Quy trình kĩ thuật CV 3089/BGDĐT & CV 908/BGDĐT</span>
              </div>
            </label>

            {/* Lồng ghép GDQP&AN */}
            <label className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 cursor-pointer transition-all shadow-2xs">
              <input
                type="checkbox"
                checked={options.gdqpan}
                onChange={(e) => setOptions({ ...options, gdqpan: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Giáo dục Quốc phòng & An ninh</span>
                <span className="text-[11px] text-slate-500">Thông tư 08/2024/TT-BGDĐT</span>
              </div>
            </label>
          </div>

          {/* Phương pháp & Khởi động */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {/* Phương Pháp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span>Phương Pháp Dạy Học Chủ Đạo</span>
              </label>
              <select
                value={options.teachingMethod}
                onChange={(e) => setOptions({ ...options, teachingMethod: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
              >
                {teachingMethodsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Khởi Động */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Hình Thức Khởi Động (Hoạt động 1)</span>
              </label>
              <select
                value={options.warmupType}
                onChange={(e) => setOptions({ ...options, warmupType: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
              >
                {warmupTypesList.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tích hợp nội dung khác: nhập yêu cầu vào */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tích Hợp Nội Dung Khác (Nhập Yêu Cầu Vào)
            </label>
            <input
              type="text"
              value={options.customIntegration}
              onChange={(e) => setOptions({ ...options, customIntegration: e.target.value })}
              placeholder="Ví dụ: Giáo dục Bảo vệ Môi trường, Biến đổi khí hậu, Kỹ năng sống, Văn hóa truyền thống địa phương..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Tiện ích bổ trợ */}
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.timeline}
                onChange={(e) => setOptions({ ...options, timeline: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 border-slate-300"
              />
              <span>Tự động phân bổ thời gian (Timeline phút)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.worksheets}
                onChange={(e) => setOptions({ ...options, worksheets: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 border-slate-300"
              />
              <span>Tạo Phiếu học tập đính kèm</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.mathFormulas}
                onChange={(e) => setOptions({ ...options, mathFormulas: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 border-slate-300"
              />
              <span>Hỗ trợ công thức Toán/Hóa học Unicode</span>
            </label>
          </div>
        </div>

        {/* Nội dung cốt lõi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Nội Dung Cốt Lõi Hoặc Ghi Chú Sư Phạm
          </label>
          <textarea
            rows={3}
            value={coreContent}
            onChange={(e) => setCoreContent(e.target.value)}
            placeholder="Dán nội dung trọng tâm bài học, yêu cầu cần đạt hoặc ghi chú sư phạm của Thầy/Cô..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Drag and Drop Zone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Đính Kèm Tài Liệu Nguồn (PDF, DOCX, Ảnh Sách OCR)
          </label>
          <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void addFiles(Array.from(e.dataTransfer.files)); }} className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-all">
            <UploadCloud className="w-8 h-8 text-sky-600 mb-2" />
            <span className="text-xs font-semibold text-slate-800">
              Kéo thả tài liệu vào đây hoặc bấm để chọn tệp
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              PDF, Word (.docx), TXT/MD, ảnh PNG/JPG. Tổng tối đa 40 MB.
            </span>
            <input
              type="file"
              multiple
              accept={SOURCE_ACCEPT}
              aria-label="Chọn tài liệu nguồn"
              disabled={isReadingFile || isGenerating}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {fileAnalysisStatus && (
            <div className={`mt-2 text-xs font-semibold flex items-center gap-1.5 ${fileAnalysisStatus.includes('⚠️') ? 'text-amber-600' : 'text-emerald-600'}`}>
              <Check className="w-3.5 h-3.5" />
              <span>{fileAnalysisStatus}</span>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {uploadedFiles.map((file, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] text-slate-700 border border-slate-200">
                  <FileText className="w-3 h-3 text-sky-600" />
                  <span>{file.name}{file.text ? ` — ${file.text.length.toLocaleString()} ký tự` : " — sẵn sàng gửi AI"}</span>
                  <span className="text-slate-500 font-mono">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <button type="button" aria-label={`Bỏ tệp ${file.name}`} disabled={isReadingFile || isGenerating} onClick={() => setUploadedFiles(prev => prev.filter((_, index) => index !== i))} className="ml-1 text-rose-600">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {fileErrors.length > 0 && <div role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-800">
          {fileErrors.map((message, i) => <p key={i}>{message}</p>)}
          <p>Chọn lại tệp lỗi hoặc xác nhận bỏ qua các tệp này trước khi tạo.</p>
          <button type="button" onClick={() => setFileErrors([])} className="mt-2 underline font-bold">Bỏ qua tệp lỗi</button>
        </div>}
        {!geminiApiKey.trim() && <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
          Cần Gemini API Key để AI soạn bài từ nguồn của thầy/cô.
          <button type="button" onClick={currentUser ? openProfileModal : openLoginModal} className="ml-2 underline font-bold">Cấu hình API Key</button>
        </div>}
        {generationError && <div role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{generationError}</div>}
        {/* Action Button & Loading Status */}
        <div className="pt-2">
          {isGenerating && (
            <div className="mb-3 p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />
              <span className="text-xs font-semibold text-sky-800">{generationProgress}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating || isReadingFile || fileErrors.length > 0}
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-md shadow-sky-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang Khởi Tạo Kế Hoạch Bài Dạy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>✨ Tạo Kế Hoạch Bài Dạy Với AI ({language === 'en' ? 'English Lesson Plan' : 'Chuẩn CV 5512'})</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
