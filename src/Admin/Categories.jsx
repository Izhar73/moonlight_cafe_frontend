import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { categorySchema } from "../Schema";
import { deleteMethod, getMethod, postMethod, putMethod } from "../APIService";

export default function Categories() {
  const [initValue, setInitValue] = useState({
    Category: "",
    Description: "",
    Type: "Veg",
    id: null,
  });

  const [categories, setCategories] = useState([]);

  const resetForm = () => {
    setInitValue({
      Category: "",
      Description: "",
      Type: "Veg",
      id: null,
    });
  };

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: categorySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        category_name: values.Category,
        description: values.Description,
        type: values.Type,
      };

      try {
        let response;

        if (!values.id) {
          response = await postMethod("category/save", payload);
        } else {
          response = await putMethod(`category/update/${values.id}`, payload);
        }

        if (response.Status === "OK") {
          alert("✅ Category saved successfully");
          resetForm();
          getData();
        } else {
          alert("⚠️ Operation failed");
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    },
  });

  const { handleBlur, handleChange, handleSubmit, values, errors } = formik;

  const getData = async () => {
    try {
      const res = await getMethod("category/list");
      setCategories(Array.isArray(res.Result) ? res.Result : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const getDetail = (data) => {
    setInitValue({
      Category: data.category_name || "",
      Description: data.description || "",
      Type: data.type || "Veg",
      id: data._id, // ✅ IMPORTANT FIX
    });
  };

  const deleteCategory = async (id) => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await deleteMethod(`category/delete/${id}`);
        if (res.Status === "OK") {
          setCategories((prev) =>
            prev.filter((c) => c._id !== id)
          );
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="dashboard-body container mt-4">
      <div className="card shadow-sm">
        <form onSubmit={handleSubmit} className="card-body">
          <h4 className="mb-3 text-center">Manage Categories</h4>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                name="Category"
                value={values.Category}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${errors.Category ? "is-invalid" : ""}`}
              />
              {errors.Category && (
                <div className="invalid-feedback">{errors.Category}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="Description"
                value={values.Description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${errors.Description ? "is-invalid" : ""}`}
              />
              {errors.Description && (
                <div className="invalid-feedback">{errors.Description}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Type</label>
              <select
                name="Type"
                value={values.Type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>

            <div className="col-md-12 text-center mt-3">
              <button type="submit" className="btn btn-dark px-4 me-2">
                {values.id ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-danger px-4"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="table-responsive mt-4">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((o) => (
                    <tr key={o._id}>
                      <td>{o.category_name}</td>
                      <td>{o.description}</td>
                      <td>
                        <span
                          className={`badge ${
                            o.type === "Veg" ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {o.type}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => getDetail(o)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteCategory(o._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </section>
  );
}
