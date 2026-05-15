import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dpIcon from '../assets/dp.svg';
import shirtImg from '../assets/shirt.png';
import './web-listview.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

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

const sections = [
  {
    title: 'Category',
    items: ['Mobile accessory', 'Electronics', 'Smartphones', 'Modern tech'],
    extraItems: ['Wearables', 'Audio', 'Gaming', 'Accessories'],
  },
  {
    title: 'Brands',
    items: ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo'],
    extraItems: ['Xiaomi', 'Sony', 'LG', 'Dell'],
    checkboxes: true,
  },
  {
    title: 'Features',
    items: ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'],
    extraItems: ['Water resistant', 'Fast charging', 'Wireless', 'Foldable'],
    checkboxes: true,
  },
  {
    title: 'Condition',
    items: ['Any', 'Refurbished', 'Brand new', 'Old items'],
    radios: true,
  },
];

const WebListView = ({ searchQuery = '' }) => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState(() => new Set(sections.map((section) => section.title)));
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({
    Brands: ['Samsung'],
    Features: [],
  });
  const [expandedSeeAll, setExpandedSeeAll] = useState(() => new Set());
  const [selectedCondition, setSelectedCondition] = useState('Any');
  const [selectedRating, setSelectedRating] = useState('★★★★☆');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const toggleSection = (title) => {
    setOpenSections((current) => {
      const next = new Set(current);

      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }

      return next;
    });
  };

  const toggleCheckbox = (groupTitle, item) => {
    setSelectedCheckboxes((current) => {
      const nextGroup = current[groupTitle] ?? [];
      const nextItems = nextGroup.includes(item)
        ? nextGroup.filter((entry) => entry !== item)
        : [...nextGroup, item];

      return {
        ...current,
        [groupTitle]: nextItems,
      };
    });
  };

  const toggleSeeAll = (sectionTitle) => {
    setExpandedSeeAll((current) => {
      const next = new Set(current);

      if (next.has(sectionTitle)) {
        next.delete(sectionTitle);
      } else {
        next.add(sectionTitle);
      }

      return next;
    });
  };

  const openProductDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  const ratingRows = useMemo(() => ['★★★★★', '★★★★☆', '★★★☆☆', '★★☆☆☆'], []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products`);
        console.log('ListView API Response:', response.data);
        const fetchedData = response.data.data || response.data || [];
        setProducts(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="forceListViewContainer">
      <div className="listBreadcrumbs">
        <Link to="/home">Home</Link>
        <span>›</span>
        <Link to="/list-view">Clothing</Link>
        <span>›</span>
        <Link to="/list-view">Men&apos;s wear</Link>
        <span>›</span>
        <strong>Summer clothing</strong>
      </div>

      <div className="catalogShell">
        <aside className="catalogSidebar">
          {sections.map((section) => (
            <section key={section.title} className="filterBlock">
              <div className="filterHeader">
                <h3>{section.title}</h3>
                <button type="button" className="filterToggle" onClick={() => toggleSection(section.title)} aria-expanded={openSections.has(section.title)} aria-label={`Toggle ${section.title}`}>
                  <img src={dpIcon} alt="" aria-hidden="true" className="dropdownIcon" />
                </button>
              </div>
              {openSections.has(section.title) ? (
                <div className="filterItems">
                  {section.items.map((item, index) => {
                    if (section.checkboxes) {
                      const checkedItems = selectedCheckboxes[section.title] ?? [];
                      const checked = checkedItems.includes(item);

                      return (
                        <label key={item} className={checked ? 'filterChoice active' : 'filterChoice'}>
                          <input type="checkbox" checked={checked} onChange={() => toggleCheckbox(section.title, item)} />
                          <span>{item}</span>
                        </label>
                      );
                    }

                    if (section.radios) {
                      const checked = selectedCondition === item;

                      return (
                        <label key={item} className={checked ? 'filterChoice active' : 'filterChoice'}>
                          <input type="radio" name="condition" checked={checked} onChange={() => setSelectedCondition(item)} />
                          <span>{item}</span>
                        </label>
                      );
                    }

                    return (
                      <button
                        key={item}
                        type="button"
                        className={section.title === 'Category' ? (selectedCategory === item ? 'filterLink active' : 'filterLink') : (index === 0 ? 'filterLink active' : 'filterLink')}
                        onClick={section.title === 'Category' ? () => setSelectedCategory(selectedCategory === item ? '' : item) : undefined}
                      >
                        {item}
                      </button>
                    );
                  })}

                  {section.extraItems ? (
                    <>
                      {expandedSeeAll.has(section.title)
                        ? section.extraItems.map((item) => (
                          <button key={item} type="button" className="filterLink filterLinkExtra">
                            {item}
                          </button>
                        ))
                        : null}
                      <button type="button" className="seeAllButton" onClick={() => toggleSeeAll(section.title)}>
                        {expandedSeeAll.has(section.title) ? 'Show less' : 'See all'}
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </section>
          ))}

          <section className="filterBlock">
            <div className="filterHeader">
              <h3>Price range</h3>
              <button type="button" className="filterToggle" onClick={() => toggleSection('Price range')} aria-expanded={openSections.has('Price range')} aria-label="Toggle Price range">
                <img src={dpIcon} alt="" aria-hidden="true" className="dropdownIcon" />
              </button>
            </div>
            {openSections.has('Price range') ? (
              <div className="priceRangeWrap">
                <div className="priceTrack">
                  <span className="priceActive" />
                  <span className="priceHandle left" />
                  <span className="priceHandle right" />
                </div>
                <div className="priceFields">
                  <label>
                    <span>Min</span>
                    <input type="text" placeholder="0" />
                  </label>
                  <label>
                    <span>Max</span>
                    <input type="text" placeholder="999999" />
                  </label>
                </div>
                <button type="button" className="applyButton">Apply</button>
              </div>
            ) : null}
          </section>

          <section className="filterBlock">
            <div className="filterHeader">
              <h3>Ratings</h3>
              <button type="button" className="filterToggle" onClick={() => toggleSection('Ratings')} aria-expanded={openSections.has('Ratings')} aria-label="Toggle Ratings">
                <img src={dpIcon} alt="" aria-hidden="true" className="dropdownIcon" />
              </button>
            </div>
            {openSections.has('Ratings') ? (
              <div className="ratingRows">
                {ratingRows.map((stars) => {
                  const checked = selectedRating === stars;

                  return (
                    <label key={stars} className={checked ? 'filterChoice active' : 'filterChoice'}>
                      <input type="radio" name="rating" checked={checked} onChange={() => setSelectedRating(stars)} />
                      <span className="ratingStars">{stars}</span>
                    </label>
                  );
                })}
              </div>
            ) : null}
          </section>
        </aside>

        <section className="catalogContent">
          <div className="catalogToolbar">
            <div className="catalogCount">{products.length} items found</div>

            <div className="catalogControls">
              <label className="verifiedToggle">
                <input type="checkbox" defaultChecked />
                <span>Verified only</span>
              </label>
              <label className="featuredSelectWrap" aria-label="Featured sort">
                <select defaultValue="Featured" className="featuredSelect">
                  <option value="Featured">Featured</option>
                  <option value="Top sales">Top sales</option>
                  <option value="Newest">Newest</option>
                  <option value="Price low to high">Price low to high</option>
                </select>
                <img src={dpIcon} alt="" aria-hidden="true" className="featuredSelectIcon" />
              </label>
              <Link to="/grid-view" className="viewButton" aria-label="Grid view">▦</Link>
              <Link to="/list-view" className="viewButton active" aria-label="List view">☰</Link>
            </div>
          </div>

          <div className="productList">
            {loading ? <p>Loading products...</p> : null}
            {error ? <p>{error}</p> : null}

            {products
              .filter((p) => {
                const matchesSearch = !searchQuery || p.attributes.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory ? p.attributes.category === selectedCategory : true;
                return matchesSearch && matchesCategory;
              })
              .map((product) => (
                <article
                  key={product.id}
                  className="productCard"
                  role="link"
                  tabIndex={0}
                  onClick={() => openProductDetails(product)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openProductDetails(product);
                    }
                  }}
                >
                  <div className="productVisual">
                    <img src={resolveAsset(product.attributes.image) || shirtImg} alt={product.attributes.name} />
                  </div>
                  <div className="productBody">
                    <div className="productTopRow">
                      <h3>{product.attributes.name}</h3>
                      <button type="button" className="wishButton" aria-label="Save item">♡</button>
                    </div>
                    <div className="productPriceRow">
                      <strong>{`$${Number(product.attributes.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</strong>
                    </div>
                    <div className="productMeta">
                      <span className="ratingValue">★★★★☆</span>
                      <span>· {product.attributes.reviews ?? 0}</span>
                      <span className="freeShipping">· Free Shipping</span>
                    </div>
                    <p>{product.attributes.description}</p>
                    <button type="button" className="viewDetailsButton" onClick={(event) => {
                      event.stopPropagation();
                      openProductDetails(product);
                    }}>View details</button>
                  </div>
                  <button type="button" className="wishButton" aria-label="Save item" onClick={(event) => event.stopPropagation()}>♡</button>
                </article>
              ))}
          </div>

          <div className="paginationBar">
            <button type="button" className="pageSizeButton">Show 10</button>
            <div className="pageButtons">
              <button type="button" className="pageArrow">‹</button>
              <button type="button" className="pageNum active">1</button>
              <button type="button" className="pageNum">2</button>
              <button type="button" className="pageNum">3</button>
              <button type="button" className="pageArrow">›</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WebListView;
