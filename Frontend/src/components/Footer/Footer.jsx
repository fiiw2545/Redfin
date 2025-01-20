import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h4>Join us</h4>
          <ul>
            <li><a href="/careers/real-estate">Become an Agent</a></li>
            <li><a href="https://redfin.com/partner">Get referrals</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
          <h4>Find homes faster</h4>
          <div className="app-links">
            <a href="https://redfin.onelink.me/iy7h/wk66abnm">
              <img src="https://ssl.cdn-redfin.com/vLATEST/images/apple-app-download-badge-284x84.png" alt="Download on the Apple App Store" />
            </a>
            <a href="https://redfin.onelink.me/iy7h/wk66abnm">
              <img src="https://ssl.cdn-redfin.com/vLATEST/images/google-app-download-badge-284x84.png" alt="Get it on Google Play" />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>About us</h4>
          <ul>
            <li><a href="/why-redfin">Why Redfin?</a></li>
            <li><a href="https://www.redfin.com/rise">Community Impact</a></li>
            <li><a href="/careers/diversity">Diversity & Inclusion</a></li>
            <li><a href="/careers/redfin-life">Life at Redfin</a></li>
            <li><a href="https://investors.redfin.com/news-events/press-releases">Press</a></li>
            <li><a href="https://investors.redfin.com/">Investors</a></li>
            <li><a href="https://www.redfin.com/blog/">Blog</a></li>
            <li><a href="https://www.redfin.com/news/">Real Estate News</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Find us</h4>
          <ul>
            <li><a href="/about/contact-us">Contact Us</a></li>
            <li><a href="https://support.redfin.com/hc">Help Center</a></li>
            <li><a href="#">Advertise</a></li>
            <li><a href="/mortgage-marketplace">Become a Lender Partner</a></li>
          </ul>
          <ul class="footer-socials">
            {/* <!-- Facebook Icon --> */}
            <li id="footerFacebookIcon">
              <a class="facebook" target="_blank" rel="noopener" href="https://www.facebook.com/redfin" title="Redfin Facebook" aria-label="Redfin Facebook" alt="Redfin Facebook">
                <svg class="SvgIcon facebook" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M21.252 1.6H2.747c-.633 0-1.147.514-1.147 1.148v18.504c0 .634.514 1.148 1.147 1.148h9.963v-8.055H9.999v-3.139h2.71V8.891c0-2.686 1.641-4.15 4.038-4.15 1.148 0 2.134.086 2.422.125v2.807h-1.662c-1.304 0-1.556.62-1.556 1.529v2.004h3.109l-.405 3.14h-2.704V22.4h5.3c.635 0 1.149-.514 1.149-1.148V2.748c0-.634-.514-1.148-1.148-1.148z" fill-rule="evenodd"></path>
                </svg>
              </a>
            </li>

            {/* <!-- Twitter Icon --> */}
            <li id="footerTwitterIcon">
              <a class="twitter" target="_blank" rel="noopener" href="https://twitter.com/Redfin" title="Redfin Twitter" aria-label="Redfin Twitter" alt="Redfin Twitter">
                <svg class="SvgIcon twitter" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M14.36 10.392L21.805 1.5H20.04l-6.465 7.72L8.412 1.5H2.457l7.808 11.675L2.457 22.5H4.22l6.828-8.153L16.5 22.5h5.956l-8.098-12.108zm-2.417 2.886l-.791-1.162-6.295-9.251h2.71l5.08 7.465.79 1.163 6.604 9.704h-2.71l-5.388-7.919z" fill-rule="evenodd"></path>
                </svg>
              </a>
            </li>

            {/* <!-- TikTok Icon --> */}
            <li id="footerTikTokIcon">
              <a class="tiktok" target="_blank" rel="noopener" href="https://www.tiktok.com/@redfinrealestate" title="Redfin TikTok" aria-label="Redfin TikTok" alt="Redfin TikTok">
                <svg class="SvgIcon tiktok" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M19.68 1.92H4.32a2.403 2.403 0 00-2.4 2.4v15.36c0 1.323 1.077 2.4 2.4 2.4h15.36c1.323 0 2.4-1.077 2.4-2.4V4.32c0-1.323-1.077-2.4-2.4-2.4zm-1.917 8.795a3.596 3.596 0 01-3.34-1.61v5.538a4.093 4.093 0 11-4.093-4.093c.085 0 .168.008.252.013v2.017c-.084-.01-.166-.025-.252-.025a2.089 2.089 0 100 4.178c1.153 0 2.172-.91 2.172-2.063l.02-9.405h1.928a3.594 3.594 0 003.313 3.208v2.242z" fill-rule="evenodd"></path>
                </svg>
              </a>
            </li>

            {/* <!-- Instagram Icon --> */}
            <li id="footerInstagramIcon">
              <a class="instagram" target="_blank" rel="noopener" href="https://www.instagram.com/redfinrealestate/" title="Redfin Instagram" aria-label="Redfin Instagram" alt="Redfin Instagram">
                <svg class="SvgIcon instagram" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 1c-2.987 0-3.362.013-4.535.066-1.171.054-1.971.24-2.67.511a5.412 5.412 0 00-1.949 1.269 5.412 5.412 0 00-1.269 1.949c-.271.699-.457 1.499-.511 2.67C1.013 8.638 1 9.013 1 12s.013 3.362.066 4.535c.054 1.171.24 1.971.511 2.67a5.412 5.412 0 001.269 1.949 5.412 5.412 0 001.949 1.269c.699.271 1.499.457 2.67.511C8.638 22.987 9.013 23 12 23s3.362-.013 4.535-.066c1.171-.054 1.971-.24 2.67-.511a5.412 5.412 0 001.949-1.269 5.412 5.412 0 001.269-1.949c.271-.699.457-1.499.511-2.67.053-1.173.066-1.548.066-4.535s-.013-3.362-.066-4.535c-.054-1.171-.24-1.971-.511-2.67a5.412 5.412 0 00-1.269-1.949 5.412 5.412 0 00-1.949-1.269c-.699-.271-1.499-.457-2.67-.511C15.362 1.013 14.987 1 12 1m0 1.982c2.937 0 3.285.011 4.445.064 1.072.049 1.655.228 2.042.379.514.199.88.438 1.265.823.385.385.624.751.823 1.265.151.387.33.97.379 2.042.053 1.16.064 1.508.064 4.445 0 2.937-.011 3.285-.064 4.445-.049 1.072-.228 1.655-.379 2.042-.199.514-.438.88-.823 1.265a3.398 3.398 0 01-1.265.823c-.387.151-.97.33-2.042.379-1.16.053-1.508.064-4.445.064-2.937 0-3.285-.011-4.445-.064-1.072-.049-1.655-.228-2.042-.379a3.398 3.398 0 01-1.265-.823 3.398 3.398 0 01-.823-1.265c-.151-.387-.33-.97-.379-2.042-.053-1.16-.064-1.508-.064-4.445 0-2.937.011-3.285.064-4.445.049-1.072.228-1.655.379-2.042.199-.514.438-.88.823-1.265a3.398 3.398 0 011.265-.823c.387-.151.97-.33 2.042-.379 1.16-.053 1.508-.064 4.445-.064zm0 3.37a5.649 5.649 0 100 11.297 5.649 5.649 0 000-11.297zm0 9.315a3.667 3.667 0 110-7.335 3.667 3.667 0 010 7.335zm7.192-9.539a1.32 1.32 0 11-2.64 0 1.32 1.32 0 012.64 0z" fill-rule="evenodd"></path>
                </svg>
              </a>
            </li>
          </ul>
          <h4>Subsidiaries</h4>
          <ul>
            <li><a href="https://www.rent.com/">Rent</a></li>
            <li><a href="https://www.apartmentguide.com/">ApartmentGuide</a></li>
            <li><a href="https://bayequityhomeloans.com/">Bay Equity Home Loans</a></li>
            <li><a href="https://www.titleforward.com/tf">Title Forward</a></li>
          </ul>
          <h4>Countries</h4>
          <div className="country-selector">
            <p><img src="https://ssl.cdn-redfin.com/vLATEST/images/footer/flags/united-states.png" alt="US flag" />United States</p>
            <p><img src="https://ssl.cdn-redfin.com/vLATEST/images/footer/flags/canada.png" alt="Canadian flag" />Canada</p>
          </div>
        </div>

        <div className="footer-column">
          <div className="footer-legal">
            <p>Copyright: © 2024 Redfin. All rights reserved.</p>
            <p>By searching, you agree to the <a href="/about/terms-of-use">Terms of Use</a> and <a href="/about/privacy-policy">Privacy Policy</a>.</p>
            <p><a href="/about/privacy/cookie">Do not sell or share my personal information.</a></p>
            <p>REDFIN and all REDFIN variants, TITLE FORWARD, WALK SCORE, and the R logos, are trademarks of Redfin Corporation. registered or pending in the USPTO.</p>
            <p>California DRE #01521930</p>
            <p>If you are using a screen reader, or having trouble reading this website, please call Redfin Customer Support for help at <a href="tel:1-844-759-7732">1-844-759-7732</a>.</p>
            <div className="housing-policy">
              <a href="/about/terms-of-use#Equal_Housing_Opportunity" target="_blank" rel="noopener">
                <img className="icon ehoLogo" src="https://ssl.cdn-redfin.com/vLATEST/images/footer/equal-housing.png" alt="Equal Housing Opportunity" loading="lazy" />
              </a>
              <div className="bold-text">
                <p>REDFIN IS COMMITTED TO AND ABIDES BY THE FAIR HOUSING ACT AND EQUAL OPPORTUNITY ACT.</p>
                <p>READ REDFIN'S <a href="/fair-housing-policy">FAIR HOUSING POLICY</a> AND <a href="/new-york-state-fair-housing-notice">THE NEW YORK STATE FAIR HOUSING NOTICE.</a></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
