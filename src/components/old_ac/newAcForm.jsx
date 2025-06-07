import React, { useState } from 'react';
import '../../../src/index.css';
import Button from "../commonComponents/button";
import { API_ENDPOINTS } from '../../config/api';

const ACListingForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        brand: '',
        manufacturing_year: '',
        ac_type: '',
        dimensions: '',
        no_of_ac: '',
        price: '',
        photos: [], // Store photo objects here
        status: 'available'
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const acBrands = [
        'Voltas',
        'Hitachi',
        'O General',
        'Carrier',
        'Daikin',
        'LG',
        'Samsung',
        'Whirlpool',
        'Blue Star',
        'Panasonic'
    ];

    const acTypes = [
        'Split AC',
        'Window AC'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePhotoChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            // Convert the file to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPhotos = [...formData.photos];
                updatedPhotos[index] = reader.result;
                setFormData({
                    ...formData,
                    photos: updatedPhotos
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const addPhotoField = () => {
        if (formData.photos.length < 5) {
            setFormData({
                ...formData,
                photos: [...formData.photos, null]
            });
        }
    };

    const handleOwnerSelection = (owner) => {
        setFormData({
            ...formData,
            no_of_ac: owner
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setError('Please login to create an AC listing');
            return;
        }

        try {
            // Prepare the photos array - only include non-null photos
            const photosArray = formData.photos
                .filter(photo => photo !== null)
                .map(photo => photo.split(',')[1]); // Extract base64 data after the comma

            const requestData = {
                title: formData.title,
                description: formData.description,
                brand: formData.brand,
                manufacturing_year: parseInt(formData.manufacturing_year),
                ac_type: formData.ac_type,
                dimensions: formData.dimensions,
                no_of_ac: parseInt(formData.no_of_ac) || 1,
                price: parseFloat(formData.price),
                photos: photosArray,
                status: formData.status
            };

            console.log('Sending data:', {
                ...requestData,
                photos: `${photosArray.length} photos included` // Log photo count instead of full base64 strings
            });

            const response = await fetch(API_ENDPOINTS.AC_LISTINGS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
                setSuccess('AC listing created successfully!');
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    brand: '',
                    manufacturing_year: '',
                    ac_type: '',
                    dimensions: '',
                    no_of_ac: '',
                    price: '',
                    photos: [],
                    status: 'available'
                });
            } else {
                setError(data.message || 'Failed to create AC listing. Please check all fields are filled correctly.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to connect to server. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="form-group">
                    <label className="form-label">Write Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Write Heading Here"
                        className="form-control"
                        required
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label className="form-label">Write Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Write Description Here"
                        className="form-control form-textarea"
                        required
                    />
                </div>

                <div className="grid-container">
                    {/* Brand Selection */}
                    <div className="form-group">
                        <label className="form-label">Select Brand</label>
                        <select
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="select-dropdown"
                            required
                        >
                            <option value="">Select your AC Brand</option>
                            {acBrands.map((brand) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    {/* Manufacturing Year */}
                    <div className="form-group">
                        <label className="form-label">Enter Manufacturing Year</label>
                        <input
                            type="number"
                            name="manufacturing_year"
                            value={formData.manufacturing_year}
                            onChange={handleChange}
                            placeholder="Enter year"
                            className="form-control"
                            min="1990"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                </div>

                <div className="grid-container">
                    {/* AC Type Selection */}
                    <div className="form-group">
                        <label className="form-label">Select Type</label>
                        <select
                            name="ac_type"
                            value={formData.ac_type}
                            onChange={handleChange}
                            className="select-dropdown"
                            required
                        >
                            <option value="">Select your AC Type</option>
                            {acTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dimensions */}
                    <div className="form-group">
                        <label className="form-label">Enter Dimensions</label>
                        <input
                            type="text"
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleChange}
                            placeholder="Enter Dimensions of your AC"
                            className="form-control"
                            required
                        />
                    </div>
                </div>

                {/* Number of ACs */}
                <div className="form-group">
                    <label className="form-label">No. of AC (Select One Of Them):</label>
                    <div className="owner-buttons">
                        {['1', '2', '3', '4', '4+'].map((owner) => (
                            <button
                                key={owner}
                                type="button"
                                onClick={() => handleOwnerSelection(owner)}
                                className={`owner-button ${formData.no_of_ac === owner ? 'owner-button-selected' : ''}`}
                            >
                                {owner}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="form-group">
                    <label className="form-label">Set A Price</label>
                    <div className="price-input-container">
                        <span className="price-symbol">₹</span>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0"
                            className={`form-control price-input ${formData.price ? 'filled' : ''}`}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                {/* Photos */}
                <div className="form-group">
                    <label className="form-label">Add Up to 5 Photos of Your AC</label>
                    <div className="photos-container">
                        {formData.photos.map((photo, index) => (
                            <div key={index} className="photo-box">
                                {photo && (
                                    <img
                                        src={photo}
                                        alt={`Preview ${index + 1}`}
                                        className="photo-preview"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input-hidden"
                                    id={`photo-${index}`}
                                    onChange={(e) => handlePhotoChange(e, index)}
                                />
                                <label htmlFor={`photo-${index}`}>Select</label>
                            </div>
                        ))}
                        {formData.photos.length < 5 && (
                            <button
                                type="button"
                                onClick={addPhotoField}
                                className="add-photo-box"
                            >
                                + Add
                            </button>
                        )}
                    </div>
                </div>

                {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{success}</p>}

                {/* Submit Button */}
                <div className="form-group">
                    <Button text="Add your AC" className="default-button" type="submit" />
                </div>
            </form>
        </div>
    );
};

export default ACListingForm;