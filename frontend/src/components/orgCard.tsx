import type {Organization} from "../types";
import {orgEmoji} from "./elements.ts";

type Props = {
    org: Organization;
    onClick?: () => void;
}

export function OrgCard({ org, onClick }: Props) {
    return (
        <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
            <div className="card-avatar">{
                org.imageUrl ? <img src={org.imageUrl} /> : orgEmoji(org.type)}
            </div>
            <div className="card-body">
                <div className="card-title">{org.name}</div>
                {/*<div className="card-sub">*/}
                {/*    {[org.city, org.region].filter(Boolean).join(', ')}*/}
                {/*</div>*/}

                <div className="badges">
                    {org.city   && <span className="badge">{org.city}</span>}
                    {org.region && <span className="badge">{org.region}</span>}
                </div>

                <div className="card-fields">
                    {org.phoneNumber        && <div className="card-field"><span>Тел.</span>{org.phoneNumber}</div>}
                    {org.adoptionConditions && <div className="card-field"><span>Умови</span>{org.adoptionConditions}</div>}
                </div>
                {/*<div className="card-actions">*/}
                {/*    <button className="btn-primary" onClick={e => { e.stopPropagation(); alert('TODO: contact'); }}>*/}
                {/*        Контакти*/}
                {/*    </button>*/}
                {/*    <button className="btn-ghost" onClick={e => { e.stopPropagation(); alert('TODO: map'); }}>*/}
                {/*        На карті*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}