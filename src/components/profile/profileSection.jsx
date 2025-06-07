import React, { useState, useEffect } from 'react';
import Button from '../commonComponents/button'; // Import the Button component
import '../../../src/index.css'; // Import the CSS file

const ProfileSection = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
    });

    useEffect(() => {
        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // Directly use the user data without the fallback
            setProfileData({
                name: user.name,
                email: user.email,
            });
        }
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-section">
                {/* Avatar */}
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {profileData.name ? profileData.name[0].toUpperCase() : 'U'}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="profile-details">
                    <div className="detail-group">
                        <label>Username</label>
                        <p>{profileData.name}</p>
                    </div>

                    <div className="detail-group">
                        <label>Email</label>
                        <p>{profileData.email}</p>
                    </div>

                    <div className="detail-group">
                        <label>Member Since</label>
                        <p>{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;