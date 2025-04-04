const EvoraPrivacy = {
  consentKey: 'evora_tracking_consent',
  defaultConsent: {
    analytics: false,
    marketing: false,
    necessary: true
  },

  init() {
    this.loadConsent();
    this.initBanner();
  },

  loadConsent() {
    try {
      const saved = localStorage.getItem(this.consentKey);
      this.consent = saved ? JSON.parse(saved) : this.defaultConsent;
    } catch (e) {
      console.warn('Error loading consent:', e);
      this.consent = this.defaultConsent;
    }
    this.applyConsent();
  },

  saveConsent(consent) {
    this.consent = { ...this.consent, ...consent };
    localStorage.setItem(this.consentKey, JSON.stringify(this.consent));
    this.applyConsent();
  },

  applyConsent() {
    // Disable tracking if marketing consent is not given
    if (!this.consent.marketing) {
      window['ga-disable-UA-XXXXX-Y'] = true;
      window['fbq'] = function() {};
    }
  },

  initBanner() {
    if (document.cookie.indexOf('cookie_consent=') === -1) {
      this.showBanner();
    }
  },

  showBanner() {
    const banner = document.createElement('div');
    banner.className = 'privacy-banner';
    banner.innerHTML = `
      <div class="privacy-banner__content">
        <p>We use cookies to improve your experience and for marketing. Visit our 
        <a href="/policies/privacy-policy">Privacy Policy</a> for more information.</p>
        <div class="privacy-banner__buttons">
          <button class="button button--secondary" onclick="EvoraPrivacy.rejectAll()">Reject All</button>
          <button class="button button--primary" onclick="EvoraPrivacy.acceptAll()">Accept All</button>
          <button class="button button--tertiary" onclick="EvoraPrivacy.showPreferences()">Preferences</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  },

  showPreferences() {
    // Implementation for preferences modal
    console.log('Show preferences modal');
  },

  acceptAll() {
    this.saveConsent({
      analytics: true,
      marketing: true
    });
    this.hideBanner();
  },

  rejectAll() {
    this.saveConsent(this.defaultConsent);
    this.hideBanner();
  },

  hideBanner() {
    const banner = document.querySelector('.privacy-banner');
    if (banner) {
      banner.remove();
    }
  },

  hasConsent(type) {
    return this.consent[type] === true;
  }
};

// Initialize privacy controls
document.addEventListener('DOMContentLoaded', () => EvoraPrivacy.init()); 