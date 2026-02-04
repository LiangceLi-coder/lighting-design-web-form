import React from "react";

const FinishPage = () => {
  return (
    <div className="form-page">
      <div className="form-panel animate-fade" style={{ textAlign: "center" }}>
        <h2 className="section-title">Submission already completed</h2>
        <p className="helper-text">If you need to submit a new project, return to the homepage.</p>
        <div className="action-row" style={{ justifyContent: "center" }}>
          <button className="btn-accent" onClick={() => (window.location.href = "/")}>
            Go To Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;
