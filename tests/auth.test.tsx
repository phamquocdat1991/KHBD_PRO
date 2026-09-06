// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { LoginModal } from '../src/components/auth/LoginModal';

function Controls() {
  const auth = useAuth();
  return <>
    <button onClick={auth.openLoginModal}>Open login</button>
    <button onClick={() => { auth.logout(); auth.openLoginModal(); }}>Sign out</button>
    <button onClick={() => auth.setGeminiApiKey('updated-test-key')}>Update key</button>
    <output data-testid="signed-in">{String(auth.isAuthenticated)}</output>
  </>;
}
function setup() { render(<AuthProvider><Controls/><LoginModal/></AuthProvider>); }
beforeEach(() => localStorage.clear());
afterEach(cleanup);

it('clears the previous key from the login form after signing out', () => {
  setup();
  fireEvent.click(screen.getByText('Open login'));
  fireEvent.change(screen.getByLabelText('Gemini API Key'), {target:{value:'previous-test-key'}});
  fireEvent.click(screen.getByRole('button', {name:'Tiếp Tục Với Key Này'}));
  fireEvent.click(screen.getByText('Sign out'));
  expect(localStorage.getItem('khbd_byok_api_key_v2')).toBeNull();
  expect((screen.getByLabelText('Gemini API Key') as HTMLInputElement).value).toBe('');
  expect(screen.getByTestId('signed-in').textContent).toBe('false');
});

it('shows the current configured key when reopening login instead of a stale draft', () => {
  setup();
  fireEvent.click(screen.getByText('Update key'));
  fireEvent.click(screen.getByText('Open login'));
  expect((screen.getByLabelText('Gemini API Key') as HTMLInputElement).value).toBe('updated-test-key');
});

it('does not create a BYOK profile from a whitespace-only key', () => {
  setup();
  fireEvent.click(screen.getByText('Open login'));
  fireEvent.change(screen.getByLabelText('Gemini API Key'), {target:{value:'   '}});
  fireEvent.click(screen.getByRole('button', {name:'Tiếp Tục Với Key Này'}));
  expect(screen.getByTestId('signed-in').textContent).toBe('false');
  expect(screen.getByRole('alert').textContent).toMatch(/API Key/);
  expect(localStorage.getItem('khbd_current_user_v2')).toBeNull();
});
