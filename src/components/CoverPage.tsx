import React from "react";
import {scroller} from 'react-scroll';

const Coverpage = () => {
    const scrollToForm = () => {
        scroller.scrollTo('form-section', {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart',
        });
    };

    return (
        <div style={{
            height:'100vh',
            width:'100vw',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#bdfff0',
        }}>

            <div
                style={{
                    background:'#00b388',
                    // height:'50%',
                    // width:'50%',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    justifyContent:'center',
                    // gap:'1rem',
                    padding:'4rem',
                    borderRadius:'8rem'
                }}    
            >
                <img className=" h-15" alt="Haneco Logo" src="public\Haneco_Logo_Mono.svg">
                </img>
                <div
                    style={{
                        fontSize:'4.5rem',
                        fontWeight:'bold'
                        // fontFamily:'Playfair Display',
                    }}
                >
                    Project Submission Form
                </div>

                <div
                    style={{
                        fontSize:'1.5rem',
                        // fontFamily:'Poppins',
                        // fontWeight:'bold',
                        marginTop:'1rem'
                    }}
                >
                    Fill the form to upload your project
                </div>

                <button onClick={scrollToForm} className="upload-btn">
                    Get Start
                </button>
                <div>

                </div>

            </div>

            
        </div>
    );
};

export default Coverpage;