import React from "react";
import { scroller } from "react-scroll";

const Header = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          type="button"
          className="site-brand"
          onClick={() => (window.location.href = "/")}
        >
          <img className="site-logo" alt="Haneco Logo" src="/Haneco_Logo_Mono.svg" />
          <span className="site-brand__text">Project Submission</span>
        </button>

        <button
          className="btn-secondary"
          onClick={() =>
            scroller.scrollTo("form-section", {
              duration: 700,
              delay: 0,
              smooth: "easeInOutQuart",
            })
          }
        >
          Start
        </button>
      </div>
    </header>
  );
};

export default Header;
