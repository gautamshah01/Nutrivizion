import React from 'react';

const NutriVisionLogo = ({ className = "", size = "normal" }) => {
  const logoClasses = size === "large" ? "nutrivision-logo-large" : "nutrivision-logo";
  
  return (
    <img 
      src="/images/nutrivision-logo.png"
      alt="NutriVision"
      className={`${logoClasses} ${className}`}
      onError={(e) => {
        // Fallback to text logo if image fails to load
        e.target.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.className = 'text-xl font-bold text-primary-600';
        fallback.textContent = 'NutriVision';
        e.target.parentNode.appendChild(fallback);
      }}
    />
  );
};

export default NutriVisionLogo;