import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getMethod, postMethod } from "../APIService";

const validationSchema = Yup.object({
  ProductName: Yup.string().required("Product Name is required"),
  Description: Yup.string().required("Description is required"),
  Price: Yup.number().required("Price is required").typeError("Price must be a number"),
  base64: Yup.string().required("Image is required"),
  CategoryId: Yup.string().required("Category is required"),
  CategoryType: Yup.string().required("Category type is required"),
  Available: Yup.boolean().required(),
});

const ProductForm = () => {
  const [success, setSuccess] = useState("");
  const [apiErrors, setApiErrors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  // 🧠 Formik Setup
  const formik = useFormik({
    initialValues: {
      ProductName: "",
      Description: "",
      Price: "",
      base64: "",
      CategoryType: "", // Veg / Non-Veg
      CategoryId: "",
      Available: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setApiErrors([]);
      setSuccess("");
      try {
        const response = await postMethod("product/save", values);
        if (response.Status === "OK") {
          setSuccess(response.Result);
          resetForm();
        } else {
          setApiErrors([response.Result]);
        }
      } catch (err) {
        const resErrors = err.response?.data?.Result;
        setApiErrors(Array.isArray(resErrors) ? resErrors : [resErrors || "Unknown error"]);
      }
    },
  });

  // 🖼️ Convert uploaded image to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      formik.setFieldValue("base64", base64String);
    };

    if (file) reader.readAsDataURL(file);
  };

  // 🧾 Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getMethod("category/list");
      if (response.Status === "OK") setCategories(response.Result);
    };
    fetchCategories();
  }, []);

  // 🥦 Filter categories dynamically based on type
  useEffect(() => {
    if (formik.values.CategoryType) {
      const filtered = categories.filter(
        (cat) => cat.type?.toLowerCase() === formik.values.CategoryType.toLowerCase()
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [formik.values.CategoryType, categories]);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "900px" }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Add New Product</h3>

          {/* ✅ Success Message */}
          {success && <div className="alert alert-success">{success}</div>}

          {/* ❌ Error Message */}
          {apiErrors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {apiErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 🧾 Product Form */}
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3">
              {/* 🟢 Category Type */}
              <div className="col-md-6">
                <label className="form-label">Category Type</label>
                <select
                  name="CategoryType"
                  value={formik.values.CategoryType}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("CategoryId", ""); // reset category when type changes
                  }}
                  className={`form-select ${
                    formik.touched.CategoryType && formik.errors.CategoryType ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
                {formik.touched.CategoryType && formik.errors.CategoryType && (
                  <div className="invalid-feedback">{formik.errors.CategoryType}</div>
                )}
              </div>

              {/* 🏷️ Category */}
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  name="CategoryId"
                  value={formik.values.CategoryId}
                  onChange={formik.handleChange}
                  className={`form-select ${
                    formik.touched.CategoryId && formik.errors.CategoryId ? "is-invalid" : ""
                  }`}
                  disabled={!formik.values.CategoryType}
                >
                  <option value="">
                    {formik.values.CategoryType
                      ? `Select ${formik.values.CategoryType} Category`
                      : "Select Category Type First"}
                  </option>
                  {filteredCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
                {formik.touched.CategoryId && formik.errors.CategoryId && (
                  <div className="invalid-feedback">{formik.errors.CategoryId}</div>
                )}
              </div>

              {/* 🧾 Product Name */}
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="ProductName"
                  className={`form-control ${
                    formik.touched.ProductName && formik.errors.ProductName ? "is-invalid" : ""
                  }`}
                  value={formik.values.ProductName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ProductName && formik.errors.ProductName && (
                  <div className="invalid-feedback">{formik.errors.ProductName}</div>
                )}
              </div>

              {/* 📝 Description */}
              <div className="col-md-6">
                <label className="form-label">Description</label>
                <textarea
                  name="Description"
                  className={`form-control ${
                    formik.touched.Description && formik.errors.Description ? "is-invalid" : ""
                  }`}
                  value={formik.values.Description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="2"
                />
                {formik.touched.Description && formik.errors.Description && (
                  <div className="invalid-feedback">{formik.errors.Description}</div>
                )}
              </div>

              {/* 💰 Price */}
              <div className="col-md-4">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="Price"
                  className={`form-control ${
                    formik.touched.Price && formik.errors.Price ? "is-invalid" : ""
                  }`}
                  value={formik.values.Price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.Price && formik.errors.Price && (
                  <div className="invalid-feedback">{formik.errors.Price}</div>
                )}
              </div>

              {/* ✅ Availability Toggle */}
              <div className="col-md-4">
                <label className="form-label d-block">Availability</label>
                <button
                  type="button"
                  className={`btn w-100 ${
                    formik.values.Available ? "btn-success" : "btn-danger"
                  }`}
                  onClick={() => formik.setFieldValue("Available", !formik.values.Available)}
                >
                  {formik.values.Available ? "Available ✅" : "Not Available ❌"}
                </button>
              </div>

              {/* 🖼️ Upload Image */}
              <div className="col-md-4">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control ${
                    formik.touched.base64 && formik.errors.base64 ? "is-invalid" : ""
                  }`}
                  onChange={handleFileChange}
                  onBlur={() => formik.setFieldTouched("base64", true)}
                />
                {formik.touched.base64 && formik.errors.base64 && (
                  <div className="invalid-feedback">{formik.errors.base64}</div>
                )}
              </div>
            </div>

            {/* 💾 Submit Button */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-4">
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
