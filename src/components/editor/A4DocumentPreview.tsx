import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';
import { useAuth } from '../../context/AuthContext';
import { FloatingActionDock } from './FloatingActionDock';
import { Edit3, Check, Sparkles, Compass, Lightbulb, Cpu, Award } from 'lucide-react';

export const A4DocumentPreview: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeLesson } = useLesson();
  const [isEditing, setIsEditing] = useState(false);

  if (!activeLesson) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Sparkles className="w-12 h-12 mb-3 text-sky-500/50" />
        <p className="text-sm">Chưa có bài dạy nào được chọn. Hãy chọn từ Thư viện hoặc Soạn bài mới.</p>
      </div>
    );
  }

  const isEn = activeLesson.language === 'en';
  const teacherName = currentUser?.name || 'Nguyễn Nam';
  const schoolName = currentUser?.schoolName || (isEn ? 'HIGH SCHOOL FOR THE GIFTED' : 'TRƯỜNG THPT CHUYÊN');
  const department = currentUser?.department || (isEn ? 'ACADEMIC DEPARTMENT' : 'TỔ CHUYÊN MÔN');

  return (
    <div className="flex flex-col items-center w-full">
      {/* Action Dock */}
      <FloatingActionDock />

      {/* Editor toolbar switch & info */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-[210mm] mb-2 px-2 no-print gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Ngôn ngữ:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-sky-800 border border-slate-200">
            {isEn ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
          </span>
          {activeLesson.options.stemLesson && (
            <span className="px-2 py-0.5 rounded bg-emerald-50 font-bold text-emerald-800 border border-emerald-200">
              Bài học STEM (CV 3089/908)
            </span>
          )}
          {activeLesson.options.aiEducation && (
            <span className="px-2 py-0.5 rounded bg-indigo-50 font-bold text-indigo-800 border border-indigo-200">
              Giáo dục AI (QĐ 2422)
            </span>
          )}
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            isEditing
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-xs'
          }`}
        >
          {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit3 className="w-3.5 h-3.5 text-slate-500" />}
          <span>{isEditing ? 'Đang bật chế độ chỉnh sửa trực tiếp' : 'Bật chỉnh sửa trực tiếp'}</span>
        </button>
      </div>

      {/* A4 Document Sheet */}
      <div
        className="a4-document-sheet rounded-md transition-all select-text"
        contentEditable={isEditing}
        suppressContentEditableWarning
      >
        {/* Ministry Header */}
        <div className="grid grid-cols-2 gap-4 pb-4 mb-4 text-center border-b border-gray-300">
          <div>
            <div className="font-bold text-[11pt] uppercase">{schoolName}</div>
            <div className="font-bold text-[11pt] uppercase underline">{department}</div>
            <div className="text-[10pt] mt-1 italic">{isEn ? 'Teacher' : 'Họ tên GV'}: {teacherName}</div>
          </div>
          <div>
            <div className="font-bold text-[11pt] uppercase">
              {isEn ? 'SOCIALIST REPUBLIC OF VIETNAM' : 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'}
            </div>
            <div className="font-bold text-[11pt] underline">
              {isEn ? 'Independence - Freedom - Happiness' : 'Độc lập - Tự do - Hạnh phúc'}
            </div>
            <div className="text-[10pt] mt-1 italic">
              {isEn ? 'Date' : 'Ngày soạn'}: {new Date(activeLesson.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Lesson Title */}
        <div className="text-center my-6">
          <h1 className="text-[16pt] font-bold uppercase tracking-tight text-black">
            {isEn ? `LESSON PLAN: ${activeLesson.title}` : `KẾ HOẠCH BÀI DẠY: ${activeLesson.title}`}
          </h1>
          <div className="text-[12pt] italic mt-1 text-gray-700">
            {isEn ? 'Subject' : 'Môn học'}: <strong>{activeLesson.subject}</strong>; {isEn ? 'Grade' : 'Lớp'}: <strong>{activeLesson.grade}</strong> ({isEn ? 'Textbook' : 'Bộ sách'}: {activeLesson.textbook})
          </div>
          <div className="text-[11pt] text-gray-600 italic">
            {isEn ? 'Duration' : 'Thời lượng thực hiện'}: {activeLesson.periodsCount} {isEn ? 'periods' : 'tiết'} (Chuẩn Công văn 5512/BGDĐT)
          </div>
        </div>

        {/* I. MỤC TIÊU */}
        <div className="mb-5 space-y-2">
          <h2 className="text-[13pt] font-bold uppercase text-black">
            {isEn ? 'I. OBJECTIVES' : 'I. MỤC TIÊU'}
          </h2>
          
          <div>
            <h3 className="text-[12pt] font-bold">{isEn ? '1. Knowledge:' : '1. Về kiến thức:'}</h3>
            <ul className="list-disc pl-6 space-y-1 text-[12pt] leading-relaxed">
              {activeLesson.objectives.knowledge.map((k, idx) => (
                <li key={idx}>{k}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12pt] font-bold">{isEn ? '2. Competencies:' : '2. Về năng lực:'}</h3>
            <div className="space-y-1.5 text-[12pt] leading-relaxed pl-2">
              <div>
                <strong>{isEn ? 'a) General competencies:' : 'a) Năng lực chung:'}</strong>
                <ul className="list-disc pl-6">
                  {activeLesson.objectives.generalCompetencies.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>{isEn ? 'b) Specific competencies:' : 'b) Năng lực đặc thù môn học:'}</strong>
                <ul className="list-disc pl-6">
                  {activeLesson.objectives.specificCompetencies.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Năng lực số TT 02/2025 & CV 3456 */}
              {activeLesson.options.nls && activeLesson.objectives.digitalCompetencies && (
                <div>
                  <strong className="text-blue-900">
                    {isEn ? 'c) Digital competencies (Circular 02/2025 & Dispatch 3456/BGDDT):' : 'c) Năng lực số (Thông tư 02/2025/TT-BGDĐT & CV 3456/BGDĐT):'}
                  </strong>
                  <ul className="list-disc pl-6 text-blue-900 font-medium">
                    {activeLesson.objectives.digitalCompetencies.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Giáo dục AI QĐ 2422 */}
              {activeLesson.options.aiEducation && (
                <div>
                  <strong className="text-indigo-950">
                    {isEn ? 'd) Artificial Intelligence competencies (Decision 2422/QD-BGDDT):' : 'd) Năng lực Trí tuệ Nhân tạo - AI (Khung Quyết định 2422/QĐ-BGDĐT):'}
                  </strong>
                  <ul className="list-disc pl-6 text-indigo-950 font-medium">
                    {(activeLesson.objectives.aiCompetencies || [
                      'Hiểu nguyên lý cơ bản của hệ thống AI và các mô hình xử lý dữ liệu số.',
                      'Ứng dụng AI trợ lý học tập có trách nhiệm, đảm bảo tính trung thực học thuật và an toàn thông tin.'
                    ]).map((ai, idx) => (
                      <li key={idx}>{ai}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bài học STEM CV 3089/908 */}
              {activeLesson.options.stemLesson && (
                <div>
                  <strong className="text-emerald-950">
                    {isEn ? 'e) STEM competencies (Dispatch 3089/BGDDT & 908/BGDDT):' : 'e) Năng lực Bài học STEM (Công văn 3089/BGDĐT & CV 908/BGDĐT):'}
                  </strong>
                  <ul className="list-disc pl-6 text-emerald-950 font-medium">
                    {(activeLesson.objectives.stemCompetencies || [
                      'Science: Khám phá và giải thích bản chất khoa học cốt lõi của bài học.',
                      'Technology: Khai thác công cụ đo lường và thiết bị mô phỏng tương tác.',
                      'Engineering: Vận dụng quy trình thiết kế kỹ thuật từ lên bản vẽ đến chế tạo và thử nghiệm.',
                      'Mathematics: Đo đạc chính xác, phân tích dữ liệu và tính toán tối ưu hóa mô hình.'
                    ]).map((stem, idx) => (
                      <li key={idx}>{stem}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-[12pt] font-bold">{isEn ? '3. Qualities:' : '3. Về phẩm chất:'}</h3>
            <ul className="list-disc pl-6 space-y-1 text-[12pt] leading-relaxed">
              {activeLesson.objectives.qualities.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* II. THIẾT BỊ DẠY HỌC */}
        <div className="mb-6 space-y-2">
          <h2 className="text-[13pt] font-bold uppercase text-black">
            {isEn ? 'II. TEACHING AIDS AND LEARNING MATERIALS' : 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU'}
          </h2>
          <div className="text-[12pt] space-y-1">
            <div>
              <strong>{isEn ? '1. Teacher:' : '1. Giáo viên:'}</strong> {activeLesson.teachingEquipment.teacher.join('; ')}
            </div>
            <div>
              <strong>{isEn ? '2. Students:' : '2. Học sinh:'}</strong> {activeLesson.teachingEquipment.student.join('; ')}
            </div>
          </div>
        </div>

        {/* III. TIẾN TRÌNH DẠY HỌC */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-1">
            <h2 className="text-[13pt] font-bold uppercase text-black">
              {isEn ? 'III. INSTRUCTIONAL PROCEDURE' : 'III. TIẾN TRÌNH DẠY HỌC'}
            </h2>
            <div className="text-[10pt] italic text-gray-700">
              {activeLesson.options.teachingMethod ? `Phương pháp: ${activeLesson.options.teachingMethod}` : ''}
            </div>
          </div>

          {activeLesson.activities.map((act) => (
            <div key={act.id} className="border border-black mb-6">
              {/* Activity Header */}
              <div className="bg-gray-100 p-2.5 border-b border-black font-bold text-[12pt] uppercase flex items-center justify-between">
                <span>{act.title} {act.durationMinutes ? `(${act.durationMinutes} ${isEn ? 'mins' : 'phút'})` : ''}</span>
              </div>

              {/* Sub-objectives */}
              <div className="p-2.5 bg-gray-50 border-b border-black text-[11.5pt] space-y-1">
                <div><strong>{isEn ? 'a) Objectives:' : 'a) Mục tiêu:'}</strong> {act.objective}</div>
                <div><strong>{isEn ? 'b) Content:' : 'b) Nội dung:'}</strong> {act.content}</div>
                <div><strong>{isEn ? 'c) Expected Products:' : 'c) Sản phẩm:'}</strong> {act.product}</div>
                <div className="italic font-bold">{isEn ? 'd) Implementation:' : 'd) Tổ chức thực hiện:'}</div>
              </div>

              {/* 2-Column Table */}
              <table className="w-full border-collapse text-[11.5pt]">
                <thead>
                  <tr className="bg-gray-200 border-b border-black text-center font-bold">
                    <th className="w-1/2 p-2 border-r border-black uppercase text-[11pt]">
                      {isEn ? 'TEACHER ACTIVITIES' : 'HOẠT ĐỘNG CỦA GIÁO VIÊN'}
                    </th>
                    <th className="w-1/2 p-2 uppercase text-[11pt]">
                      {isEn ? 'STUDENT ACTIVITIES' : 'HOẠT ĐỘNG CỦA HỌC SINH'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Step 1 */}
                  <tr className="border-b border-black align-top">
                    <td className="p-2.5 border-r border-black">
                      <div className="font-bold text-blue-900 mb-1">
                        {isEn ? '# Step 1: Task Assignment' : '# Bước 1: Chuyển giao nhiệm vụ'}
                      </div>
                      <div className="leading-relaxed">{act.implementation.step1Teacher}</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-blue-900 mb-1">
                        {isEn ? '# Step 1: Task Reception' : '# Bước 1: Tiếp nhận nhiệm vụ'}
                      </div>
                      <div className="leading-relaxed">{act.implementation.step1Student}</div>
                    </td>
                  </tr>

                  {/* Step 2 */}
                  <tr className="border-b border-black align-top">
                    <td className="p-2.5 border-r border-black">
                      <div className="font-bold text-blue-900 mb-1">
                        {isEn ? '# Step 2: Monitoring & Support' : '# Bước 2: Theo dõi, hỗ trợ'}
                      </div>
                      <div className="leading-relaxed">{act.implementation.step2Teacher}</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-blue-900 mb-1">
                        {isEn ? '# Step 2: Task Execution' : '# Bước 2: Thực hiện nhiệm vụ'}
                      </div>
                      <div className="leading-relaxed">{act.implementation.step2Student}</div>
                    </td>
                  </tr>

                  {/* Step 3 */}
                  <tr className="border-b border-black align-top">
                    <td className="p-2.5 border-r border-black">
                      <div className="font-bold text-blue-900 mb-1">
                        {isEn ? '# Step 3: Presentation & Facilitation' : '# Bước 3: Tổ chức báo cáo'}
                      </div>
                      <div className="leading-relaxed">{act.implementation.step3Teacher}</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-blue-900 mb-1">
                        {isEn ? '# Step 3: Reporting & Discussion' : '# Bước 3: Báo cáo, thảo luận'}
                      </div>
                      <div className="leading-relaxed">{act.implementation.step3Student}</div>
                    </td>
                  </tr>

                  {/* Step 4 */}
                  <tr className="align-top">
                    <td className="p-2.5 border-r border-black">
                      <div className="font-bold text-blue-900 mb-1">
                        {isEn ? '# Step 4: Assessment & Conclusion' : '# Bước 4: Kết luận, nhận định'}
                      </div>
                      <div className="leading-relaxed">{act.implementation.step4Teacher}</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-blue-900 mb-1">
                        {isEn ? '# Step 4: Knowledge Synthesis' : '# Bước 4: Ghi nhận kiến thức'}
                      </div>
                      <div className="leading-relaxed">{act.implementation.step4Student}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* IV. PHỤ LỤC & PHIẾU HỌC TẬP */}
        {activeLesson.options.worksheets && (
          <div className="mt-8 pt-4 border-t-2 border-black space-y-3">
            <h2 className="text-[13pt] font-bold uppercase text-black text-center">
              {isEn ? 'APPENDIX: WORKSHEET #1' : 'PHỤ LỤC: PHIẾU HỌC TẬP SỐ 1'}
            </h2>
            <div className="border border-dashed border-gray-600 p-4 rounded text-[11.5pt] space-y-2">
              <div className="text-center font-bold">
                {isEn ? `STUDENT WORKSHEET: ${activeLesson.title.toUpperCase()}` : `PHIẾU HỌC TẬP: ${activeLesson.title.toUpperCase()}`}
              </div>
              <div>
                {isEn ? 'Student / Group name' : 'Họ và tên học sinh / Nhóm'}: ..................................................... {isEn ? 'Grade' : 'Lớp'}: {activeLesson.grade}
              </div>
              <div>
                <strong>{isEn ? 'Task 1' : 'Nhiệm vụ 1'}:</strong> {isEn ? 'Observe the problem context and record key findings.' : 'Quan sát hiện tượng và ghi lại ít nhất 2 đặc điểm nhận biết.'}
              </div>
              <div className="border-b border-dotted border-gray-400 py-2"></div>
              <div>
                <strong>{isEn ? 'Task 2' : 'Nhiệm vụ 2'}:</strong> {isEn ? 'Group collaboration, apply formulas and evaluate outcomes.' : 'Thảo luận nhóm, hoàn thành công thức và so sánh kết quả.'}
              </div>
              <div className="border-b border-dotted border-gray-400 py-2"></div>
            </div>
          </div>
        )}

        {/* Footnote credit */}
        <div className="mt-10 pt-4 border-t border-gray-300 text-center text-[10pt] text-gray-500 italic">
          Kế hoạch bài dạy chuẩn Công văn 5512/BGDĐT & Thông tư 02/2025/TT-BGDĐT • Phát triển bởi: Anh Giáo PHẠM QUỐC ĐẠT
        </div>
      </div>
    </div>
  );
};
