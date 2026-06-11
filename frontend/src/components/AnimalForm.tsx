
import { FormCard } from './FormCard';
import { FormField, FInput, FSelect } from './FormField';

export type AnimalFormState = {
  name: string;
  age: number;
  height: number;
  description: string;
  sex: string;
  animalType: string;
};

export const EMPTY_ANIMAL_FORM: AnimalFormState = {
  name: '', age: 0, height: 0, description: '', sex: 'MALE', animalType: '',
};

type Props = {
  /** Present → edit mode; absent → add mode */
  id?: number;
  form: AnimalFormState;
  setForm: React.Dispatch<React.SetStateAction<AnimalFormState>>;
  onSave: () => void;
  onCancel: () => void;
};

export const AnimalForm = ({ id, form, setForm, onSave, onCancel }: Props) => {
  const set = <K extends keyof AnimalFormState>(key: K, val: AnimalFormState[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <FormCard
      title={id ? '✏️ Редагування тварини' : '➕ Нова тварина'}
      onSave={onSave}
      onCancel={onCancel}
    >
      {/* Name / age / height row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px', gap: 10 }}>
        <FormField label="Ім'я">
          <FInput value={form.name} onChange={e => set('name', e.target.value)} />
        </FormField>
        <FormField label="Вік">
          <FInput type="number" value={form.age} onChange={e => set('age', +e.target.value)} />
        </FormField>
        <FormField label="Висота (см)">
          <FInput type="number" value={form.height} onChange={e => set('height', +e.target.value)} />
        </FormField>
      </div>

      {/* Sex / type row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Стать">
          <FSelect value={form.sex} onChange={e => set('sex', e.target.value)}>
            <option value="MALE">♂ Хлопчик</option>
            <option value="FEMALE">♀ Дівчинка</option>
          </FSelect>
        </FormField>
        <FormField label="Тип тварини">
          <FInput value={form.animalType} placeholder="Кіт, Пес…" onChange={e => set('animalType', e.target.value)} />
        </FormField>
      </div>

      <FormField label="Опис">
        <FInput value={form.description} onChange={e => set('description', e.target.value)} />
      </FormField>
    </FormCard>
  );
};