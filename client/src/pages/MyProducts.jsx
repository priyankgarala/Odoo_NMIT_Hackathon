import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from "../api/product.js";
import { toast } from "react-hot-toast";
import Header from '../Components/Header';

const MyProducts = () => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
    { value: "new", label: "New", color: "green" },
    { value: "like_new", label: "Like New", color: "blue" },
    { value: "good", label: "Good", color: "yellow" },
    { value: "fair", label: "Fair", color: "orange" },
    { value: "poor", label: "Poor", color: "red" }
  ];

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getMyProducts(axiosInstance);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleUpdateProduct = async (id, updates) => {
    try {
      const updated = await updateProduct(axiosInstance, id, updates);
      setProducts(prev => prev.map(p => p._id === id ? updated : p));
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(axiosInstance, id);
      setProducts(prev => prev.filter(p => p._id !== id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete product");
    }
  };

  const startEditProduct = (product) => {
    setEditProductId(product._id);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      quantity: product.quantity ?? 1,
      category: product.category || "",
      condition: product.condition || "new",
      image_url: product.image_url || "",
    });
  };

  const cancelEditProduct = () => {
    setEditProductId(null);
  };

  const saveEditProduct = async (id) => {
    const payload = {
      ...editForm,
      price: Number(editForm.price),
      quantity: Number(editForm.quantity),
    };
    await handleUpdateProduct(id, payload);
    setEditProductId(null);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && product.is_active) ||
                         (filterStatus === 'inactive' && !product.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'oldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'price_high':
        return (b.price || 0) - (a.price || 0);
      case 'price_low':
        return (a.price || 0) - (b.price || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getConditionColor = (condition) => {
    const conditionObj = conditions.find(c => c.value === condition);
    return conditionObj?.color || 'gray';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
            <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
            <button
              onClick={() => navigate("/addnew")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                <p className="text-gray-600">Total Products</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {products.filter(p => p.is_active).length}
                </p>
                <p className="text-gray-600">Active Products</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  ${products.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(2)}
                </p>
                <p className="text-gray-600">Total Value</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {products.reduce((sum, p) => sum + (p.quantity || 0), 0)}
                </p>
                <p className="text-gray-600">Total Stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search products..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory || filterStatus 
                ? "No products match your current filters. Try adjusting your search criteria."
                : "You haven't added any products yet. Start by creating your first listing!"
              }
            </p>
            <button
              onClick={() => navigate("/addnew")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Product Image */}
                <div 
                  className="aspect-square relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <div 
                    className="cursor-pointer mb-3"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  
                  {/* Price and Condition */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-green-600">${product.price}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getConditionColor(product.condition)}-100 text-${getConditionColor(product.condition)}-800`}>
                      {product.condition?.charAt(0).toUpperCase() + product.condition?.slice(1) || 'New'}
                    </span>
                  </div>
                  
                  {/* Category and Stock */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {product.category && (
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {product.category}
                      </span>
                    )}
                    <span className="text-xs">
                      Stock: {product.quantity || 0}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleUpdateProduct(product._id, { is_active: !product.is_active })} 
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        product.is_active 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {product.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    {editProductId === product._id ? (
                      <>
                        <button 
                          onClick={() => saveEditProduct(product._id)} 
                          className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button 
                          onClick={cancelEditProduct} 
                          className="px-3 py-2 rounded-lg bg-gray-400 text-white text-sm font-medium hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => startEditProduct(product)} 
                        className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    
                    <button 
                      onClick={() => confirmDelete(product)} 
                      className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Edit Form */}
                  {editProductId === product._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        name="name" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, [e.target.name]: e.target.value})} 
                        placeholder="Product Name" 
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          name="price" 
                          value={editForm.price} 
                          onChange={(e) => setEditForm({...editForm, [e.target.name]: e.target.value})} 
                          placeholder="Price" 
                          type="number"
                        />
                        <input 
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          name="quantity" 
                          value={editForm.quantity} 
                          onChange={(e) => setEditForm({...editForm, [e.target.name]: e.target.value})} 
                          placeholder="Quantity" 
                          type="number"
                        />
                      </div>
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        name="category" 
                        value={editForm.category} 
                        onChange={(e) => setEditForm({...editForm, [e.target.name]: e.target.value})} 
                        placeholder="Category" 
                      />
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        name="image_url" 
                        value={editForm.image_url} 
                        onChange={(e) => setEditForm({...editForm, [e.target.name]: e.target.value})} 
                        placeholder="Image URL" 
                      />
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        name="condition" 
                        value={editForm.condition} 
                        onChange={(e) => setEditForm({...editForm, [e.target.name]: e.target.value})}
                      >
                        {conditions.map(condition => (
                          <option key={condition.value} value={condition.value}>
                            {condition.label}
                          </option>
                        ))}
                      </select>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                        name="description" 
                        value={editForm.description} 
                        onChange={(e) => setEditForm({...editForm, [e.target.name]: e.target.value})} 
                        placeholder="Description" 
                        rows="3"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "<span className="font-semibold">{productToDelete?.name}</span>"? 
                This will permanently remove the product from your listings.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(productToDelete._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyProducts