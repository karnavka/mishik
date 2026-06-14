import { FormCard } from './FormCard';
import { FormField, FInput, FTextarea } from './FormField';

export type ShelterProfileFormState = {
  name: string;
  phoneNumber: string;
  address: string;
  socialLinks: string;
  adoptionConditions: string;
};

type Props = {
  form: ShelterProfileFormState;
  setForm: React.Dispatch<React.SetStateAction<ShelterProfileFormState>>;
  onSave: () => void;
  onCancel: () => void;
};

export const ShelterProfileForm = ({ form, setForm, onSave, onCancel }: Props) => {
  const set = <K extends keyof ShelterProfileFormState>(key: K, val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <FormCard title="⛏︎" onSave={onSave} onCancel={onCancel} saveLabel="Зберегти зміни">

      {/* Name */}
      <FormField label="Назва притулку">
        <FInput value={form.name} onChange={e => set('name', e.target.value)} />
      </FormField>

      {/* Phone + Social */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Телефон" hint="необов'язково, але потрібен для додавання тварин">
          <FInput
            value={form.phoneNumber}
            placeholder="+380XXXXXXXXX"
            onChange={e => set('phoneNumber', e.target.value)}
          />
        </FormField>
        <FormField label="Соц. мережі" hint="необов'язково">
          <FInput
            value={form.socialLinks}
            placeholder="Instagram, Facebook…"
            onChange={e => set('socialLinks', e.target.value)}
          />
        </FormField>
      </div>

      {/* Address */}
      <FormField label="Адреса" hint="необов'язково">
        <FInput
          value={form.address}
          placeholder="вул. Шевченка 1, Київ"
          onChange={e => set('address', e.target.value)}
        />
      </FormField>

      {/* Adoption conditions */}
      <FormField label="Умови усиновлення">
        <FTextarea
          value={form.adoptionConditions}
          minHeight={100}
          resize="vertical"
          onChange={e => set('adoptionConditions', e.target.value)}
        />
      </FormField>

    </FormCard>
  );
};