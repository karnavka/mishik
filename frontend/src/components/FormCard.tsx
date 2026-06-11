
import type { ReactNode } from 'react';
import { section } from '../utils/Profilestyles';

type Props = {
  title: string;
  children: ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  /** Extra style overrides on the outer container */
  style?: React.CSSProperties;
};

export const FormCard = ({
  title, children, onSave, onCancel,
  saveLabel = 'Зберегти',
  cancelLabel = 'Скасувати',
  style,
}: Props) => (
  <div style={{
    ...section,
    gap: 10, padding: 16, borderRadius: 12,
    border: '1px solid var(--border)', background: 'var(--surface)',
    ...style,
  }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
      {title}
    </div>

    {children}

    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
      <button className="btn-primary" onClick={onSave}>{saveLabel}</button>
      <button className="btn-ghost"   onClick={onCancel}>{cancelLabel}</button>
    </div>
  </div>
);