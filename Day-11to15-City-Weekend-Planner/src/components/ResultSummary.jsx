export function ResultSummary({ visibleCount, totalCount }) {
  return (
    <p className="result-summary">
      Showing {visibleCount} of {totalCount} places
    </p>
  )
}