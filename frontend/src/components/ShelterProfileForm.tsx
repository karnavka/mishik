import { FormCard } from './FormCard';
import { FormField, FInput, FTextarea } from './FormField';

export type ShelterProfileFormState = {
  name: string;
  phoneNumber: string;
  instagram: string;
  facebook: string;
  telegram: string;
  adoptionConditions: string;
  address: {
    city: string;
    region: string;
    street: string;
  };
};

type Props = {
  form: ShelterProfileFormState;
  setForm: React.Dispatch<React.SetStateAction<ShelterProfileFormState>>;
  onSave: () => void;
  onCancel: () => void;
};

export const ShelterProfileForm = ({ form, setForm, onSave, onCancel }: Props) => {
  const set = <K extends keyof ShelterProfileFormState>(key: K, val: ShelterProfileFormState[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const setAddr = (key: keyof ShelterProfileFormState['address'], val: string) =>
    setForm(f => ({ ...f, address: { ...f.address, [key]: val } }));

  return (
    <FormCard title="⛏︎" onSave={onSave} onCancel={onCancel} saveLabel="Зберегти зміни">

      <FormField label="Назва притулку">
        <FInput value={form.name} onChange={e => set('name', e.target.value)} />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Телефон" hint="потрібен для додавання тварин">
          <FInput value={form.phoneNumber} placeholder="+380XXXXXXXXX"
            onChange={e => set('phoneNumber', e.target.value)} />
        </FormField>
      </div>

      {/* Соцмережі */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Instagram" hint="необов'язково">
          <FInput value={form.instagram} placeholder="https://instagram.com/..."
            onChange={e => set('instagram', e.target.value)} />
        </FormField>
        <FormField label="Facebook" hint="необов'язково">
          <FInput value={form.facebook} placeholder="https://facebook.com/..."
            onChange={e => set('facebook', e.target.value)} />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Telegram" hint="необов'язково">
          <FInput value={form.telegram} placeholder="https://t.me/..."
            onChange={e => set('telegram', e.target.value)} />
        </FormField>
      </div>

      {/* Адреса */}
      <FormField label="Місто" hint="необов'язково">
        <FInput value={form.address.city} placeholder="Київ"
          onChange={e => setAddr('city', e.target.value)} />
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Область" hint="необов'язково">
          <FInput value={form.address.region} placeholder="Київська"
            onChange={e => setAddr('region', e.target.value)} />
        </FormField>
        <FormField label="Вулиця" hint="необов'язково">
          <FInput value={form.address.street} placeholder="вул. Шевченка 1"
            onChange={e => setAddr('street', e.target.value)} />
        </FormField>
      </div>

      <FormField label="Умови усиновлення">
        <FTextarea value={form.adoptionConditions} minHeight={100} resize="vertical"
          onChange={e => set('adoptionConditions', e.target.value)} />
      </FormField>

    </FormCard>
  );
};