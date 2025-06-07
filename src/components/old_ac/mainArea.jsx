import React, { useState } from 'react';
import ACListingForm from './newAcForm';
import AcList from '../home/aclist';
import '../../../src/index.css';

const MainArea = () => {
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="main-area">
            <button onClick={toggleForm} className="add-ac-button">
                {showForm ? "View Listed ACs" : "Add New AC"}
            </button>
            {showForm ? <ACListingForm /> : <AcList />}
        </div>
    );
};

export default MainArea;