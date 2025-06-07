import React, { useState, useEffect } from 'react';
import Button from '../commonComponents/button'; // Import the Button component
import '../../../src/index.css'; // Import the CSS file
import { API_ENDPOINTS } from '../../config/api';

const ProfileSection = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
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
            setEditData({
                name: user.name,
                email: user.email,
            });
        }
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            name: profileData.name,
            email: profileData.email,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`${API_ENDPOINTS.USERS}/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            setProfileData({
                name: updatedUser.name,
                email: updatedUser.email,
            });

            // Update localStorage
            localStorage.setItem('user', JSON.stringify({
                ...user,
                ...updatedUser
            }));

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            // You might want to show an error message to the user
        }
    };

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
                {isEditing ? (
                    <div className="profile-form">
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="name"
                                value={editData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-actions">
                            <button className="save-button" onClick={handleSave}>
                                Save Changes
                            </button>
                            <button className="cancel-button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
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

                        <div className="form-actions">
                            <button className="edit-button" onClick={handleEdit}>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSection;