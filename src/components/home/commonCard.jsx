import React from "react";
import Button from "../commonComponents/button";
import { useNavigate } from 'react-router-dom';

export default function CommonCard(props) {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (props.buttonText === "Sell Now") {
            navigate('/old_ac');
            // Set the active tab to "My Listed ACs" after a short delay to ensure navigation is complete
            setTimeout(() => {
                const myListedACTab = document.querySelector('.sidebar-item:nth-child(2)');
                if (myListedACTab) {
                    myListedACTab.click();
                }
            }, 100);
        } else {
            // Handle other button clicks (like Refer Now)
            console.log(`${props.buttonText} clicked!`);
        }
    };

    return (
        <div className="sell-card">
            <div className="sell-card__content">
                <h2 className="sell-card__title">{props.title}</h2>
                <p className="sell-card__desc">
                    {props.desc}
                </p>
            </div>
            <Button text={props.buttonText} className="sell-card__button" onClick={handleButtonClick} />
        </div>
    );
}