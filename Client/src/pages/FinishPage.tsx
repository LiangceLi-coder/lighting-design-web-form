import React from "react";
// import { useRouter } from "next/navigation";

const FinishPage = () => {  
    return(

        <div
            className="flex w-[100vw] h-[100vh] bg-[#00b389] justify-center items-center"
        >

            <div className="flex flex-col items-center">
                <div className="text-white font-bold text-[4rem]">
                    Submission already completed.
            </div>

            <button
                className="text-[#00b389] bg-white text-[1.5rem] hover:bg-[#053e30] hover:text-white rounded py-2 px-4 mt-[0.8rem]"
                 onClick={() => (window.location.href = "/")}
            >
                Go To Home
            </button>
            </div>
        </div>
    );
}

export default FinishPage;