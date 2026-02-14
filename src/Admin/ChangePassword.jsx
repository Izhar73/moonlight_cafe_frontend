import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { putMethod } from "../APIService";

// Validation Schema
const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ChangePassword() {
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {


      console.log({
        newPassword: values.newPassword,
        oldPassword: values.currentPassword,
        id: localStorage.getItem("AdminId")
      });


      const reponse = await putMethod("Admin/ChangePassword", {
        newPassword: values.newPassword,
        oldPassword: values.currentPassword,
        id: localStorage.getItem("AdminId")
      });

      //alert(reponse);
      console.log("Password Changed:", reponse);
      alert("Password updated successfully!");
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Change Password</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Current Password */}
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className={`form-control ${
                formik.touched.currentPassword && formik.errors.currentPassword
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter current password"
            />
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <div className="invalid-feedback">
                {formik.errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              className={`form-control ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter new password"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="invalid-feedback">
                {formik.errors.newPassword}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm new password"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="invalid-feedback">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}