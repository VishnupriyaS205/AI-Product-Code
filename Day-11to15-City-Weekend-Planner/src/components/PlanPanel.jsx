import EmptyState from './EmptyState'

export function PlanPanel({
  planItems,
  onRemove,
  onNoteChange,
  onClearPlan,
  categoryCounts,
}) {
  return (
   
    <aside className="plan-panel" aria-label="Saved weekend plan">
      <div className="panel-heading">
        <p className="eyebrow">Saved plan</p>
        <h2>{planItems.length} places</h2>
      </div>

      {planItems.length === 0 ? (
        <EmptyState
          title="No saved places yet"
          message="Choose a few cards from the list to build your weekend."
        />
      ) : (
        <>
          <div className="category-summary">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <span key={category}>
                {category}: {count}
              </span>
            ))}
          </div>
          <button type="button" className="danger-button" onClick={onClearPlan}>
            Clear plan
          </button>

          <div className="plan-list">
            {planItems.map((item) => (
              <article key={item.id} className="plan-item">
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.time} / {item.area}
                  </p>
                </div>

                <label>
                  <span>Note</span>
                  <textarea
                    value={item.note}
                    placeholder="Example: Go after lunch"
                    aria-label={`Note for ${item.name}`}
                    onChange={(event) =>
                      onNoteChange(item.id, event.target.value)
                    }
                  />
                </label>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </aside>
  )
}