import '../styles/LandingPage.css';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-header">
          <div className="emoji">📸</div>
          <h1>Photo Collage</h1>
          <p className="tagline">Take photos, pick a vibe, send to friends</p>
        </div>

        {/* CTA Buttons */}
        <div className="landing-buttons">
          <button 
            className="btn btn-primary"
            onClick={onGetStarted}
          >
            Take a Photo
          </button>
          <button 
            className="btn btn-secondary"
            onClick={onGetStarted}
          >
            Upload Photo
          </button>
        </div>

        {/* Footer note */}
        <div className="landing-footer">
          <p> works totally anonymous ✨</p>
        </div>
      </div>
    </div>
  );
}