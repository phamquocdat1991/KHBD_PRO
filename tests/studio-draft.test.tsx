// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import { DRAFT_KEY, readStudioDraft } from '../src/services/studioDraft';
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('restores the chosen subject, text and pedagogical switches after a reload without storing the API key', () => {
  localStorage.setItem('khbd_byok_api_key_v2', 'private-test-key');
  const first = render(<App />);
  fireEvent.change(screen.getByLabelText('Tên bài dạy'), { target: { value: 'Bài nháp cần giữ' } });
  fireEvent.click(screen.getByRole('button', { name: /KHTNThực hành/ }));
  fireEvent.click(screen.getByRole('checkbox', { name: /Tích hợp Năng lực số/ }));
  fireEvent.change(screen.getByPlaceholderText(/Dán nội dung trọng tâm/), { target: { value: 'Nội dung từ giáo viên' } });
  const saved = localStorage.getItem(DRAFT_KEY)!;
  expect(saved).not.toContain('private-test-key');
  expect(saved).not.toContain('sourceDocuments');
  first.unmount();
  render(<App />);
  expect((screen.getByLabelText('Tên bài dạy') as HTMLInputElement).value).toBe('Bài nháp cần giữ');
  expect((screen.getByRole('combobox', { name: 'Môn học' }) as HTMLSelectElement).value).toBe('Khoa học tự nhiên');
  expect((screen.getByRole('checkbox', { name: /Tích hợp Năng lực số/ }) as HTMLInputElement).checked).toBe(false);
  expect((screen.getByPlaceholderText(/Dán nội dung trọng tâm/) as HTMLTextAreaElement).value).toBe('Nội dung từ giáo viên');
});

it('ignores corrupt or incompatible draft storage instead of breaking the studio', () => {
  for (const invalid of ['{broken', '{"version":2}', '{"version":1,"options":null}']) {
    localStorage.setItem(DRAFT_KEY, invalid);
    expect(readStudioDraft()).toBeNull();
  }
  render(<App />);
  expect((screen.getByLabelText('Tên bài dạy') as HTMLInputElement).value).toBe('');
});

it('reports a failed draft write while leaving text editable', () => {
  const original = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
    if (key === DRAFT_KEY) throw new DOMException('Quota exceeded', 'QuotaExceededError');
    return original.call(this, key, value);
  });
  render(<App />);
  fireEvent.change(screen.getByLabelText('Tên bài dạy'), { target: { value: 'Vẫn soạn được' } });
  expect(screen.getByRole('status').textContent).toContain('Chưa lưu được nháp');
  expect((screen.getByLabelText('Tên bài dạy') as HTMLInputElement).value).toBe('Vẫn soạn được');
});

it('opens an empty subject folder with the correct filter and preserves the draft on return', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Tên bài dạy'), { target: { value: 'Không mất nháp' } });
  fireEvent.click(screen.getByRole('button', { name: 'KHTN0' }));
  expect(screen.getByRole('heading', { name: /Kho Kế Hoạch Bài Dạy/ })).not.toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Studio Soạn Bài' }));
  expect((screen.getByLabelText('Tên bài dạy') as HTMLInputElement).value).toBe('Không mất nháp');
});

it('sends an inline Copilot question with the active lesson context and renders the API response', async () => {
  localStorage.setItem('khbd_byok_api_key_v2', 'private-test-key');
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Gợi ý hoạt động được kiểm thử 487' }] } }] })));
  vi.stubGlobal('fetch', fetchMock);
  render(<App />);
  fireEvent.change(screen.getByLabelText('Câu hỏi cho trợ lý sư phạm'), { target: { value: 'Gợi ý khởi động cho bài này' } });
  fireEvent.click(screen.getByRole('button', { name: 'Gửi câu hỏi AI' }));
  await waitFor(() => expect(screen.getByText('Gợi ý hoạt động được kiểm thử 487')).not.toBeNull());
  expect(JSON.stringify(fetchMock.mock.calls)).toContain('Phương trình lượng giác cơ bản');
});
