import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from "../api/product.js";

const AddNewProduct = () => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", quantity: 1, category: "", condition: "new", image_url: "" });
  const [productError, setProductError] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: "", quantity: 1, category: "", condition: "new", image_url: "" });

  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleCreateProduct = async () => {
    setProductError("");
    try {
      const created = await createProduct(axiosInstance, { ...productForm, price: Number(productForm.price) });
      setProducts([created, ...products]);
      setProductForm({ name: "", description: "", price: "", quantity: 1, category: "", condition: "new", image_url: "" });
    } catch (err) {
      setProductError(err?.response?.data?.message || err?.message || "Failed to create product");
    }
  };

  return (
    <>
    {/* Add New Product Section */}
    <div className="bg-white shadow-lg rounded-2xl p-6 mt-6">
    <h2 className="text-xl font-bold mb-6">Add New Product</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <input 
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        name="name" 
        value={productForm.name} 
        onChange={handleProductChange} 
        placeholder="Product Name" 
      />
      <input 
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        name="price" 
        value={productForm.price} 
        onChange={handleProductChange} 
        placeholder="Price" 
        type="number"
      />
      <input 
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        name="quantity" 
        value={productForm.quantity} 
        onChange={handleProductChange} 
        placeholder="Quantity" 
        type="number"
      />
      <input 
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        name="category" 
        value={productForm.category} 
        onChange={handleProductChange} 
        placeholder="Category" 
      />
      <input 
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        name="image_url" 
        value={productForm.image_url} 
        onChange={handleProductChange} 
        placeholder="Image URL" 
      />
      <select 
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        name="condition" 
        value={productForm.condition} 
        onChange={handleProductChange}
      >
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="refurbished">Refurbished</option>
      </select>
      <textarea 
        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent col-span-1 md:col-span-2" 
        name="description" 
        value={productForm.description} 
        onChange={handleProductChange} 
        placeholder="Product Description" 
        rows="3"
      />
    </div>
    <button 
      onClick={handleCreateProduct} 
      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
    >
      Add Product
    </button>
    {productError && <p className="text-red-600 text-sm mt-3">{productError}</p>}
  </div>
  </>

  )
}

export default AddNewProduct