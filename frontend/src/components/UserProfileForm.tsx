
import { FormCard } from './FormCard';
import { FormField, FInput } from './FormField';

export type UserProfileFormState = {
  firstName: string;
  lastName: string;
  patronymic: string;
  phoneNumber: string;
};

const NAME_FIELDS: { key: keyof UserProfileFormState; label: string }[] = [
  { key: 'firstName',  label: "Ім'я"       },
  { key: 'lastName',   label: 'Прізвище'   },
  { key: 'patronymic', label: 'По батькові' },
];

type Props = {
  form: UserProfileFormState;
  setForm: React.Dispatch<React.SetStateAction<UserProfileFormState>>;
  onSave: () => void;
  onCancel: () => void;
};

export const UserProfileForm = ({ form, setForm, onSave, onCancel }: Props) => {
  const set = <K extends keyof UserProfileFormState>(key: K, val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <FormCard title="⛏︎" onSave={onSave} onCancel={onCancel} saveLabel="Зберегти зміни">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {NAME_FIELDS.map(({ key, label }) => (
          <FormField key={key} label={label}>
            <FInput value={form[key]} onChange={e => set(key, e.target.value)} />
          </FormField>
        ))}
      </div>

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