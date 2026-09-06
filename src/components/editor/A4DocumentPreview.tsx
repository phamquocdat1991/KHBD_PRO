import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';
import { useAuth } from '../../context/AuthContext';
import { FloatingActionDock } from './FloatingActionDock';
import { Edit3, Check, Sparkles } from 'lucide-react';
import { stepLabels, tableHeaders, stepTime } from '../../services/lessonPresentation';
import { LessonPlan } from '../../types';

export const A4DocumentPreview: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeLesson, updateActiveLesson } = useLesson();
  const [isEditing, setIsEditing] = useState(false);
  if (!activeLesson) return <div className="flex flex-col items-center p-12 text-slate-400"><Sparkles className="w-12 h-12 mb-3"/><p>Chưa có bài dạy nào được chọn. Hãy chọn từ Thư viện hoặc Soạn bài mới.</p></div>;
  const lesson = activeLesson;
  const en = lesson.language === 'en';
  const tr = (vi:string,english:string)=>en?english:vi;
  const labels = stepLabels(en);
  const headers = tableHeaders(lesson);
  function save(path:(string|number)[], value:string) {
    if (!value.trim()) return;
    const copy = structuredClone(lesson);
    let target:any=copy;
    path.slice(0,-1).forEach(key=>{target=target[key];});
    target[path[path.length-1]]=value.trim();
    updateActiveLesson({[path[0]]:copy[path[0] as keyof LessonPlan]});
  }
  const editable = (value:string,path:(string|number)[]) => <span
    contentEditable={isEditing} suppressContentEditableWarning
    role={isEditing?'textbox':undefined} aria-label={isEditing?path.join('.'):undefined}
    onBlur={e=>{const text=e.currentTarget.innerText??e.currentTarget.textContent??''; if(text.trim())save(path,text);else e.currentTarget.textContent=value;}}
    onPaste={e=>{if(!isEditing)return; e.preventDefault(); const text=e.clipboardData.getData('text/plain'); const selection=window.getSelection(); if(selection?.rangeCount){const range=selection.getRangeAt(0);range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range);}}}
    className={`whitespace-pre-line ${isEditing?'outline-none rounded bg-sky-50 focus:ring-2 focus:ring-sky-400':''}`}>{value}</span>;
  const list=(values:string[]|undefined,path:string[]) => <ul className="list-disc pl-6 space-y-1">{values?.map((v,i)=><li key={i}>{editable(v,[...path,i])}</li>)}</ul>;
  const steps=(index:number) => labels.map((pair,i)=>{
    const a=lesson.activities[index];
    return <tr key={i} className="align-top">
      {lesson.tableFormat==='4col'&&<td className="border border-black p-2">{lesson.options.timeline?`${stepTime(a,i)} ${tr('phút','min')}`:'—'}</td>}
      {(['Teacher','Student'] as const).map((role,j)=><td key={role} className="border border-black p-2.5"><div className="font-bold mb-1">{pair[j]}</div>{editable(a.implementation[`step${i+1}${role}` as keyof typeof a.implementation],['activities',index,'implementation',`step${i+1}${role}`])}</td>)}
      {(lesson.tableFormat==='3col'||lesson.tableFormat==='4col')&&<td className="border border-black p-2">{i===0?editable(a.product,['activities',index,'product']):''}</td>}
    </tr>;
  });
  return <div className="flex flex-col items-center w-full">
    <FloatingActionDock/>
    <div className="flex flex-wrap items-center justify-between w-full max-w-[210mm] mb-2 no-print gap-2 text-xs">
      <span>{tr('Ngôn ngữ: Tiếng Việt','Language: English')} · {lesson.attachmentsCount||0} {tr('tài liệu nguồn','source files')}</span>
      <button onClick={()=>setIsEditing(!isEditing)} className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sky-800">
        {isEditing?<Check className="w-4 h-4"/>:<Edit3 className="w-4 h-4"/>}{isEditing?'Xong chỉnh sửa':'Bật chỉnh sửa trực tiếp'}
      </button>
    </div>
    {isEditing&&<p className="no-print text-xs text-sky-700 mb-3">Bấm vào nội dung cần sửa. Thay đổi được lưu khi rời ô và dùng cho bản xuất Word, sao chép, in/PDF.</p>}
    <div className="w-full overflow-x-auto print-document-wrap">
      <article className="a4-document-sheet rounded-md mx-auto select-text">
        <div className="grid grid-cols-2 gap-4 pb-4 mb-4 text-center border-b border-gray-300 text-[11pt]">
          <div><div className="font-bold uppercase">{currentUser?.schoolName||tr('TÊN TRƯỜNG','SCHOOL NAME')}</div><div className="font-bold uppercase underline">{currentUser?.department||tr('TỔ CHUYÊN MÔN','DEPARTMENT')}</div><div className="italic">{tr('Họ tên GV','Teacher')}: {currentUser?.name||'................................'}</div></div>
          <div><div className="font-bold">{tr('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM','SOCIALIST REPUBLIC OF VIETNAM')}</div><div className="font-bold underline">{tr('Độc lập - Tự do - Hạnh phúc','Independence - Freedom - Happiness')}</div><div className="italic">{tr('Ngày soạn','Date')}: {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</div></div>
        </div>
        <div className="text-center my-6"><h1 className="text-[16pt] font-bold uppercase">{tr('KẾ HOẠCH BÀI DẠY','LESSON PLAN')}: {editable(lesson.title,['title'])}</h1><p className="italic text-[12pt]">{lesson.subject}; {lesson.grade} ({lesson.textbook})</p><p className="italic text-[11pt]">{tr('Thời lượng thực hiện','Duration')}: {lesson.periodsCount} {tr('tiết','periods')}</p></div>
        <section className="space-y-3 mb-5">
          <h2 className="font-bold text-[13pt]">{tr('I. MỤC TIÊU','I. OBJECTIVES')}</h2>
          <h3 className="font-bold">{tr('1. Về kiến thức:','1. Knowledge:')}</h3>{list(lesson.objectives.knowledge,['objectives','knowledge'])}
          <h3 className="font-bold">{tr('2. Về năng lực:','2. Competencies:')}</h3>
          <strong>{tr('a) Năng lực chung:','a) General competencies:')}</strong>{list(lesson.objectives.generalCompetencies,['objectives','generalCompetencies'])}
          <strong>{tr('b) Năng lực đặc thù:','b) Subject competencies:')}</strong>{list(lesson.objectives.specificCompetencies,['objectives','specificCompetencies'])}
          {lesson.options.nls&&<><strong>{tr('Năng lực số:','Digital competencies:')}</strong>{list(lesson.objectives.digitalCompetencies,['objectives','digitalCompetencies'])}</>}
          {lesson.options.aiEducation&&<><strong>{tr('Năng lực AI:','AI competencies:')}</strong>{list(lesson.objectives.aiCompetencies,['objectives','aiCompetencies'])}</>}
          {lesson.options.stemLesson&&<><strong>{tr('Năng lực STEM:','STEM competencies:')}</strong>{list(lesson.objectives.stemCompetencies,['objectives','stemCompetencies'])}</>}
          <h3 className="font-bold">{tr('3. Về phẩm chất:','3. Qualities:')}</h3>{list(lesson.objectives.qualities,['objectives','qualities'])}
        </section>
        <section className="space-y-2 mb-5"><h2 className="font-bold text-[13pt]">{tr('II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU','II. EQUIPMENT AND MATERIALS')}</h2><strong>{tr('1. Giáo viên:','1. Teacher:')}</strong>{list(lesson.teachingEquipment.teacher,['teachingEquipment','teacher'])}<strong>{tr('2. Học sinh:','2. Students:')}</strong>{list(lesson.teachingEquipment.student,['teachingEquipment','student'])}</section>
        <section className="space-y-5"><h2 className="font-bold text-[13pt]">{tr('III. TIẾN TRÌNH DẠY HỌC','III. LEARNING ACTIVITIES')}</h2><p className="italic">{tr('Phương pháp','Method')}: {lesson.options.teachingMethod}</p>
          {lesson.activities.map((a,index)=><div key={a.id} className="space-y-2"><h3 className="font-bold bg-gray-100 p-2 border border-black">{editable(a.title,['activities',index,'title'])}{lesson.options.timeline&&a.durationMinutes?` (${a.durationMinutes} ${tr('phút','minutes')})`:''}</h3>
            {(['objective','content','product'] as const).map((field,i)=><div key={field}><strong>{[tr('a) Mục tiêu: ','a) Objective: '),tr('b) Nội dung: ','b) Content: '),tr('c) Sản phẩm: ','c) Product: ')][i]}</strong>{editable(a[field],['activities',index,field])}</div>)}
            <h4 className="font-bold">{tr('d) Tổ chức thực hiện:','d) Implementation:')}</h4>
            {lesson.tableFormat==='1col'?<div className="space-y-3">{labels.map((pair,i)=><div key={i} className="border border-black p-3">{(['Teacher','Student'] as const).map((role,j)=><div key={role}><strong>{pair[j]}: </strong>{editable(a.implementation[`step${i+1}${role}` as keyof typeof a.implementation],['activities',index,'implementation',`step${i+1}${role}`])}</div>)}</div>)}</div>:<table className="w-full border-collapse border border-black text-[11pt] table-fixed"><thead><tr>{headers.map(h=><th key={h} className="border border-black p-2 bg-gray-100">{h}</th>)}</tr></thead><tbody>{steps(index)}</tbody></table>}
          </div>)}
        </section>
        {lesson.options.worksheets&&<section className="mt-8 pt-4 border-t-2 border-black space-y-4"><h2 className="font-bold text-center">{tr('PHỤ LỤC: PHIẾU HỌC TẬP','APPENDIX: WORKSHEETS')}</h2>{lesson.worksheetsAppendix?.length?lesson.worksheetsAppendix.map((w,i)=><div key={i} className="border border-dashed border-gray-600 p-4 whitespace-pre-line">{editable(w,['worksheetsAppendix',i])}</div>):<p>{tr('Bài này chưa có nội dung phiếu học tập đã lưu.','This lesson has no saved worksheets.')}</p>}</section>}
        <footer className="mt-10 pt-4 border-t text-center text-[10pt] italic">Phát triển bởi: Anh Giáo PHẠM QUỐC ĐẠT</footer>
      </article>
    </div>
  </div>;
};
