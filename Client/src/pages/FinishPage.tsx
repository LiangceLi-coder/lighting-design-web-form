const FinishPage = ({ result, onReturnHome }) => {
  const isSuccess = result?.success;

  return (
    <div className="form-page">
      <div className="form-panel animate-fade" style={{ textAlign: "center" }}>
        <h2 className="section-title">
          {isSuccess ? "Submission Successful" : "Submission Failed"}
        </h2>
        <p className="helper-text">{result?.message}</p>
        {isSuccess && result?.caseId && (
          <p className="helper-text">Case ID: {result.caseId}</p>
        )}
        <div className="action-row" style={{ justifyContent: "center" }}>
          <button type="button" className="btn-accent" onClick={onReturnHome}>
            Return To Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;
