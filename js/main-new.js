/**
 * WANTED s.f.o. - Main Application Entry Point
 * Film Production Support & Services
 * 
 * This is the new modular version - much cleaner than the original 1741 lines!
 */

import { CONFIG } from './core/config.js';
import { ready, loadHTML, isMobile } from './core/utils.js';
import { NaturalScroll } from './modules/scroll.js';
import { initProjectSlider } from './modules/slider.js';
import { initContactForm } from './modules/contact.js';
import { initNavigation } from './modules/navigation.js';

/**
 * Initialize the application
 */
function init() {
    console.log('🎬 WANTED s.f.o. - Initializing...');

    // 1. Initialize navigation
    initNavigation();

    // 2. Initialize project slider
    initProjectSlider();

    // 3. Initialize contact form
    initContactForm(CONFIG.emailJS);

    // 4. Initialize timeline
    initTimeline();

    // 5. Load and initialize services
    loadServices();

    // 6. Load partners section
    loadPartners();

    // 7. Force translation update if language was previously selected
    if (localStorage.getItem('language')) {
        setTimeout(() => {
            if (window.i18n && typeof window.i18n.translatePage === 'function') {
                window.i18n.translatePage();
                console.log('✅ Triggered translation refresh');
            }
        }, 500);
    }

    // 8. Initialize movie grid fading
    fadeMovies();

    // 9. Initialize modal functionality
    initModals();

    console.log('✅ WANTED s.f.o. - Initialized successfully!');
}

/**
 * Movie Grid Image Fading
 */
function fadeMovies() {
    const items = document.querySelectorAll('.movie-item');
    items.forEach(item => {
        const images = item.querySelectorAll('img');
        if (images.length < 2) return; // Skip if not enough images

        let currentIndex = 0;
        const interval = 15000 + Math.random() * 5000; // Longer interval between transitions (15-20 seconds)

        // Preload images
        images.forEach(img => {
            const preload = new Image();
            preload.src = img.src;
        });

        const fadeInterval = setInterval(() => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }, interval);

        // Cleanup on page hide/unload
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(fadeInterval);
            } else {
                fadeMovies();
            }
        });
    });
}

/**
 * Initialize Service Modals
 */
function initModals() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('service-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalBody = document.getElementById('modal-body');

    // Modal content data
    const modalData = {
        'service-01': {
            title: 'Print & Design',
            subtitle: 'Professional printing and design services for various media',
            image: 'images/services/01.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Professional printing</li>
                        <li>Graphic design</li>
                        <li>Large format printing</li>
                        <li>Brochures and catalogs</li>
                        <li>Custom print solutions</li>
                        <li>Digital design</li>
                    </ul>
                </div>
            `
        },
        'service-02': {
            title: 'Corporate Identities',
            subtitle: 'Comprehensive brand identity development and implementation',
            image: 'images/services/02.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Logo design</li>
                        <li>Brand guidelines</li>
                        <li>Visual identity systems</li>
                        <li>Corporate branding</li>
                        <li>Brand implementation</li>
                        <li>Visual communication</li>
                    </ul>
                </div>
            `
        },
        'service-03': {
            title: 'Furniture',
            subtitle: 'Custom furniture design and manufacturing solutions',
            image: 'images/services/03.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Custom furniture design</li>
                        <li>Commercial furniture</li>
                        <li>Exhibition furniture</li>
                        <li>Interior solutions</li>
                    </ul>
                </div>
            `
        },
        'service-04': {
            title: 'Production',
            subtitle: 'Full-scale production services and project management',
            image: 'images/services/04.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Project management</li>
                        <li>Production planning</li>
                        <li>Quality control</li>
                        <li>Timeline management</li>
                        <li>Resource coordination</li>
                    </ul>
                </div>
            `
        },
        'service-05': {
            title: 'Crafts',
            subtitle: 'Specialized craftsmanship including glass work and custom solutions',
            image: 'images/services/05.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Custom craftsmanship</li>
                        <li>Artisanal solutions</li>
                        <li>Specialized finishes</li>
                        <li>Unique custom pieces</li>
                    </ul>
                </div>
            `
        },
        'service-06': {
            title: 'Film Props & Decorations',
            subtitle: 'Custom props and set decorations for film and television',
            image: 'images/services/06.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Unique custom pieces</li>
                        <li>Set decoration</li>
                        <li>Period-accurate items</li>
                        <li>Special effect props</li>
                        <li>Production design support</li>
                        <li>Custom craftsmanship</li>
                    </ul>
                </div>
            `
        },
        'service-07': {
            title: 'Logistics',
            subtitle: 'Comprehensive logistics and transportation services',
            image: 'images/services/07.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Transportation management</li>
                        <li>Warehouse solutions</li>
                        <li>Inventory control</li>
                        <li>Route optimization</li>
                        <li>Delivery coordination</li>
                    </ul>
                </div>
            `
        },
        'service-08': {
            title: 'Documentation',
            subtitle: 'Professional documentation and project documentation services',
            image: 'images/services/08.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Project documentation</li>
                        <li>Technical documentation</li>
                        <li>Process documentation</li>
                        <li>Quality documentation</li>
                        <li>Compliance documentation</li>
                    </ul>
                </div>
            `
        },
        'sponsorship': {
            title: 'Sponzoring',
            subtitle: '',
            image: '',
            content: `
                <div class="modal-section">
                    <p style="text-align: center; font-size: 1.2rem; padding: 2rem;">
                        Obsah dodá doktor Kalbis
                    </p>
                </div>
            `
        }
    };

    // Function to open modal
    function openModal(modalId) {
        // Check if it's the sponsorship modal (different structure)
        if (modalId === 'sponsorship') {
            const data = modalData[modalId];
            if (!data) return;
            modalImage.src = data.image;
            modalImage.alt = data.title;
            modalTitle.textContent = data.title;
            modalSubtitle.textContent = data.subtitle;
            modalBody.innerHTML = data.content;
        } else {
            // Get current language from i18n
            const currentLang = window.i18n?.getCurrentLanguage() || 'cs';
            const langTranslations = window.translations?.[currentLang];

            if (!langTranslations?.services) {
                console.warn(`Services translations not found for ${currentLang}`);
                // Fallback to hardcoded data
                const data = modalData[modalId];
                if (!data) return;
                modalImage.src = data.image;
                modalImage.alt = data.title;
                modalTitle.textContent = data.title;
                modalSubtitle.textContent = data.subtitle;
                modalBody.innerHTML = data.content;
                return;
            }

            // Load service content from translations
            const serviceNumber = modalId.split('-')[1]; // service-01 -> 01
            const serviceKey = `service${serviceNumber}`; // service01
            const serviceData = langTranslations.services[serviceKey];

            if (!serviceData) {
                console.warn(`Service data not found for ${serviceKey}`);
                return;
            }

            // Populate modal content from translations
            modalImage.src = `images/services/${serviceNumber}.jpg`;
            modalImage.alt = serviceData.title;
            modalTitle.textContent = serviceData.title;
            modalSubtitle.textContent = serviceData.description;

            // Build capabilities list from translations
            const capabilities = serviceData.capabilities || [];
            const listHTML = `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        ${capabilities.map(cap => `<li>${cap}</li>`).join('')}
                    </ul>
                </div>
            `;
            modalBody.innerHTML = listHTML;
        }

        // Show modal
        modalOverlay.classList.add('active');

        // Prevent body scrolling
        document.body.style.overflow = 'hidden';

        // Accessibility
        modal.setAttribute('aria-hidden', 'false');
        modalClose.focus();
    }

    // Function to close modal
    function closeModal() {
        modalOverlay.classList.remove('active');

        // Restore body scrolling
        document.body.style.overflow = '';

        // Accessibility
        modal.setAttribute('aria-hidden', 'true');

        // Clear content after transition is complete
        setTimeout(() => {
            modalImage.src = '';
            modalImage.alt = '';
        }, 400);
    }

    // Close modal when clicking the close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside of it (on the overlay)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Add click event listeners to desktop service tiles
    document.querySelectorAll('.bento-grid .service-tile[data-modal]').forEach(tile => {
        tile.addEventListener('click', function (event) {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Add click event listener to sponsorship tile
    const sponsorshipTile = document.querySelector('.sponsorship-tile[data-modal]');
    if (sponsorshipTile) {
        sponsorshipTile.addEventListener('click', function (event) {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    }

    // Expose openModal globally for use by other scripts
    window.openModal = openModal;
}

/**
 * Initialize Timeline
 */
async function initTimeline() {
    const container = document.getElementById('timeline-basic-scroll');
    if (!container) return;

    try {
        // Load timeline content from markdown
        const response = await fetch('content_md/timeline.md');
        if (!response.ok) {
            throw new Error('Failed to load timeline data');
        }

        const markdown = await response.text();
        const timelineData = parseTimelineMarkdown(markdown);

        // Render timeline
        renderTimeline(container, timelineData);

        // Add loaded class for swipe hint animation (after a delay)
        setTimeout(() => {
            container.parentElement.classList.add('loaded');
        }, 1000);

    } catch (error) {
        console.error('Error initializing timeline:', error);
        container.innerHTML = '<p class="timeline-error">Failed to load timeline content.</p>';
    }
}

/**
 * Parse timeline markdown into structured data
 */
function parseTimelineMarkdown(markdown) {
    const lines = markdown.split('\n').filter(line => line.trim());
    const timeline = [];
    let currentYear = null;
    let currentEvents = [];

    lines.forEach(line => {
        const yearMatch = line.match(/^\*\*(\d{4})\*\*$/);

        if (yearMatch) {
            // Save previous year if exists
            if (currentYear) {
                timeline.push({ year: currentYear, events: currentEvents });
            }
            // Start new year
            currentYear = yearMatch[1];
            currentEvents = [];
        } else if (currentYear && line.trim()) {
            // Add event to current year
            currentEvents.push(line.trim());
        }
    });

    // Add last year
    if (currentYear) {
        timeline.push({ year: currentYear, events: currentEvents });
    }

    return timeline.reverse(); // Most recent first
}

/**
 * Render timeline HTML
 */
function renderTimeline(container, timelineData) {
    const html = timelineData.map(({ year, events }) => `
        <div class="timeline-tile">
            <div class="timeline-year">${year}</div>
            <div class="timeline-content">
                <ul class="timeline-event-list">
                    ${events.map(event => `<li>${event}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

/**
 * Load and initialize services
 */
async function loadServices() {
    const servicesTrack = document.getElementById('services-track');
    if (!servicesTrack) return;

    try {
        console.log('Loading services content...');
        const html = await loadHTML('includes/services.html');

        if (html) {
            servicesTrack.innerHTML = html;
            initServicesScroll();

            // Add click event listeners to service tiles
            const tiles = servicesTrack.querySelectorAll('.service-tile[data-modal]');
            tiles.forEach(tile => {
                tile.addEventListener('click', function (event) {
                    if (event._isScroll) return;
                    const modalId = this.getAttribute('data-modal');
                    if (window.openModal) {
                        window.openModal(modalId);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error loading services:', error);
        servicesTrack.innerHTML = '<p class="services-error">Failed to load services content.</p>';
    }
}

/**
 * Initialize services scroll functionality
 */
function initServicesScroll() {
    const basicServicesScroll = document.getElementById('basic-services-scroll');
    if (!basicServicesScroll) return;

    if (!isMobile()) return;

    console.log('Setting up mobile services scroll');

    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;

    // Basic touch handling
    basicServicesScroll.addEventListener('touchstart', (e) => {
        isScrolling = false;
        startX = e.touches[0].pageX;
        scrollLeft = basicServicesScroll.scrollLeft;
    }, { passive: true });

    basicServicesScroll.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        if (Math.abs(walk) > 5) {
            isScrolling = true;
        }
    }, { passive: true });

    basicServicesScroll.addEventListener('touchend', (e) => {
        if (isScrolling) {
            // Mark event to prevent click
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        }
    }, { passive: true });

    // Handle clicks on service tiles
    const tiles = basicServicesScroll.querySelectorAll('.basic-service-tile[data-target]');
    tiles.forEach(tile => {
        tile.addEventListener('click', function (e) {
            if (isScrolling) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            const targetId = this.getAttribute('data-target');
            if (window.openModal) {
                window.openModal(targetId);
            }
        });
    });

    // Add hint for mobile swipe
    const mobileServices = document.querySelector('.mobile-only-services');
    if (mobileServices) {
        setTimeout(() => {
            mobileServices.classList.add('loaded');
        }, 1000);
    }
}

/**
 * Load partners section
 */
async function loadPartners() {
    const partnersContainer = document.getElementById('partners');
    if (!partnersContainer) return;

    try {
        const html = await loadHTML('includes/partners.html');
        if (html) {
            partnersContainer.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading partners:', error);
    }
}

// Initialize when DOM is ready
ready(init);

console.log('📦 Main module loaded');
