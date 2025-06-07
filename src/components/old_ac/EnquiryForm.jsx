import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';

const EnquiryForm = ({ acListingId, onClose }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        message: '',
        preferred_contact_time: '',
        status: 'pending'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.BUYER_INQUIRIES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    ac_listing_id: acListingId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit inquiry');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            setError('Failed to submit inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="enquiry-modal-overlay">
            <div className="enquiry-modal">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>Submit Inquiry</h2>
                
                {success ? (
                    <div className="success-message">
                        Thank you for your inquiry! We'll get back to you soon.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="enquiry-form">
                        <div className="form-group">
                            <label htmlFor="full_name">Full Name *</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="preferred_contact_time">Preferred Contact Time</label>
                            <select
                                id="preferred_contact_time"
                                name="preferred_contact_time"
                                value={formData.preferred_contact_time}
                                onChange={handleChange}
                            >
                                <option value="">Select a time</option>
                                <option value="morning">Morning (9 AM - 12 PM)</option>
                                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                <option value="evening">Evening (4 PM - 7 PM)</option>
                            </select>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EnquiryForm; 