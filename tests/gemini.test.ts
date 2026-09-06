import { afterEach, describe, expect, it, vi } from 'vitest';
import { GeminiService, GenerateParams } from '../src/services/geminiService';
import { SAMPLE_LESSONS } from '../src/data/sampleLessons';

import {params,aiResult} from './fixtures';
function respond(result = aiResult(), finishReason = 'STOP') {
  return new Response(JSON.stringify({ candidates: [{ finishReason, content: { role: 'model', parts: [{ text: JSON.stringify(result) }] } }] }), {status: 200});
}
afterEach(() => vi.unstubAllGlobals());
it('requests a schema with four complete activities and required selected appendices', async () => {
  let request: any;
  vi.stubGlobal('fetch', vi.fn(async (_url, init) => { request=JSON.parse(init.body); return respond(); }));
  await GeminiService.generateLessonPlan(params);
  const schema = request.generationConfig.responseJsonSchema;
  expect(schema).toBeDefined();
  const success = schema.anyOf.find((branch:any) => branch.properties.activities);
  expect(success.properties.activities).toMatchObject({type:'array',minItems:4,maxItems:4});
  expect(success.properties.activities.items.required).toContain('step4Student');
  expect(success.required).toEqual(expect.arrayContaining(['mindmap','slides','worksheetsAppendix','digitalCompetencies']));
  expect(success.properties.worksheetsAppendix.minItems).toBe(1);
  expect(schema.anyOf.some((branch:any) => branch.required?.includes('error'))).toBe(true);
});
it('identifies missing selected competencies in an incomplete AI response', async () => {
  vi.stubGlobal('fetch',vi.fn(async()=>respond({...aiResult(),digitalCompetencies:[]})));
  await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow(/năng lực số/i);
});
it('handles null activities as an invalid answer with a useful error', async () => {
  vi.stubGlobal('fetch',vi.fn(async()=>respond({...aiResult(),activities:[null,null,null,null]} as any)));
  await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow(/hoạt động/i);
});
it('preserves source-reading refusals instead of requiring a fabricated lesson', async () => {
  vi.stubGlobal('fetch',vi.fn(async()=>respond({error:'Không đọc được source.pdf'} as any)));
  await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow(/Không đọc được source.pdf/);
});
describe('Gemini source grounding and failure handling', () => {
  it('refuses generation without a key instead of saving a fabricated completed lesson', async () => {
    await expect(GeminiService.generateLessonPlan({...params, apiKey: ''})).rejects.toThrow(/API Key/i);
  });
  it.each([400, 403, 404, 429, 500])('surfaces HTTP %s without substituting a template', async status => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', {status})));
    await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow();
  });
  it('passes entered content and PDF/image bytes to Gemini and preserves generated worksheets', async () => {
    let request: any;
    let url = '';
    vi.stubGlobal('fetch', vi.fn(async (input, init) => { url = String(input); request = JSON.parse(init.body); return respond(); }));
    const result = await GeminiService.generateLessonPlan({ ...params, sourceDocuments: [
      {name:'source.pdf',size:12,mimeType:'application/pdf',data:'JVBERi0xLjQK'},
      {name:'page.png',size:12,mimeType:'image/png',data:'iVBORw0KGgo='},
    ] } as GenerateParams);
    expect(JSON.stringify(request.contents)).toContain('SOURCE-58319');
    expect(request.contents[0].parts).toContainEqual({inlineData:{mimeType:'application/pdf',data:'JVBERi0xLjQK'}});
    expect(request.contents[0].parts).toContainEqual({inlineData:{mimeType:'image/png',data:'iVBORw0KGgo='}});
    expect(url).not.toContain(params.apiKey);
    expect(result.worksheetsAppendix).toEqual(['So sánh khay A, B, C — SOURCE-58319.']);
    expect(result.attachmentsCount).toBe(2);
    expect(result.activities.reduce((n,a)=>n+(a.durationMinutes||0),0)).toBe(90);
  });
  it('rejects a truncated or malformed answer rather than filling it with generic activities', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respond(aiResult(), 'MAX_TOKENS')));
    await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow();
    vi.stubGlobal('fetch', vi.fn(async () => respond({...aiResult(), activities:[{title:'...'}]} as any)));
    await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow();
  });
  it('rejects invalid JSON and empty/safety-blocked replies', async () => {
    for (const body of [
      {candidates:[{finishReason:'STOP',content:{parts:[{text:'not JSON'}]}}]},
      {promptFeedback:{blockReason:'SAFETY'}},
      {candidates:[{finishReason:'STOP',content:{parts:[]}}]},
    ]) {
      vi.stubGlobal('fetch', vi.fn(async()=>new Response(JSON.stringify(body))));
      await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow();
    }
  });
});

it('uses a Gemini 3.8 request without deprecated sampling parameters',async()=>{
  vi.stubGlobal('fetch',vi.fn(async(_url,init)=>{
    const config=JSON.parse(init.body).generationConfig;
    return config.temperature!==undefined?new Response('{}',{status:400}):new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(aiResult())}]}}]}));
  }));
  await expect(GeminiService.generateLessonPlan({...params,modelId:'gemini-3.8-flash'})).resolves.toMatchObject({title:'Sự nảy mầm'});
});
it('answers a Copilot question using the selected lesson and surfaces errors',async()=>{
  let request:any;
  vi.stubGlobal('fetch',vi.fn(async(_url,init)=>{request=JSON.parse(init.body);return new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:'Câu trả lời kiểm thử từ nguồn.'}]}}]}));}));
  const result=await GeminiService.answerLessonQuestion({...SAMPLE_LESSONS[0],coreContent:'CONTEXT-COPILOT-528'},'Giải thích nguồn này','test-key','gemini-3.8-flash');
  expect(JSON.stringify(request.contents)).toContain('CONTEXT-COPILOT-528');
  expect(result).toBe('Câu trả lời kiểm thử từ nguồn.');
  await expect(GeminiService.answerLessonQuestion(SAMPLE_LESSONS[0],'Hỏi nguồn','','gemini-3.8-flash')).rejects.toThrow(/API Key/);
});

it('rejects uncoded competencies instead of saving an unverifiable mapping',async()=>{
  vi.stubGlobal('fetch',vi.fn(async()=>respond({...aiResult(),digitalCompetencies:['Biết sử dụng máy tính.']})));
  await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow(/mã năng lực số/i);
});
it('rejects a made-up AI code or a code from another grade',async()=>{
  for(const code of ['6.Z9.999','8.A1.2']){
    vi.stubGlobal('fetch',vi.fn(async()=>respond({...aiResult(),aiCompetencies:[`[${code}] Kiểm chứng kết quả.`]})));
    await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow(/mã.*AI/i);
  }
});
it('rejects very sparse activities even when all JSON fields exist',async()=>{
  const result=aiResult();
  result.activities=result.activities.map(a=>({...a,content:'Học kiến thức mới.',product:'Bài làm.',...Object.fromEntries(Object.keys(a.implementation).map(k=>[k,'Thực hiện nhiệm vụ.']))}));
  vi.stubGlobal('fetch',vi.fn(async()=>respond(result)));
  await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow(/chi tiết/i);
});
it('does not silently rewrite minutes while keeping contradictory lesson instructions',async()=>{
  const result=aiResult();result.activities=result.activities.map(a=>({...a,durationMinutes:2}));
  vi.stubGlobal('fetch',vi.fn(async()=>respond(result)));
  await expect(GeminiService.generateLessonPlan(params)).rejects.toThrow(/thời lượng/i);
});
it('repairs a sparse first draft once, preserving sources and returning the complete lesson',async()=>{
  const sparse=aiResult();sparse.activities=sparse.activities.map(a=>({...a,step1Teacher:'...'}));
  const fetchMock=vi.fn().mockResolvedValueOnce(respond(sparse)).mockResolvedValueOnce(respond());
  vi.stubGlobal('fetch',fetchMock);
  const lesson=await GeminiService.generateLessonPlan(params);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  const repair=JSON.parse(fetchMock.mock.calls[1][1].body);
  expect(JSON.stringify(repair.contents)).toContain('SOURCE-58319');
  expect(lesson.activities).toHaveLength(4);
  expect(lesson.textbook).toBe('Kết nối tri thức với cuộc sống');
});
it('does not require competencies or minutes when the teacher disabled them',async()=>{
  const result={...aiResult(),digitalCompetencies:[],aiCompetencies:[],activities:aiResult().activities.map(a=>({...a,durationMinutes:undefined}))};
  vi.stubGlobal('fetch',vi.fn(async()=>respond(result)));
  const lesson=await GeminiService.generateLessonPlan({...params,options:{...params.options,nls:false,aiEducation:false,timeline:false}});
  expect(lesson.objectives.digitalCompetencies).toBeUndefined();
  expect(lesson.activities[0].durationMinutes).toBeUndefined();
});
