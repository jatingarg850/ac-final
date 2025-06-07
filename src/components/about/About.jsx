import React from 'react';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About AC Walla</h1>
                <p className="subtitle">Your Trusted Partner in AC Services</p>
            </div>

            <div className="about-content">
                <section className="about-section">
                    <h2>Who We Are</h2>
                    <p>
                        AC Walla is a leading air conditioning service platform in India, connecting quality AC service providers with customers. 
                        We're dedicated to making AC maintenance, repair, and sales hassle-free and reliable.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        To revolutionize the AC service industry by providing transparent, reliable, and efficient services through our network of verified professionals.
                    </p>
                </section>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🛠️</div>
                        <h3>Expert Services</h3>
                        <p>Qualified and experienced technicians for all your AC needs</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Quick Response</h3>
                        <p>Fast and reliable service when you need it most</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3>Best Prices</h3>
                        <p>Competitive pricing with no hidden charges</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">✅</div>
                        <h3>Quality Assured</h3>
                        <p>100% satisfaction guaranteed on all services</p>
                    </div>
                </div>

                <section className="about-section">
                    <h2>Why Choose Us</h2>
                    <div className="benefits-list">
                        <div className="benefit-item">
                            <h4>Verified Professionals</h4>
                            <p>All our service providers undergo thorough verification and training</p>
                        </div>
                        <div className="benefit-item">
                            <h4>Transparent Pricing</h4>
                            <p>Clear pricing structure with no hidden costs</p>
                        </div>
                        <div className="benefit-item">
                            <h4>Customer Support</h4>
                            <p>24/7 customer support to assist you with any queries</p>
                        </div>
                        <div className="benefit-item">
                            <h4>Warranty</h4>
                            <p>Service warranty on all repairs and maintenance work</p>
                        </div>
                    </div>
                </section>

                <section className="about-section contact-section">
                    <h2>Get in Touch</h2>
                    <div className="contact-info">
                        <div className="contact-item">
                            <strong>Email:</strong>
                            <p>support@acwalla.com</p>
                        </div>
                        <div className="contact-item">
                            <strong>Phone:</strong>
                            <p>1800-123-4567</p>
                        </div>
                        <div className="contact-item">
                            <strong>Working Hours:</strong>
                            <p>Monday to Sunday: 9:00 AM - 8:00 PM</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;