import React from "react";    
import LogoButton from "/src/assets/gooddaisy_logo.svg";

const FooterNav: React.FC = () => {
    return (
    <div className="fixed inset-x-0 bottom-0 bg-white ">
    <ul className="flex justify-around  h-11 my-2 boxShadow">
        <li>
        <button type="button" className="bottom-nav">
            <i className="fa-solid fa-user fa-xl text-primary "></i>
            <div className="text-sm text-primary">Member</div>
        </button>
        </li>
        <li>
        <button type="button" className="bottom-nav">
            <i className="fa-solid fa-hand fa-xl text-primary "></i>
            <div className="text-sm text-primary">Activity</div>
        </button>
        </li>
        <li>
        <button type="button" className="bottom-nav">
            <img src={LogoButton} alt="Logo" className="h-6 " />
            <div className="text-sm text-primary">Home</div>
        </button>
        </li>
        <li>
        <button type="button" className="bottom-nav">
            <i className="fa-solid fa-box fa-xl text-primary "></i>
            <div className="text-sm text-primary">Tracking</div>
        </button>
        </li>
        <li>
        <button type="button" className="bottom-nav">
            <i className="fa-solid fa-cart-shopping fa-xl text-primary "></i>
            <div className="text-sm text-primary">Cart</div>
        </button>
        </li>
    </ul>
    </div>
    )
}
export default FooterNav;