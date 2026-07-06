export function PlaceCard({ place, isSaved, onSave, onRemove }) {
  return (
    <article className="place-card">
      <div className="card-topline">
        <span>{place.category}</span>
        <span>{place.time}</span>
      </div>
      <h2>{place.name}</h2>
      <p>{place.description}</p>

      <dl className="place-meta">
        <div>
          <dt>Area</dt>
          <dd>{place.area}</dd>
        </div>
        <div>
          <dt>Cost</dt>
          <dd>Rs. {place.cost}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{place.duration} hr</dd>
        </div>
      </dl>

      {isSaved ? (
        <>
          <p className="saved-label">Saved in your plan</p>
          <button
            type="button"
            className="danger-button"
            onClick={() => onRemove(place.id)}
          >
            Remove from plan
          </button>
        </>
      ) : (
        <button type="button" onClick={() => onSave(place.id)}>
          Save to plan
        </button>
      )}
    </article>
  )
}
