import { expect, it } from 'vitest';
import { illustrationSvg, validateIllustrations } from '../src/services/illustrationService';
it('escapes AI labels and rejects executable or unbounded primitives', () => {
  const f={caption:'Hình',elements:[{kind:'text' as const,x:20,y:30,x2:20,y2:30,text:'<script>alert(1)</script>'}]};
  expect(illustrationSvg(f)).not.toContain('<script>');
  expect(illustrationSvg(f)).toContain('&lt;script&gt;');
  expect(()=>validateIllustrations([{...f,elements:[{...f.elements[0],x:Infinity}]}])).toThrow();
  expect(()=>validateIllustrations([{...f,elements:[{...f.elements[0],kind:'image'}]}])).toThrow();
});
