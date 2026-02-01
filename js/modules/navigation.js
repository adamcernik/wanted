/**
 * Navigation Module
 * Handles mobile navigation toggle and smooth scrolling
 */

export class Navigation {
    constructor() {
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.html = document.documentElement;
        this.logoLink = document.querySelector('.logo-link');
        this.header = document.querySelector('.header');

        this.init();
    }

    init() {
        // Header scroll effect
        this.initHeaderScroll();

        // Mobile toggle
        if (this.mobileToggle && this.mobileNav) {
            this.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Logo click to scroll to top
        if (this.logoLink) {
            this.logoLink.addEventListener('click', this.scrollToTop.bind(this));
        }

        // Close mobile menu when clicking navigation links
        const mobileLinks = this.mobileNav?.querySelectorAll('a');
        mobileLinks?.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.mobileNav?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.mobileNav.classList.contains('active');

        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileNav.classList.add('active');
        this.mobileToggle.classList.add('active');
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        this.html.classList.add('mobile-menu-open');
    }

    closeMobileMenu() {
        this.mobileNav.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.html.classList.remove('mobile-menu-open');
    }

    initHeaderScroll() {
        if (!this.header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }

    scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.closeMobileMenu();
    }
}

// Initialize function
export function initNavigation() {
    return new Navigation();
}
