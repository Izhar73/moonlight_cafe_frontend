import React, { useState } from 'react';
import './../../assets/Dashboard.css';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Navbar from './Navbar';

const MasterPage = ({title, breadcrumbLinks, Component}) => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">MOONLIGHT CAFE</h2>
        <Navbar />
      </aside>
      <div className="main-content">
  <header className="dashboard-header">
    <Breadcrumbs title={title} links={breadcrumbLinks} />
  </header>
  <div className="dashboard-body">{Component}</div>
  <Footer />
</div>

    </div>
  );
};

export default MasterPage;
