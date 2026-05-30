type FilterGroup = {
  key: string;
  label: string;
  opts: { v: string; l: string }[];
};

type Props = {
  filters: Record<string, string>;
  onToggle: (key: string, value: string) => void;
  filterGroups: FilterGroup[];
  addLabel: string;
  onAdd: () => void;
};

export const Sidebar = ({ filters, onToggle, filterGroups, addLabel, onAdd }: Props) => (
  <aside className="sidebar">
    <span className="sidebar-title">Фільтри</span>
    {filterGroups.map(fg => (
      <div className="filter-group" key={fg.key}>
        <span className="filter-group-label">{fg.label}</span>
        {fg.opts.map(o => (
          <button
            key={o.v}
            className={'filter-opt' + (filters[fg.key] === o.v ? ' selected' : '')}
            onClick={() => onToggle(fg.key, o.v)}
          >
            {o.l}
          </button>
        ))}
      </div>
    ))}
    <button className="add-btn" onClick={onAdd}>{addLabel}</button>
  </aside>
);