import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Product from "./pages/Product";
import Category from "./pages/Category";
import AddProductCategory from "./pages/AddProductCategory";

/**
 * Main application routing configuration
 * Establishes navigational flow between authentication, dashboard, and management modules.
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to={'/login'} replace/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/user" element={<User/>} />
        <Route path="/get-product" element={<Product/>} />
        <Route path="/add-product-category" element={<AddProductCategory/>} />
        <Route path="/category" element={<Category/>} />
      </Routes>
    </Router>
  );
}

export default App;
