/**
 * Natural Scrolling Utility
 * Provides smooth, natural scrolling behavior for horizontal containers
 * with momentum, overscroll effects, and optional snap-to functionality
 */

export class NaturalScroll {
    constructor(container, options = {}) {
        if (!container) {
            console.warn('NaturalScroll: No container provided');
            return;
        }

        this.container = container;
        this.config = {
            resistance: 0.5,
            deceleration: 0.85,
            minSwipeDistance: 5,
            snapToItems: false,
            itemSelector: null,
            overscrollEnabled: true,
            overscrollResistance: 0.3,
            overscrollReturnDelay: 500,
            customSnapBehavior: null,
            ...options
        };

        this.state = {
            isDragging: false,
            startX: 0,
            startY: 0,
            startScrollLeft: 0,
            lastX: 0,
            lastY: 0,
            lastTimestamp: 0,
            velocityX: 0,
            momentumID: null,
            isTap: true,
            scrollDistanceTraveled: 0,
            isOverscrolling: false,
            overscrollAmount: 0,
            overscrollReturnTimeoutId: null
        };

        this.init();
    }

    init() {
        // Touch events
        this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });

        // Mouse events (for desktop)
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.onMouseUp.bind(this));

        // Wheel event
        this.container.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

        // Set initial cursor
        this.container.style.cursor = 'grab';
    }

    getTrack() {
        return this.container.querySelector(':scope > div');
    }

    // Touch handlers
    onTouchStart(e) {
        this.cancelMomentum();
        this.clearOverscrollReturn();

        const touch = e.touches[0];
        this.state.startX = touch.clientX;
        this.state.startY = touch.clientY;
        this.state.lastX = this.state.startX;
        this.state.lastY = this.state.startY;
        this.state.startScrollLeft = this.container.scrollLeft;
        this.state.lastTimestamp = Date.now();
        this.state.velocityX = 0;
        this.state.isTap = true;
        this.state.scrollDistanceTraveled = 0;
        this.state.isDragging = true;
        this.state.isOverscrolling = false;
        this.state.overscrollAmount = 0;

        const track = this.getTrack();
        if (track) {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
        }
    }

    onTouchMove(e) {
        if (!this.state.isDragging) return;

        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        const deltaX = this.state.lastX - currentX;
        const deltaY = this.state.lastY - currentY;
        const timestamp = Date.now();
        const elapsed = timestamp - this.state.lastTimestamp;

        this.state.scrollDistanceTraveled += Math.abs(deltaX);

        if (this.state.scrollDistanceTraveled > this.config.minSwipeDistance) {
            this.state.isTap = false;
        }

        // Only handle horizontal scrolling
        if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            e.preventDefault();

            const isAtLeftEdge = this.container.scrollLeft <= 0;
            const isAtRightEdge = this.container.scrollLeft + this.container.offsetWidth >= this.container.scrollWidth;

            if (this.config.overscrollEnabled && ((isAtLeftEdge && deltaX < 0) || (isAtRightEdge && deltaX > 0))) {
                this.handleOverscroll(deltaX);
            } else {
                this.handleNormalScroll(deltaX, elapsed);
            }
        } else {
            this.state.velocityX = 0;
        }

        this.state.lastX = currentX;
        this.state.lastY = currentY;
        this.state.lastTimestamp = timestamp;
    }

    onTouchEnd() {
        if (!this.state.isDragging) return;
        this.state.isDragging = false;

        if (this.state.isOverscrolling && this.state.overscrollAmount !== 0) {
            this.scheduleOverscrollReturn();
            return;
        }

        if (this.state.isTap) return;

        if (this.config.customSnapBehavior) {
            this.config.customSnapBehavior(this.container, this.config);
        } else if (Math.abs(this.state.velocityX) > 0.1) {
            const isTimeline = this.container.classList.contains('timeline-scroll-container');
            const amplifier = isTimeline ? 25 : 15;
            this.startMomentum(this.state.velocityX * amplifier);
        } else if (this.config.snapToItems) {
            this.snapToNearestItem();
        }
    }

    // Mouse handlers
    onMouseDown(e) {
        e.preventDefault();
        this.cancelMomentum();
        this.clearOverscrollReturn();

        this.state.startX = e.pageX;
        this.state.startY = e.pageY;
        this.state.lastX = this.state.startX;
        this.state.lastY = this.state.startY;
        this.state.startScrollLeft = this.container.scrollLeft;
        this.state.lastTimestamp = Date.now();
        this.state.velocityX = 0;
        this.state.isTap = true;
        this.state.scrollDistanceTraveled = 0;
        this.state.isDragging = true;
        this.state.isOverscrolling = false;
        this.state.overscrollAmount = 0;
        this.container.style.cursor = 'grabbing';

        const track = this.getTrack();
        if (track) {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
        }
    }

    onMouseMove(e) {
        if (!this.state.isDragging) return;

        const currentX = e.pageX;
        const deltaX = this.state.lastX - currentX;
        const timestamp = Date.now();
        const elapsed = timestamp - this.state.lastTimestamp;

        this.state.scrollDistanceTraveled += Math.abs(deltaX);

        if (this.state.scrollDistanceTraveled > this.config.minSwipeDistance) {
            this.state.isTap = false;
        }

        const isAtLeftEdge = this.container.scrollLeft <= 0;
        const isAtRightEdge = this.container.scrollLeft + this.container.offsetWidth >= this.container.scrollWidth;

        if (this.config.overscrollEnabled && ((isAtLeftEdge && deltaX < 0) || (isAtRightEdge && deltaX > 0))) {
            this.handleOverscroll(deltaX);
        } else {
            this.handleNormalScroll(deltaX, elapsed);
        }

        this.state.lastX = currentX;
        this.state.lastTimestamp = timestamp;
    }

    onMouseUp() {
        if (!this.state.isDragging) return;
        this.state.isDragging = false;
        this.container.style.cursor = 'grab';

        if (this.state.isOverscrolling && this.state.overscrollAmount !== 0) {
            this.scheduleOverscrollReturn();
            return;
        }

        if (this.config.customSnapBehavior) {
            this.config.customSnapBehavior(this.container, this.config);
        } else if (!this.state.isTap && Math.abs(this.state.velocityX) > 0.1) {
            this.startMomentum(this.state.velocityX * 15);
        } else if (this.config.snapToItems) {
            this.snapToNearestItem();
        }
    }

    onWheel(e) {
        if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            this.cancelMomentum();
            this.clearOverscrollReturn();

            const isAtLeftEdge = this.container.scrollLeft <= 0;
            const isAtRightEdge = this.container.scrollLeft + this.container.offsetWidth >= this.container.scrollWidth;

            if (this.config.overscrollEnabled && ((isAtLeftEdge && e.deltaX < 0) || (isAtRightEdge && e.deltaX > 0))) {
                this.handleOverscrollWheel(e.deltaX);
            } else {
                const wheelDelta = e.deltaX || e.deltaY;
                this.container.scrollLeft += wheelDelta;
            }

            clearTimeout(this.container._wheelTimeout);
            this.container._wheelTimeout = setTimeout(() => {
                if (this.config.snapToItems) {
                    this.snapToNearestItem();
                }
            }, 150);
        }
    }

    // Scroll handling
    handleNormalScroll(deltaX, elapsed) {
        this.state.isOverscrolling = false;
        
        const isTimeline = this.container.classList.contains('timeline-scroll-container');
        const resistedDeltaX = deltaX * (isTimeline ? this.config.resistance * 1.8 : this.config.resistance);
        this.container.scrollLeft += resistedDeltaX;

        if (elapsed > 0) {
            const velocityWeight = isTimeline ? 0.4 : 0.2;
            this.state.velocityX = (1 - velocityWeight) * this.state.velocityX + velocityWeight * (deltaX / elapsed);
        }
    }

    handleOverscroll(deltaX) {
        this.state.isOverscrolling = true;
        const resistedDeltaX = -deltaX * this.config.overscrollResistance;
        this.state.overscrollAmount += resistedDeltaX;

        const maxOverscroll = this.container.offsetWidth * 0.25;
        this.state.overscrollAmount = Math.max(
            Math.min(this.state.overscrollAmount, maxOverscroll),
            -maxOverscroll
        );

        const track = this.getTrack();
        if (track) {
            track.style.transform = `translateX(${this.state.overscrollAmount}px)`;
        }
    }

    handleOverscrollWheel(deltaX) {
        this.state.overscrollAmount += deltaX * -0.1;
        
        const maxOverscroll = this.container.offsetWidth * 0.1;
        this.state.overscrollAmount = Math.max(
            Math.min(this.state.overscrollAmount, maxOverscroll),
            -maxOverscroll
        );

        const track = this.getTrack();
        if (track) {
            track.style.transform = `translateX(${this.state.overscrollAmount}px)`;
            
            clearTimeout(this.state.overscrollReturnTimeoutId);
            this.state.overscrollReturnTimeoutId = setTimeout(() => {
                this.returnFromOverscroll();
            }, 150);
        }
    }

    // Momentum scrolling
    startMomentum(initialVelocity) {
        let velocity = initialVelocity;
        let totalScrolled = 0;

        const scroll = () => {
            velocity *= this.config.deceleration;
            const delta = velocity;
            totalScrolled += Math.abs(delta);

            if (Math.abs(delta) < 0.1) {
                this.cancelMomentum();
                if (this.config.snapToItems) {
                    this.snapToNearestItem();
                }
                return;
            }

            this.container.scrollLeft += delta;
            this.state.momentumID = requestAnimationFrame(scroll);
        };

        this.state.momentumID = requestAnimationFrame(scroll);
    }

    cancelMomentum() {
        if (this.state.momentumID) {
            cancelAnimationFrame(this.state.momentumID);
            this.state.momentumID = null;
        }
    }

    // Snap functionality
    snapToNearestItem() {
        if (!this.config.itemSelector) return;

        if (this.config.customSnapBehavior) {
            this.config.customSnapBehavior(this.container, this.config);
            return;
        }

        const scrollPosition = this.container.scrollLeft;
        const containerWidth = this.container.offsetWidth;
        const items = Array.from(this.container.querySelectorAll(this.config.itemSelector));

        if (items.length === 0) return;

        let closestItem = null;
        let closestDistance = Infinity;

        items.forEach(item => {
            const itemLeft = item.offsetLeft;
            const itemCenter = itemLeft + (item.offsetWidth / 2);
            const distanceToCenter = Math.abs(scrollPosition + (containerWidth / 2) - itemCenter);

            if (distanceToCenter < closestDistance) {
                closestDistance = distanceToCenter;
                closestItem = item;
            }
        });

        if (closestItem) {
            const targetPosition = closestItem.offsetLeft - (containerWidth - closestItem.offsetWidth) / 2;
            this.container.scrollTo({
                left: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Overscroll handling
    returnFromOverscroll(immediate = false) {
        clearTimeout(this.state.overscrollReturnTimeoutId);
        const track = this.getTrack();
        if (!track) return;

        if (immediate) {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            this.state.overscrollAmount =0;
            return;
        }

        track.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.05)';
        track.style.transform = 'translateX(0)';
        this.state.overscrollAmount = 0;

        setTimeout(() => {
            if (track) track.style.transition = 'none';
        }, 350);
    }

    scheduleOverscrollReturn() {
        const isMobile = 'ontouchstart' in window;
        const maxDelay = isMobile ? 250 : 150;
        const delay = Math.abs(this.state.overscrollAmount) > this.container.offsetWidth * 0.1 ?
                      Math.min(Math.abs(this.state.overscrollAmount), maxDelay) : 0;

        this.state.overscrollReturnTimeoutId = setTimeout(() => {
            this.returnFromOverscroll();
        }, delay);
    }

    clearOverscrollReturn() {
        if (this.state.overscrollReturnTimeoutId) {
            clearTimeout(this.state.overscrollReturnTimeoutId);
            this.state.overscrollReturnTimeoutId = null;
        }
    }

    // Public API
    destroy() {
        this.cancelMomentum();
        this.clearOverscrollReturn();
        // Remove event listeners if needed
    }
}

// Legacy function wrapper for backward compatibility
export function setupNaturalScrolling(container, options = {}) {
    return new NaturalScroll(container, options);
}
