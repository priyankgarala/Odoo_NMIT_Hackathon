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
import MyProducts from "./pages/MyProducts";
import AddNewProduct from "./pages/AddNewProduct";


export default function App() {
  return (
    // routing for different pages
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
          <Route path="/previous-purchases" element={
            <PrivateRoute>
              <PreviousPurchasePage />
            </PrivateRoute>
          } />

          <Route path="/myproducts" element={
            <PrivateRoute>
              <MyProducts />
            </PrivateRoute>
          } />

          <Route path="/addnew" element={
            <PrivateRoute>
              <AddNewProduct />
            </PrivateRoute>
          } />
          
        </Routes>
      </Router>
    </CartProvider>
  );
}
