import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postMethod } from "../APIService";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Full Name is required"),
    contactno: Yup.string()
      .required("Contact Number is required")
      .matches(/^[0-9]{10}$/, "Enter valid 10-digit number"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().required("Address is required"),
    username: Yup.string()
      .required("Username is required")
      .min(3, "Minimum 3 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Minimum 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      fullname: "",
      contactno: "",
      email: "",
      address: "",
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await postMethod("Registeration/register", {
          Name: values.fullname,
          Mobile: values.contactno,
          Email: values.email,
          Address: values.address,
          UserName: values.username,
          Password: values.password,
        });

        if (response?.Status === "OK") {
          localStorage.setItem("FullName", values.fullname);
          localStorage.setItem("UserName", values.username);

          alert("✅ Registration Successful!");
          navigate("/Login");
        } else {
          alert(response?.Message || "Registration Failed!");
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
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
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#ff5200" }}>
          User Registration
        </h2>

        <form onSubmit={formik.handleSubmit}>
          {["fullname", "contactno", "email", "address", "username", "password"].map(
            (field) => (
              <div className="mb-3" key={field}>
                <label className="form-label text-capitalize">
                  {field.replace(/no/, " No")}
                </label>

                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  className={`form-control ${
                    formik.touched[field] && formik.errors[field]
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={`Enter your ${field}`}
                />

                {formik.touched[field] && formik.errors[field] && (
                  <div className="invalid-feedback">
                    {formik.errors[field]}
                  </div>
                )}
              </div>
            )
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-100"
            style={{
              background: "linear-gradient(90deg, #ff7a00, #ff5200)",
              border: "none",
              color: "white",
              padding: "10px",
              borderRadius: "25px",
              fontWeight: "600",
            }}
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#ff5200", fontWeight: "600" }}
            onClick={() => navigate("/Login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
