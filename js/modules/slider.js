/**
 * Project Slider Module
 * Handles the project slider with autoplay, touch gestures, and navigation dots
 */

export class ProjectSlider {
    constructor(containerSelector) {
        this.slider = document.querySelector(containerSelector);
        if (!this.slider) {
            console.warn(`ProjectSlider: Container "${containerSelector}" not found`);
            return;
        }

        this.backgrounds = this.slider.querySelectorAll('.project-slide-bg');
        this.slides = this.slider.querySelectorAll('.project-slide');
        this.dots = this.slider.querySelectorAll('.project-dot');
        this.slidesWrapper = this.slider.querySelector('.project-slides-wrapper');

        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.isSwiping = false;
        this.startX = 0;
        this.startY = 0;
        this.moveX = 0;

        this.init();
    }

    init() {
        // Start autoplay
        this.startAutoplay();

        // Set up dot navigation
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                if (slideIndex !== this.currentIndex) {
                    this.goToSlide(slideIndex);
                    this.resetAutoplay();
                }
            });
        });

        // Touch events for mobile swiping
        if (this.slidesWrapper) {
            this.slidesWrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), {
                passive: true,
            });
            this.slidesWrapper.addEventListener('touchmove', this.handleTouchMove.bind(this), {
                passive: true,
            });
            this.slidesWrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), {
                passive: true,
            });
        }

        // Mouse enter/leave to pause/resume autoplay
        this.slider.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });

        this.slider.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            const nextIndex = (this.currentIndex + 1) % this.backgrounds.length;
            this.goToSlide(nextIndex);
        }, 5000); // Change slides every 5 seconds
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    goToSlide(index) {
        // Update active classes
        this.backgrounds.forEach((bg, i) => {
            bg.classList.toggle('active', i === index);
        });

        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentIndex = index;
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.isSwiping = true;
    }

    handleTouchMove(e) {
        if (!this.isSwiping) return;

        this.moveX = e.touches[0].clientX;
        const moveY = e.touches[0].clientY;

        // Detect horizontal vs vertical scrolling
        const diffX = Math.abs(this.moveX - this.startX);
        const diffY = Math.abs(moveY - this.startY);

        // If more vertical than horizontal movement, exit
        if (diffY > diffX) {
            this.isSwiping = false;
            return;
        }
    }

    handleTouchEnd() {
        if (!this.isSwiping) return;

        const diff = this.moveX - this.startX;
        const threshold = 50; // Minimum swipe distance

        if (diff > threshold) {
            // Swiped right, go to previous slide
            const prevIndex =
                (this.currentIndex - 1 + this.backgrounds.length) % this.backgrounds.length;
            this.goToSlide(prevIndex);
            this.resetAutoplay();
        } else if (diff < -threshold) {
            // Swiped left, go to next slide
            const nextIndex = (this.currentIndex + 1) % this.backgrounds.length;
            this.goToSlide(nextIndex);
            this.resetAutoplay();
        }

        this.isSwiping = false;
    }

    destroy() {
        this.stopAutoplay();
    }
}

// Initialize function for backward compatibility
export function initProjectSlider() {
    return new ProjectSlider('.project-slider-tile');
}
