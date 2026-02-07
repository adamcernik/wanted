/**
 * Internationalization (i18n) functionality for WANTED website
 * Handles language switching and translation of text content
 */

// Default language and available languages
const DEFAULT_LANGUAGE = 'en';
const AVAILABLE_LANGUAGES = ['en', 'cs', 'de', 'fr', 'pl', 'hu'];

// Store translations cache
let translations = {};
let currentLanguage = localStorage.getItem('language') || DEFAULT_LANGUAGE;

// Make translations available globally
window.translations = translations;

// Elements with translations
const translatableElements = [];

/**
 * Initialize the i18n functionality
 */
function initI18n() {
    // Set the initial language
    document.documentElement.lang = currentLanguage;

    // Setup language switchers
    setupLanguageSwitchers();

    // Load translations and translate the page
    loadTranslations(currentLanguage)
        .then(() => translatePage())
        .catch(error => console.error('Failed to load translations:', error));

    // Update meta tags
    updateMetaTags();
}

/**
 * Load translations for a specific language
 * @param {string} lang - Language code to load
 * @returns {Promise} - Promise resolving when translations are loaded
 */
function loadTranslations(lang) {
    console.log(`Attempting to load translations for language: ${lang}`);

    // If already cached, return immediately
    if (translations[lang]) {
        console.log(`Using cached translations for ${lang}`);
        return Promise.resolve(translations[lang]);
    }

    // Otherwise, fetch from file
    const url = `langs/${lang}.json?v=${new Date().getTime()}`;
    console.log(`Fetching translations from: ${url}`);

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error(`Failed to load ${lang} translations. Status: ${response.status}`);
                throw new Error(`Failed to load ${lang} translations`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Successfully loaded translations for ${lang}`);
            console.log('Translation data sample:', JSON.stringify(data).substring(0, 100) + '...');
            translations[lang] = data;
            return data;
        })
        .catch(error => {
            console.error(`Error loading translations for ${lang}:`, error);
            throw error;
        });
}

/**
 * Setup language selection dropdown functionality
 */
function setupLanguageSwitchers() {
    // Only handle language selection clicks - toggle is now handled inline
    const languageOptions = document.querySelectorAll('.language-option');

    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const lang = this.getAttribute('data-lang');
            if (lang && AVAILABLE_LANGUAGES.includes(lang)) {
                switchLanguage(lang);

                // Update display of current language
                document.querySelectorAll('.language-current span').forEach(span => {
                    span.textContent = lang.toUpperCase();
                });

                // Close all dropdowns
                document.querySelectorAll('.language-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });

                // Close mobile menu if open
                const mobileNav = document.querySelector('.mobile-nav');
                const mobileToggle = document.querySelector('.mobile-toggle');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.classList.remove('active');
                        mobileToggle.setAttribute('aria-expanded', 'false');
                    }
                    document.documentElement.classList.remove('mobile-menu-open');
                }
            }
        });
    });
}

/**
 * Switch the website language
 * @param {string} lang - Language code to switch to
 */
function switchLanguage(lang) {
    if (!AVAILABLE_LANGUAGES.includes(lang)) {
        console.error(`Language ${lang} is not supported`);
        return;
    }

    // Update current language
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    // Load translations and update the page
    loadTranslations(lang)
        .then(() => {
            translatePage();
            updateMetaTags();
        })
        .catch(error => console.error('Failed to load translations:', error));
}

/**
 * Update page metadata based on current language
 */
function updateMetaTags() {
    const langData = translations[currentLanguage];
    if (!langData || !langData.meta) return;

    // Update title and meta description
    document.title = langData.meta.title || 'WANTED';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && langData.meta.description) {
        metaDescription.setAttribute('content', langData.meta.description);
    }
}

/**
 * Translate the entire page to the current language
 */
function translatePage() {
    const langData = translations[currentLanguage];
    if (!langData) {
        console.error(`No translations loaded for ${currentLanguage}`);
        return;
    }

    // Apply translations to all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(translateElement);

    // Apply translations to all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(translatePlaceholder);

    // Translate specific sections
    translateNavigation(langData);
    translateWhoWeAreSection(langData);
    translateWhatWeDoSection(langData);
    translateProjectsSection(langData);
    translateContactForm(langData);
    translateServices(langData);
    translateTimeline(langData);

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;

    // Display current language in UI
    document.querySelectorAll('.language-current span').forEach(span => {
        span.textContent = currentLanguage.toUpperCase();
    });

    // Dispatch event for other components
    document.dispatchEvent(
        new CustomEvent('languageChanged', {
            detail: { language: currentLanguage, data: langData },
        })
    );
}

/**
 * Translate a specific element using its data-i18n key
 * @param {HTMLElement} element - Element to translate
 */
function translateElement(element) {
    const key = element.getAttribute('data-i18n');
    if (!key) return;

    const langData = translations[currentLanguage];
    if (!langData) return;

    // Get the translation using the key path
    const value = getNestedTranslation(langData, key);

    if (value !== undefined) {
        element.textContent = value;
    } else {
        console.warn(`Translation for key "${key}" not found in language "${currentLanguage}"`);
    }
}

/**
 * Translate a placeholder for a form element
 * @param {HTMLElement} element - Form element to translate placeholder
 */
function translatePlaceholder(element) {
    const key = element.getAttribute('data-i18n-placeholder');
    if (!key) return;

    const langData = translations[currentLanguage];
    if (!langData) return;

    // Get the translation using the key path
    const value = getNestedTranslation(langData, key);

    if (value !== undefined) {
        element.placeholder = value;
    } else {
        console.warn(
            `Translation for placeholder key "${key}" not found in language "${currentLanguage}"`
        );
    }
}

/**
 * Get a nested translation value from a key path like "home.whoWeAre.title" or "home.resources.items.0"
 * @param {Object} data - Translation data object
 * @param {string} path - Dot-notation path to the translation
 * @returns {string|undefined} - Translation text or undefined if not found
 */
function getNestedTranslation(data, path) {
    const keys = path.split('.');
    let value = data;

    for (const key of keys) {
        if (value === undefined || value === null) {
            return undefined;
        }

        // Handle array indices (key is a number)
        if (!isNaN(parseInt(key)) && Array.isArray(value)) {
            const index = parseInt(key);
            if (index >= 0 && index < value.length) {
                value = value[index];
            } else {
                console.warn(`Array index ${index} out of bounds for path ${path}`);
                return undefined;
            }
        } else {
            value = value[key];
        }
    }

    return value;
}

/**
 * Translate navigation menu
 * @param {Object} langData - Translation data for current language
 */
function translateNavigation(langData) {
    if (!langData.navigation) return;

    // Desktop navigation
    document.querySelectorAll('.desktop-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#service-01') {
            link.textContent = langData.navigation.services;
        } else if (href === '#movie-grid') {
            link.textContent = langData.navigation.production;
        } else if (href === '#history') {
            link.textContent = langData.navigation.references;
        } else if (href === '#lukas-contact') {
            link.textContent = langData.navigation.contact;
        }
    });

    // Mobile navigation
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#desktop-services') {
            link.textContent = langData.navigation.services;
        } else if (href === '#movie-grid') {
            link.textContent = langData.navigation.production;
        } else if (href === '#history') {
            link.textContent = langData.navigation.references;
        } else if (href === '#lukas-contact') {
            link.textContent = langData.navigation.contact;
        }
    });

    // Skip to content link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink && langData.header.skipToContent) {
        skipLink.textContent = langData.header.skipToContent;
    }
}

/**
 * Translate Who We Are section
 * @param {Object} langData - Translation data for current language
 */
function translateWhoWeAreSection(langData) {
    if (!langData.home || !langData.home.whoWeAre) return;

    const section = document.getElementById('who-we-are');
    if (!section) return;

    const headline = section.querySelector('.headline');
    if (headline) {
        headline.textContent = langData.home.whoWeAre.title;
    }

    const text = section.querySelector('.text');
    if (text) {
        text.textContent = langData.home.whoWeAre.text;
    }
}

/**
 * Translate What We Do section
 * @param {Object} langData - Translation data for current language
 */
function translateWhatWeDoSection(langData) {
    if (!langData.home || !langData.home.whatWeDo) return;

    const section = document.querySelector('.what-we-do-tile');
    if (!section) return;

    const headline = section.querySelector('.headline');
    if (headline) {
        headline.textContent = langData.home.whatWeDo.title;
    }

    const serviceList = section.querySelector('.service-list');
    if (serviceList && langData.home.whatWeDo.services) {
        const listItems = serviceList.querySelectorAll('li');
        langData.home.whatWeDo.services.forEach((service, index) => {
            if (listItems[index]) {
                listItems[index].textContent = service;
            }
        });
    }
}

/**
 * Translate Projects section
 * @param {Object} langData - Translation data for current language
 */
function translateProjectsSection(langData) {
    if (!langData.home || !langData.home.projects) return;

    // Find project slides
    const projectSlides = document.querySelectorAll('.project-slide');

    projectSlides.forEach(slide => {
        // Translate "In progress" status
        const status = slide.querySelector('.project-status');
        if (status) {
            status.textContent = langData.home.projects.inProgress;
        }

        // Translate project titles
        const title = slide.querySelector('.project-title');
        if (title) {
            if (title.textContent.includes('Dacia NVI')) {
                title.textContent = langData.home.projects.daciaNvi;
            } else if (title.textContent.includes('Renault Store')) {
                title.textContent = langData.home.projects.renaultStore;
            }
        }

        // Translate "Coming Soon" text
        const text = slide.querySelector('.project-text');
        if (text && text.textContent.includes('Coming Soon')) {
            text.textContent = langData.home.projects.comingSoon;
        }
    });
}

/**
 * Translate Contact form
 * @param {Object} langData - Translation data for current language
 */
function translateContactForm(langData) {
    if (!langData.contact) return;

    // Translate form elements with data-i18n-placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const value = getNestedTranslation(langData, key);

        if (value !== undefined) {
            element.placeholder = value;
        }
    });

    // Set form button status messages
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        // Set data attributes for status messages
        if (submitBtn.hasAttribute('data-sending')) {
            submitBtn.setAttribute('data-sending', langData.contact.sending || 'Sending...');
        }

        if (submitBtn.hasAttribute('data-sent')) {
            submitBtn.setAttribute('data-sent', langData.contact.sent || 'Message sent!');
        }

        if (submitBtn.hasAttribute('data-failed')) {
            submitBtn.setAttribute('data-failed', langData.contact.failed || 'Sending failed');
        }
    }
}

/**
 * Translate timeline section
 * @param {Object} langData - Translation data for current language
 */
function translateTimeline(langData) {
    if (!langData.timeline) return;

    // Trigger timeline re-render if it exists
    const container = document.getElementById('timeline-basic-scroll');
    if (container && window.refreshTimeline) {
        window.refreshTimeline();
    }
}

/**
 * Translate services section
 * @param {Object} langData - Translation data for current language
 */
function translateServices(langData) {
    if (!langData.services) return;

    // Translate service tiles on the main page
    document.querySelectorAll('.service-tile').forEach(tile => {
        const serviceId = tile.getAttribute('data-modal');
        if (!serviceId) return;

        const serviceNumber = serviceId.replace('service-', '');
        const serviceKey = `service${serviceNumber.padStart(2, '0')}`;

        if (langData.services[serviceKey]) {
            const serviceData = langData.services[serviceKey];

            // Update title and description
            const titleElement = tile.querySelector('.service-title');
            const textElement = tile.querySelector('.text');

            if (titleElement && serviceData.title) {
                titleElement.textContent = serviceData.title;
            }

            if (textElement && serviceData.description) {
                textElement.textContent = serviceData.description;
            }
        }
    });

    // Translate mobile service tiles
    document.querySelectorAll('.basic-service-tile').forEach(tile => {
        const serviceId = tile.getAttribute('data-target');
        if (!serviceId) return;

        const serviceNumber = serviceId.replace('service-', '');
        const serviceKey = `service${serviceNumber.padStart(2, '0')}`;

        if (langData.services[serviceKey]) {
            const serviceData = langData.services[serviceKey];

            // Update title and description
            const titleElement = tile.querySelector('h3');
            const textElement = tile.querySelector('p');

            if (titleElement && serviceData.title) {
                titleElement.textContent = serviceData.title;
            }

            if (textElement && serviceData.description) {
                textElement.textContent = serviceData.description;
            }
        }
    });
}

/**
 * Initialize i18n functionality
 */
function initializeI18n() {
    // Set initial language from localStorage or use default
    currentLanguage = localStorage.getItem('language') || DEFAULT_LANGUAGE;

    // Update display of current language in UI
    document.querySelectorAll('.language-current span').forEach(span => {
        span.textContent = currentLanguage.toUpperCase();
    });

    // Load translations for initial language
    loadTranslations(currentLanguage)
        .then(() => {
            // Apply translations
            translatePage();
            updateMetaTags();
        })
        .catch(error => console.error('Failed to load translations:', error));

    // Add event listeners to language options
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            if (lang && lang !== currentLanguage) {
                switchLanguage(lang);
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired - initializing i18n');
    initI18n();
});

// Export functions for use in other scripts
window.i18n = {
    switchLanguage,
    translatePage,
    getCurrentLanguage: () => currentLanguage,
};
