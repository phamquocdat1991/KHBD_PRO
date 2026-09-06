// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import { SAMPLE_LESSONS } from '../src/data/sampleLessons';
vi.mock('canvas-confetti',()=>({default:vi.fn()}));

beforeEach(() => {localStorage.clear(); localStorage.setItem('khbd_library_v2', JSON.stringify(SAMPLE_LESSONS));});
afterEach(() => {cleanup(); vi.unstubAllGlobals();});
it('opens the new-lesson form from the sidebar', () => {
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'+ Soạn Bài Dạy Mới',exact:true}));
  expect(screen.queryByRole('heading',{name:'Cấu Hình Kế Hoạch Bài Dạy Mới'})).not.toBeNull();
});
it('keeps an intentionally empty library empty after reload', () => {
  localStorage.setItem('khbd_library_v2','[]');
  render(<App/>);
  expect(screen.queryAllByText('Phương trình lượng giác cơ bản',{exact:true})).toHaveLength(0);
});
it('does not restore a signed-out profile on reload', () => {
  localStorage.removeItem('khbd_current_user_v2');
  render(<App/>);
  expect(screen.queryByRole('button',{name:/Thầy Nguyễn Nam Thầy Nguyễn Nam/})).toBeNull();
});
it('removes the legacy built-in demo teacher instead of presenting it as a real login', () => {
  localStorage.setItem('khbd_current_user_v2', JSON.stringify({
    id: 'teacher-default', name: 'Thầy Nguyễn Nam', email: 'nguyennam@hanoi-amsterdam.edu.vn',
    schoolName: 'THPT Chuyên Hà Nội - Amsterdam', department: 'Tổ Toán - Tin học', province: 'Hà Nội',
    avatarUrl: 'demo', role: 'teacher', authProvider: 'google',
  }));
  render(<App/>);
  expect(screen.queryByRole('button',{name:/Thầy Nguyễn Nam/})).toBeNull();
  expect(screen.getByRole('button',{name:'Đăng Nhập'})).not.toBeNull();
});
it('shows missing API key errors in the form and does not add a lesson', async () => {
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'Soạn Bài Dạy Mới',exact:true}));
  fireEvent.change(screen.getByPlaceholderText(/Ví dụ: Phương trình lượng giác/),{target:{value:'Bài kiểm thử nguồn'}});
  fireEvent.click(screen.getByRole('button',{name:/Tạo Kế Hoạch Bài Dạy Với AI/}));
  await waitFor(()=>expect(screen.queryByRole('alert')?.textContent).toMatch(/API Key/i),{timeout:5000});
  expect(JSON.parse(localStorage.getItem('khbd_library_v2')!).length).toBe(3);
});
it('persists an edited objective to lesson data', async () => {
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'Bật chỉnh sửa trực tiếp'}));
  const text = screen.getByText(SAMPLE_LESSONS[0].objectives.knowledge[0],{exact:true});
  text.textContent = 'Nội dung đã chỉnh sửa — EDIT-943';
  fireEvent.blur(text);
  await waitFor(()=>expect(JSON.parse(localStorage.getItem('khbd_library_v2')!)[0].objectives.knowledge[0]).toBe('Nội dung đã chỉnh sửa — EDIT-943'));
});

it('generates from uploaded DOCX, PDF and entered text through the real form/context/service chain', async () => {
  const {Document,Paragraph,Packer}=await import('docx');
  const {aiResult}=await import('./fixtures');
  localStorage.setItem('khbd_byok_api_key_v2','test-key-not-a-real-secret');
  let request:any;
  vi.stubGlobal('fetch',vi.fn(async(_url,init)=>{
    request=JSON.parse(init.body);
    return new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{role:'model',parts:[{text:JSON.stringify({...aiResult(),aiCompetencies:['[11.A1.1] Thực hiện quy trình sử dụng AI an toàn.'],activities:aiResult().activities.map(a=>({...a,product:a.product+' [11.A1.1]'}))})}]}}]}));
  }));
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'Soạn Bài Dạy Mới',exact:true}));
  fireEvent.change(screen.getByPlaceholderText(/Ví dụ: Phương trình lượng giác/),{target:{value:'Bài kiểm thử nguồn'}});
  fireEvent.change(screen.getByPlaceholderText(/Dán nội dung trọng tâm/),{target:{value:'TYPED-829-GROUNDING'}});
  const docx=await Packer.toBuffer(new Document({sections:[{children:[new Paragraph('DOCX-END-284-GROUNDING')]}]}));
  fireEvent.change(screen.getByLabelText('Chọn tài liệu nguồn'),{target:{files:[new File([new Uint8Array(docx)],'input.docx'),new File(['%PDF-1.4\nPDF-BYTES-246'],'input.pdf')]}});
  await waitFor(()=>expect(screen.getByText(/Đã chuẩn bị 2 tệp/)).not.toBeNull());
  fireEvent.click(screen.getByRole('button',{name:/Tạo Kế Hoạch Bài Dạy Với AI/}));
  await waitFor(()=>expect(screen.getByRole('heading',{name:/KẾ HOẠCH BÀI DẠY: Bài kiểm thử nguồn/})).not.toBeNull());
  const parts=request.contents[0].parts;
  expect(JSON.stringify(parts)).toContain('TYPED-829-GROUNDING');
  expect(JSON.stringify(parts)).toContain('DOCX-END-284-GROUNDING');
  expect(atob(parts.find((p:any)=>p.inlineData).inlineData.data)).toBe('%PDF-1.4\nPDF-BYTES-246');
  const stored=JSON.parse(localStorage.getItem('khbd_library_v2')!);
  expect(stored).toHaveLength(4);
  expect(stored[0].coreContent).toContain('DOCX-END-284-GROUNDING');
  expect(JSON.stringify(stored[0])).not.toContain('test-key-not-a-real-secret');
  expect(screen.getByText('So sánh khay A, B, C — SOURCE-58319.')).not.toBeNull();
});

it('prevents generation after a failed upload until the teacher corrects or skips it',async()=>{
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'Soạn Bài Dạy Mới',exact:true}));
  fireEvent.change(screen.getByLabelText('Chọn tài liệu nguồn'),{target:{files:[new File(['invalid'],'broken.pdf')]}});
  await waitFor(()=>expect(screen.getByRole('alert').textContent).toMatch(/broken.pdf/));
  expect((screen.getByRole('button',{name:/Tạo Kế Hoạch Bài Dạy Với AI/}) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('button',{name:'Bỏ qua tệp lỗi'}));
  expect((screen.getByRole('button',{name:/Tạo Kế Hoạch Bài Dạy Với AI/}) as HTMLButtonElement).disabled).toBe(false);
});

it('removes selected source bytes when its attachment is removed',async()=>{
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'Soạn Bài Dạy Mới',exact:true}));
  fireEvent.change(screen.getByLabelText('Chọn tài liệu nguồn'),{target:{files:[new File(['REMOVE-ONLY-694'],'remove.txt')]}});
  await waitFor(()=>expect(screen.getByRole('button',{name:'Bỏ tệp remove.txt'})).not.toBeNull());
  fireEvent.click(screen.getByRole('button',{name:'Bỏ tệp remove.txt'}));
  expect(screen.queryByRole('button',{name:'Bỏ tệp remove.txt'})).toBeNull();
});

it('preserves entered source and attachments while visiting preview and library',async()=>{
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'Soạn Bài Dạy Mới',exact:true}));
  fireEvent.change(screen.getByPlaceholderText(/Dán nội dung trọng tâm/),{target:{value:'KEEP-DRAFT-456'}});
  fireEvent.change(screen.getByLabelText('Chọn tài liệu nguồn'),{target:{files:[new File(['KEEP-SOURCE-289'],'keep.txt')]}});
  await waitFor(()=>expect(screen.getByRole('button',{name:'Bỏ tệp keep.txt'})).not.toBeNull());
  fireEvent.click(screen.getByRole('button',{name:'Xem & Biên Tập Trang A4'}));
  fireEvent.click(screen.getByRole('button',{name:/Thư Viện Bài Dạy/}));
  fireEvent.click(screen.getByRole('button',{name:'Studio Soạn Bài'}));
  fireEvent.click(screen.getByRole('button',{name:'Soạn Bài Dạy Mới',exact:true}));
  expect((screen.getByPlaceholderText(/Dán nội dung trọng tâm/) as HTMLTextAreaElement).value).toBe('KEEP-DRAFT-456');
  expect(screen.getByRole('button',{name:'Bỏ tệp keep.txt'})).not.toBeNull();
});
it('offers only the fixed Ket noi tri thuc textbook for new lessons',()=>{
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'Soạn Bài Dạy Mới',exact:true}));
  expect(screen.queryByRole('button',{name:'Cánh Diều',exact:true})).toBeNull();
  expect(screen.queryByRole('button',{name:'Chân trời sáng tạo',exact:true})).toBeNull();
  expect(screen.queryByRole('button',{name:'Bộ sách hiện hành khác',exact:true})).toBeNull();
});
it('marks both competency sections red on the A4 document',()=>{
  render(<App/>);
  for(const text of ['Năng lực số:','Năng lực AI:']){
    expect(screen.getByText(text,{exact:true}).closest('[data-competency]')?.getAttribute('style')).toContain('color: rgb(255, 0, 0)');
  }
});
