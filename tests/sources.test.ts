// @vitest-environment jsdom
import {expect,it} from 'vitest';
import {Document,Paragraph,Packer} from 'docx';
import {prepareSourceDocument,sourceText} from '../src/services/sourceDocumentService';
it('extracts DOCX text from the actual archive including text at the end',async()=>{
  const buffer=await Packer.toBuffer(new Document({sections:[{children:[new Paragraph('SOURCE-FIRST-491'),new Paragraph('Nước và không khí. SOURCE-LAST-739')]}]}));
  const file=new File([new Uint8Array(buffer)],'lesson.docx',{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  const document=await prepareSourceDocument(file);
  expect(document.text).toContain('SOURCE-FIRST-491');
  expect(document.text).toContain('SOURCE-LAST-739');
  expect(sourceText('GHI-CHU-271',[document])).toContain('SOURCE-LAST-739');
});
it.each([
  ['source.pdf','application/pdf','%PDF-1.4\nSOURCE-PDF-934'],
  ['page.png','image/png',new Uint8Array([137,80,78,71,13,10,26,10,0,0])],
  ['page.jpg','image/jpeg',new Uint8Array([255,216,255,224,0,0])],
] as const)('keeps binary bytes and media type for %s',async(name,mimeType,content)=>{
  const file=new File([content],name,{type:mimeType});
  const doc=await prepareSourceDocument(file);
  expect(doc.mimeType).toBe(mimeType);
  const raw=atob(doc.data!);
  expect(raw.length).toBe(file.size);
  expect(doc.text).toBeUndefined();
});
it.each([['empty.txt',''],['bad.pdf','not a pdf'],['bad.docx','bad zip'],['file.exe','binary']])('rejects unreadable %s instead of making a fake source notice',async(name,content)=>{
  await expect(prepareSourceDocument(new File([content],name))).rejects.toThrow();
});
it('rejects a file beyond the advertised size limit before reading it',async()=>{
  const f=new File(['x'],'large.txt');Object.defineProperty(f,'size',{value:40*1024*1024+1});
  await expect(prepareSourceDocument(f)).rejects.toThrow(/40 MB/);
});
it('retains UTF-8 text without losing trailing source material',async()=>{
  const doc=await prepareSourceDocument(new File(['Đầu\nHẾT-NGUỒN-295'],'source.txt'));
  expect(doc.text).toBe('Đầu\nHẾT-NGUỒN-295');
});

it('does not accept partial text when a DOCX contains embedded textbook images',async()=>{
  const JSZip=(await import('jszip')).default;
  const buffer=await Packer.toBuffer(new Document({sections:[{children:[new Paragraph('Title only: content is in an image')]}]}));
  const zip=await JSZip.loadAsync(buffer);zip.file('word/media/book-page.png',new Uint8Array([137,80,78,71,13,10,26,10]));
  const docx=await zip.generateAsync({type:'uint8array'});
  await expect(prepareSourceDocument(new File([docx],'scanned-word.docx'))).rejects.toThrow(/PDF/);
});
