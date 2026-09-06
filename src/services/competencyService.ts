import { AI_COMPETENCIES } from '../data/aiCompetencies';
// Component-level identifiers from TT 02/2025, not invented grade-level indicators.
export const DIGITAL_COMPETENCIES: Record<string,string> = {
  "1.1": "Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số",
  "1.2": "Đánh giá dữ liệu, thông tin và nội dung số",
  "1.3": "Quản lý dữ liệu, thông tin và nội dung số",
  "2.1": "Tương tác thông qua công nghệ số",
  "2.2": "Chia sẻ thông tin và nội dung thông qua công nghệ số",
  "2.3": "Sử dụng công nghệ số để thực hiện trách nhiệm công dân",
  "2.4": "Hợp tác thông qua công nghệ số",
  "2.5": "Quy tắc ứng xử trên mạng",
  "2.6": "Quản lý danh tính số",
  "3.1": "Phát triển nội dung số",
  "3.2": "Tích hợp và tạo lập lại nội dung số",
  "3.3": "Thực thi bản quyền và giấy phép",
  "3.4": "Lập trình",
  "4.1": "Bảo vệ thiết bị",
  "4.2": "Bảo vệ dữ liệu cá nhân và quyền riêng tư",
  "4.3": "Bảo vệ sức khỏe và an sinh số",
  "4.4": "Bảo vệ môi trường",
  "5.1": "Giải quyết các vấn đề kỹ thuật",
  "5.2": "Xác định nhu cầu và giải pháp công nghệ",
  "5.3": "Sử dụng sáng tạo công nghệ số",
  "5.4": "Xác định các vấn đề cần cải thiện về năng lực số",
  "6.1": "Hiểu biết về AI",
  "6.2": "Sử dụng AI có đạo đức và trách nhiệm",
  "6.3": "Đánh giá các công cụ AI"
};
export function aiCompetenciesForGrade(grade: string) {
  const prefix = `${Number(grade.match(/\d+/)?.[0])}.`;
  return Object.fromEntries(Object.entries(AI_COMPETENCIES).filter(([code]) => code.startsWith(prefix)));
}
export function competencyCode(value: string): string | undefined {
  return value.match(/^\[([^\]]+)\]\s+\S/)?.[1];
}
export function validCompetency(value: string, catalog: Record<string,string>): boolean {
  const code = competencyCode(value);
  return !!code && Object.prototype.hasOwnProperty.call(catalog, code);
}
export function competencyInstructions(grade: string, nls: boolean, ai: boolean): string {
  return `Mã năng lực phải lấy đúng từ danh mục dưới đây; không tự đặt mã, không dùng số hiệu văn bản làm mã năng lực.
${nls ? `NLS: ${JSON.stringify(DIGITAL_COMPETENCIES)}. Dùng mã năng lực thành phần của TT 02/2025, không tự nối CB/TC/NC khi chưa có bảng chỉ báo xác minh.` : ''}
${ai ? `AI đúng ${grade}, QĐ 2422/QĐ-BGDĐT: ${JSON.stringify(aiCompetenciesForGrade(grade))}` : ''}
Mỗi mục digitalCompetencies/aiCompetencies viết dạng [mã] Tên hoặc yêu cầu năng lực — Biểu hiện cụ thể trong bài — Hoạt động thực hiện — Minh chứng đánh giá.
Chọn 1–3 mã thực sự phù hợp mỗi nhóm được bật. Phần sau mã phải đúng nghĩa của mã, đúng lớp; không gán năng lực chỉ vì dùng một công cụ.
Gắn lại chính mã đã chọn dưới dạng [mã] ở nhiệm vụ GV/HS hoặc sản phẩm của hoạt động thực sự rèn năng lực đó. Không chèn HTML hay Markdown màu; ứng dụng tự tô đỏ.
NLS miền 6 và mã giáo dục AI là hai hệ khác nhau. Giữ mã khi soạn bằng tiếng Anh.`;
}

export function competencySegments(text: string): {text:string; isCode:boolean}[] {
  return text.split(/(\[[^\]\n]+\])/g).filter(Boolean).map(part=>({
    text:part,
    isCode: /^\[.+\]$/.test(part) && Object.prototype.hasOwnProperty.call({...DIGITAL_COMPETENCIES,...AI_COMPETENCIES},part.slice(1,-1)),
  }));
}
