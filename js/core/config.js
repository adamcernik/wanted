/**
 * Configuration for WANTED s.f.o. Website
 */

export const CONFIG = {
    // EmailJS Configuration
    emailJS: {
        publicKey: 'hUdCH3u0SC6LkmOaD',
        serviceId: 'service_y9eokla',
        templateId: 'template_07bfz5o',
    },

    // i18n Configuration
    i18n: {
        defaultLanguage: 'en',
        availableLanguages: ['en', 'cs', 'de', 'fr', 'pl', 'hu'],
    },

    // Scrolling Configuration
    scroll: {
        timeline: {
            resistance: 0.9, // Higher for faster scrolling
            deceleration: 0.85,
            overscrollEnabled: true,
            overscrollResistance: 0.3,
        },
        services: {
            resistance: 0.5,
            deceleration: 0.85,
            snapToItems: false,
            overscrollEnabled: true,
            overscrollResistance: 0.3,
        },
    },

    // Slider Configuration
    slider: {
        autoplayDelay: 5000,
        swipeThreshold: 50,
    },

    // Breakpoints (for JS reference)
    breakpoints: {
        mobile: 640,
        tablet: 768,
        laptop: 1024,
        desktop: 1440,
    },
};
