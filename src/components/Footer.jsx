import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import './location-footer.css';

const ADDRESS = 'Natrajan Modern Rice Mill, Othakadai, Kodumudi(PO), Erode, Tamil Nadu';

export default function Footer() {
  const onDirections = useCallback(() => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <section className="location-grid">
          <div className="location-card">
            <div className="location-header">
              <div className="location-icon" aria-hidden="true">📍</div>
              <div>
                <h3 className="location-title">Visit Us</h3>
                <p className="location-subtitle">We’d love to meet you</p>
              </div>
            </div>
            <address className="location-address">
              {ADDRESS}
            </address>
            <div className="location-actions">
              <button className="btn-primary" onClick={onDirections}>Get Directions</button>
            </div>
            <div className="contact-list">
              <div><strong>Phone:</strong> +91 9442352398</div>
              <div><strong>Email:</strong> natrajanricemill@gmail.com</div>
              <div><strong>Hours:</strong> Mon–Sat, 9:00 AM – 7:00 PM IST</div>
            </div>
            <div className="mt-4">
              <Link to="/about" className="text-blue-400 hover:text-blue-300 font-semibold">
                About NRM Rice Mill →
              </Link>
            </div>
          </div>

          <div className="map-card">
            <div className="map-frame">
              <iframe
                title="Natrajan Modern Rice Mill - Google Map"
                src={mapSrc}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        <section className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NRM – Online Rice Milling Platform</p>
        </section>
      </div>
    </footer>
  );
}
