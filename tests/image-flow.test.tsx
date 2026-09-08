// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import React from 'react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import App from '../src/App';
import {SAMPLE_LESSONS} from '../src/data/sampleLessons';
import {loadImage} from '../src/services/imageStore';
import {AuthProvider} from '../src/context/AuthContext';
import {LessonProvider,useLesson} from '../src/context/LessonContext';
import {LessonImagesPanel} from '../src/components/studio/LessonImagesPanel';

beforeEach(()=>{localStorage.clear();localStorage.setItem('khbd_byok_api_key_v2','test-key');});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('requires approval, inserts an image, and restores it after remount without another API call',async()=>{
  const idea={activityId:SAMPLE_LESSONS[0].activities[0].id,title:'Quan sát hình',purpose:'So sánh',prompt:'Một hình minh họa',caption:'Chú thích hình'};
  let calls=0;
  vi.stubGlobal('fetch',async()=>{
    calls++;
    return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:calls===1?[{text:JSON.stringify([idea])}]:[{inlineData:{mimeType:'image/png',data:'iVBORw0KGgo='}}]}}]})};
  });
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'Hình minh họa'}));
  fireEvent.click(screen.getByRole('button',{name:'Gợi ý hình cho bài này'}));
  await screen.findByRole('button',{name:'Duyệt tạo ảnh'});
  expect(calls).toBe(1);
  expect(screen.queryByRole('img',{name:idea.title})).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Duyệt tạo ảnh'}));
  await screen.findByRole('button',{name:'Chèn vào hoạt động'});
  fireEvent.click(screen.getByRole('button',{name:'Chèn vào hoạt động'}));
  await waitFor(()=>expect(screen.getAllByRole('img',{name:idea.title})).toHaveLength(2));
  const stored=JSON.parse(localStorage.getItem('khbd_library_v2')!)[0].images[0];
  expect(stored.inserted).toBe(true);
  expect(localStorage.getItem('khbd_library_v2')).not.toContain('base64');
  expect(await loadImage(stored.assetId)).toBe('data:image/png;base64,iVBORw0KGgo=');
  cleanup();render(<App/>);
  await screen.findByRole('img',{name:idea.title});
  expect(calls).toBe(2);
});
it('keeps the paid-request lock when switching away and back to a lesson',async()=>{
  const idea={id:'image-navigation',activityId:SAMPLE_LESSONS[0].activities[0].id,title:'Ảnh chờ',purpose:'Quan sát',prompt:'Vẽ',caption:'Ảnh'};
  localStorage.setItem('khbd_library_v2',JSON.stringify([{...SAMPLE_LESSONS[0],images:[idea]},SAMPLE_LESSONS[1]]));
  let finish:(value:unknown)=>void;
  const response=new Promise(resolve=>{finish=resolve;});
  let calls=0;
  vi.stubGlobal('fetch',()=>{calls++;return response;});
  function Harness(){const {activeLesson,setActiveLesson,library}=useLesson();return <><button onClick={()=>setActiveLesson(library[0])}>Bài A</button><button onClick={()=>setActiveLesson(library[1])}>Bài B</button><LessonImagesPanel key={activeLesson?.id}/></>;}
  render(<AuthProvider><LessonProvider><Harness/></LessonProvider></AuthProvider>);
  fireEvent.click(screen.getByRole('button',{name:'Duyệt tạo ảnh'}));
  fireEvent.click(screen.getByRole('button',{name:'Bài B'}));
  fireEvent.click(screen.getByRole('button',{name:'Bài A'}));
  expect((screen.getByRole('button',{name:'Đang tạo ảnh…'}) as HTMLButtonElement).disabled).toBe(true);
  finish!({ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{inlineData:{mimeType:'image/png',data:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII='}}]}}]})});
  await screen.findByRole('button',{name:'Chèn vào hoạt động'});
  expect(calls).toBe(1);
  expect(JSON.parse(localStorage.getItem('khbd_library_v2')!)[0].images[0].assetId).toBeTruthy();
});
