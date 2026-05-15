import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import shirtImg from '../assets/shirt.png';
import jacketImg from '../assets/jacket.png';
import lampImg from '../assets/lamp.png';
import mobileImg from '../assets/mobile.png';
import laptopImg from '../assets/laptop.png';
import cameraImg from '../assets/camera.png';
import watchImg from '../assets/watch.png';
import cardImg from '../assets/card.png';
import './web-cart.css';

const assetModules = import.meta.glob('../assets/*', {
  eager: true,
  import: 'default',
});

const assetByName = Object.entries(assetModules).reduce((map, [path, assetUrl]) => {
  const fileName = path.split('/').pop();
  if (fileName) map[fileName] = assetUrl;
  return map;
}, {});

const resolveAsset = (fileName) => assetByName[fileName] || '';


const SecurePaymentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7.5 10V7.5C7.5 5.01 9.51 3 12 3C14.49 3 16.5 5.01 16.5 7.5V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 13V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const SupportIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4.5 6.5H19.5V15.2H12.6L8.9 18V15.2H4.5V6.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M8 9.8H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M8 12.3H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const DeliveryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3.5 8H13V16H3.5V8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M13 10H16.5L19.5 13.2V16H13" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M7 18.2C7.97 18.2 8.75 17.42 8.75 16.45C8.75 15.48 7.97 14.7 7 14.7C6.03 14.7 5.25 15.48 5.25 16.45C5.25 17.42 6.03 18.2 7 18.2Z" fill="currentColor" />
    <path d="M16.5 18.2C17.47 18.2 18.25 17.42 18.25 16.45C18.25 15.48 17.47 14.7 16.5 14.7C15.53 14.7 14.75 15.48 14.75 16.45C14.75 17.42 15.53 18.2 16.5 18.2Z" fill="currentColor" />
  </svg>
);

const savedItems = [
  {
    id: 1,
    title: 'GoPro HERO6 4K Action Camera - Black',
    price: '$29.50',
    image: cameraImg,
  },
  {
    id: 2,
    title: 'GoPro HERO6 4K Action Camera - Black',
    price: '$99.50',
    image: cameraImg,
  },
  {
    id: 3,
    title: 'GoPro HERO6 4K Action Camera - Black',
    price: '$99.50',
    image: watchImg,
  },
  {
    id: 4,
    title: 'GoPro HERO6 4K Action Camera - Black',
    price: '$99.50',
    image: laptopImg,
  },
];

const benefits = [
  { icon: <SecurePaymentIcon />, title: 'Secure payment', text: 'Have you ever finally just' },
  { icon: <SupportIcon />, title: 'Customer support', text: 'Have you ever finally just' },
  { icon: <DeliveryIcon />, title: 'Free delivery', text: 'Have you ever finally just' },
];

const CartIconSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3.8 6H5.8L7 15.3H17.8L19 8.9H6.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.7 19.2C9.45 19.2 10.05 18.6 10.05 17.85C10.05 17.1 9.45 16.5 8.7 16.5C7.95 16.5 7.35 17.1 7.35 17.85C7.35 18.6 7.95 19.2 8.7 19.2Z" fill="currentColor" />
    <path d="M16 19.2C16.75 19.2 17.35 18.6 17.35 17.85C17.35 17.1 16.75 16.5 16 16.5C15.25 16.5 14.65 17.1 14.65 17.85C14.65 18.6 15.25 19.2 16 19.2Z" fill="currentColor" />
  </svg>
);

const CartCard = ({ item }) => (
  <Link to="/products" className="savedCard">
    <img src={resolveAsset(item.image) || shirtImg} alt={item.title} className="savedCardImage" />
    <strong>{item.price}</strong>
    <p>
      <span className="savedCardTitleMain">GoPro HERO6 4K Action</span>
      <span className="savedCardTitleSuffix"> Camera- Black</span>
    </p>
    <span className="moveBtn" aria-label={`Move ${item.title} to cart`}>
      <CartIconSvg />
      <span>Move to cart</span>
    </span>
  </Link>
);

const WebCart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const subtotal = cartItems.reduce((sum, it) => sum + (Number(it.price) || 0) * Number(it.qty || 0), 0);
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <div className="cartPage">
      <div className="cartPageTitleRow">
        <h1>My cart ({cartItems.length})</h1>
      </div>

      <section className="cartTopGrid">
        <div className="cartListPanel">
          {cartItems.length === 0 ? (
            <div className="emptyCart">
              <p>Your cart is empty.</p>
              <Link to="/grid-view" className="backBtn">← Back to shop</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cartItemRow" key={item.id}>
                <img src={resolveAsset(item.image) || shirtImg} alt={item.name || item.title} className="cartItemImage" />
                <div className="cartItemBody">
                  <div className="cartItemTop">
                    <div>
                      <h3>{item.name || item.title}</h3>
                      {item.size || item.color || item.material ? (
                        <p>Size: {item.size}, Color: {item.color}, Material: {item.material}</p>
                      ) : null}
                      <span>Seller: {item.seller ?? 'Unknown'}</span>
                    </div>
                    <strong>${((Number(item.price) || 0)).toFixed(2)}</strong>
                  </div>
                  <div className="cartItemActions">
                    <div className="actionLinks">
                      <button type="button" className="removeBtn" onClick={() => removeFromCart(item.id)}>Remove</button>
                      <button type="button" className="saveBtn">Save for later</button>
                    </div>
                    <label className="qtySelectWrap">
                      <span>Qty:</span>
                      <select value={Number(item.qty)} aria-label={`Quantity for ${item.name || item.title}`} onChange={(e) => updateQuantity(item.id, Number(e.target.value))}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}> {n}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <div className="cartListFooter">
              <Link to="/grid-view" className="backBtn">← Back to shop</Link>
              <button type="button" className="removeAllBtn" onClick={clearCart}>Remove all</button>
            </div>
          )}
        </div>

        <aside className="cartSummaryPanel">
          <div className="couponBox">
            <h3>Have a coupon?</h3>
            <div className="couponInputRow">
              <input type="text" placeholder="Add coupon" />
              <button type="button">Apply</button>
            </div>
          </div>

          <div className="totalsBox">
            <div className="totalLine">
              <span>Subtotal:</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="totalLine">
              <span>Tax:</span>
              <strong className="taxValue">+ ${tax.toFixed(2)}</strong>
            </div>
            <div className="grandTotalLine">
              <span>Total:</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button type="button" className="checkoutBtn">Checkout</button>
            <div className="paymentLogos" aria-hidden="true">
              <img src={cardImg} alt="" />
              <img src={cardImg} alt="" />
              <img src={cardImg} alt="" />
              <img src={cardImg} alt="" />
            </div>
          </div>
        </aside>
      </section>

      <section className="benefitsRow">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="benefitCard">
            <span className="benefitIcon" aria-hidden="true">{benefit.icon}</span>
            <div>
              <strong>{benefit.title}</strong>
              <p>{benefit.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="savedLaterSection">
        <h2>Saved for later</h2>
        <div className="savedLaterGrid">
          {savedItems.map((item) => (
            <CartCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="promoBanner cartPromoBanner">
        <div>
          <strong>Super discount on more than 100 USD</strong>
          <span>Have you ever finally just write dummy info</span>
        </div>
        <button type="button">Shop now</button>
      </section>
    </div>
  );
};

export default WebCart;
