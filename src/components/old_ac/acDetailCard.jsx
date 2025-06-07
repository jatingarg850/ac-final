import React from "react";
import Button from "../commonComponents/button";

const ACDetailCard = () => {
    return (
        <div class="product-detail-card-container">
            <div class="product-detail-product-image">
                <img src="https://rukminim2.flixcart.com/image/850/1000/xif0q/air-conditioner-new/4/p/q/-original-imah79hh4fjrfxyn.jpeg?q=90&crop=false" alt="Blue Star 1.5 Ton AC" />
            </div>

            <div className="product-detail-product-info">
                <div class="product-detail-product-title">
                    <h2>Blue Star 1.5 Ton</h2>
                    <div class="product-detail-rating">★★★★☆</div>
                </div>

                <div class="product-detail-actions">
                    <Button text="Add to Cart" className="default-button-add-to-cart" />
                    <Button text="Buy Now" className="default-button" />
                </div>
            </div>

            <div class="product-detail-price-info">
                <div>
                    <span class="product-detail-price-tag">Starts from ₹14000</span>
                    <span class="product-detail-offer-badge">⌚ Limited Offer</span>
                </div>
                <div>
                    <span class="product-detail-price-tag">Starts from ₹10000</span>
                    <span class="product-detail-offer-badge">✨ For VIP Users</span>
                </div>
            </div>

            <ul class="product-detail-product-specs">
                <li><span class="product-detail-spec-label">Brand:</span> Blue Star</li>
                <li><span class="product-detail-spec-label">Capacity:</span> 1.5 Tons</li>
                <li><span class="product-detail-spec-label">Cooling Power:</span> 1026 Kilowatts</li>
                <li><span class="product-detail-spec-label">Special Feature:</span> Inverter Compressor, WiFi Enabled, Dust Filter</li>
                <li><span class="product-detail-spec-label">Product Dimensions:</span> 21.5D x 96W x 32H Centimeters</li>
            </ul>

            <div class="product-detail-about-section">
                <h3>About this item</h3>

                <ul class="product-detail-features-list">
                    <li class="product-detail-feature-item">
                        <p><span class="product-detail-feature-title">Split AC with inverter compressor:</span> Smart AC with Smart App: Blue Star Smart AC comes with an in-built WiFi module which ensures that you can use your AC from anywhere, truly the smart way. Voice Command Technology: Operate your AC with Voice Command using Amazon Alexa or Google Assistant. Switch On, set the temperature and enjoy comfort cooling through Voice Command Assistants.</p>
                    </li>
                    <li class="product-detail-feature-item">
                        <p><span class="product-detail-feature-title">Capacity:</span> 1.5 Ton Suitable for medium sized rooms (151 to 180 sq ft.); Air Circulation (High / Medium / Low): 582/452/326/260 CFM. Cooling Capacity (Min-Max): 5000(789-5116) W & Ambient Temperature: 21 degree to 52 degree Celsius with 4D Way Air Swing</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ACDetailCard;