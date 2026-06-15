// import {SelectFilter} from "./SelectFilter.tsx";

type FilterGroup = {
    key: string;
    label: string;
    opts: { v: string; l: string; icon?: string }[];
    type?: 'buttons' | 'select';
    columns?: number;
    icon?: string;
};

type Props = {
    filters: Record<string, string>;
    onToggle: (key: string, value: string) => void;
    filterGroups: FilterGroup[];
    addLabel: string;
    onAdd: () => void;
};

export const Sidebar = ({filters, onToggle, filterGroups, addLabel, onAdd}: Props) => (
    <aside className="sidebar">
        {/*<span className="sidebar-title">Фільтри</span>*/}

        {filterGroups.map(fg => (
            fg.type === 'select'
                ? <SelectFilter
                    key={fg.key}
                    label={fg.label}
                    filterKey={fg.key}
                    icon = {fg.icon}
                    options={fg.opts}
                    value={filters[fg.key] ?? ''}
                    onChange={onToggle}
                />
                :
            <div className="filter-group" key={fg.key}>
                <span className="filter-group-label" style ={{display:'flex', gap: '5px', flexDirection:'row', alignItems: 'center'}}>
                    {fg.icon && <img src = {fg.icon} style = {{width:'35px', height:'35px', padding: '2px 0 0 0'}}/>}
                    {fg.label}
                </span>
                <div className="filter-opts-grid" style={{
                    gridTemplateColumns: `repeat(${fg.columns ?? 1}, 1fr)`
                }}>
                {fg.opts.map(o => (
                    <button style ={{display:'flex', gap: '5px', flexDirection:'row', alignItems: 'center'}}
                        key={o.v}
                        className={'filter-opt' + (filters[fg.key] === o.v ? ' selected' : '')}
                        onClick={() => onToggle(fg.key, o.v)}
                    >
                        {o.icon && <img src = {o.icon} style = {{width:'35px', height:'35px', padding: '2px 0 0 0'}}/>}
                        <span> {o.l} </span>
                        </button>
                ))}
                </div>
            </div>
        ))}
        {/*<button className="add-btn" onClick={onAdd}>{addLabel}</button>*/}
    </aside>
);

type Option = { v: string; l: string };

type Props2 = {
    label: string;
    filterKey: string;
    options: Option[];
    value: string;
    onChange: (key: string, value: string) => void;
    placeholder?: string;
    icon?: string;
};

export const SelectFilter = ({ label, filterKey, options, value, onChange, icon, placeholder = 'Усі'}: Props2) => (
    <div className="filter-group">
        <span className="filter-group-label" style ={{display:'flex', gap: '5px', flexDirection:'row', alignItems: 'center'}}>
            {icon && <img src={icon} style={{width:'35px', height:'35px', padding: '2px 0 0 0'}}/>}
            {label}</span>
        <select
            className="select-filter"
            value={value}
            onChange={e => onChange(filterKey, e.target.value)}
        >
            <option value="">{placeholder}</option>
            {options.map(o => (
                <option key={o.v} value={o.v}>{o.l}</option>
            ))}
        </select>
    </div>
);
