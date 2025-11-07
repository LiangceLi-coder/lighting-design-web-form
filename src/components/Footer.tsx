import React from "react";

const Footer = () => {
    return(
            <div
                style={{
                    width:'100%',
                    height:'3rem',
                    backgroundColor:'#00b388',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    color:'#ffffff',
                    alignItems:'center'
                }}>

                <p style={{
                    marginLeft:'4rem',
                    fontSize:'1vw'
                }}>Copyright © 2025 Haneco Lighting</p>

                <p style={{
                    marginRight:'4rem',
                    fontSize:'1vw'
                }}>Powered By Haneco Lighting</p>

            </div>
    );
}

export default Footer;