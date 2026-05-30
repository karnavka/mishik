import {animalEmoji} from "./elements.ts";
import type {Animal} from "../types";

export function AnimalCard({ animal }: { animal: Animal }) {
    return (
        <div className="card">
            <div className="card-avatar">
                {animal.imageUrl
                    ? <img src={animal.imageUrl} alt={animal.name} />
                    : animalEmoji(animal.species)}
            </div>
            <div className="card-body">
                <div className="card-title">{animal.name}</div>
                <div className="card-sub">
                    {[animal.breed, animal.shelterName].filter(Boolean).join(' · ')}
                </div>
                <div className="badges">
                    {[animal.species, animal.gender, animal.size].filter(Boolean).map(b => (
                        <span className="badge" key={b}>{b}</span>
                    ))}
                    {animal.vaccinated !== undefined && (
                        <span className="badge">{animal.vaccinated ? '✓ Щеплений' : '✗ Без щеплень'}</span>
                    )}
                </div>
                <div className="card-fields">
                    {animal.age && <div className="card-field"><span>Вік</span>{animal.age}</div>}
                    {animal.description && <div className="card-field"><span>Опис</span>{animal.description}</div>}
                </div>
                <div className="card-actions">
                    <button className="btn-primary" onClick={e => { e.stopPropagation(); alert('TODO: contact'); }}>
                        Зв'язатися
                    </button>
                    <button className="btn-ghost" onClick={e => { e.stopPropagation(); alert('TODO: save'); }}>
                        ♡ Зберегти
                    </button>
                </div>
            </div>
        </div>
    );
}