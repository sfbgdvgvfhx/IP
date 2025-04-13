// Global variables
let currentLang = 'ar';
let currentTheme = 'dark';
let map = null;
let marker = null;

// Translations
const translations = {
  ar: {
    title: 'تحديد الموقع عبر IP',
    placeholder: 'أدخل عنوان IP أو اتركه فارغًا لعنوانك',
    button: 'تحقق الآن',
    loading: 'جاري تحميل البيانات...',
    invalidIP: 'الرجاء إدخال عنوان IP صحيح',
    errorMsg: 'حدث خطأ أثناء جلب البيانات. الرجاء المحاولة مرة أخرى.',
    aboutLink: 'حول الموقع',
    privacyLink: 'سياسة الخصوصية',
    footer: '© 2025 تحديد الموقع عبر IP. جميع الحقوق محفوظة.',
    modalTitle: 'حول الموقع',
    langButton: 'English',
    copied: 'تم النسخ!',
    infoLabels: {
      ip: 'عنوان IP',
      country: 'الدولة',
      city: 'المدينة',
      region: 'المنطقة',
      timezone: 'المنطقة الزمنية',
      isp: 'مزود خدمة الإنترنت',
      coordinates: 'الإحداثيات'
    },
    modalBody: `
      <p>موقع تحديد الموقع عبر IP هو أداة بسيطة وفعالة تساعدك في:</p>
      <ul class="feature-list">
        <li>تحديد موقع أي عنوان IP باستخدام واجهات API آمنة</li>
        <li>عرض مباشر للخريطة بدون مغادرة الصفحة</li>
        <li>دعم اللغتين العربية والإنجليزية تلقائيًا</li>
        <li>تحديد معلومات المزود والبلد والمدينة</li>
        <li>واجهة استخدام سهلة ومميزة للجوال والحاسوب</li>
        <li>خيارات الوضع الداكن والفاتح</li>
      </ul>
      <p>استخدم الموقع مجانًا بدون تسجيل أو إعلانات!</p>
    `
  },
  en: {
    title: 'IP Location Finder',
    placeholder: 'Enter an IP address or leave empty for your own',
    button: 'Check Now',
    loading: 'Loading data...',
    invalidIP: 'Please enter a valid IP address',
    errorMsg: 'An error occurred while fetching data. Please try again.',
    aboutLink: 'About Site',
    privacyLink: 'Privacy Policy',
    footer: '© 2025 IP Location Finder. All rights reserved.',
    modalTitle: 'About This Website',
    langButton: 'العربية',
    copied: 'Copied!',
    infoLabels: {
      ip: 'IP Address',
      country: 'Country',
      city: 'City',
      region: 'Region',
      timezone: 'Timezone',
      isp: 'ISP',
      coordinates: 'Coordinates'
    },
    modalBody: `
      <p>IP Location Finder is a simple yet powerful tool that helps you:</p>
      <ul class="feature-list">
        <li>Locate any IP address using secure API interfaces</li>
        <li>View location directly on a map without leaving the page</li>
        <li>Support for both Arabic and English languages</li>
        <li>Identify ISP, country, and city information</li>
        <li>Responsive interface for mobile and desktop</li>
        <li>Dark and light mode options</li>
      </ul>
      <p>Use the site for free with no registration or ads!</p>
    `
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set theme based on user preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light');
  }
  
  // Listen for theme changes
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Set up validation
  document.getElementById('ip-input').addEventListener('input', validateIP);
});

// Theme toggle
function toggleTheme() {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-toggle').innerHTML = theme === 'dark' ? '🌙' : '☀️';
}

// Language toggle
function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  applyTranslations();
}

function applyTranslations() {
  const t = translations[currentLang];
  
  // Update HTML direction and language
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  
  // Update UI elements
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('ip-input').placeholder = t.placeholder;
  document.getElementById('locate-btn').textContent = t.button;
  document.getElementById('loading-text').textContent = t.loading;
  document.getElementById('validation-message').textContent = t.invalidIP;
  document.getElementById('about-link').textContent = t.aboutLink;
  document.getElementById('privacy-link').textContent = t.privacyLink;
  document.getElementById('footer-text').textContent = t.footer;
  document.getElementById('modal-title').textContent = t.modalTitle;
  document.getElementById('modal-body').innerHTML = t.modalBody;
  document.getElementById('lang-toggle').textContent = t.langButton;
  
  // Update results if they exist
  updateResultsLanguage();
}

// Update results language if they're visible
function updateResultsLanguage() {
  const infoContainer = document.getElementById('info-container');
  if (infoContainer.innerHTML !== '') {
    const items = infoContainer.querySelectorAll('.info-item');
    const t = translations[currentLang].infoLabels;
    
    items.forEach(item => {
      const label = item.querySelector('.info-label');
      const key = label.dataset.key;
      if (key && t[key]) {
        label.textContent = t[key] + ':';
      }
    });
  }
}

// Modal toggle
function toggleModal() {
  document.getElementById('about-modal').classList.toggle('active');
}

// Validate IP address
function validateIP() {
  const ipInput = document.getElementById('ip-input');
  const validationMessage = document.getElementById('validation-message');
  
  // If empty, it's valid (will use user's IP)
  if (!ipInput.value.trim()) {
    validationMessage.style.display = 'none';
    return true;
  }
  
  // IPv4 or IPv6 validation regex
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
  
  const isValid = ipv4Regex.test(ipInput.value) || ipv6Regex.test(ipInput.value);
  
  // For IPv4, also check that each octet is <= 255
  if (ipv4Regex.test(ipInput.value)) {
    const octets = ipInput.value.split('.');
    const validOctets = octets.every(octet => parseInt(octet) <= 255);
    if (!validOctets) {
      validationMessage.style.display = 'block';
      return false;
    }
  }
  
  validationMessage.style.display = isValid ? 'none' : 'block';
  return isValid;
}

// Copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const t = translations[currentLang];
    // Show temporary copied message
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = t.copied;
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  });
}

// Main function to locate IP
function locateIP() {
  // Validate input first
  if (!validateIP() && document.getElementById('ip-input').value.trim() !== '') {
    return;
  }
  
  const ipValue = document.getElementById('ip-input').value.trim();
  const loader = document.getElementById('loader');
  const results = document.getElementById('results');
  const errorMessage = document.getElementById('error-message');
  
  // Reset UI
  results.style.display = 'none';
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';
  loader.style.display = 'block';
  
  // Use HTTPS API
  fetch(`https://ipapi.co/${ipValue}/json/`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Check if API returned an error
      if (data.error) {
        throw new Error(data.reason || 'API error');
      }
      
      displayResults(data);
    })
    .catch(error => {
      console.error('Error:', error);
      // Try fallback API
      tryFallbackAPI(ipValue)
        .then(data => {
          displayResults(data);
        })
        .catch(fallbackError => {
          console.error('Fallback Error:', fallbackError);
          errorMessage.textContent = translations[currentLang].errorMsg;
          errorMessage.style.display = 'block';
          loader.style.display = 'none';
        });
    });
}

// Display results
function displayResults(data) {
  const infoContainer = document.getElementById('info-container');
  const loader = document.getElementById('loader');
  const results = document.getElementById('results');
  const t = translations[currentLang].infoLabels;
  
  // Create info items
  let infoHTML = '';
  
  // IP Address
  infoHTML += createInfoItem('ip', t.ip, data.ip);
  
  // Country and City
  const location = [data.country_name];
  if (data.city) location.push(data.city);
  infoHTML += createInfoItem('country', t.country, data.country_name);
  infoHTML += createInfoItem('city', t.city, data.city || '-');
  
  // Region
  infoHTML += createInfoItem('region', t.region, data.region || '-');
  
  // Timezone
  infoHTML += createInfoItem('timezone', t.timezone, data.timezone || '-');
  
  // ISP/Organization
  infoHTML += createInfoItem('isp', t.isp, data.org || '-');
  
  // Coordinates
  const coordinates = `${data.latitude}, ${data.longitude}`;
  infoHTML += createInfoItem('coordinates', t.coordinates, coordinates);
  
  // Update the DOM
  infoContainer.innerHTML = infoHTML;
  
  // Initialize map
  initializeMap(data.latitude, data.longitude, data.city || data.country_name);
  
  // Show results
  loader.style.display = 'none';
  results.style.display = 'block';
  
  // Add copy event listeners
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const text = this.parentElement.querySelector('.info-value').textContent;
      copyToClipboard(text);
    });
  });
}

// Create a single info item
function createInfoItem(key, label, value) {
  return `
    <div class="info-item">
      <div class="info-label" data-key="${key}">${label}:</div>
      <div class="info-value">
        ${value}
        <button class="copy-btn" title="${translations[currentLang].copied}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
}

// Initialize Leaflet map
function initializeMap(lat, lon, locationName) {
  // Clear existing map if any
  if (map) {
    map.remove();
    map = null;
  }
  
  // Create new map
  map = L.map('map').setView([lat, lon], 13);
  
  // Add tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Add marker
  marker = L.marker([lat, lon]).addTo(map)
    .bindPopup(locationName)
    .openPopup();
    
  // Make sure map resizes properly
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

// Handle Enter key press on input
document.getElementById('ip-input').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    locateIP();
  }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('about-modal');
  if (event.target === modal) {
    toggleModal();
  }
});

// Add keyboard accessibility for modal
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('about-modal');
    if (modal.classList.contains('active')) {
      toggleModal();
    }
  }
});

// Fallback for API errors
function tryFallbackAPI(ipValue) {
  return fetch(`https://ipinfo.io/${ipValue}/json`)
    .then(response => response.json())
    .then(data => {
      // Convert API format
      const coords = data.loc ? data.loc.split(',') : [0, 0];
      return {
        ip: data.ip,
        country_name: data.country,
        city: data.city,
        region: data.region,
        timezone: data.timezone,
        org: data.org,
        latitude: coords[0],
        longitude: coords[1]
      };
    });
}
