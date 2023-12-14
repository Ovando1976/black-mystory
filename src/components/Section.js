import React from 'react';

const Section = ({ title, description, media }) => {
  return (
    <div className="section">
      {media && <div className="section-media">{media}</div>}
      <div className="section-content">
        {title && <h2 className="section-title">{title}</h2>}
        {description && <p className="section-description">{description}</p>}
      </div>
    </div>
  );
};


export default Section;
