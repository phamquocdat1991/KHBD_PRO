import {saveAs} from 'file-saver';
import {LessonPlan} from '../types';

export class PptxExportService {
  static async exportSlideDeck(lesson:LessonPlan):Promise<void> {
    if(!lesson.slides?.length) throw new Error('Chưa có kịch bản slide cho bài dạy này.');
    const {default:PptxGenJS}=await import('pptxgenjs');
    const deck=new PptxGenJS();
    deck.layout='LAYOUT_WIDE';
    deck.author='KHBD AI PRO'; deck.subject=lesson.subject; deck.title=lesson.title;
    deck.theme={headFontFace:'Arial',bodyFontFace:'Arial'};
    for(const item of lesson.slides){
      const slide=deck.addSlide();slide.background={color:'F8FAFC'};
      slide.addText(item.title,{x:0.7,y:0.5,w:11.9,h:1.0,fontSize:28,bold:true,color:'0F172A',breakLine:false,fit:'shrink'});
      if(item.subtitle)slide.addText(item.subtitle,{x:0.7,y:1.6,w:11.9,h:0.55,fontSize:17,color:'475569',fit:'shrink'});
      slide.addText(item.bullets.map(text=>({text,options:{bullet:{indent:20},hanging:4,breakLine:true}})),{x:0.9,y:2.3,w:11.5,h:4.2,fontSize:22,color:'1E293B',paraSpaceAfter:14,fit:'shrink',valign:'top'});
      slide.addText(`${item.slideNumber} · ${lesson.subject} · ${lesson.grade}`,{x:0.7,y:7.0,w:11.9,h:0.25,fontSize:10,color:'64748B'});
      if(item.notesForTeacher)slide.addNotes(item.notesForTeacher);
    }
    const blob=await deck.write({outputType:'blob'}) as Blob;
    saveAs(blob,`Slide_BaiGiang_${lesson.title.replace(/[^\p{L}\p{N}\s]/gu,'').trim().replace(/\s+/g,'_')||'Bai_day'}.pptx`);
  }
}
