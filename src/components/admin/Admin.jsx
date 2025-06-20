import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../commonComponents/button';
import '../../../src/index.css';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('service-requests');
    const [serviceRequests, setServiceRequests] = useState([]);
    const [buyerInquiries, setBuyerInquiries] = useState([]);
    const [users, setUsers] = useState([]);
    const [acListings, setAcListings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.is_admin) {
            navigate('/');
            return;
        }

        fetchAllData();
    }, [navigate]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchServiceRequests(),
                fetchBuyerInquiries(),
                fetchUsers(),
                fetchAcListings()
            ]);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceRequests = async () => {
        try {
            const response = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/service-requests');
            if (!response.ok) throw new Error('Failed to fetch service requests');
            const data = await response.json();
            setServiceRequests(data);
        } catch (err) {
            console.error('Error fetching service requests:', err);
        }
    };

    const fetchBuyerInquiries = async () => {
        try {
            const response = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/buyer-inquiries');
            if (!response.ok) throw new Error('Failed to fetch inquiries');
            const data = await response.json();
            setBuyerInquiries(data);
        } catch (err) {
            console.error('Error fetching inquiries:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchAcListings = async () => {
        try {
            const response = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/ac-listings');
            if (!response.ok) throw new Error('Failed to fetch AC listings');
            const data = await response.json();
            setAcListings(data);
        } catch (err) {
            console.error('Error fetching AC listings:', err);
        }
    };

    const handleAddAC = async (e) => {
        e.preventDefault();
        // Add AC listing logic here
    };

    const updateServiceStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`https://actext-c24df4a0ce27.herokuapp.com/api/service-requests/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            
            // Refresh the service requests
            await fetchServiceRequests();
        } catch (err) {
            console.error('Error updating service request:', err);
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    if (error) {
        return <div className="admin-error">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <Button 
                    text="Refresh Data" 
                    className="default-button" 
                    onClick={fetchAllData}
                />
            </div>

            <div className="admin-tabs">
                <button 
                    className={`tab ${activeTab === 'service-requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('service-requests')}
                >
                    Service Requests
                </button>
                <button 
                    className={`tab ${activeTab === 'inquiries' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inquiries')}
                >
                    Buyer Inquiries
                </button>
                <button 
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button 
                    className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('listings')}
                >
                    AC Listings
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'service-requests' && (
                    <div className="service-requests-section">
                        <h2>Service Requests</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Service</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td>{request.full_name}</td>
                                            <td>{request.email}</td>
                                            <td>{request.phone}</td>
                                            <td>{request.service_type}</td>
                                            <td>{request.address}</td>
                                            <td>{request.status}</td>
                                            <td>
                                                <select
                                                    value={request.status}
                                                    onChange={(e) => updateServiceStatus(request.id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'inquiries' && (
                    <div className="inquiries-section">
                        <h2>Buyer Inquiries</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Message</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buyerInquiries.map((inquiry) => (
                                        <tr key={inquiry.id}>
                                            <td>{inquiry.full_name}</td>
                                            <td>{inquiry.email}</td>
                                            <td>{inquiry.phone}</td>
                                            <td>{inquiry.message}</td>
                                            <td>{inquiry.status}</td>
                                            <td>
                                                <Button 
                                                    text="View Details" 
                                                    className="small-button"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-section">
                        <h2>Users</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.is_admin ? 'Admin' : 'User'}</td>
                                            <td>
                                                <Button 
                                                    text="Edit" 
                                                    className="small-button"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'listings' && (
                    <div className="listings-section">
                        <div className="listings-header">
                            <h2>AC Listings</h2>
                            <Button 
                                text="Add New AC" 
                                className="default-button"
                                onClick={() => navigate('/old_ac')}
                            />
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Brand</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {acListings.map((listing) => (
                                        <tr key={listing.id}>
                                            <td>{listing.title}</td>
                                            <td>{listing.brand}</td>
                                            <td>{listing.ac_type}</td>
                                            <td>₹{listing.price}</td>
                                            <td>{listing.status}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button 
                                                        text="Edit" 
                                                        className="small-button"
                                                    />
                                                    <Button 
                                                        text="Delete" 
                                                        className="small-button danger"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin; 