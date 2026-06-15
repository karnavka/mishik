
import { FormCard } from './FormCard';
import { FormField, FInput, FSelect } from './FormField';

export type AnimalFormState = {
  name: string;
  age: number;
  height: number;
  description: string;
  sex: string;
  animalTypeId: string;
  animalTypeName: string;
  imageUrl: string;
};

export const EMPTY_ANIMAL_FORM: AnimalFormState = {
  name: '', age: 0, height: 0, description: '', sex: 'MALE', animalTypeId: '', animalTypeName: '', imageUrl: '',
};

export type AnimalTypeOption = {
  id: number;
  type: string;
};

type Props = {
  id?: number;
  form: AnimalFormState;
  setForm: React.Dispatch<React.SetStateAction<AnimalFormState>>;
  animalTypes: AnimalTypeOption[];
  onSave: () => void;
  onCancel: () => void;
};

export const AnimalForm = ({ id, form, setForm, animalTypes, onSave, onCancel }: Props) => {
  const set = <K extends keyof AnimalFormState>(key: K, val: AnimalFormState[K]) =>
    setForm(f => ({ ...f, [key]: val }));
  const isOtherType = form.animalTypeId === '__other__';

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
          <FSelect value={form.animalTypeId} onChange={e => set('animalTypeId', e.target.value)}>
            <option value="">Оберіть тип</option>
            {animalTypes.map(t => (
              <option key={t.id} value={String(t.id)}>{t.type}</option>
            ))}
            <option value="__other__">Інший</option>
          </FSelect>
        </FormField>
      </div>

      {isOtherType && (
        <FormField label="Свій вид">
          <FInput
            value={form.animalTypeName}
            placeholder="Наприклад: хом'як"
            onChange={e => set('animalTypeName', e.target.value)}
          />
        </FormField>
      )}

      <FormField label="Image URL" hint="optional">
        <FInput
          type="url"
          value={form.imageUrl}
          placeholder="https://example.com/photo.jpg"
          onChange={e => set('imageUrl', e.target.value)}
        />
      </FormField>

      {form.imageUrl && (
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--bg)',
        }}>
          <img
            src={form.imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <FormField label="Опис">
        <FInput value={form.description} onChange={e => set('description', e.target.value)} />
      </FormField>
    </FormCard>
  );
};
