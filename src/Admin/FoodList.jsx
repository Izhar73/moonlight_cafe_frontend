import React, { useEffect, useState } from "react";
import { getMethod, deleteMethod, putMethod } from "../APIService";

export default function FoodList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getMethod("product/list");
      if (res.Status === "OK") {
        setProducts(res.Result || []);
      } else {
        alert("Failed to fetch product list!");
      }
    } catch (err) {
      console.error("Failed to fetch product list", err);
    }
  };

  /* ===========================
     ✅ PROPER FILTERING (BASED ON TYPE)
     =========================== */

  const vegPizzas = products.filter(
    (item) =>
      item.CategoryName?.toLowerCase() === "pizza" &&
      item.Type === "Veg"
  );

  const nonVegPizzas = products.filter(
    (item) =>
      item.CategoryName?.toLowerCase() === "pizza" &&
      item.Type === "Non-Veg"
  );

  const vegBurgers = products.filter(
    (item) =>
      item.CategoryName?.toLowerCase() === "burger" &&
      item.Type === "Veg"
  );

  const nonVegBurgers = products.filter(
    (item) =>
      item.CategoryName?.toLowerCase() === "burger" &&
      item.Type === "Non-Veg"
  );

  /* ===========================
     DELETE
     =========================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await deleteMethod(`product/delete/${id}`);
      if (res.Status === "OK") {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        alert("Product deleted successfully!");
      } else {
        alert("Delete failed!");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ===========================
     EDIT
     =========================== */

  const openEditModal = (product) => {
    setSelectedProduct({ ...product });
    setNewImage(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await putMethod(
        `product/update/${selectedProduct._id}`,
        selectedProduct
      );

      if (res.Status === "OK") {
        alert("Product updated successfully!");
        setShowModal(false);
        fetchProducts();
      } else {
        alert("Update failed!");
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  /* ===========================
     TABLE RENDER
     =========================== */

  const renderTable = (data, title) => (
    <div className="my-5">
      <h3 className="fw-bold text-center mb-3">{title}</h3>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={`http://localhost:9600/Content/Product/${item.FileName}`}
                      alt={item.ProductName}
                      width="80"
                      height="80"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/80?text=No+Image")
                      }
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  </td>

                  <td>{item.ProductName}</td>
                  <td>{item.Description}</td>
                  <td>₹{item.Price}</td>

                  <td>
                    {new Date(item.created_at).toLocaleDateString()}
                    <br />
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ===========================
     RETURN UI
     =========================== */

  return (
    <div className="container py-4">

      {renderTable(vegPizzas, "🍕 Veg Pizzas")}
      {renderTable(vegBurgers, "🍔 Veg Burgers")}
      {renderTable(nonVegPizzas, "🍕 Non-Veg Pizzas")}
      {renderTable(nonVegBurgers, "🍔 Non-Veg Burgers")}

      {showModal && selectedProduct && (
        <>
          <div className="modal show fade d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleUpdate}>
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Product</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">

                    <div className="mb-2">
                      <label>Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ProductName"
                        value={selectedProduct.ProductName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-2">
                      <label>Description</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Description"
                        value={selectedProduct.Description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-2">
                      <label>Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="Price"
                        value={selectedProduct.Price}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-2">
                      <label>Type</label>
                      <select
                        className="form-control"
                        name="Type"
                        value={selectedProduct.Type}
                        onChange={handleChange}
                      >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                      </select>
                    </div>

                    <div className="mb-2">
                      <label>Update Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleImageChange}
                      />
                    </div>

                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="btn btn-success">
                      Update
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          ></div>
        </>
      )}

    </div>
  );
}
