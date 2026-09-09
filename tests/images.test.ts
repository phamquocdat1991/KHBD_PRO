import { afterEach, expect, it, vi } from 'vitest';
import { GeminiService } from '../src/services/geminiService';
import { SAMPLE_LESSONS } from '../src/data/sampleLessons';

afterEach(() => vi.unstubAllGlobals());
const idea = { id: 'i1', activityId: SAMPLE_LESSONS[0].activities[0].id, title: 'Hình minh họa', purpose: 'Quan sát', prompt: 'Vẽ dụng cụ học tập', caption: 'Dụng cụ' };
it('returns image bytes rather than the accompanying text', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{text:'Đây là ảnh'}, {inlineData:{mimeType:'image/png',data:'iVBORw0KGgo='}}] }, finishReason:'STOP' }] }))));
  const result = await GeminiService.generateLessonImage(SAMPLE_LESSONS[0], idea, 'test-key');
  expect(result).toBe('data:image/png;base64,iVBORw0KGgo=');
});
it('rejects text-only output instead of claiming an image was generated', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{text:'Hãy vẽ một cái cây'}] }, finishReason:'STOP' }] }))));
  await expect(GeminiService.generateLessonImage(SAMPLE_LESSONS[0], idea, 'test-key')).rejects.toThrow(/không trả.*ảnh/i);
});
it('reports quota errors and never retries a billable request automatically', async () => {
  const fetcher = vi.fn().mockResolvedValue(new Response('{}', {status:429}));
  vi.stubGlobal('fetch', fetcher);
  await expect(GeminiService.generateLessonImage(SAMPLE_LESSONS[0], idea, 'test-key')).rejects.toThrow(/hạn mức/i);
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it('rejects suggestions targeting an activity outside the lesson', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify([{...idea,activityId:'unknown'}])}]},finishReason:'STOP'}]}))));
  await expect(GeminiService.suggestLessonImages(SAMPLE_LESSONS[0], 'test-key', 'gemini-2.5-flash')).rejects.toThrow(/vị trí/i);
});
