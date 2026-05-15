import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import heroImg from '../assets/banner.png';
import smartWatchesImg from '../assets/smart-watches.png';
import laptopImg from '../assets/laptop.png';
import cameraImg from '../assets/camera.png';
import headphoneImg from '../assets/headphone.png';
import mobileImg from '../assets/mobile.png';
import homeOutdoorImg from '../assets/home-outdoor.png';
import consumerElecImg from '../assets/consumer-elec.png';
import quoteBgImg from '../assets/bgblue.png';
import uaeFlagImg from '../assets/uae.png';
import italyFlagImg from '../assets/italy.png';
import shirtImg from '../assets/shirt.png';
import jacketImg from '../assets/jacket.png';
import walletImg from '../assets/wallet.png';
import coffeeImg from '../assets/coffe.png';
import './web-main.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ecommerce-fullstack-design-25oo.onrender.com/api/v1';

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

const Home = ({ searchQuery = '' }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');

  const categories = [
    'Automobiles',
    'Clothes and wear',
    'Home interiors',
    'Computer and tech',
    'Tools, equipments',
    'Sports and outdoor',
    'Animal and pets',
    'Machinery tools',
    'More Categories',
  ];


  const extraServices = [
    {
      title: 'Source from Industry Hubs',
      image: heroImg,
      icon: '🔍',
    },
    {
      title: 'Customize Your Products',
      image: homeOutdoorImg,
      icon: '📦',
    },
    {
      title: 'Fast, reliable shipping by ocean or air',
      image: consumerElecImg,
      icon: '➜',
    },
    {
      title: 'Product monitoring and inspection',
      image: quoteBgImg,
      icon: '🛡',
    },
  ];

  const supplierRegions = [
    { flag: uaeFlagImg, abbr: 'Arabic Emirates', country: 'Arabic Emirates', domain: 'shopname.ae' },
    { flag: italyFlagImg, abbr: 'Australia', country: 'Australia', domain: 'shopname.au' },
    { flag: uaeFlagImg, abbr: 'United States', country: 'United States', domain: 'shopname.us' },
    { flag: italyFlagImg, abbr: 'Russia', country: 'Russia', domain: 'shopname.ru' },
    { flag: uaeFlagImg, abbr: 'Italy', country: 'Italy', domain: 'shopname.it' },
    { flag: italyFlagImg, abbr: 'Denmark', country: 'Denmark', domain: 'denmark.com.dk' },
    { flag: uaeFlagImg, abbr: 'France', country: 'France', domain: 'shopname.fr' },
    { flag: italyFlagImg, abbr: 'Arabic Emirates', country: 'Arabic Emirates', domain: 'shopname.ae' },
    { flag: uaeFlagImg, abbr: 'China', country: 'China', domain: 'shopname.cn' },
    { flag: italyFlagImg, abbr: 'Great Britain', country: 'Great Britain', domain: 'shopname.co.uk' },
  ];

  const renderMarketplaceSection = (title, buttonLabel, promoClassName, category) => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredItems = products.filter((item) => {
      if (item.attributes.category !== category) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const productName = item.attributes.name.toLowerCase();
      const productCategory = item.attributes.category.toLowerCase();

      return productName.includes(normalizedSearch) || productCategory.includes(normalizedSearch);
    });

    return (
      <section className="marketSection">
        <div className={`marketPromo ${promoClassName}`}>
          <div>
            <h3>{title}</h3>
            <Link to="/products" className="marketButton">{buttonLabel}</Link>
          </div>
          <img src={promoClassName === 'promoWarm' ? homeOutdoorImg : consumerElecImg} alt={title} className="marketPromoImage" />
        </div>

        <div className="marketGrid">
          {filteredItems.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`} className="marketItem">
              <div className="marketItemText">
                <div className="marketItemName">{item.attributes.name}</div>
                <div className="marketItemPrice">
                  <span>From</span>
                  <br />
                  <span>{`USD ${Number(item.attributes.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}</span>
                </div>
              </div>
              <img src={resolveAsset(item.attributes.image) || walletImg} alt={item.attributes.name} className="marketItemImage" />
            </Link>
          ))}
        </div>
      </section>
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await axios.get(`${API_BASE_URL}/products`);
        console.log('API Response:', response.data);
        const fetchedData = response.data.data || response.data || [];
        setProducts(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error('Fetch error:', error);
        setProductsError('Failed to load marketplace products.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const renderQuoteBanner = () => (
    <section className="quoteBanner">
      <div className="quoteBannerCopy">
        <h2>An easy way to send <br /> requests to all suppliers</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt.
        </p>
      </div>

      <form className="quoteCard">
        <h3>Send quote to suppliers</h3>

        <label className="quoteField">
          <input type="text" placeholder="What item you need?" />
        </label>

        <label className="quoteField quoteFieldTextarea">
          <textarea rows="4" placeholder="Type more details" />
        </label>

        <div className="quoteRow">
          <label className="quoteField quoteFieldGrow">
            <input type="text" placeholder="Quantity" />
          </label>
          <label className="quoteField quoteFieldUnit">
            <select defaultValue="Pcs">
              <option>Pcs</option>
              <option>Kg</option>
              <option>Set</option>
            </select>
          </label>
        </div>

        <button type="button" className="quoteButton">
          Send inquiry
        </button>
      </form>
    </section>
  );

  const renderRecommendedSection = () => (
    <section className="recommendedSection">
      <h3 className="recommendedTitle">Recommended items</h3>

      <div className="recommendedGrid">
        {products.slice(0, 10).map((item) => (
          <Link key={item.id} to={`/product/${item.id}`} className="recommendedCard">
            <div className="recommendedImageWrap">
              <img src={resolveAsset(item.attributes.image) || shirtImg} alt={item.attributes.name} className="recommendedImage" />
            </div>
            <div className="recommendedPrice">{`$${Number(item.attributes.price).toFixed(2)}`}</div>
            <div className="recommendedName">{item.attributes.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );

  const renderExtraServices = () => (
    <section className="extraServicesSection">
      <h3 className="sectionHeading">Our extra services</h3>

      <div className="extraServicesGrid">
        {extraServices.map((service) => (
          <article key={service.title} className="extraServiceCard">
            <div className="extraServiceImageWrap">
              <img src={service.image} alt={service.title} className="extraServiceImage" />
              <div className="extraServiceIcon">{service.icon}</div>
            </div>
            <div className="extraServiceTitle">{service.title}</div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderSupplierRegions = () => (
    <section className="regionsSection">
      <h3 className="sectionHeading">Suppliers by region</h3>

      <div className="regionsGrid">
        {supplierRegions.map((region, idx) => (
          <div key={`${region.country}-${region.domain}-${idx}`} className="regionItem">
            <div className="regionFlagWrap">
              {region.flag ? <img src={region.flag} alt={region.abbr} className="regionFlagImage" /> : <span className="regionAbbr">{region.abbr}</span>}
            </div>
            <div>
              <div className="regionCountry">{region.abbr}</div>
              <div className="regionDomain">{region.domain}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="homePageWrap">
      <section className="homeTopCard">
        <aside className="homeSidebar">
          <ul className="categoryList">
            {categories.map((cat, index) => (
              <li key={cat} className={index === 0 ? 'categoryItem active' : 'categoryItem'}>
                <Link to={`/products?category=${encodeURIComponent(cat)}`}>{cat}</Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="heroCard">
          <div className="heroCopy">
            <h3 className="heroKicker">Latest trending</h3>
            <h2 className="heroTitle">Electronic items</h2>
            <Link to="/list-view" className="heroButton">Browse catalog</Link>
          </div>
          <img src={heroImg} className="heroImage" alt="Hero Banner" />
        </div>

        <div className="sideCards">
          <div className="profileCard">
            <div className="profileTop">
              <div className="profileAvatar">👤</div>
              <p className="profileText">Hi, user<br />let&apos;s get stated</p>
            </div>
            <button className="joinNowBtn">Join now</button>
            <button className="loginBtn">Log in</button>
          </div>

          <div className="offerCard orangeCard">
            Get US $10 off<br />with a new supplier
          </div>

          <div className="offerCard tealCard">
            Send quotes with supplier preferences
          </div>
        </div>
      </section>

      <section className="dealsSection">
        <div className="dealsPromo">
          <h3>Deals and offers</h3>
          <p>Hygiene equipments</p>

          <div className="timerRow">
            <div className="timerBox"><strong>04</strong><span>Days</span></div>
            <div className="timerBox"><strong>13</strong><span>Hour</span></div>
            <div className="timerBox"><strong>34</strong><span>Min</span></div>
            <div className="timerBox"><strong>56</strong><span>Sec</span></div>
          </div>
        </div>

        <div className="dealCards">
          {products.slice(0, 5).map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="dealCard">
              <img src={resolveAsset(product.attributes.image) || walletImg} alt={product.attributes.name} className="dealImage" />
              <div className="dealName">{product.attributes.name}</div>
              <div className="dealDiscount">−25%</div>
            </Link>
          ))}
        </div>
      </section>

      {productsError ? <section className="marketSection"><p>{productsError}</p></section> : null}
      {loadingProducts && !productsError ? <section className="marketSection"><p>Loading marketplace products...</p></section> : null}
      {!loadingProducts && !productsError && renderMarketplaceSection('Home and outdoor', 'Source now', 'promoWarm', 'Home and outdoor')}
      {!loadingProducts && !productsError && renderMarketplaceSection('Consumer electronics', 'Source now', 'promoCool', 'Consumer electronics')}
      {renderQuoteBanner()}
      {renderRecommendedSection()}
      {renderExtraServices()}
      {renderSupplierRegions()}
    </div>
  );
};

export default Home;
