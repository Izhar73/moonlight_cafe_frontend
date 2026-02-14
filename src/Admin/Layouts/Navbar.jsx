import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  
    const redirect = useNavigate();

    const confirmLogout =() => {
      if (window.confirm("Are you sure to logut!!!")){
        localStorage.removeItem("Fullname");
        localStorage.removeItem("AdminId");
        redirect("/SignIn");
      }
    }

    const [menuOpen, setMenuOpen] = useState(false); 
    return (
                <nav className="sidebar-nav">
          
         <Link to="/Dashboard">Dashboard</Link>
          <Link to="/categories">Category</Link>
          <Link to="/food">Add Food</Link>
          <Link to="/food-list">Menu</Link>
          <Link to="/admincart">Customer Order</Link>
          <Link to="/change-password">Change Password</Link>
          <Link to="/Users">Users</Link>
          <Link to="/CustomerFeedback">CustomerFeedback</Link>




          
          <a onClick={confirmLogout}>Logout</a>
        </nav>

        
    )
}
