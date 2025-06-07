import React, { useState, useEffect } from 'react';
import EnquiryForm from '../old_ac/EnquiryForm';
import { API_ENDPOINTS } from '../../config/api';

const AcList = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAcId, setSelectedAcId] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.AC_LISTINGS);
                const data = await response.json();
                setListings(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching listings:', err);
                setError('Failed to load AC listings');
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const handleEnquire = (acId) => {
        setSelectedAcId(acId);
    };

    const handleCloseEnquiry = () => {
        setSelectedAcId(null);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!listings.length) return <div className="no-listings">No ACs listed yet</div>;

    return (
        <>
            <div className='aclist-block'>
                {listings.map((listing) => (
                    <div key={listing.id} className='ac-list'>
                        <div className="ac-list__image-container">
                            {listing.photos && listing.photos.length > 0 ? (
                                <img 
                                    src={`data:image/jpeg;base64,${listing.photos[0]}`}
                                    alt={listing.title}
                                    className="ac-image"
                                    onError={(e) => {
                                        e.target.src = '/default-ac.jpg';
                                    }}
                                />
                            ) : (
                                <img 
                                    src="/default-ac.jpg"
                                    alt="Default AC"
                                    className="ac-image"
                                />
                            )}
                            <div className="ac-list__badge">{listing.ac_type}</div>
                        </div>
                        <div className="ac-list__content">
                            <h2 className='ac-list__title'>
                                <span className='brand-name'>{listing.brand}</span>
                                {listing.title}
                            </h2>
                            <div className="ac-list__specs">
                                <div className="ac-list__spec-item">
                                    <span className="spec-label">Year:</span>
                                    <span className="spec-value">{listing.manufacturing_year}</span>
                                </div>
                                <div className="ac-list__spec-item">
                                    <span className="spec-label">Size:</span>
                                    <span className="spec-value">{listing.dimensions}</span>
                                </div>
                                <div className="ac-list__spec-item">
                                    <span className="spec-label">Quantity:</span>
                                    <span className="spec-value">{listing.no_of_ac} unit(s)</span>
                                </div>
                            </div>
                            <div className="ac-list__price-container">
                                <div className="ac-list__price">₹{listing.price}</div>
                                <button 
                                    className="enquire-button"
                                    onClick={() => handleEnquire(listing.id)}
                                >
                                    Enquire Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedAcId && (
                <EnquiryForm 
                    acListingId={selectedAcId}
                    onClose={handleCloseEnquiry}
                />
            )}
        </>
    );
};

export default AcList;