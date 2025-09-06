import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../api/user";
import { logoutUser } from "../api/auth.js";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "../Components/Header";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", quantity: 1, category: "", condition: "new", image_url: "" });
  const [productError, setProductError] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: "", quantity: 1, category: "", condition: "new", image_url: "" });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: ""
  });

  // Load user profile
  useEffect(() => {
    getUserProfile()
      .then((data) => {
        console.log("Profile data received:", data);
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          avatar: data.avatar || ""
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    updateUserProfile(formData)
      .then((data) => {
        console.log("Profile updated:", data);
        setUser(data);
        setEditMode(false);
        toast.success("Profile updated!");
      })
      .catch((error) => {
        console.error("Update failed:", error);
        toast.error("Update failed");
      });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4"></div>
          <p className="text-xl text-gray-700">Failed to load profile</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={formData.avatar || "https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=U"}
                        alt="avatar"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{user.name}</h2>
                      <p className="text-blue-100 text-lg">{user.email}</p>
                      <p className="text-blue-200 text-sm">
                        Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-8">
                {editMode ? (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                      <input
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        placeholder="https://example.com/your-photo.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded-lg transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                      <button
                        onClick={() => setEditMode(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Full Name</h4>
                          </div>
                          <p className="text-gray-700 text-lg">{user.name}</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Email Address</h4>
                          </div>
                          <p className="text-gray-700 text-lg">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Bio</h4>
                          </div>
                          <p className="text-gray-700 text-lg">{user.bio || "No bio added yet"}</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Member Since</h4>
                          </div>
                          <p className="text-gray-700 text-lg">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/myproducts')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-xl transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">My Products</p>
                    <p className="text-blue-100 text-sm">Manage your listings</p>
                  </div>
                  <svg className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate('/addnew')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-xl transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Add New Product</p>
                    <p className="text-green-100 text-sm">Create a new listing</p>
                  </div>
                  <svg className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate('/previous-purchases')}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-4 rounded-xl transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">My Purchases</p>
                    <p className="text-purple-100 text-sm">View order history</p>
                  </div>
                  <svg className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;