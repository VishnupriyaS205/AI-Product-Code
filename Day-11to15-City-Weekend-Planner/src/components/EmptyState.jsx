const EmptyState = ({
  title,
  message,
  onReset,
  buttonText = 'Try again',
}) => {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{message}</p>
        {onReset && (
            <button type="button" onClick={onReset}>
              {buttonText}
            </button>
        )}
    </div>
  );
};

export default EmptyState;