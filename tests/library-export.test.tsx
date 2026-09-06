// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import { SAMPLE_LESSONS } from '../src/data/sampleLessons';

vi.mock('file-saver', () => ({saveAs: () => { throw new Error('Browser download unavailable'); }}));
beforeEach(() => { localStorage.clear(); localStorage.setItem('khbd_library_v2', JSON.stringify(SAMPLE_LESSONS)); });
afterEach(cleanup);

it('shows a recoverable error when a Word download fails from the library', async () => {
  render(<App/>);
  fireEvent.click(screen.getByRole('button', {name:/Thư Viện Bài Dạy/}));
  fireEvent.click(screen.getAllByTitle('Xuất Word .DOCX')[0]);
  await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/Không xuất được Word/), {timeout:5000});
  expect(JSON.parse(localStorage.getItem('khbd_library_v2')!)).toHaveLength(3);
  expect(screen.getByRole('heading', {name:/Kho Kế Hoạch Bài Dạy/})).not.toBeNull();
});
