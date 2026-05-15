import socialBannerImg from '../assets/social.png';
import appStoreImg from '../assets/appstore.png';
import playStoreImg from '../assets/playstore.png';
import usFlagImg from '../assets/us.png';
import './site-footer.css';

const LogoMark = () => (
  <svg width="49" height="49" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.25 8.25H15.75V16.5H6.25V8.25Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8.05 8.25C8.05 5.97 9.45 4.5 11 4.5C12.55 4.5 13.95 5.97 13.95 8.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.1 11.1L11 12.15L12.9 11.1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SiteFooter = ({ showNewsletter = true }) => {
  return (
    <>
      {showNewsletter ? (
        <section className="newsletterSection">
          <h3>Subscribe on our newsletter</h3>
          <p>Get daily news on upcoming offers from many suppliers all over the world</p>
          <form className="newsletterForm">
            <label className="newsletterInputWrap">
              <span className="newsletterInputIcon" aria-hidden="true">✉</span>
              <input type="email" placeholder="Email" />
            </label>
            <button type="button">Subscribe</button>
          </form>
        </section>
      ) : null}

      <footer className="siteFooter">
        <div className="footerTop">
          <div className="footerBrandBlock">
            <div className="footerBrandRow">
              <div className="footerLogo" aria-hidden="true">
                <span className="footerLogoShadow" aria-hidden="true" />
                <span className="footerLogoMark" aria-hidden="true">
                  <LogoMark />
                </span>
              </div>
              <span className="footerBrandName">Brand</span>
            </div>
            <p>
              Best information about the company goes here but now lorem ipsum is
              placeholder text.
            </p>
            <img src={socialBannerImg} alt="Social media" className="footerSocialBanner" />
          </div>

          <div className="footerLinkColumn">
            <h4>About</h4>
            <a href="#">About Us</a>
            <a href="#">Find store</a>
            <a href="#">Categories</a>
            <a href="#">Blogs</a>
          </div>

          <div className="footerLinkColumn">
            <h4>Partnership</h4>
            <a href="#">About Us</a>
            <a href="#">Find store</a>
            <a href="#">Categories</a>
            <a href="#">Blogs</a>
          </div>

          <div className="footerLinkColumn">
            <h4>Information</h4>
            <a href="#">Help Center</a>
            <a href="#">Money Refund</a>
            <a href="#">Shipping</a>
            <a href="#">Contact us</a>
          </div>

          <div className="footerLinkColumn">
            <h4>For users</h4>
            <a href="#">Login</a>
            <a href="#">Register</a>
            <a href="#">Settings</a>
            <a href="#">My Orders</a>
          </div>

          <div className="footerAppColumn">
            <h4>Get app</h4>
            <img src={appStoreImg} alt="Download on the App Store" className="storeBadgeImage" />
            <img src={playStoreImg} alt="Get it on Google Play" className="storeBadgeImage" />
          </div>
        </div>

        <div className="footerBottom">
          <span>© 2023 Ecommerce.</span>
          <span className="footerLanguage">
            <img src={usFlagImg} alt="US flag" className="footerLanguageFlag" />
            <span>English</span>
            <span className="footerLanguageCaret">▴</span>
          </span>
        </div>
      </footer>
    </>
  );
};

export default SiteFooter;
