import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import usFlagImg from '../assets/us.png';
import walletImg from '../assets/wallet.png';
import './product-details.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const assetModules = import.meta.glob('../assets/*', {
  eager: true,
  import: 'default',
});

const assetByName = Object.entries(assetModules).reduce((map, [path, assetUrl]) => {
  const fileName = path.split('/').pop();

  if (fileName) {
    map[fileName] = assetUrl;
  }

  return map;
}, {});

const resolveAsset = (fileName) => assetByName[fileName] || '';

const detailSpecs = [
  ['Model', 'HD-2000'],
  ['Style', 'Classic body'],
  ['Certificate', 'ISO-88912212'],
  ['Size', '34mm x 450mm x 19mm'],
  ['Memory', '36GB RAM'],
];

const featureLines = [
  '✓ Some great feature name here',
  '✓ Lorem ipsum dolor sit amet, consectetur',
  '✓ Duis aute irure dolor in reprehenderit',
  '✓ Some great feature name here',
];

const tabs = ['Description', 'Reviews', 'Shipping', 'About seller'];

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, allRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products/${id}`),
          axios.get(`${API_BASE_URL}/products`),
        ]);
        setProduct(productRes.data.data || productRes.data || null);
        const allFetched = allRes.data.data || allRes.data || [];
        setAllProducts(Array.isArray(allFetched) ? allFetched : []);
      } catch (requestError) {
        setError('Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const thumbnailProducts = useMemo(() => [
    product,
  ].filter(Boolean), [product]);

  const relatedProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    return allProducts
      .filter((p) => p?.attributes?.category === product?.attributes?.category && p.id !== product.id)
      .slice(0, 5);
  }, [product, allProducts]);

  const imageSource = product ? resolveAsset(product.attributes.image) : '';

  if (loading) {
    return <div className="productDetailsPage"><p>Loading product details...</p></div>;
  }

  if (error || !product) {
    return <div className="productDetailsPage"><p>{error || 'Product not found.'}</p></div>;
  }

  return (
    <div className="productDetailsPage">
      <div className="productDetailsBreadcrumbs">
        <Link to="/home">Home</Link>
        <span>›</span>
        <Link to="/grid-view">Clothing</Link>
        <span>›</span>
        <Link to="/grid-view">Men&apos;s wear</Link>
        <span>›</span>
        <strong>Summer clothing</strong>
      </div>

      <section className="productHeroCard">
        <div className="productHeroMain">
          <div className="productGallery">
            <div className="productMainImageWrap">
              <img src={imageSource} alt={product.attributes.name} className="productMainImage" />
            </div>
            <div className="thumbnailRow">
              {thumbnailProducts.map((thumb) => (
                <button key={thumb.id} type="button" className="thumbnailItem active" aria-label={`View ${thumb.attributes.name}`}>
                  <img src={resolveAsset(thumb.attributes.image)} alt="" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <div className="productSummary">
            <span className="inStockBadge">In stock</span>
            <h1>{product.attributes.name}</h1>
            <div className="summaryMeta">
              <span className="ratingStars">★★★★☆</span>
              <span>7.5</span>
              <span>32 reviews</span>
              <span>154 sold</span>
            </div>
            <div className="priceTierRow">
              <div>
                <strong>{`$${Number(product.attributes.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</strong>
                <span>SO-100 pcs</span>
              </div>
              <div>
                <strong>$90.00</strong>
                <span>100-700 pcs</span>
              </div>
              <div>
                <strong>$78.00</strong>
                <span>700+ pcs</span>
              </div>
            </div>
            <div className="productActions">
              <button type="button" className="primaryButton" onClick={() => addToCart(product)}>Add to cart</button>
            </div>
            <dl className="summaryTable">
              <div>
                <dt>Price</dt>
                <dd>Negotiable</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>Classic shoes</dd>
              </div>
              <div>
                <dt>Material</dt>
                <dd>Plastic material</dd>
              </div>
              <div>
                <dt>Design</dt>
                <dd>Modern</dd>
              </div>
              <div>
                <dt>Customization</dt>
                <dd>Customized logo and design custom packages</dd>
              </div>
              <div>
                <dt>Protection</dt>
                <dd>Refund Policy</dd>
              </div>
              <div>
                <dt>Warranty</dt>
                <dd>2 years full warranty</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="sellerColumn">
          <aside className="sellerCard">
            <div className="sellerHeaderRow">
              <div className="sellerAvatar">R</div>
              <div className="sellerHeader">
                <strong>Supplier</strong>
                <span>Guangxi Trading LLC</span>
              </div>
            </div>
            <div className="sellerMeta">
              <div className="sellerMetaRow">
                <img src={usFlagImg} alt="Germany flag" className="sellerMetaIcon" />
                <span>Germany, Berlin</span>
              </div>
              <div className="sellerMetaRow">
                <span className="sellerMetaSymbol" aria-hidden="true">🛡</span>
                <span>Verified Seller</span>
              </div>
              <div className="sellerMetaRow">
                <span className="sellerMetaSymbol" aria-hidden="true">🌐</span>
                <span>Worldwide shipping</span>
              </div>
            </div>
            <button type="button" className="primaryButton">Send inquiry</button>
            <button type="button" className="secondaryButton">Seller&apos;s profile</button>
          </aside>
          <button type="button" className="saveLaterButton">♡ Save for later</button>
        </div>
      </section>

      <section className="productContentGrid">
        <div className="descriptionPanel">
          <div className="detailTabs">
            {tabs.map((tab, index) => (
              <button key={tab} type="button" className={index === 0 ? 'detailTab active' : 'detailTab'}>
                {tab}
              </button>
            ))}
          </div>

          <div className="descriptionBody">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,   </p>
            <p>
              
Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <table className="specTable">
              <tbody>
                {detailSpecs.map(([label, value]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="featureList">
              {featureLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="recommendationPanel">
          <h2>You may like</h2>
          <div className="recommendationList">
            {relatedProducts.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="recommendationItem">
                <img src={resolveAsset(item.attributes.image)} alt={item.attributes.name} />
                <div>
                  <strong>{item.attributes.name}</strong>
                  <br />
                  <span>{`$${Number(item.attributes.price).toFixed(2)} - $99.50`}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="relatedProductsSection">
        <h2>Related products</h2>
        <div className="relatedProductsRow">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="relatedProductCard">
                <img src={resolveAsset(item.attributes.image) || walletImg} alt={item.attributes.name} />
                <strong>{item.attributes.name}</strong>
                <span>{`$${Number(item.attributes.price).toFixed(2)}`}</span>
              </Link>
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </section>

      <section className="promoBanner">
        <div>
          <strong>Super discount on more than 100 USD</strong>
          <span>Have you ever finally just write dummy info</span>
        </div>
        <button type="button">Shop now</button>
      </section>
    </div>
  );
};

export default ProductDetails;
