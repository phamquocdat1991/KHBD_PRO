import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Award, FileCheck, CheckCircle2, Phone, Mail, User } from 'lucide-react';

export const PedagogicalGuidelinesView: React.FC = () => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1200px] mx-auto w-full space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-sky-600" />
          <span>Quy Chuẩn Sư Phạm & Khung Năng Lực Số 2025</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hệ thống hóa các văn bản chỉ đạo chuyên môn cốt lõi của Bộ Giáo dục và Đào tạo ứng dụng trong KHBD AI PRO
        </p>
      </div>

      {/* Author & Creator Spotlight Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border border-sky-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white text-sky-600 shadow-xs border border-sky-200">
              <Award className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-800 uppercase tracking-wider">Thông Tin Tác Giả & Đơn Vị Phát Triển</div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Anh Giáo PHẠM QUỐC ĐẠT</h2>
              <p className="text-xs text-slate-600 mt-1">
                Chuyên gia tư vấn chuyển đổi số giáo dục, thẩm định Sáng kiến kinh nghiệm & Trợ lý Kế hoạch bài dạy AI
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-sky-800 border border-sky-200 shadow-xs">
              Chuẩn GDPT 2018
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-xs">
              Google AI SDK v5.0
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Công văn 5512 & Thông tư 02/2025 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Công văn 5512 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Công văn 5512/BGDĐT-GDTrH</h3>
              <p className="text-xs text-slate-500">Khung Kế hoạch bài dạy chuẩn THCS & THPT</p>
            </div>
          </div>

          <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
            <p><strong>Cấu trúc 4 Hoạt động bắt buộc:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Hoạt động 1 (Khởi động):</strong> Tạo mâu thuẫn nhận thức, liên hệ thực tiễn.</li>
              <li><strong>Hoạt động 2 (Hình thành kiến thức):</strong> Học sinh chiếm lĩnh kiến thức cốt lõi.</li>
              <li><strong>Hoạt động 3 (Luyện tập):</strong> Giải bài tập rèn luyện kỹ năng.</li>
              <li><strong>Hoạt động 4 (Vận dụng):</strong> Mở rộng và áp dụng vào cuộc sống.</li>
            </ul>
            <p className="pt-2"><strong>Mỗi hoạt động phải rõ ràng 4 yếu tố:</strong> Mục tiêu, Nội dung, Sản phẩm và Tổ chức thực hiện (4 bước đối chiếu GV và HS).</p>
          </div>
        </div>

        {/* Card 2: Thông tư 02/2025 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Thông tư 02/2025/TT-BGDĐT</h3>
              <p className="text-xs text-slate-500">Quy định Khung Năng lực số cho người học</p>
            </div>
          </div>

          <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
            <p><strong>Yêu cầu tích hợp Năng lực số (NLS):</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tạo cơ hội cho học sinh khai thác tài nguyên học liệu số an toàn.</li>
              <li>Ứng dụng phần mềm mô phỏng (GeoGebra, PhET, Google Earth) trong hoạt động hình thành kiến thức.</li>
              <li>Sử dụng các công cụ tương tác nhóm số để báo cáo sản phẩm.</li>
              <li>Bồi dưỡng văn hóa số và ý thức bảo vệ bản quyền, an toàn mạng.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Verification Matrix */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Cam Kết Chuẩn Mực Kỹ Thuật & Bảo Mật Dữ Liệu</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sky-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bảo Mật API Key</span>
            </div>
            <p className="text-slate-500">
              Key cá nhân chỉ lưu trong phiên trình duyệt (localStorage), không lưu trữ trái phép trên máy chủ trung gian.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sky-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Google AI SDK v5.0</span>
            </div>
            <p className="text-slate-500">
              Tích hợp chuẩn thế hệ model mới (Gemini 3.8 Flash, 3.6 Flash) tối ưu tư duy sư phạm và phân bổ token.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sky-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Xuất Bản Đa Kênh</span>
            </div>
            <p className="text-slate-500">
              Xuất file Word (.docx) chuẩn phông Times New Roman 13-14pt, canh lề hành chính và file trình chiếu PowerPoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
