// config.js
const CONFIG = {
    // API URLs
    FASTAPI_URL: process.env.REACT_APP_FASTAPI_URL,
    CRM_API_URL: process.env.NODE_ENV === 'development' 
      ? process.env.REACT_APP_CRM_API_URL_LOCAL 
      : process.env.REACT_APP_CRM_API_URL,
  
    // reCAPTCHA Keys
    RECAPTCHA_KEY: process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_RECAPTCHA_SITE_KEY_TEST
      : process.env.REACT_APP_RECAPTCHA_SITE_KEY,
  
    // API Headers
    API_HEADERS: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
  
    // API Timeout
    TIMEOUT: 60000,
  
    // Build Settings
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    SOURCE_MAP: process.env.GENERATE_SOURCEMAP === 'true'
  };
  
  // IIFE (Immediately Invoked Function Expression) ile konfigürasyonu kapsülleme
  export default (() => {
    // Private değişkenler
    let instance = null;
    
    // Singleton pattern
    const createInstance = () => {
      return {
        get: (key) => {
          if (!(key in CONFIG)) {
            console.warn(`Config key "${key}" not found`);
            return null;
          }
          return CONFIG[key];
        },
        
        // API URL'lerini alma
        getApiUrl: () => CONFIG.CRM_API_URL,
        getFastApiUrl: () => CONFIG.FASTAPI_URL,
        
        // reCAPTCHA anahtarını alma
        getRecaptchaKey: () => CONFIG.RECAPTCHA_KEY,
        
        // API Headers
        getHeaders: (additionalHeaders = {}) => ({
          ...CONFIG.API_HEADERS,
          ...additionalHeaders
        }),
        
        // Environment kontrolü
        isProduction: () => CONFIG.IS_PRODUCTION,
        
        // Timeout değeri
        getTimeout: () => CONFIG.TIMEOUT
      };
    };
  
    return {
      getInstance: () => {
        if (!instance) {
          instance = createInstance();
        }
        return instance;
      }
    };
  })();