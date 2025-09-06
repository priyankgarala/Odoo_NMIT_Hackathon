import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../api/user";
import { logoutUser } from "../api/auth.js";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

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


  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">Failed to load profile</p>;

  return (
    <>
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img
              src={formData.avatar || "https://via.placeholder.com/100"}
              alt="avatar"
              className="w-24 h-24 rounded-full border"
            />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <hr className="my-4" />

        {editMode ? (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write your bio..."
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="Profile picture URL"
              className="w-full border p-2 rounded"
            />

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-2xl font-semibold text-gray-700">Name:</p>
                <p className="text-xl text-gray-900">{user.name}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-2xl font-semibold text-gray-700">Email:</p>
                <p className="text-xl text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-700">Bio:</p>
                <p className="text-xl text-gray-900">{user.bio || "No bio yet"}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-700">Member Since:</p>
                <p className="text-xl text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
            <div className="mt-6 w-full">
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => navigate('/myproducts')}
            className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            My Product Listings
          </button>
          <button
            onClick={() => navigate('/addnew')}
            className="w-1/2 bg-red-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
            My Purchases
          </button>
        </div>
        
      
      
      
    </div>
    </>
  );
};

export default ProfilePage;
