export type GradeLevel = 
  | 'Lớp 1' | 'Lớp 2' | 'Lớp 3' | 'Lớp 4' | 'Lớp 5'
  | 'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9'
  | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';

export type Subject = 
  | 'Toán' | 'Ngữ văn' | 'Tiếng Anh' | 'Khoa học tự nhiên'
  | 'Vật lí' | 'Hóa học' | 'Sinh học' | 'Lịch sử' | 'Địa lí'
  | 'Lịch sử và Địa lí' | 'Tin học' | 'Công nghệ'
  | 'Giáo dục công dân' | 'Giáo dục kinh tế và pháp luật'
  | 'Giáo dục thể chất' | 'Âm nhạc' | 'Mĩ thuật'
  | 'Hoạt động trải nghiệm, hướng nghiệp';

export type TextbookEdition = 
  | 'Kết nối tri thức với cuộc sống'
  | 'Cánh Diều'
  | 'Chân trời sáng tạo'
  | 'Bộ sách hiện hành khác';

export type TableFormat = 
  | '2col' // Bảng 2 Cột (GV ↔ HS chuẩn CV 5512)
  | '3col' // Bảng 3 Cột (GV - HS - Sản phẩm)
  | '4col' // Bảng 4 Cột (TG - GV - HS - SP)
  | '1col'; // Dạng 1 cột phân đoạn

export type LessonLanguage = 'vi' | 'en';

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  schoolName: string;
  department: string; // Tổ chuyên môn
  province: string;
  role: 'teacher' | 'head_of_department' | 'admin';
  authProvider: 'google' | 'email' | 'byok_guest';
}

export interface AdvancedOptions {
  nls: boolean; // Tích hợp NLS thông tư 02/2025 & CV 3456/BGDĐT
  aiEducation: boolean; // Tích hợp giáo dục AI Khung QĐ 2422/QĐ-BGDĐT
  stemLesson: boolean; // Giáo án bài học STEM CV 3089/908
  teachingMethod: string; // Phương pháp dạy học (Dạy học khám phá, Bàn tay nặn bột, Dạy học giải quyết vấn đề, v.v.)
  warmupType: string; // Hình thức Khởi động (Trò chơi tương tác, Video tình huống, Đố vui, Thí nghiệm...)
  customIntegration: string; // Tích hợp nội dung khác: nhập yêu cầu vào
  gdqpan: boolean; // Giáo dục Quốc phòng & An ninh (TT 08/2024)
  timeline: boolean; // Phân bổ thời gian chi tiết
  mathFormulas: boolean; // Hỗ trợ công thức Toán/Ký hiệu Hóa học Unicode
  worksheets: boolean; // Tạo phiếu học tập kèm theo
}

export interface PedagogicalActivity {
  id: string;
  activityNumber: number;
  title: string; // Hoạt động 1: Khởi động, Hoạt động 2: Hình thành kiến thức...
  durationMinutes?: number;
  objective: string; // a) Mục tiêu
  content: string; // b) Nội dung
  product: string; // c) Sản phẩm
  implementation: { // d) Tổ chức thực hiện (4 bước)
    step1Teacher: string; // Bước 1: Chuyển giao nhiệm vụ
    step1Student: string; // Bước 1: Tiếp nhận nhiệm vụ
    step2Teacher: string; // Bước 2: Theo dõi, hỗ trợ
    step2Student: string; // Bước 2: Thực hiện nhiệm vụ
    step3Teacher: string; // Bước 3: Tổ chức báo cáo
    step3Student: string; // Bước 3: Báo cáo, thảo luận
    step4Teacher: string; // Bước 4: Kết luận, nhận định
    step4Student: string; // Bước 4: Ghi nhận kiến thức
  };
}

export interface MindmapNode {
  id: string;
  label: string;
  children?: MindmapNode[];
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  notesForTeacher?: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: Subject;
  grade: GradeLevel;
  textbook: TextbookEdition;
  periodsCount: number; // Số tiết
  splitPeriod?: number; // Tiết thứ mấy
  tableFormat: TableFormat;
  language: LessonLanguage; // Tiếng Việt hoặc Tiếng Anh
  options: AdvancedOptions;
  coreContent: string;
  attachmentsCount?: number;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed' | 'reviewed';

  // Structure CV 5512
  objectives: {
    knowledge: string[];
    generalCompetencies: string[]; // Năng lực chung (Tự chủ, Giao tiếp, Giải quyết vấn đề)
    specificCompetencies: string[]; // Năng lực đặc thù môn học
    digitalCompetencies?: string[]; // Năng lực số (TT 02/2025 & CV 3456)
    aiCompetencies?: string[]; // Năng lực AI (QĐ 2422/QĐ-BGDĐT)
    stemCompetencies?: string[]; // Năng lực STEM (CV 3089/908)
    qualities: string[]; // Phẩm chất (Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm)
  };
  teachingEquipment: {
    teacher: string[];
    student: string[];
  };
  activities: PedagogicalActivity[];
  worksheetsAppendix?: string[]; // Phiếu học tập phụ lục
  
  // AI Generated Extras
  mindmap?: MindmapNode;
  slides?: SlideItem[];
}

export type GeminiModelId = 'gemini-3.8-flash' | 'gemini-3.6-flash' | 'gemini-2.5-flash';

export interface GeminiModelInfo {
  id: GeminiModelId;
  name: string;
  badge: string;
  description: string;
}
