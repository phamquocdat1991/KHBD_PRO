import type { AdvancedOptions, GradeLevel, LessonLanguage, Subject, TableFormat, TextbookEdition } from '../types';
export const DRAFT_KEY = 'khbd_studio_draft_v1';
export const SUBJECTS: Subject[] = ['Toán', 'Ngữ văn', 'Tiếng Anh', 'Khoa học tự nhiên', 'Vật lí', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lí', 'Lịch sử và Địa lí', 'Tin học', 'Công nghệ', 'Giáo dục công dân', 'Giáo dục kinh tế và pháp luật', 'Giáo dục thể chất', 'Âm nhạc', 'Mĩ thuật', 'Hoạt động trải nghiệm, hướng nghiệp'];
export const TEXTBOOKS: TextbookEdition[] = ['Kết nối tri thức với cuộc sống', 'Cánh Diều', 'Chân trời sáng tạo', 'Bộ sách hiện hành khác'];
export const DEFAULT_OPTIONS: AdvancedOptions = {
  nls: true, aiEducation: true, stemLesson: false,
  teachingMethod: 'Phương pháp dạy học tích cực',
  warmupType: 'Khởi động sôi nổi (Trò chơi / Hoạt náo tương tác)',
  customIntegration: '', gdqpan: false, timeline: true, mathFormulas: true, worksheets: true,
};
export interface StudioDraft {
  version: 1; title: string; subject: Subject; grade: GradeLevel; textbook: TextbookEdition;
  periodsCount: number; tableFormat: TableFormat; language: LessonLanguage; coreContent: string; options: AdvancedOptions;
}
export function readStudioDraft(): StudioDraft | null {
  try {
    const value = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (!value || value.version !== 1 || typeof value.title !== 'string' || typeof value.coreContent !== 'string'
      || !SUBJECTS.includes(value.subject) || !TEXTBOOKS.includes(value.textbook)
      || !/^Lớp ([1-9]|1[0-2])$/.test(value.grade) || ![1,2,3,4].includes(value.periodsCount)
      || !['1col','2col','3col','4col'].includes(value.tableFormat) || !['vi','en'].includes(value.language)
      || !value.options || Object.entries(DEFAULT_OPTIONS).some(([key, fallback]) => typeof value.options[key] !== typeof fallback)) return null;
    // Pick only known fields: a draft never restores credentials or source-file bytes.
    const options = Object.fromEntries(Object.keys(DEFAULT_OPTIONS).map(key => [key, value.options[key]])) as unknown as AdvancedOptions;
    return { version: 1, title: value.title, subject: value.subject, grade: value.grade, textbook: value.textbook,
      periodsCount: value.periodsCount, tableFormat: value.tableFormat, language: value.language, coreContent: value.coreContent, options };
  } catch { return null; }
}
