import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postMethod } from "../APIService";
import { useNavigate } from "react-router-dom";


const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function AdminLogin() {

  const redirect = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Admin Login Data:", values);

      const response = await postMethod("Admin/Authetication", { UserName: values.username, Password: values.password })
      console.log(response);

      if (response.Status == "OK") {
        localStorage.setItem("Fullname", response.Result.FullName);
        localStorage.setItem("AdminId", response.Result._id);
        redirect("/Dashboard");
      }
      else {
        alert(response.Result);
      }
    },
  });

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.85)", // transparent white
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4">Admin Login</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className={`form-control ${formik.touched.username && formik.errors.username
                  ? "is-invalid"
                  : ""
                }`}
              placeholder="Enter your username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="invalid-feedback">{formik.errors.username}</div>
            )}
          </div>

        
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
                }`}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
