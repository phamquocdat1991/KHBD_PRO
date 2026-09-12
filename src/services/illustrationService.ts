import { LessonIllustration } from '../types';

export function validateIllustrations(value: unknown): asserts value is LessonIllustration[] {
  if (!Array.isArray(value) || value.length > 2 || !value.every(f =>
    typeof f?.caption === 'string' && f.caption.trim() && f.caption.length <= 1000 &&
    Array.isArray(f.elements) && f.elements.length > 0 && f.elements.length <= 100 &&
    f.elements.every((e: any) => ['line','ellipse','rect','text'].includes(e?.kind) &&
      ['x','x2','y','y2'].every(k => Number.isFinite(e[k]) && e[k] >= 0 && e[k] <= (k.startsWith('x') ? 640 : 360)) &&
      typeof e.text === 'string' && e.text.length <= 200 &&
      (!['rect','ellipse'].includes(e.kind) || (e.x2 > e.x && e.y2 > e.y))))) {
    throw new Error('Hình minh họa AI sai cấu trúc. Hãy tạo lại hoặc tắt AI chèn hình minh họa.');
  }
}
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
export function illustrationSvg(figure: LessonIllustration): string {
  validateIllustrations([figure]);
  const shapes = figure.elements.map(e => {
    if (e.kind === 'text') return `<text x="${e.x}" y="${e.y}" font-family="Arial, sans-serif" font-size="16" fill="#172554">${escape(e.text)}</text>`;
    const style = 'fill="none" stroke="#172554" stroke-width="2"';
    if (e.kind === 'line') return `<line x1="${e.x}" y1="${e.y}" x2="${e.x2}" y2="${e.y2}" ${style}/>`;
    if (e.kind === 'rect') return `<rect x="${e.x}" y="${e.y}" width="${e.x2-e.x}" height="${e.y2-e.y}" ${style}/>`;
    return `<ellipse cx="${(e.x+e.x2)/2}" cy="${(e.y+e.y2)/2}" rx="${(e.x2-e.x)/2}" ry="${(e.y2-e.y)/2}" ${style}/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="white"/>${shapes}</svg>`;
}
export const illustrationUrl = (f: LessonIllustration) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(illustrationSvg(f))}`;
export async function illustrationPng(f: LessonIllustration): Promise<Uint8Array> {
  const image = new Image();
  await new Promise<void>((resolve, reject) => { image.onload=()=>resolve(); image.onerror=()=>reject(new Error('Không thể xuất hình minh họa.')); image.src=illustrationUrl(f); });
  const canvas=document.createElement('canvas'); canvas.width=1280; canvas.height=720;
  const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('Trình duyệt không hỗ trợ xuất hình.');
  ctx.drawImage(image,0,0,1280,720);
  const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Không thể chuyển hình sang PNG.')),'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}
