import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🧩 Admin imports
import MasterPage from "./Admin/Layouts/MasterPage";
import Dashboard from "./Admin/Dashboard";
import Categories from "./Admin/Categories";
import ProductForm from "./Admin/FoodMaster";
import ProductList from "./Admin/FoodList";
import AdminCart from "./Admin/Admincart";
import ChangePassword from "./Admin/ChangePassword";
import AdminLogin from "./Admin/AdminLogin";
import Users from "./Admin/Users";
import CustomerFeedback from "./Admin/CustomerFeedback";
// 🍕 User imports
import UserMasterPage from "./User/layouts/masterpage";
import HomePage from "./User/home";
import MenuPage from "./User/Menu";
import ContactPage from "./User/Contact";
import AboutPage from "./User/About";
import CartPage from "./User/Cart";
import UserRegister from "./User/UserRegister";
import UserLogin from "./User/UserLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import YourOrders from "./User/YourOrders"; // ✅ New page import

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🧩 ADMIN SIDE ROUTES */}
        <Route path="/SignIn" element={<AdminLogin />} />

        <Route
          path="/Dashboard"
          element={
            <MasterPage
              title="Dashboard"
              breadcrumbLinks={[
                { label: "Home", url: "/Dashboard" },
                { label: "Dashboard" },
              ]}
              Component={<Dashboard />}
            />
          }
        />

        <Route
          path="/categories"
          element={
            <MasterPage
              title="Categories"
              breadcrumbLinks={[
                { label: "Home", url: "/" },
                { label: "Categories" },
              ]}
              Component={<Categories />}
            />
          }
        />

        <Route
          path="/food"
          element={
            <MasterPage
              title="Food Master"
              breadcrumbLinks={[
                { label: "Home", url: "/" },
                { label: "Food" },
              ]}
              Component={<ProductForm />}
            />
          }
        />

        <Route
          path="/food-list"
          element={
            <MasterPage
              title="Food List"
              breadcrumbLinks={[
                { label: "Home", url: "/" },
                { label: "Food List" },
              ]}
              Component={<ProductList />}
            />
          }
        />

        <Route
          path="/admincart"
          element={
            <MasterPage
              title="Customer Orders"
              breadcrumbLinks={[
                { label: "Home", url: "/Dashboard" },
                { label: "Customer Orders" },
              ]}
              Component={<AdminCart />}
            />
          }
        />
   <Route
          path="/Users"
          element={
            <MasterPage
              title="Users"
              breadcrumbLinks={[
                { label: "Home", url: "/" },
                { label: "Users" },
              ]}
              Component={<Users />}
            />
          }
        />
<Route
          path="/CustomerFeedback"
          element={
            <MasterPage
              title="CustomerFeedback"
              breadcrumbLinks={[
                { label: "Home", url: "/" },
                { label: "CustomerFeedback" },
              ]}
              Component={<CustomerFeedback />}
            />
          }
        />
        <Route
          path="/change-password"
          element={
            <MasterPage
              title="Change Password"
              breadcrumbLinks={[
                { label: "Home", url: "/" },
                { label: "Change Password" },
              ]}
              Component={<ChangePassword />}
            />
          }
        />

        {/* 🍕 USER SIDE ROUTES */}
        {/* Public routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/" element={<UserRegister />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <UserMasterPage
                title="Home"
                breadcrumbLinks={[
                  { label: "Home", url: "/" },
                  { label: "Home" },
                ]}
                Component={<HomePage />}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Menu"
          element={
            <ProtectedRoute>
              <UserMasterPage
                title="Menu"
                breadcrumbLinks={[
                  { label: "Home", url: "/" },
                  { label: "Menu" },
                ]}
                Component={<MenuPage />}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Cart"
          element={
            <ProtectedRoute>
              <UserMasterPage
                title="Cart"
                breadcrumbLinks={[
                  { label: "Home", url: "/" },
                  { label: "Cart" },
                ]}
                Component={<CartPage />}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/About"
          element={
            <ProtectedRoute>
              <UserMasterPage
                title="About"
                breadcrumbLinks={[
                  { label: "Home", url: "/" },
                  { label: "About" },
                ]}
                Component={<AboutPage />}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Contact"
          element={
            <ProtectedRoute>
              <UserMasterPage
                title="Contact"
                breadcrumbLinks={[
                  { label: "Home", url: "/" },
                  { label: "Contact" },
                ]}
                Component={<ContactPage />}
              />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW PAGE — USER ORDER HISTORY */}
        <Route
          path="/YourOrders"
          element={
            <ProtectedRoute>
              <UserMasterPage
                title="Your Orders"
                breadcrumbLinks={[
                  { label: "Home", url: "/" },
                  { label: "Your Orders" },
                ]}
                Component={<YourOrders />}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
