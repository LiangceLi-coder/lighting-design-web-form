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
    <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
                 height:'100vh',
                //  justifyItems:'center',
                 width:'100vw'
    }}>
        <div className="cover-box">
        <img className="cover-logo" alt="Haneco Logo" src="/Haneco_Logo_Mono.svg" />

        <div className="cover-title">Project Submission Form</div>

        <div className="cover-text">Fill the form to upload your project</div>

        <button onClick={scrollToForm} className="upload-btn">
          Get Start
        </button>
      </div>
    </div>

      

  );
};

export default Coverpage;
