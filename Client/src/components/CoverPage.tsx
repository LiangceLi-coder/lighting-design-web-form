import React from "react";
import { scroller } from "react-scroll";

const Coverpage = () => {
  const scrollToForm = () => {
    scroller.scrollTo("form-section", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };

  return (
    <section className="hero">
      <div className="hero-card animate-fade">
        <div className="hero-topline">Lighting Design Portal</div>
        <div className="status-banner">Internal Test Only * Not Fully Functional, Not Released For Use</div>
        <img className="hero-logo" alt="Haneco Logo" src="/Haneco_Logo_Mono.svg" />
        <h1 className="hero-title">Project Submission Form</h1>
        <p className="hero-subtitle">
          A guided request flow built for speed, clarity, and precision in lighting
          design submissions.
        </p>
        <div className="hero-actions">
          <button onClick={scrollToForm} className="btn-primary">
            Start Submission
          </button>
        </div>
        <div className="hero-meta">
          <span className="meta-chip">3-step guided workflow</span>
          <span className="meta-chip">Attach drawings & specs</span>
          <span className="meta-chip">Haneco Lighting</span>
        </div>
      </div>
    </section>
  );
};

export default Coverpage;
