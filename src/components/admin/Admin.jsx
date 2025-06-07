import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../commonComponents/button';
import '../../../src/index.css';
import { API_ENDPOINTS } from '../../config/api';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('service-requests');
    const [serviceRequests, setServiceRequests] = useState([]);
    const [buyerInquiries, setBuyerInquiries] = useState([]);
    const [users, setUsers] = useState([]);
    const [acListings, setAcListings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);

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
            const response = await fetch(API_ENDPOINTS.SERVICE_REQUESTS);
            if (!response.ok) throw new Error('Failed to fetch service requests');
            const data = await response.json();
            setServiceRequests(data);
        } catch (err) {
            console.error('Error fetching service requests:', err);
        }
    };

    const fetchBuyerInquiries = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.BUYER_INQUIRIES);
            if (!response.ok) throw new Error('Failed to fetch inquiries');
            const data = await response.json();
            setBuyerInquiries(data);
        } catch (err) {
            console.error('Error fetching inquiries:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.USERS);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchAcListings = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.AC_LISTINGS);
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
            const response = await fetch(`${API_ENDPOINTS.SERVICE_REQUESTS}/${id}`, {
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

    const handleEdit = (item, type) => {
        setEditingItem({ ...item, type });
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            let endpoint;
            switch (type) {
                case 'service-request':
                    endpoint = `${API_ENDPOINTS.SERVICE_REQUESTS}/${id}`;
                    break;
                case 'inquiry':
                    endpoint = `${API_ENDPOINTS.BUYER_INQUIRIES}/${id}`;
                    break;
                case 'user':
                    endpoint = `${API_ENDPOINTS.USERS}/${id}`;
                    break;
                case 'listing':
                    endpoint = `${API_ENDPOINTS.AC_LISTINGS}/${id}`;
                    break;
                default:
                    throw new Error('Invalid type');
            }

            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            // Refresh data
            fetchAllData();
        } catch (error) {
            console.error('Error deleting item:', error);
            setError('Failed to delete item');
        }
    };

    const handleSave = async () => {
        if (!editingItem) return;

        try {
            let endpoint;
            switch (editingItem.type) {
                case 'service-request':
                    endpoint = `${API_ENDPOINTS.SERVICE_REQUESTS}/${editingItem.id}`;
                    break;
                case 'inquiry':
                    endpoint = `${API_ENDPOINTS.BUYER_INQUIRIES}/${editingItem.id}`;
                    break;
                case 'user':
                    endpoint = `${API_ENDPOINTS.USERS}/${editingItem.id}`;
                    break;
                case 'listing':
                    endpoint = `${API_ENDPOINTS.AC_LISTINGS}/${editingItem.id}`;
                    break;
                default:
                    throw new Error('Invalid type');
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingItem)
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            // Refresh data and close edit mode
            fetchAllData();
            setEditingItem(null);
        } catch (error) {
            console.error('Error updating item:', error);
            setError('Failed to update item');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const renderEditForm = () => {
        if (!editingItem) return null;

        return (
            <div className="edit-form-overlay">
                <div className="edit-form">
                    <h2>Edit {editingItem.type}</h2>
                    {Object.keys(editingItem).map(key => {
                        if (key === 'id' || key === 'type') return null;
                        return (
                            <div className="form-group" key={key}>
                                <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
                                <input
                                    type="text"
                                    name={key}
                                    value={editingItem[key]}
                                    onChange={handleChange}
                                />
                            </div>
                        );
                    })}
                    <div className="form-actions">
                        <button className="save-button" onClick={handleSave}>
                            Save Changes
                        </button>
                        <button className="cancel-button" onClick={() => setEditingItem(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    if (error) {
        return <div className="admin-error">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            {editingItem && renderEditForm()}
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
                                                <div className="action-buttons">
                                                    <button 
                                                        className="small-button"
                                                        onClick={() => handleEdit(request, 'service-request')}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="small-button danger"
                                                        onClick={() => handleDelete(request.id, 'service-request')}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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
                                                <div className="action-buttons">
                                                    <button 
                                                        className="small-button"
                                                        onClick={() => handleEdit(inquiry, 'inquiry')}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="small-button danger"
                                                        onClick={() => handleDelete(inquiry.id, 'inquiry')}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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
                                                <div className="action-buttons">
                                                    <button 
                                                        className="small-button"
                                                        onClick={() => handleEdit(user, 'user')}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="small-button danger"
                                                        onClick={() => handleDelete(user.id, 'user')}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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
                                                    <button 
                                                        className="small-button"
                                                        onClick={() => handleEdit(listing, 'listing')}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="small-button danger"
                                                        onClick={() => handleDelete(listing.id, 'listing')}
                                                    >
                                                        Delete
                                                    </button>
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