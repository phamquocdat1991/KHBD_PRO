import { GenerateParams } from '../src/services/geminiService';
import { SAMPLE_LESSONS } from '../src/data/sampleLessons';
export const params: GenerateParams = {
  ...SAMPLE_LESSONS[0], title: 'Sự nảy mầm', subject: 'Khoa học tự nhiên', grade: 'Lớp 6',
  coreContent: 'SOURCE-58319: Ba khay hạt đậu, nước và không khí.', apiKey: 'test-key-not-a-real-secret',
};
export function aiResult() {
  const s = SAMPLE_LESSONS[0];
  return {
    knowledgeObjectives: ['Giải thích SOURCE-58319 từ ba khay hạt đậu.'],
    generalCompetencies: s.objectives.generalCompetencies, specificCompetencies: s.objectives.specificCompetencies,
    digitalCompetencies: ['Đọc bảng số liệu.'], aiCompetencies: ['Kiểm tra câu trả lời AI.'], stemCompetencies: [],
    qualities: s.objectives.qualities, equipmentTeacher: s.teachingEquipment.teacher, equipmentStudent: s.teachingEquipment.student,
    activities: s.activities.map(a => ({ ...a, ...a.implementation, illustrations: [] })),
    worksheetsAppendix: ['So sánh khay A, B, C — SOURCE-58319.'], mindmap: s.mindmap, slides: s.slides,
  };
}
