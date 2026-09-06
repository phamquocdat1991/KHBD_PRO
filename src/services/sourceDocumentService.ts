export interface SourceDocument {
  name: string;
  size: number;
  mimeType: string;
  text?: string;
  data?: string;
}
export const MAX_SOURCE_BYTES = 40 * 1024 * 1024;
export const SOURCE_ACCEPT = '.pdf,.docx,.txt,.md,.png,.jpg,.jpeg';

function readFile(file: File, mode: 'text' | 'arrayBuffer' | 'dataURL'): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reader.onabort = () => reject(new Error(`Không đọc được tệp ${file.name}. Hãy chọn lại tệp.`));
    reader.onload = () => resolve(reader.result as string | ArrayBuffer);
    if (mode === 'text') reader.readAsText(file, 'UTF-8');
    else if (mode === 'arrayBuffer') reader.readAsArrayBuffer(file);
    else reader.readAsDataURL(file);
  });
}

export async function prepareSourceDocument(file: File): Promise<SourceDocument> {
  if (!file.size) throw new Error(`Tệp ${file.name} rỗng.`);
  if (file.size > MAX_SOURCE_BYTES) throw new Error(`Tệp ${file.name} vượt quá 40 MB.`);
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'txt' || ext === 'md') {
    const text = (await readFile(file, 'text') as string).trim();
    if (!text || text.includes('\u0000')) throw new Error(`Tệp ${file.name} không có văn bản UTF-8 đọc được.`);
    return { name: file.name, size: file.size, mimeType: 'text/plain', text };
  }
  if (ext === 'docx') {
    try {
      const mammoth = await import('mammoth/mammoth.browser');
      const arrayBuffer = await readFile(file, 'arrayBuffer') as ArrayBuffer;
      const {default: JSZip} = await import('jszip');
      const archive = await JSZip.loadAsync(arrayBuffer);
      const xml = await archive.file('word/document.xml')?.async('string');
      const hasUnsupportedMedia = Object.keys(archive.files).some(path => /^word\/(media|charts|embeddings)\/.+/.test(path) && !archive.files[path].dir);
      if (hasUnsupportedMedia || /<(?:\w+:)?(?:oMath|oMathPara|OLEObject)\b/.test(xml || '')) {
        throw new Error('DOCX_UNSUPPORTED_CONTENT');
      }
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      if (!text) throw new Error('empty');
      return {name:file.name,size:file.size,mimeType:'text/plain',text};
    } catch {
      throw new Error(`Không trích xuất được chữ từ ${file.name}. Word có ảnh, biểu đồ hoặc công thức đặc biệt cần xuất PDF hoặc tải ảnh gốc để AI đọc đầy đủ.`);
    }
  }
  const mimeTypes = {pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg'};
  const mimeType = mimeTypes[ext as keyof typeof mimeTypes];
  if (!mimeType) throw new Error(`Chưa hỗ trợ ${file.name}. Hãy dùng PDF, DOCX, TXT, MD, PNG hoặc JPG.`);
  const signature = new Uint8Array(await readFile(file.slice(0, 8) as File, 'arrayBuffer') as ArrayBuffer);
  const valid = ext === 'pdf' ? String.fromCharCode(...signature.slice(0,5)) === '%PDF-'
    : ext === 'png' ? [137,80,78,71,13,10,26,10].every((n,i)=>signature[i]===n)
    : signature[0]===255 && signature[1]===216 && signature[2]===255;
  if (!valid) throw new Error(`Nội dung ${file.name} không đúng định dạng ${ext?.toUpperCase()}.`);
  const encoded = await readFile(file, 'dataURL') as string;
  return { name:file.name, size:file.size, mimeType, data:encoded.slice(encoded.indexOf(',')+1) };
}

export function sourceText(coreContent: string, documents: SourceDocument[] = []): string {
  return [coreContent.trim(), ...documents.filter(d=>d.text).map(d=>`[Tài liệu: ${d.name}]\n${d.text}\n[Hết tài liệu]`)].filter(Boolean).join('\n\n');
}
