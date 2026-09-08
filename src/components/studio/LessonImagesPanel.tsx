import React from 'react';
import {useLesson} from '../../context/LessonContext';
import {useAuth} from '../../context/AuthContext';
import {GeminiService} from '../../services/geminiService';
import {saveImage} from '../../services/imageStore';
import {LessonImageFigure} from '../editor/LessonImageFigure';
import {LessonImage} from '../../types';

export function LessonImagesPanel() {
  const {activeLesson,library,selectedModel,updateLessonImages,imageJob:busy,startImageJob,finishImageJob,imageRecovery,setImageRecovery,imageError:error,setImageError:setError} = useLesson();
  const {geminiApiKey} = useAuth();
  if(!activeLesson) return <div><p className="text-sm text-slate-500">Hãy mở hoặc soạn bài dạy để gợi ý hình.</p>{imageRecovery && <><a href={imageRecovery.data} download="hinh-minh-hoa.png">Tải ảnh chưa lưu về</a><button onClick={()=>setImageRecovery(null)}>Đã tải ảnh — bỏ bản chưa lưu</button></>}</div>;
  const lesson = activeLesson;
  const pending = imageRecovery;
  const images = lesson.images || [];
  const change = (id:string,patch:Partial<LessonImage>) => updateLessonImages(lesson.id,previous=>previous.map(i => i.id===id?{...i,...patch}:i));
  async function run(id:string, task:()=>Promise<void>) {
    if(imageRecovery && id!=='save') {setError('Có ảnh chưa lưu. Hãy mở lại bài vừa tạo ảnh để tải về hoặc thử lưu lại.');return;}
    if(!startImageJob(id))return;
    setError('');
    try {await task();} catch(e) {setError(e instanceof Error?e.message:'Không xử lý được ảnh. Hãy thử lại.');}
    finally {finishImageJob();}
  }
  async function persist(idea:LessonImage,data:string,targetId=lesson.id) {
    if(!library.some(item=>item.id===targetId))throw new Error('Bài chứa ảnh đã bị xóa. Hãy tải ảnh về rồi bỏ bản chưa lưu.');
    const assetId=await saveImage(data);
    updateLessonImages(targetId,previous=>previous.map(item=>item.id===idea.id?{...item,assetId,inserted:false}:item));
    setImageRecovery(null);
  }
  const button='px-3 py-2 rounded-lg bg-sky-700 text-white text-xs font-semibold disabled:opacity-50';
  return <section className="space-y-3" aria-label="Hình minh họa AI">
    <p className="text-xs text-slate-600">AI gợi ý vị trí cần hình. Thầy/cô duyệt từng hình trước khi tạo; xem ảnh rồi chèn vào bài. Tạo ảnh dùng hạn mức API của thầy/cô và có thể phát sinh phí.</p>
    {!images.length && <button className={button} disabled={!!busy} onClick={()=>run('suggest',async()=>updateLessonImages(lesson.id,await GeminiService.suggestLessonImages(lesson,geminiApiKey,selectedModel)))}>{busy==='suggest'?'Đang gợi ý…':'Gợi ý hình cho bài này'}</button>}
    {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
    {pending && <div className="border border-amber-300 p-3 rounded-lg space-y-2"><p className="text-xs">Ảnh chưa lưu: {pending.idea.title}. Hãy tải ảnh về hoặc thử lưu lại, không cần gọi AI lần nữa.</p><img src={pending.data} alt={pending.idea.title}/><a href={pending.data} download="hinh-minh-hoa.png" className="underline text-sm">Tải ảnh về</a><button className={button} disabled={!!busy} onClick={()=>run('save',()=>persist(pending.idea,pending.data,pending.lessonId))}>Thử lưu lại</button><button className="text-xs underline" disabled={!!busy} onClick={()=>setImageRecovery(null)}>Đã tải ảnh — bỏ bản chưa lưu</button></div>}
    {images.map(idea=><div key={idea.id} className="border border-slate-200 rounded-xl p-3 space-y-2">
      <h3 className="text-sm font-bold">{idea.title}</h3>
      <p className="text-xs text-sky-800">Vị trí: {lesson.activities.find(a=>a.id===idea.activityId)?.title}</p>
      <p className="text-xs text-slate-600">{idea.purpose}</p>
      <label className="block text-xs">Mô tả hình<textarea aria-label={`Mô tả ${idea.title}`} disabled={!!busy || !!pending} value={idea.prompt} onChange={e=>change(idea.id,{prompt:e.target.value})} className="w-full min-h-24 border rounded-lg p-2 mt-1"/></label>
      {idea.assetId && <LessonImageFigure image={idea}/>}
      <div className="flex flex-wrap gap-2">
        <button className={button} disabled={!!busy || !!pending || !idea.prompt.trim()} onClick={()=>run(idea.id,async()=>{
          const data=await GeminiService.generateLessonImage(lesson,idea,geminiApiKey);
          setImageRecovery({lessonId:lesson.id,idea,data});
          await persist(idea,data);
        })}>{busy===idea.id?'Đang tạo ảnh…':idea.assetId?'Tạo lại ảnh':'Duyệt tạo ảnh'}</button>
        {idea.assetId && <button className="px-3 py-2 rounded-lg border text-xs" disabled={!!busy || !!pending} onClick={()=>change(idea.id,{inserted:!idea.inserted})}>{idea.inserted?'Bỏ ảnh khỏi bài':'Chèn vào hoạt động'}</button>}
      </div>
      {idea.inserted && <p className="text-xs text-emerald-700">Đã chèn — ảnh sẽ có trong bản xem và file Word.</p>}
    </div>)}
  </section>;
}
