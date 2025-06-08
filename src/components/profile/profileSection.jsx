import React, { useState, useEffect } from 'react';
import Button from '../commonComponents/button'; // Import the Button component
import '../../../src/index.css'; // Import the CSS file

const ProfileSection = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({
        username: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            // Get user email from localStorage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser || !storedUser.email) {
                throw new Error('No user data found');
            }

            // Fetch user data from API
            const response = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const users = await response.json();
            
            // Find the user with matching email
            const user = users.find(u => u.email === storedUser.email);
            if (!user) {
                throw new Error('User not found');
            }

            // Update profile data
            const userData = {
                username: user.username || '',
                email: user.email || '',
            };
            setProfileData(userData);
            setEditedData(userData);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message);
            
            // Fallback to localStorage data if API fails
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                const userData = {
                    username: storedUser.username || '',
                    email: storedUser.email || '',
                };
                setProfileData(userData);
                setEditedData(userData);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
        setEditedData(profileData);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditedData(profileData);
        setUpdateStatus('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setUpdateStatus('Saving changes...');
            const storedUser = JSON.parse(localStorage.getItem('user'));
            
            // Get all users to find the current user's ID
            const response = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/users');
            const users = await response.json();
            const currentUser = users.find(u => u.email === storedUser.email);
            
            if (!currentUser) {
                throw new Error('User not found');
            }

            // Keep the same email but update the username
            const updatedUser = {
                ...currentUser,
                username: editedData.username,
                // Keep the original email
                email: currentUser.email
            };

            // Update user data
            const updateResponse = await fetch(`https://actext-c24df4a0ce27.herokuapp.com/api/users/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update profile');
            }

            // Update local storage with new data but keep the same email
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                username: editedData.username,
                // Keep the original email
                email: currentUser.email
            }));

            // Update profile data state but keep the same email
            setProfileData({
                username: editedData.username,
                email: currentUser.email
            });
            
            setEditMode(false);
            setUpdateStatus('Profile updated successfully!');
            setTimeout(() => setUpdateStatus(''), 3000);

            // Refresh user data to ensure we have the latest data
            await fetchUserData();
        } catch (err) {
            console.error('Error updating profile:', err);
            setUpdateStatus('Failed to update profile. Please try again.');
        }
    };

    if (loading) {
        return <div className="profile-container">Loading...</div>;
    }

    if (error && !profileData.username) {
        return <div className="profile-container">Error: {error}</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-section">
                {/* Avatar */}
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {profileData.username ? profileData.username[0].toUpperCase() : 'U'}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="profile-details">
                    {editMode ? (
                        // Edit Form
                        <div className="profile-form">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editedData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    disabled
                                    className="disabled-input"
                                />
                                <small className="input-helper">Email cannot be changed</small>
                            </div>

                            <div className="form-actions">
                                <Button
                                    text="Save Changes"
                                    className="save-button"
                                    onClick={handleSave}
                                />
                                <Button
                                    text="Cancel"
                                    className="cancel-button"
                                    onClick={handleCancel}
                                />
                            </div>
                        </div>
                    ) : (
                        // Display Profile
                        <>
                            <div className="detail-group">
                                <label>Username</label>
                                <p>{profileData.username || 'Not set'}</p>
                            </div>

                            <div className="detail-group">
                                <label>Email</label>
                                <p>{profileData.email || 'Not set'}</p>
                            </div>

                            <div className="detail-group">
                                <label>Member Since</label>
                                <p>{new Date().toLocaleDateString()}</p>
                            </div>

                            <div className="form-actions">
                                <Button
                                    text="Edit Profile"
                                    className="edit-button"
                                    onClick={handleEdit}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Status Message */}
                {updateStatus && (
                    <div className={`alert ${updateStatus.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                        {updateStatus}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSection;