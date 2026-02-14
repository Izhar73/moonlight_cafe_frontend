import React from 'react';
import { Link } from 'react-router-dom';
import './../../assets/Breadcrumbs.css';

const Breadcrumbs = () => {
  return (
    <div className="breadcrumbs-container">
      <div className="breadcrumbs-title"></div>
      <div className="breadcrumbs-links">
        {/* nothing here - removed >Menu >About >Yourorders */}
      </div>
    </div>
  );
};

export default Breadcrumbs;
