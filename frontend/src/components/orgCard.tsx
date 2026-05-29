import type {Organization} from "../types";
import {orgEmoji} from "./elements.ts";


export function OrgCard({ org }: { org: Organization }) {
    return (
        <div className="card">
            <div className="card-avatar">
                {org.logoUrl
                    ? <img src={org.logoUrl} alt={org.name} />
                    : orgEmoji(org.type)}
            </div>
            <div className="card-body">
                <div className="card-title">{org.name}</div>
                <div className="card-sub">{[org.city, org.type].filter(Boolean).join(' · ')}</div>
                <div className="badges">
                    {[org.type, org.city].filter(Boolean).map(b => (
                        <span className="badge" key={b}>{b}</span>
                    ))}
                    {org.rating && <span className="badge">{org.rating} ★</span>}
                </div>
                <div className="card-fields">
                    {org.schedule && <div className="card-field"><span>Графік</span>{org.schedule}</div>}
                    {org.phone    && <div className="card-field"><span>Тел.</span>{org.phone}</div>}
                    {org.description && <div className="card-field"><span>Про нас</span>{org.description}</div>}
                </div>
                <div className="card-actions">
                    <button className="btn-primary" onClick={e => { e.stopPropagation(); alert('TODO: contact'); }}>
                        Контакти
                    </button>
                    <button className="btn-ghost" onClick={e => { e.stopPropagation(); alert('TODO: map'); }}>
                        На карті
                    </button>
                </div>
            </div>
        </div>
    );
}