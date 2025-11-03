import React from 'react';

// A modern, attractive splash screen shown while the app initializes/auth checks.
// Important: This component stays visible as long as the parent renders it.
// We do not auto-hide to avoid a brief blank screen if initialization takes longer.
export default function SplashScreen() {

  return (
    <div className="splash">
      <div className="splash-backdrop" />
      <div className="splash-card">
        <div className="splash-logo">
          <div className="cross">
            <div className="vert" />
            <div className="horiz" />
          </div>
          <div className="pulse" />
        </div>
        <div className="brand">SecureMed</div>
        <div className="tag">Smart Health Tracker</div>
        <div className="heartbeat">
          <span />
        </div>
        <div className="loading-text">Loading your experience…</div>
      </div>
    </div>
  );
}
