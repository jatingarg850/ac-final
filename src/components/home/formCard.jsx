import React, { useState } from 'react';
import Button from '../commonComponents/button';
import { API_ENDPOINTS } from '../../config/api';

const FormCard = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        service: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(API_ENDPOINTS.SERVICE_REQUESTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    service_type: formData.service,
                    status: 'pending'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            const data = await response.json();
            setStatus({ type: 'success', message: 'Service request submitted successfully!' });
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                address: '',
                service: '',
            });
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to submit request. Please try again.' });
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-card">
            {status.message && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {status.message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name<span>*</span></label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Eg: Rohan Singh"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email ID<span>*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Eg: rohansingh12@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number<span>*</span></label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="+91 93xxxx xxxx"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="service">Choose Service<span>*</span></label>
                        <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Eg: AC Cleaning</option>
                            <option value="AC Cleaning">AC Cleaning</option>
                            <option value="AC Repair">AC Repair</option>
                            <option value="AC Installation">AC Installation</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Location/Address<span>*</span></label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Hno.2 ABC Colony, Delhi"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-submit">
                    <Button 
                        text={isSubmitting ? "Submitting..." : "Book Now"} 
                        className="default-button"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
};

export default FormCard;