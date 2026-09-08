import {expect,it,vi,beforeEach} from 'vitest';
import JSZip from 'jszip';
import {DocxExportService} from '../src/services/docxExportService';
import {PptxExportService} from '../src/services/pptxExportService';
import {SAMPLE_LESSONS} from '../src/data/sampleLessons';
import 'fake-indexeddb/auto';
import {saveImage} from '../src/services/imageStore';
const saved = vi.hoisted(()=>({blob:null as Blob|null,name:''}));
vi.mock('file-saver',()=>({saveAs:(blob:Blob,name:string)=>{saved.blob=blob;saved.name=name;}}));
beforeEach(()=>{saved.blob=null;saved.name='';});
it('downloads a real PPTX archive with slide text',async()=>{
  await PptxExportService.exportSlideDeck(SAMPLE_LESSONS[0]);
  expect(saved.name).toMatch(/\.pptx$/);
  const zip=await JSZip.loadAsync(await saved.blob!.arrayBuffer());
  expect(zip.file('ppt/presentation.xml')).not.toBeNull();
  expect(await zip.file('ppt/slides/slide1.xml')!.async('string')).toContain('LƯỢNG GIÁC');
});
it.each(['1col','2col','3col','4col'] as const)('exports %s and the real worksheet appendix',async tableFormat=>{
  await DocxExportService.exportLessonPlanToDocx({...SAMPLE_LESSONS[0],tableFormat,worksheetsAppendix:['WORKSHEET-934: Khay A có nước.']});
  const zip=await JSZip.loadAsync(await saved.blob!.arrayBuffer());
  const xml=await zip.file('word/document.xml')!.async('string');
  expect(xml).toContain('WORKSHEET-934');
  const widths=xml.match(/<w:gridCol /g)||[];
  expect(widths.length).toBe(tableFormat==='1col'?0:4*Number(tableFormat[0]));
  expect(xml).toContain('sin');
});
it('exports English labels when English is selected',async()=>{
  await DocxExportService.exportLessonPlanToDocx({...SAMPLE_LESSONS[0],language:'en'});
  const zip=await JSZip.loadAsync(await saved.blob!.arrayBuffer());
  expect(await zip.file('word/document.xml')!.async('string')).toContain('I. OBJECTIVES');
});
it('embeds inserted image bytes and captions in Word',async()=>{
  const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=';
  const assetId=await saveImage('data:image/png;base64,'+png);
  vi.stubGlobal('Image',class {naturalWidth=1;naturalHeight=1;onload:()=>void;set src(_:string){queueMicrotask(()=>this.onload());}});
  try {
    await DocxExportService.exportLessonPlanToDocx({...SAMPLE_LESSONS[0],images:[{id:'i',activityId:SAMPLE_LESSONS[0].activities[0].id,title:'Hình',purpose:'Quan sát',prompt:'Vẽ',caption:'IMAGE-CAPTION-41',assetId,inserted:true}]});
    const zip=await JSZip.loadAsync(await saved.blob!.arrayBuffer());
    const media=Object.keys(zip.files).find(name=>name.startsWith('word/media/')&&name.endsWith('.png'))!;
    expect(await zip.file(media)!.async('base64')).toBe(png);
    expect(await zip.file('word/document.xml')!.async('string')).toContain('IMAGE-CAPTION-41');
  } finally {vi.unstubAllGlobals();}
});
