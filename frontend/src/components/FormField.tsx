
import type { ReactNode } from 'react';
import { inp, onFocus, onBlur, lbl, fieldRow } from '../utils/Profilestyles';

type BaseProps = {
  label: string;
  hint?: string;
  headerRight?: ReactNode;
  style?: React.CSSProperties;
};

type ReadonlyProps = BaseProps & {
  disabled: true;
  value: string;
  children?: never;
};

type EditableProps = BaseProps & {
  disabled?: false;
  value?: never;
  children: ReactNode;
};

type Props = ReadonlyProps | EditableProps;

export const FormField = ({ label, hint, headerRight, style, ...rest }: Props) => (
  <div style={{ ...fieldRow, ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
      <span style={lbl}>
        {label}
        {hint && (
          <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontWeight: 400, marginLeft: 4 }}>
            ({hint})
          </span>
        )}
      </span>
      {headerRight}
    </div>

    {'disabled' in rest && rest.disabled ? (
      <input style={{ ...inp, opacity: 0.55 }} value={rest.value} disabled />
    ) : (
      (rest as EditableProps).children
    )}
  </div>
);


export const FInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input style={inp} onFocus={onFocus} onBlur={onBlur} {...props} />
);

export const FTextarea = ({
  minHeight = 100,
  resize = 'vertical',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { minHeight?: number; resize?: React.CSSProperties['resize'] }) => (
  <textarea
    style={{ ...inp, minHeight, resize } as React.CSSProperties}
    onFocus={onFocus} onBlur={onBlur}
    {...props}
  />
);


export const FSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select style={{ ...inp }} {...props} />
);