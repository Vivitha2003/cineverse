import { LayoutGrid, List } from 'lucide-react';

// Count + "Sort by" dropdown + grid/list toggle.
function BrowseControls({ countText, sortBy, onSortChange, sortOptions, layout, onLayoutChange }) {
  return (
    <div className="browser__toolbar">
      <p className="browser__count" aria-live="polite">
        {countText}
      </p>

      <label className="select">
        <span>Sort by</span>
        <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="layout-toggle" role="group" aria-label="Layout">
        <button
          type="button"
          aria-pressed={layout === 'grid'}
          aria-label="Grid view"
          title="Grid view"
          onClick={() => onLayoutChange('grid')}
        >
          <LayoutGrid size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-pressed={layout === 'list'}
          aria-label="List view"
          title="List view"
          onClick={() => onLayoutChange('list')}
        >
          <List size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default BrowseControls;
