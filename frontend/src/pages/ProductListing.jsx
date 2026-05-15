import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import dpIcon from '../assets/dp.svg';
import shirtImg from '../assets/shirt.png';
import './web-gridview.css';

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

const splitProductTitle = (title) => {
  const parts = title.split(/\s-\s|,\s/).map((part) => part.trim()).filter(Boolean);

  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' ').trim()];
  }

  const words = title.trim().split(/\s+/);
  if (words.length <= 2) {
    return [title, ''];
  }

  const splitIndex = Math.ceil(words.length / 2);
  return [words.slice(0, splitIndex).join(' '), words.slice(splitIndex).join(' ')];
};

const ProductListing = ({ searchQuery = '' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('Any');
  const [selectedRating, setSelectedRating] = useState('★★★★☆');
  const [selectedBrands, setSelectedBrands] = useState(['Samsung']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [expandedSeeAll, setExpandedSeeAll] = useState(new Set());
  const [openSections, setOpenSections] = useState(new Set(['Category', 'Brands', 'Features', 'Condition', 'Price range', 'Ratings']));

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

  const ratingRows = useMemo(() => ['★★★★★', '★★★★☆', '★★★☆☆', '★★☆☆☆'], []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data.data ?? []);
      } catch (requestError) {
        setError('Unable to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') || '';

    if (category) {
      setSelectedCategory(category);
    }
  }, [location.search]);

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

  const toggleCheckbox = (groupTitle, item) => {
    if (groupTitle === 'Brands') {
      setSelectedBrands((current) => (
        current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
      ));
    }

    if (groupTitle === 'Features') {
      setSelectedFeatures((current) => (
        current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
      ));
    }
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const name = product.attributes.name.toLowerCase();
      const category = product.attributes.category.toLowerCase();
      const matchesSearch = !normalizedSearch || name.includes(normalizedSearch) || category.includes(normalizedSearch);

      if (selectedCategory && selectedCategory.length > 0) {
        return matchesSearch && product.attributes.category === selectedCategory;
      }

      return matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  const activeFilters = useMemo(() => {
    const filters = [...selectedBrands, ...selectedFeatures];

    if (selectedCondition !== 'Any') {
      filters.push(selectedCondition);
    }

    if (selectedRating !== '★★★★☆') {
      filters.push(selectedRating);
    }

    return filters;
  }, [selectedBrands, selectedFeatures, selectedCondition, selectedRating]);

  return (
    <div className="gridViewPage">
      <div className="gridBreadcrumbs">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/products">Products</Link>
        <span>›</span>
        <strong>All items</strong>
      </div>

      <div className="catalogShell">
        <aside className="catalogSidebar">
          {sections.map((section) => (
            <section key={section.title} className="filterBlock">
              <div className="filterHeader">
                <h3>{section.title}</h3>
                <button
                  type="button"
                  className="filterToggle"
                  onClick={() => toggleSection(section.title)}
                  aria-expanded={openSections.has(section.title)}
                  aria-label={`Toggle ${section.title}`}
                >
                  <img src={dpIcon} alt="" aria-hidden="true" className="dropdownIcon" />
                </button>
              </div>

              {openSections.has(section.title) ? (
                <div className="filterItems">
                  {section.items.map((item) => {
                    if (section.checkboxes) {
                      const checked = (section.title === 'Brands' ? selectedBrands : selectedFeatures).includes(item);

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
                          <input type="radio" name="listing-condition" checked={checked} onChange={() => setSelectedCondition(item)} />
                          <span>{item}</span>
                        </label>
                      );
                    }

                    return (
                      <button
                        key={item}
                        type="button"
                        className={section.title === 'Category' ? (selectedCategory === item ? 'filterLink active' : 'filterLink') : 'filterLink'}
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
                      <input type="radio" name="listing-rating" checked={checked} onChange={() => setSelectedRating(stars)} />
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
            <div className="catalogCount">{filteredProducts.length} items found</div>
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
              <Link to="/products" className="viewButton active" aria-label="Grid view">▦</Link>
              <Link to="/list-view" className="viewButton" aria-label="List view">☰</Link>
            </div>
          </div>

          <div className="activeFilterBar" aria-label="Selected filters">
            {activeFilters.length > 0 ? (
              <>
                {activeFilters.map((filter) => (
                  <button key={filter} type="button" className="activeFilterChip">
                    <span>{filter}</span>
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
              </>
            ) : (
              <span className="activeFilterHint">No filters selected</span>
            )}
          </div>

          {loading ? <p>Loading products...</p> : null}
          {error ? <p>{error}</p> : null}

          <div className="gridProductList">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                className="gridProductCard"
                to={`/product/${product.id}`}
              >
                <div className="gridProductVisual">
                  <img src={resolveAsset(product.attributes.image) || shirtImg} alt={product.attributes.name} />
                </div>
                <div className="gridProductBody">
                  <div className="gridProductPriceRow">
                    <strong>{`$${Number(product.attributes.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</strong>
                  </div>
                  <div className="gridProductTitle">
                    {splitProductTitle(product.attributes.name).map((line) => (
                      line ? <span key={line} className="gridProductTitleLine">{line}</span> : null
                    ))}
                  </div>
                </div>
                <button type="button" className="wishButton" aria-label="Save item" onClick={(event) => event.preventDefault()}>♡</button>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductListing;
