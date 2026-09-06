import { competencySegments } from './competencyService';
import {Document,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,AlignmentType,BorderStyle,Packer} from 'docx';
import {saveAs} from 'file-saver';
import {LessonPlan,TeacherProfile} from '../types';
import {stepLabels,tableHeaders,stepTime} from './lessonPresentation';

export class DocxExportService {
  static async exportLessonPlanToDocx(lesson:LessonPlan,teacher?:TeacherProfile|null):Promise<void> {
    const en=lesson.language==='en';
    const tr=(vi:string,english:string)=>en?english:vi;
    const p=(text:string,bold=false,center=false,color='000000')=>new Paragraph({alignment:center?AlignmentType.CENTER:AlignmentType.LEFT,spacing:{after:100},children:text.split('\n').flatMap((line,i)=>competencySegments(line || ' ').map((part,j)=>new TextRun({text:part.text,bold,color:part.isCode?'FF0000':color,font:'Times New Roman',size:24,...(i&&j===0?{break:1}:{})})))});
    const list=(values:string[]|undefined,color='000000')=>(values||[]).map(v=>p(`• ${v}`,false,false,color));
    const border={style:BorderStyle.SINGLE,size:4,color:'000000'};
    const cell=(texts:string[],bold=false)=>new TableCell({borders:{top:border,bottom:border,left:border,right:border},children:texts.map(t=>p(t,bold)),...(bold?{shading:{fill:'F3F4F6'}}:{})});
    const children:(Paragraph|Table)[]=[
      p(teacher?.schoolName||tr('TÊN TRƯỜNG','SCHOOL NAME'),true,true),p(teacher?.department||tr('TỔ CHUYÊN MÔN','DEPARTMENT'),true,true),
      p(tr('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM','SOCIALIST REPUBLIC OF VIETNAM'),true,true),p(tr('Độc lập - Tự do - Hạnh phúc','Independence - Freedom - Happiness'),true,true),
      p(`${tr('Giáo viên','Teacher')}: ${teacher?.name||'................................'}`),p(`${tr('Ngày soạn','Date')}: ${new Date(lesson.createdAt).toLocaleDateString('vi-VN')}`),
      p(`${tr('KẾ HOẠCH BÀI DẠY','LESSON PLAN')}: ${lesson.title}`,true,true),p(`${lesson.subject}; ${lesson.grade} (${lesson.textbook})`,false,true),p(`${lesson.periodsCount} ${tr('tiết','periods')}`,false,true),
      p(tr('I. MỤC TIÊU','I. OBJECTIVES'),true),p(tr('1. Về kiến thức:','1. Knowledge:'),true),...list(lesson.objectives.knowledge),
      p(tr('2. Về năng lực:','2. Competencies:'),true),p(tr('Năng lực chung:','General competencies:'),true),...list(lesson.objectives.generalCompetencies),
      p(tr('Năng lực đặc thù:','Subject competencies:'),true),...list(lesson.objectives.specificCompetencies),
    ];
    if(lesson.options.nls)children.push(p(tr('Năng lực số:','Digital competencies:'),true,false,'FF0000'),...list(lesson.objectives.digitalCompetencies,'FF0000'));
    if(lesson.options.aiEducation)children.push(p(tr('Năng lực AI:','AI competencies:'),true,false,'FF0000'),...list(lesson.objectives.aiCompetencies,'FF0000'));
    if(lesson.options.stemLesson)children.push(p(tr('Năng lực STEM:','STEM competencies:'),true),...list(lesson.objectives.stemCompetencies));
    children.push(p(tr('3. Về phẩm chất:','3. Qualities:'),true),...list(lesson.objectives.qualities),
      p(tr('II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU','II. EQUIPMENT AND MATERIALS'),true),p(tr('1. Giáo viên:','1. Teacher:'),true),...list(lesson.teachingEquipment.teacher),p(tr('2. Học sinh:','2. Students:'),true),...list(lesson.teachingEquipment.student),
      p(tr('III. TIẾN TRÌNH DẠY HỌC','III. LEARNING ACTIVITIES'),true),p(`${tr('Phương pháp','Method')}: ${lesson.options.teachingMethod}`));
    const labels=stepLabels(en),headers=tableHeaders(lesson);
    for(const a of lesson.activities){
      children.push(p(a.title+(lesson.options.timeline&&a.durationMinutes?` (${a.durationMinutes} ${tr('phút','minutes')})`:''),true),p(`${tr('a) Mục tiêu:','a) Objective:')} ${a.objective}`),p(`${tr('b) Nội dung:','b) Content:')} ${a.content}`),p(`${tr('c) Sản phẩm:','c) Product:')} ${a.product}`),p(tr('d) Tổ chức thực hiện:','d) Implementation:'),true));
      const rows=[new TableRow({tableHeader:true,children:headers.map(h=>cell([h],true))})];
      labels.forEach((pair,i)=>{
        const teacherText=a.implementation[`step${i+1}Teacher` as keyof typeof a.implementation];
        const studentText=a.implementation[`step${i+1}Student` as keyof typeof a.implementation];
        if(lesson.tableFormat==='1col'){children.push(p(pair[0],true),p(teacherText),p(pair[1],true),p(studentText));return;}
        const cells=[cell([pair[0],teacherText]),cell([pair[1],studentText])];
        if(lesson.tableFormat==='4col')cells.unshift(cell([lesson.options.timeline?`${stepTime(a,i)} ${tr('phút','min')}`:'—']));
        if(lesson.tableFormat==='3col'||lesson.tableFormat==='4col')cells.push(cell([i===0?a.product:'']));
        rows.push(new TableRow({children:cells}));
      });
      if(lesson.tableFormat!=='1col')children.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},columnWidths:Array(headers.length).fill(Math.floor(9300/headers.length)),rows}));
    }
    if(lesson.options.worksheets&&lesson.worksheetsAppendix?.length)children.push(p(tr('PHỤ LỤC: PHIẾU HỌC TẬP','APPENDIX: WORKSHEETS'),true),...lesson.worksheetsAppendix.map(w=>p(w)));
    const doc=new Document({sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1134,bottom:1134,left:1417,right:1134}}},children}]});
    const blob=await Packer.toBlob(doc);
    saveAs(blob,`KHBD_${lesson.title.replace(/[^\p{L}\p{N}\s]/gu,'').trim().replace(/\s+/g,'_')||'Bai_day'}.docx`);
  }
}
