import {LessonPlan, PedagogicalActivity} from '../types';
export function stepLabels(english:boolean) {
  return english ? [
    ['Step 1: Assign task','Step 1: Receive task'],['Step 2: Guide and support','Step 2: Perform task'],
    ['Step 3: Organize reports','Step 3: Report and discuss'],['Step 4: Assess and conclude','Step 4: Consolidate learning'],
  ] : [
    ['Bước 1: Chuyển giao nhiệm vụ','Bước 1: Tiếp nhận nhiệm vụ'],['Bước 2: Theo dõi, hỗ trợ','Bước 2: Thực hiện nhiệm vụ'],
    ['Bước 3: Tổ chức báo cáo','Bước 3: Báo cáo, thảo luận'],['Bước 4: Kết luận, nhận định','Bước 4: Ghi nhận kiến thức'],
  ];
}
export function tableHeaders(lesson:LessonPlan):string[] {
  const en=lesson.language==='en';
  const pair=en?['TEACHER ACTIVITIES','STUDENT ACTIVITIES']:['HOẠT ĐỘNG CỦA GIÁO VIÊN','HOẠT ĐỘNG CỦA HỌC SINH'];
  return lesson.tableFormat==='4col'?[en?'TIME':'THỜI GIAN',...pair,en?'PRODUCT':'SẢN PHẨM']:
    lesson.tableFormat==='3col'?[...pair,en?'PRODUCT':'SẢN PHẨM']:pair;
}
export function stepTime(activity:PedagogicalActivity,index:number) {
  const minutes=activity.durationMinutes||0;
  return Math.floor(minutes/4)+(index<minutes%4?1:0);
}
export function lessonPlainText(lesson:LessonPlan):string {
  const en=lesson.language==='en';
  const lines=[`${en?'LESSON PLAN':'KẾ HOẠCH BÀI DẠY'}: ${lesson.title}`,`${lesson.subject} — ${lesson.grade} — ${lesson.textbook}`,`${lesson.periodsCount} ${en?'periods':'tiết'}`,en?'I. OBJECTIVES':'I. MỤC TIÊU'];
  lines.push(...lesson.objectives.knowledge,...lesson.objectives.generalCompetencies,...lesson.objectives.specificCompetencies);
  if(lesson.options.nls)lines.push(...lesson.objectives.digitalCompetencies||[]);
  if(lesson.options.aiEducation)lines.push(...lesson.objectives.aiCompetencies||[]);
  if(lesson.options.stemLesson)lines.push(...lesson.objectives.stemCompetencies||[]);
  lines.push(...lesson.objectives.qualities,en?'II. EQUIPMENT AND MATERIALS':'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU',...lesson.teachingEquipment.teacher,...lesson.teachingEquipment.student,en?'III. LEARNING ACTIVITIES':'III. TIẾN TRÌNH DẠY HỌC');
  const labels=stepLabels(en);
  for(const a of lesson.activities){
    lines.push(a.title+(lesson.options.timeline&&a.durationMinutes?` (${a.durationMinutes} ${en?'minutes':'phút'})`:''),a.objective,a.content,a.product);
    labels.forEach((pair,i)=>{lines.push(`${pair[0]}: ${a.implementation[`step${i+1}Teacher` as keyof typeof a.implementation]}`,`${pair[1]}: ${a.implementation[`step${i+1}Student` as keyof typeof a.implementation]}`);});
  }
  if(lesson.options.worksheets&&lesson.worksheetsAppendix?.length)lines.push(en?'APPENDIX: WORKSHEETS':'PHỤ LỤC: PHIẾU HỌC TẬP',...lesson.worksheetsAppendix);
  return lines.join('\n\n');
}
