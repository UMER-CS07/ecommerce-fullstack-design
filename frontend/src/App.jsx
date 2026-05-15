import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/navbar';
import SiteFooter from './components/site-footer';
import Home from './pages/web-main';
import ProductListing from './pages/ProductListing';
import WebGridView from './pages/web-gridview';
import WebListView from './pages/web-listview';
import ProductDetails from './pages/product-details';
import WebCart from './pages/web-cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const FooterSlot = () => {
    const location = useLocation();
    const showNewsletter = !location.pathname.startsWith('/product/') && !location.pathname.startsWith('/cart') && !location.pathname.startsWith('/web-cart');

    return <SiteFooter showNewsletter={showNewsletter} />;
  };

  return (
    <CartProvider>
    <Router>
      <div className="appShell">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="appMain">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/home" element={<Home searchQuery={searchQuery} />} />
            <Route path="/products" element={<ProductListing searchQuery={searchQuery} />} />
            <Route path="/list-view" element={<WebListView searchQuery={searchQuery} />} />
            <Route path="/grid-view" element={<WebGridView searchQuery={searchQuery} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<WebCart />} />
            <Route path="/web-cart" element={<WebCart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <FooterSlot />
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
