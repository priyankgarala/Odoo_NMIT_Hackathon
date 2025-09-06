import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from "../api/product.js";
import { toast } from "react-hot-toast";
import Header from '../Components/Header';

const AddNewProduct = () => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    quantity: 1, 
    category: "", 
    condition: "new", 
    image_url: "" 
  });
  const [productError, setProductError] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    quantity: 1, 
    category: "", 
    condition: "new", 
    image_url: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Clothing & Fashion",
    "Home & Garden",
    "Sports & Outdoors",
    "Books & Media",
    "Health & Beauty",
    "Automotive",
    "Toys & Games",
    "Food & Beverages",
    "Other"
  ];

  const conditions = [
    { value: "new", label: "New", description: "Brand new, unused item" },
    { value: "like_new", label: "Like New", description: "Excellent condition, barely used" },
    { value: "good", label: "Good", description: "Good condition, minor wear" },
    { value: "fair", label: "Fair", description: "Fair condition, some wear" },
    { value: "poor", label: "Poor", description: "Poor condition, significant wear" }
  ];

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
    
    // Update image preview when image URL changes
    if (name === 'image_url') {
      setImagePreview(value);
    }
  };

  const handleCreateProduct = async () => {
    setProductError("");
    setIsSubmitting(true);
    
    // Basic validation
    if (!productForm.name.trim()) {
      setProductError("Product name is required");
      setIsSubmitting(false);
      return;
    }
    if (!productForm.price || productForm.price <= 0) {
      setProductError("Please enter a valid price");
      setIsSubmitting(false);
      return;
    }
    if (!productForm.category) {
      setProductError("Please select a category");
      setIsSubmitting(false);
      return;
    }
    if (!productForm.description.trim()) {
      setProductError("Product description is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const created = await createProduct(axiosInstance, { 
        ...productForm, 
        price: Number(productForm.price) 
      });
      setProducts([created, ...products]);
      setProductForm({ 
        name: "", 
        description: "", 
        price: "", 
        quantity: 1, 
        category: "", 
        condition: "new", 
        image_url: "" 
      });
      setImagePreview("");
      toast.success("Product added successfully!");
    } catch (err) {
      setProductError(err?.response?.data?.message || err?.message || "Failed to create product");
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Create New Listing</h2>
                <p className="text-green-100">Add your product to start selling</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleCreateProduct(); }}>
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                      name="name" 
                      value={productForm.name} 
                      onChange={handleProductChange} 
                      placeholder="Enter product name" 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                      name="category" 
                      value={productForm.category} 
                      onChange={handleProductChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description *
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none" 
                    name="description" 
                    value={productForm.description} 
                    onChange={handleProductChange} 
                    placeholder="Describe your product in detail..." 
                    rows="4"
                    required
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  Pricing & Inventory
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input 
                        className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                        name="price" 
                        value={productForm.price} 
                        onChange={handleProductChange} 
                        placeholder="0.00" 
                        type="number"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                      name="quantity" 
                      value={productForm.quantity} 
                      onChange={handleProductChange} 
                      placeholder="1" 
                      type="number"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                      name="condition" 
                      value={productForm.condition} 
                      onChange={handleProductChange}
                    >
                      {conditions.map((condition) => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Product Image
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                      name="image_url" 
                      value={productForm.image_url} 
                      onChange={handleProductChange} 
                      placeholder="https://example.com/image.jpg" 
                      type="url"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter a valid image URL</p>
                  </div>
                  
                  {/* Image Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`${imagePreview ? 'hidden' : 'flex'} flex-col items-center text-gray-400`}>
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Image preview will appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {productError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium">{productError}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Product Listing
                    </>
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNewProduct