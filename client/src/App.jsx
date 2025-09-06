import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./Components/Login";
import Register from "./Components/Register";
import PrivateRoute from "./Components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import PreviousPurchasePage from "./pages/PreviousPurchasePage";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import MyProducts from "./pages/MyProducts";
import AddNewProduct from "./pages/AddNewProduct";
import ProductPage from "./pages/ProductPage";


export default function App() {
  return (
    // routing for different pages
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="/cart" element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <PreviousPurchasePage />
              </PrivateRoute>
            } />
            <Route path="/previous-purchases" element={
              <PrivateRoute>
                <PreviousPurchasePage />
              </PrivateRoute>
            } />

            <Route path="/my-products" element={
              <PrivateRoute>
                <MyProducts />
              </PrivateRoute>
            } />
            <Route path="/myproducts" element={
              <PrivateRoute>
                <MyProducts />
              </PrivateRoute>
            } />

            <Route path="/add-product" element={
              <PrivateRoute>
                <AddNewProduct />
              </PrivateRoute>
            } />
            <Route path="/addnew" element={
              <PrivateRoute>
                <AddNewProduct />
              </PrivateRoute>
            } />
            <Route path="/products" element={<ProductPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
