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
  const [isLoading, setIsLoading] = useState(false); // 🍔 animation control

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Submitting login request:", {
        Email: values.email,
        Password: values.password,
      });

      try {
        const response = await postMethod("Registeration/login", {
          Email: values.email,
          Password: values.password,
        });

        console.log("Login Response:", response);

        if (response.Status === "OK") {
          const user = response.User || response.Result;

          localStorage.setItem("UserName", user?.Name || user?.Fullname || "");
          localStorage.setItem("UserEmail", user?.Email || "");
          localStorage.setItem("UserToken", response.Token || "");

          localStorage.setItem("RegisterationId", user?._id || user?.Id || "");

          console.log("✅ Saved RegisterationId:", localStorage.getItem("RegisterationId"));

          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            navigate("/home");
          }, 2000);
        }
        else {
          alert(response.Message || "Invalid Username or Password");
        }
      } catch (error) {
        console.error("Login API error:", error.response || error);
        alert(
          "Something went wrong: " +
          (error.response?.data?.Message || error.message)
        );
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isLoading && (
        <div style={styles.overlay}>
          <div style={styles.foodContainer}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" // 🍔 burger icon
              alt="burger"
              style={styles.foodIcon}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" // ☕ coffee icon
              alt="coffee"
              style={styles.foodIcon2}
            />
            <h2 style={styles.loadingText}>Welcome to MOONLIGHT CAFE...</h2>
          </div>
        </div>
      )}

      <div
        className="card shadow-lg p-4"
        style={{
          width: "420px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
          zIndex: 2,
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#ff5200" }}>
          User Login
        </h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="text"
              name="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""
                }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
                }`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-100"
            style={{
              background: "linear-gradient(90deg, #ff7a00, #ff5200)",
              border: "none",
              color: "white",
              padding: "10px",
              borderRadius: "25px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            Login
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

// 🍕 Animation styles
const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    animation: "fadeIn 0.3s ease-in-out",
  },
  foodContainer: {
    textAlign: "center",
    animation: "popIn 0.6s ease-out",
  },
  foodIcon: {
    width: "100px",
    animation: "bounce 1s infinite ease-in-out",
  },
  foodIcon2: {
    width: "80px",
    marginLeft: "20px",
    animation: "spin 2s linear infinite",
  },
  loadingText: {
    marginTop: "15px",
    color: "#ff5200",
    fontWeight: "bold",
    fontSize: "1.3rem",
    letterSpacing: "1px",
  },
};
