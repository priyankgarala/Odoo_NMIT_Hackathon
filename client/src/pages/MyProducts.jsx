import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from "../api/product.js";

const MyProducts = () => {
  
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", quantity: 1, category: "", condition: "new", image_url: "" });
  const [productError, setProductError] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: "", quantity: 1, category: "", condition: "new", image_url: "" });

  const navigate = useNavigate();
    // Load user profile
    useEffect(() => {
        // Load my products
        getMyProducts(axiosInstance)
          .then(setProducts)
          .catch((error) => console.error("Failed to load products:", error));
      }, []);
    
      const handleUpdateProduct = async (id, updates) => {
        try {
          const updated = await updateProduct(axiosInstance, id, updates);
          setProducts(prev => prev.map(p => p._id === id ? updated : p));
        } catch (err) {
          alert(err?.response?.data?.message || err?.message || "Failed to update product");
        }
      };
    
      const handleDeleteProduct = async (id) => {
        try {
          await deleteProduct(axiosInstance, id);
          setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
          alert(err?.response?.data?.message || err?.message || "Failed to delete product");
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

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">My Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="border rounded-xl p-4 bg-white shadow hover:shadow-lg transition-shadow">
              {/* Product Image */}
              {p.image_url ? (
                <div 
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4 cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <img 
                    src={p.image_url} 
                    alt={p.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" 
                  />
                </div>
              ) : (
                <div 
                  className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center mb-4 cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-1">📦</div>
                    <p className="text-sm">No Image</p>
                  </div>
                </div>
              )}
              
              {/* Product Info */}
              <div className="space-y-3">
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">{p.name}</h3>
                  {p.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</p>
                  )}
                </div>
                
                {/* Price and Condition */}
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-blue-600">${p.price}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.condition === 'new' ? 'bg-green-100 text-green-800' :
                    p.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {p.condition?.charAt(0).toUpperCase() + p.condition?.slice(1) || 'New'}
                  </span>
                </div>
                
                {/* Category and Status */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {p.category && <span>Category: {p.category}</span>}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button 
                    onClick={() => handleUpdateProduct(p._id, { is_active: !p.is_active })} 
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      p.is_active 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {p.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  {editProductId === p._id ? (
                    <>
                      <button 
                        onClick={() => saveEditProduct(p._id)} 
                        className="px-3 py-1 rounded bg-green-600 text-white text-xs font-medium hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEditProduct} 
                        className="px-3 py-1 rounded bg-gray-400 text-white text-xs font-medium hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => startEditProduct(p)} 
                      className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDeleteProduct(p._id)} 
                    className="px-3 py-1 rounded bg-red-500 text-white text-xs font-medium hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>

                {/* Edit Form */}
                {editProductId === p._id && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
                    <input 
                      className="w-full border p-2 rounded text-sm" 
                      name="name" 
                      value={editForm.name} 
                      onChange={(e)=>setEditForm({...editForm,[e.target.name]:e.target.value})} 
                      placeholder="Name" 
                    />
                    <input 
                      className="w-full border p-2 rounded text-sm" 
                      name="price" 
                      value={editForm.price} 
                      onChange={(e)=>setEditForm({...editForm,[e.target.name]:e.target.value})} 
                      placeholder="Price" 
                    />
                    <input 
                      className="w-full border p-2 rounded text-sm" 
                      name="quantity" 
                      value={editForm.quantity} 
                      onChange={(e)=>setEditForm({...editForm,[e.target.name]:e.target.value})} 
                      placeholder="Quantity" 
                    />
                    <input 
                      className="w-full border p-2 rounded text-sm" 
                      name="category" 
                      value={editForm.category} 
                      onChange={(e)=>setEditForm({...editForm,[e.target.name]:e.target.value})} 
                      placeholder="Category" 
                    />
                    <input 
                      className="w-full border p-2 rounded text-sm" 
                      name="image_url" 
                      value={editForm.image_url} 
                      onChange={(e)=>setEditForm({...editForm,[e.target.name]:e.target.value})} 
                      placeholder="Image URL" 
                    />
                    <select 
                      className="w-full border p-2 rounded text-sm" 
                      name="condition" 
                      value={editForm.condition} 
                      onChange={(e)=>setEditForm({...editForm,[e.target.name]:e.target.value})}
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                    <textarea 
                      className="w-full border p-2 rounded text-sm" 
                      name="description" 
                      value={editForm.description} 
                      onChange={(e)=>setEditForm({...editForm,[e.target.name]:e.target.value})} 
                      placeholder="Description" 
                      rows="3"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default MyProducts