import { afterEach, describe, expect, it, vi } from 'vitest';
import { GeminiService, GenerateParams } from '../src/services/geminiService';
import { SAMPLE_LESSONS } from '../src/data/sampleLessons';

import {params,aiResult} from './fixtures';
function respond(result = aiResult(), finishReason = 'STOP') {
  return new Response(JSON.stringify({ candidates: [{ finishReason, content: { role: 'model', parts: [{ text: JSON.stringify(result) }] } }] }), {status: 200});
}
afterEach(() => vi.unstubAllGlobals());
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
