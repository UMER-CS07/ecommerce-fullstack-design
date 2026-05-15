import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import authService from '../services/authService';
import './navbar.css';

const LogoMark = () => (
  <svg width="49" height="49" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.25 8.25H15.75V16.5H6.25V8.25Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8.05 8.25C8.05 5.97 9.45 4.5 11 4.5C12.55 4.5 13.95 5.97 13.95 8.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.1 11.1L11 12.15L12.9 11.1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2.4 4.5L6 8.1L9.6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 12.25C14.2091 12.25 16 10.4591 16 8.25C16 6.04086 14.2091 4.25 12 4.25C9.79086 4.25 8 6.04086 8 8.25C8 10.4591 9.79086 12.25 12 12.25Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M5.5 19.5C6.4 16.7 8.7 15.25 12 15.25C15.3 15.25 17.6 16.7 18.5 19.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const MessageIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.5 5.75H19.5V15.1H12.55L8.35 18.8V15.1H4.5V5.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M7.9 9.2H16.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M7.9 12.05H12.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const HeartIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 20.1L10.7 18.85C5.8 14.45 3 11.95 3 8.55C3 5.95 5 4 7.55 4C9.05 4 10.35 4.7 11.2 5.85C12.05 4.7 13.35 4 14.85 4C17.4 4 19.4 5.95 19.4 8.55C19.4 11.95 16.6 14.45 11.7 18.85L12 20.1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const CartIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3.8 6H5.8L7 15.3H17.8L19 8.9H6.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.7 5.2H8.9C9.2 5.2 9.43 5.38 9.5 5.66L10.1 8.1H18.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.7 19.2C9.45 19.2 10.05 18.6 10.05 17.85C10.05 17.1 9.45 16.5 8.7 16.5C7.95 16.5 7.35 17.1 7.35 17.85C7.35 18.6 7.95 19.2 8.7 19.2Z" fill="currentColor" />
    <path d="M16 19.2C16.75 19.2 17.35 18.6 17.35 17.85C17.35 17.1 16.75 16.5 16 16.5C15.25 16.5 14.65 17.1 14.65 17.85C14.65 18.6 15.25 19.2 16 19.2Z" fill="currentColor" />
  </svg>
);

const AdminIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 3L4 7v5c0 5.25 3.4 10.15 8 11.25C16.6 22.15 20 17.25 20 12V7l-8-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M9 12.5l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Navbar = ({ searchQuery = '', onSearchChange = () => {} }) => {
  const location = useLocation();
  const hideCategoryBlock = location.pathname.startsWith('/cart') || location.pathname.startsWith('/web-cart');
  const navClassName = hideCategoryBlock ? 'nb nbCartPage' : 'nb';

  const { cartCount } = useCart();
  const [user, setUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const onUserUpdate = () => setUser(authService.getCurrentUser());
    
    window.addEventListener('userUpdated', onUserUpdate);
    window.addEventListener('storage', onUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', onUserUpdate);
      window.removeEventListener('storage', onUserUpdate);
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.dispatchEvent(new Event('userUpdated'));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <nav className={navClassName}>
      <div className="nbTop">
        <Link to="/" className="brand">
          <div className="logo">
            <span className="logoShadow" aria-hidden="true" />
            <span className="logoMark" aria-hidden="true">
              <LogoMark />
            </span>
          </div>
          <span className="name">Brand</span>
        </Link>

        <form className="search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {!hideCategoryBlock && (
            <button type="button" className="cat">
              <span>All category</span>
              <ChevronDown />
            </button>
          )}
          <button type="button" className="btn">Search</button>
        </form>

        <div className="icons">
          {user ? (
            <button type="button" className="item" onClick={handleLogout}>
              <UserIcon />
              <span className="truncate max-w-[100px]">Logout ({user.email.split('@')[0]})</span>
            </button>
          ) : (
            <Link to="/login" className="item">
              <UserIcon />
              <span>Login/Signup</span>
            </Link>
          )}
          <button type="button" className="item">
            <MessageIcon />
            <span>Message</span>
          </button>
          <button type="button" className="item">
            <HeartIcon />
            <span>Orders</span>
          </button>
          <Link to="/cart" className="item" aria-label="My cart">
            <CartIcon />
            <span>My cart</span>
            {cartCount > 0 && <span className="cartBadge" aria-hidden="true">{cartCount}</span>}
          </Link>
          {user && user.admin && (
            <Link to="/admin" className="item">
              <AdminIcon />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </div>

      {!hideCategoryBlock && (
        <div className="nb2">
          <div className="nb2Inner">
            <div className="nb2Left">
              <button type="button" className="catBtn">
                <span className="bars">
                  <span />
                  <span />
                  <span />
                </span>
                <span>All category</span>
              </button>
              <button type="button" className="nlink">Hot offers</button>
              <button type="button" className="nlink">Gift boxes</button>
              <button type="button" className="nlink">Projects</button>
              <button type="button" className="nlink">Menu item</button>
              <button type="button" className="nlink">
                <span>Help</span>
                <ChevronDown />
              </button>
            </div>

            <div className="nb2Lang">
              <button type="button" className="nlink">
                <span>English, USD</span>
                <ChevronDown />
              </button>
            </div>

            <div className="nb2Ship">
              <button type="button" className="nlink">
                <span>Ship to</span>
                <span className="flag" aria-hidden="true" />
                <ChevronDown />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
