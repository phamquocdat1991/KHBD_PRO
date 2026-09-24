import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';
import { useAuth } from '../../context/AuthContext';
import { FloatingActionDock } from './FloatingActionDock';
import { Edit3, Check, Sparkles, Sun, Moon, BookOpen } from 'lucide-react';
import { stepLabels, tableHeaders, stepTime } from '../../services/lessonPresentation';
import { LessonPlan } from '../../types';
import { MathText } from '../common/MathText';

type PaperTheme = 'white' | 'sepia' | 'dark';

export const A4DocumentPreview: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeLesson, updateActiveLesson } = useLesson();
  const [isEditing, setIsEditing] = useState(false);
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('white');

  if (!activeLesson) {
    return (
      <div className="flex flex-col items-center p-12 text-slate-400">
        <Sparkles className="w-12 h-12 mb-3" />
        <p>Chưa có bài dạy nào được chọn. Hãy chọn từ Thư viện hoặc Soạn bài mới.</p>
      </div>
    );
  }

  const lesson = activeLesson;
  const en = lesson.language === 'en';
  const tr = (vi: string, english: string) => en ? english : vi;
  const labels = stepLabels(en);
  const headers = tableHeaders(lesson);

  function save(path: (string | number)[], value: string) {
    if (!value.trim()) return;
    const copy = structuredClone(lesson);
    let target: any = copy;
    path.slice(0, -1).forEach(key => { target = target[key]; });
    target[path[path.length - 1]] = value.trim();
    updateActiveLesson({ [path[0]]: copy[path[0] as keyof LessonPlan] });
  }

  const editable = (value: string, path: (string | number)[]) => (
    <span
      contentEditable={isEditing}
      suppressContentEditableWarning
      role={isEditing ? 'textbox' : undefined}
      aria-label={isEditing ? path.join('.') : undefined}
      onBlur={e => {
        const text = e.currentTarget.innerText ?? e.currentTarget.textContent ?? '';
        if (text.trim()) save(path, text);
        else e.currentTarget.textContent = value;
      }}
      onPaste={e => {
        if (!isEditing) return;
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const selection = window.getSelection();
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const node = document.createTextNode(text);
          range.insertNode(node);
          range.setStartAfter(node);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }}
      className={`whitespace-pre-line ${isEditing ? 'outline-none rounded bg-sky-50 focus:ring-2 focus:ring-sky-400 px-1' : ''}`}
    >
      {isEditing ? value : <MathText text={value} />}
    </span>
  );

  const list = (values: string[] | undefined, path: string[]) => (
    <ul className="list-disc pl-6 space-y-1">
      {values?.map((v, i) => (
        <li key={i}>{editable(v, [...path, i])}</li>
      ))}
    </ul>
  );

  const renderActivityTable = (a: typeof lesson.activities[0], index: number) => {
    if (lesson.tableFormat === '1col') {
      return (
        <div className="space-y-3">
          {labels.map((pair, i) => (
            <div key={i} className="border border-black p-3 space-y-1.5">
              {(['Teacher', 'Student'] as const).map(role => (
                <div key={role}>
                  <strong className="text-slate-900">{role === 'Teacher' ? pair[0] : pair[1]}: </strong>
                  {editable(
                    a.implementation[`step${i + 1}${role}` as keyof typeof a.implementation],
                    ['activities', index, 'implementation', `step${i + 1}${role}`]
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (lesson.tableFormat === '2col') {
      return (
        <table className="w-full border-collapse border border-black text-[11pt] table-fixed">
          <thead>
            <tr>
              <th className="border border-black p-2.5 bg-gray-100 font-bold uppercase text-center w-1/2">
                {headers[0]}
              </th>
              <th className="border border-black p-2.5 bg-gray-100 font-bold uppercase text-center w-1/2">
                {headers[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="align-top">
              {/* Teacher Column */}
              <td className="border border-black p-3 space-y-3.5 w-1/2">
                {labels.map((pair, i) => (
                  <div key={i} className="space-y-1">
                    <div className="font-bold text-slate-900">{pair[0]}:</div>
                    <div className="pl-1 leading-relaxed">
                      {editable(
                        a.implementation[`step${i + 1}Teacher` as keyof typeof a.implementation],
                        ['activities', index, 'implementation', `step${i + 1}Teacher`]
                      )}
                    </div>
                  </div>
                ))}
              </td>

              {/* Student Column with Product block */}
              <td className="border border-black p-3 space-y-3.5 w-1/2">
                {labels.map((pair, i) => (
                  <div key={i} className="space-y-1">
                    <div className="font-bold text-slate-900">{pair[1]}:</div>
                    <div className="pl-1 leading-relaxed">
                      {editable(
                        a.implementation[`step${i + 1}Student` as keyof typeof a.implementation],
                        ['activities', index, 'implementation', `step${i + 1}Student`]
                      )}
                    </div>
                  </div>
                ))}

                {a.product && (
                  <div className="pt-3 border-t border-dashed border-gray-400 space-y-1 mt-2">
                    <div className="font-bold text-slate-900">
                      {tr('Sản phẩm dự kiến / Kết quả:', 'Expected Product / Outcomes:')}
                    </div>
                    <div className="pl-1 italic leading-relaxed text-slate-800">
                      {editable(a.product, ['activities', index, 'product'])}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    // 3col or 4col formats
    return (
      <table className="w-full border-collapse border border-black text-[11pt] table-fixed">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className="border border-black p-2 bg-gray-100 font-bold uppercase text-center">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((pair, i) => (
            <tr key={i} className="align-top">
              {lesson.tableFormat === '4col' && (
                <td className="border border-black p-2 text-center">
                  {lesson.options.timeline ? `${stepTime(a, i)} ${tr('phút', 'min')}` : '—'}
                </td>
              )}
              {(['Teacher', 'Student'] as const).map(role => (
                <td key={role} className="border border-black p-2.5">
                  <div className="font-bold mb-1">{role === 'Teacher' ? pair[0] : pair[1]}</div>
                  {editable(
                    a.implementation[`step${i + 1}${role}` as keyof typeof a.implementation],
                    ['activities', index, 'implementation', `step${i + 1}${role}`]
                  )}
                </td>
              ))}
              {(lesson.tableFormat === '3col' || lesson.tableFormat === '4col') && (
                <td className="border border-black p-2">
                  {i === 0 ? editable(a.product, ['activities', index, 'product']) : ''}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      <FloatingActionDock />
      <div className="flex flex-wrap items-center justify-between w-full max-w-[210mm] mb-2 no-print gap-2 text-xs">
        <span>{tr('Ngôn ngữ: Tiếng Việt', 'Language: English')} · {lesson.attachmentsCount || 0} {tr('tài liệu nguồn', 'source files')}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 border border-slate-300">
            <button
              type="button"
              onClick={() => setPaperTheme('white')}
              title="Trang A4 chuẩn in (Trắng)"
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${
                paperTheme === 'white' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Trắng</span>
            </button>
            <button
              type="button"
              onClick={() => setPaperTheme('sepia')}
              title="Giấy ngà bảo vệ mắt"
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${
                paperTheme === 'sepia' ? 'bg-[#fbf7ee] text-amber-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Giấy ngà</span>
            </button>
            <button
              type="button"
              onClick={() => setPaperTheme('dark')}
              title="Chế độ tối dịu mắt ban đêm"
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${
                paperTheme === 'dark' ? 'bg-slate-800 text-slate-100 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Đêm</span>
            </button>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white text-sky-800 font-medium shadow-xs hover:bg-sky-50"
          >
            {isEditing ? <Check className="w-4 h-4 text-emerald-600" /> : <Edit3 className="w-4 h-4 text-sky-600" />}
            {isEditing ? 'Xong chỉnh sửa' : 'Bật chỉnh sửa trực tiếp'}
          </button>
        </div>
      </div>
      {isEditing && (
        <p className="no-print text-xs text-sky-700 mb-3">
          Bấm vào nội dung cần sửa. Thay đổi được lưu khi rời ô và dùng cho bản xuất Word, sao chép, in/PDF.
        </p>
      )}
      <div className="w-full overflow-x-auto print-document-wrap">
        <article
          className={`a4-document-sheet rounded-md mx-auto select-text ${
            paperTheme === 'sepia' ? 'theme-sepia' : paperTheme === 'dark' ? 'theme-dark' : ''
          }`}
        >
          <div className="grid grid-cols-2 gap-4 pb-4 mb-4 text-center border-b border-gray-300 text-[11pt]">
            <div>
              <div className="font-bold uppercase">{currentUser?.schoolName || tr('TÊN TRƯỜNG', 'SCHOOL NAME')}</div>
              <div className="font-bold uppercase underline">{currentUser?.department || tr('TỔ CHUYÊN MÔN', 'DEPARTMENT')}</div>
              <div className="italic">{tr('Họ tên GV', 'Teacher')}: {currentUser?.name || '................................'}</div>
            </div>
            <div>
              <div className="font-bold">{tr('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 'SOCIALIST REPUBLIC OF VIETNAM')}</div>
              <div className="font-bold underline">{tr('Độc lập - Tự do - Hạnh phúc', 'Independence - Freedom - Happiness')}</div>
              <div className="italic">{tr('Ngày soạn', 'Date')}: {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</div>
            </div>
          </div>

          {/* 4-tier Header matching khungkhbdmaunguvan.docx */}
          <div className="text-center my-6 space-y-1">
            <div className="text-[11pt] font-semibold text-slate-700 tracking-wide pb-1 border-b border-gray-200 mb-2">
              {tr('Môn học', 'Subject')}: {lesson.subject} &nbsp;|&nbsp; {tr('Lớp', 'Grade')}: {lesson.grade} &nbsp;|&nbsp; {tr('Bộ sách', 'Textbook')}: {lesson.textbook}
            </div>
            <h1 className="text-[15pt] sm:text-[16pt] font-bold uppercase tracking-tight text-slate-900 mt-2">
              {tr('KẾ HOẠCH BÀI DẠY', 'LESSON PLAN')}: {editable(lesson.title, ['title'])}
            </h1>
            <p className="italic text-[11pt] text-slate-600">
              {tr('Thời lượng thực hiện', 'Duration')}: {lesson.periodsCount} {tr('tiết', 'periods')}
            </p>
          </div>

          <section className="space-y-3 mb-5">
            <h2 className="font-bold text-[13pt] uppercase">{tr('I. MỤC TIÊU', 'I. OBJECTIVES')}</h2>
            <h3 className="font-bold text-[11.5pt]">{tr('1. Về kiến thức:', '1. Knowledge:')}</h3>
            {list(lesson.objectives.knowledge, ['objectives', 'knowledge'])}
            <h3 className="font-bold text-[11.5pt]">{tr('2. Về năng lực:', '2. Competencies:')}</h3>
            <strong>{tr('a) Năng lực đặc thù:', 'a) Subject competencies:')}</strong>
            {list(lesson.objectives.specificCompetencies, ['objectives', 'specificCompetencies'])}
            <strong>{tr('b) Năng lực chung:', 'b) General competencies:')}</strong>
            {list(lesson.objectives.generalCompetencies, ['objectives', 'generalCompetencies'])}
            {lesson.options.nls && (
              <>
                <strong>{tr('c) Năng lực số:', 'c) Digital competencies:')}</strong>
                {list(lesson.objectives.digitalCompetencies, ['objectives', 'digitalCompetencies'])}
              </>
            )}
            {lesson.options.aiEducation && (
              <>
                <strong>{tr('d) Năng lực AI:', 'd) AI competencies:')}</strong>
                {list(lesson.objectives.aiCompetencies, ['objectives', 'aiCompetencies'])}
              </>
            )}
            {lesson.options.stemLesson && (
              <>
                <strong>{tr('e) Năng lực STEM:', 'e) STEM competencies:')}</strong>
                {list(lesson.objectives.stemCompetencies, ['objectives', 'stemCompetencies'])}
              </>
            )}
            <h3 className="font-bold text-[11.5pt]">{tr('3. Về phẩm chất:', '3. Qualities:')}</h3>
            {list(lesson.objectives.qualities, ['objectives', 'qualities'])}
          </section>

          <section className="space-y-2 mb-5">
            <h2 className="font-bold text-[13pt] uppercase">{tr('II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU', 'II. EQUIPMENT AND MATERIALS')}</h2>
            <strong>{tr('1. Giáo viên (GV):', '1. Teacher:')}</strong>
            {list(lesson.teachingEquipment.teacher, ['teachingEquipment', 'teacher'])}
            <strong>{tr('2. Học sinh (HS):', '2. Students:')}</strong>
            {list(lesson.teachingEquipment.student, ['teachingEquipment', 'student'])}
          </section>

          <section className="space-y-6">
            <h2 className="font-bold text-[13pt] uppercase">{tr('III. TIẾN TRÌNH DẠY HỌC', 'III. LEARNING ACTIVITIES')}</h2>
            <p className="italic text-[11pt]">
              {tr('Phương pháp dạy học chủ đạo', 'Primary teaching method')}: {lesson.options.teachingMethod}
            </p>

            {lesson.activities.map((a, index) => (
              <div key={a.id} className="space-y-2.5 pt-2">
                <h3 className="font-bold bg-gray-100 p-2 border border-black text-[12pt] uppercase tracking-wide">
                  {tr('HOẠT ĐỘNG', 'ACTIVITY')} {a.activityNumber || index + 1}: {editable(a.title, ['activities', index, 'title'])}
                  {lesson.options.timeline && a.durationMinutes ? ` (Khoảng ${a.durationMinutes} ${tr('phút', 'minutes')})` : ''}
                </h3>

                <div className="space-y-1.5 pl-1">
                  <div>
                    <strong>{tr('a) Mục tiêu: ', 'a) Objective: ')}</strong>
                    {editable(a.objective, ['activities', index, 'objective'])}
                  </div>
                  <div>
                    <strong>{tr('b) Nội dung: ', 'b) Content: ')}</strong>
                    {editable(a.content, ['activities', index, 'content'])}
                  </div>
                  <div>
                    <strong>{tr('c) Sản phẩm: ', 'c) Product: ')}</strong>
                    {editable(a.product, ['activities', index, 'product'])}
                  </div>
                  {(lesson.options.nls || lesson.options.aiEducation || lesson.options.stemLesson) && (
                    <div>
                      <strong>{tr('d) Mục đích sư phạm của việc dùng NLS/AI/STEM: ', 'd) Pedagogical purpose of Digital/AI/STEM: ')}</strong>
                      <span className="italic text-slate-700">
                        {tr(
                          'Ứng dụng công nghệ hỗ trợ trực quan hóa kiến thức, tăng cường tương tác và phát triển năng lực tự học của học sinh.',
                          'Applying technology to support visualization, enhance interactivity and develop students independent learning competencies.'
                        )}
                      </span>
                    </div>
                  )}
                  <div className="font-bold pt-1">
                    {(lesson.options.nls || lesson.options.aiEducation || lesson.options.stemLesson)
                      ? tr('e) Tổ chức thực hiện:', 'e) Implementation:')
                      : tr('d) Tổ chức thực hiện:', 'd) Implementation:')}
                  </div>
                </div>

                {renderActivityTable(a, index)}
              </div>
            ))}
          </section>

          {/* Section IV. HỒ SƠ DẠY HỌC (PHỤ LỤC) matching khungkhbdmaunguvan.docx */}
          <section className="mt-8 pt-4 border-t-2 border-black space-y-4">
            <h2 className="font-bold text-[13pt] uppercase text-center">
              {tr('IV. HỒ SƠ DẠY HỌC (PHỤ LỤC)', 'IV. TEACHING DOSSIER & APPENDIX')}
            </h2>

            <div className="space-y-2">
              <h3 className="font-bold text-[11.5pt] text-slate-900">
                {tr('1. Hệ thống Phiếu học tập:', '1. Worksheets System:')}
              </h3>
              {lesson.worksheetsAppendix?.length ? (
                lesson.worksheetsAppendix.map((w, i) => (
                  <div key={i} className="border border-dashed border-gray-600 rounded p-4 whitespace-pre-line bg-slate-50/50">
                    <div className="font-bold text-sky-900 mb-1">{tr('Phiếu học tập số', 'Worksheet No.')} {i + 1}:</div>
                    {editable(w, ['worksheetsAppendix', i])}
                  </div>
                ))
              ) : (
                <p className="italic text-slate-500">
                  {tr(
                    'Đính kèm các phiếu học tập khám phá kiến thức và bài tập vận dụng theo tiến trình 4 hoạt động.',
                    'Attached are discovery and application worksheets according to the 4 activities.'
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-[11.5pt] text-slate-900">
                {tr('2. Bảng Rubric đánh giá kết quả hoạt động học tập:', '2. Assessment Criteria & Rubric:')}
              </h3>
              <table className="w-full border-collapse border border-black text-[10.5pt] table-fixed">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2 font-bold w-1/5">{tr('Tiêu chí đánh giá', 'Criteria')}</th>
                    <th className="border border-black p-2 font-bold w-1/5">{tr('Mức 1: Chưa đạt', 'Level 1 (<5.0)')}</th>
                    <th className="border border-black p-2 font-bold w-1/5">{tr('Mức 2: Đạt', 'Level 2 (5.0-6.5)')}</th>
                    <th className="border border-black p-2 font-bold w-1/5">{tr('Mức 3: Khá', 'Level 3 (7.0-8.5)')}</th>
                    <th className="border border-black p-2 font-bold w-1/5">{tr('Mức 4: Tốt', 'Level 4 (8.6-10)')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 font-bold">{tr('Kiến thức cốt lõi', 'Core Knowledge')}</td>
                    <td className="border border-black p-2">{tr('Chưa nhận biết được khái niệm trọng tâm', 'Core concepts not identified')}</td>
                    <td className="border border-black p-2">{tr('Nêu được định nghĩa cơ bản', 'Basic definitions stated')}</td>
                    <td className="border border-black p-2">{tr('Phân tích đúng và đầy đủ các yếu tố', 'Analyzes correctly & fully')}</td>
                    <td className="border border-black p-2">{tr('Hiểu sâu sắc, vận dụng thành thạo', 'Deep understanding & mastery')}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold">{tr('Hợp tác & Kỹ năng số', 'Collaboration & Digital')}</td>
                    <td className="border border-black p-2">{tr('Tham gia thụ động trong nhóm', 'Passive participation')}</td>
                    <td className="border border-black p-2">{tr('Hoàn thành nhiệm vụ được giao', 'Assigned tasks completed')}</td>
                    <td className="border border-black p-2">{tr('Chủ động tương tác, khai thác tốt công cụ số', 'Proactive, good digital tool use')}</td>
                    <td className="border border-black p-2">{tr('Dẫn dắt nhóm, tư duy phản biện xuất sắc', 'Team leadership, critical thinking')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-1.5 pt-2">
              <h3 className="font-bold text-[11.5pt] text-slate-900">
                {tr('3. Hướng dẫn tự học và nhiệm vụ về nhà:', '3. Self-study Guide & Homework:')}
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-[11pt]">
                <li>
                  <strong>{tr('Ôn tập bài cũ:', 'Review:')}</strong> {tr('Hệ thống hóa toàn bộ kiến thức bài học vào sơ đồ tư duy hoặc vở ghi.', 'Systematize all lesson knowledge into mindmaps or notebooks.')}
                </li>
                <li>
                  <strong>{tr('Rèn luyện kỹ năng:', 'Practice:')}</strong> {tr('Hoàn thành các câu hỏi bài tập củng cố trong SGK và phiếu học tập.', 'Complete textbook questions and worksheets.')}
                </li>
                <li>
                  <strong>{tr('Chuẩn bị bài mới:', 'Preparation:')}</strong> {tr('Đọc trước nội dung bài học kế tiếp, ghi nhận các vấn đề thắc mắc cần trao đổi.', 'Read the next lesson in advance and prepare questions.')}
                </li>
              </ul>
            </div>
          </section>

          <footer className="mt-10 pt-4 border-t text-center text-[10pt] italic">Phát triển bởi: Anh Giáo PHẠM QUỐC ĐẠT</footer>
        </article>
      </div>
    </div>
  );
};
