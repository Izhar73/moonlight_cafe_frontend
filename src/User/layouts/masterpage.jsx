import React from "react";
import "./../../asset/home.css"; 
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Breadcrumbs from "../components/breadcrumbs";

const UserMasterPage = ({ title, breadcrumbLinks, Component }) => {
  return (
    <div className="user-dashboard-container">
     
      <aside className="user-sidebar">
        <h2 className="user-sidebar-title"></h2>
        <Navbar />
      </aside>

      {/* Main content area */}
      <div className="user-main-content">
        <header className="user-header">
          <Breadcrumbs title={title} links={breadcrumbLinks} />
        </header>

        <section className="user-page-content">{Component}</section>

        <Footer />
      </div>
    </div>
  );
};

export default UserMasterPage;
