export function SummaryBar({ summary }) {
  return (
    <div className="summary-bar" aria-label="Plan summary">
      <div>
        <span>{summary.totalItems}</span>
        <p>Saved</p>
      </div>
      <div>
        <span>Rs. {summary.totalCost}</span>
        <p>Budget</p>
      </div>
      <div>
        <span>Rs. {summary.averageCost}</span>
        <p>Average</p>
      </div>
      <div>
        <span>{summary.totalDuration} hr</span>
        <p>Time</p>
      </div>
      <div>
        <span>{summary.notesCount} </span>
        <p>Notes</p>
      </div>
    </div>
  )
}
