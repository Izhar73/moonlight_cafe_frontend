import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postMethod } from "../APIService";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function UserLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const response = await postMethod("Registeration/login", {
          Email: values.email,
          Password: values.password,
        });

        console.log("Login Response:", response);

        // API Failure
        if (!response || response.Status !== "OK") {
          throw new Error(response?.Message || "Login failed");
        }

        const user = response.Result;

        // Save data safely
        localStorage.setItem("UserName", user?.Name || "");
        localStorage.setItem("UserEmail", user?.Email || "");
        localStorage.setItem("UserToken", response.Token || "");
        localStorage.setItem("RegisterationId", user?.Id || "");

        console.log("✅ User logged in:", user);

        // Smooth redirect
        setTimeout(() => {
          navigate("/home");
        }, 1200);

      } catch (error) {
        console.error("Login Error:", error);
        alert(error.message || "Something went wrong during login");
        setIsLoading(false);
      }
    },
  });

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "420px",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#ff5200" }}>
          User Login
        </h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label>Email</label>
            <input
              type="text"
              name="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn w-100"
            style={{
              background: "linear-gradient(90deg, #ff7a00, #ff5200)",
              color: "#fff",
              borderRadius: "25px",
              padding: "10px",
              fontWeight: "600",
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          New user?{" "}
          <span
            style={{ cursor: "pointer", color: "#ff5200", fontWeight: "600" }}
            onClick={() => navigate("/")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
