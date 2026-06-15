import { FormCard } from './FormCard';
import { FormField, FInput } from './FormField';

export type UserProfileFormState = {
  firstName: string;
  lastName: string;
  patronymic: string;
  sex: 'MALE' | 'FEMALE' | 'UNKNOWN';
  phoneNumber: string;
};

const NAME_FIELDS: { key: keyof Pick<UserProfileFormState, 'firstName' | 'lastName' | 'patronymic'>; label: string }[] = [
  { key: 'firstName',  label: "Ім'я"        },
  { key: 'lastName',   label: 'Прізвище'    },
  { key: 'patronymic', label: 'По батькові' },
];

type Props = {
  form: UserProfileFormState;
  setForm: React.Dispatch<React.SetStateAction<UserProfileFormState>>;
  onSave: () => void;
  onCancel: () => void;
};

export const UserProfileForm = ({ form, setForm, onSave, onCancel }: Props) => {
  const set = <K extends keyof UserProfileFormState>(key: K, val: UserProfileFormState[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <FormCard title="⛏︎" onSave={onSave} onCancel={onCancel} saveLabel="Зберегти зміни">

      {/* Name row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {NAME_FIELDS.map(({ key, label }) => (
          <FormField key={key} label={label}>
            <FInput value={form[key]} onChange={e => set(key, e.target.value)} />
          </FormField>
        ))}
      </div>

      {/* Sex */}
      <FormField label="Стать">
        <select
          value={form.sex}
          onChange={e => set('sex', e.target.value as UserProfileFormState['sex'])}
          style={{
            width: '100%', padding: '9px 12px', borderRadius: 10,
            border: '1px solid var(--border)', fontSize: 14,
            background: 'var(--surface)', color: 'var(--text)',
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="UNKNOWN">— Не вказано</option>
          <option value="MALE">♂ Чоловіча</option>
          <option value="FEMALE">♀ Жіноча</option>
        </select>
      </FormField>

      {/* Phone */}
      <FormField label="Номер телефону" hint="необов'язково, але потрібен для усиновлення">
        <FInput
          value={form.phoneNumber}
          placeholder="+380XXXXXXXXX"
          onChange={e => set('phoneNumber', e.target.value)}
        />
      </FormField>

    </FormCard>
  );
};