import type React from 'react';

export const inp: React.CSSProperties = {
  padding: '9px 13px', borderRadius: 8, border: '1px solid var(--border)',
  background: 'var(--input-bg)', color: 'var(--text)', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color .15s',
};

export const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.target.style.borderColor = 'var(--accent, #4a90d9)');

export const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.target.style.borderColor = 'var(--border)');

export const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
  marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.5px',
};

export const section: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 14 };
export const fieldRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };

export type StatusKey = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export const STATUS: Record<StatusKey, { color: string; label: string }> = {
  PENDING:  { color: '#f39c12', label: 'Очікує'   },
  ACCEPTED: { color: '#27ae60', label: 'Схвалено'  },
  REJECTED: { color: '#e74c3c', label: 'Відхилено' },
};