/**
 * Contact Form Module
 * Handles contact form submission via EmailJS
 */

export class ContactForm {
    constructor(formSelector, emailJSConfig) {
        this.form = document.querySelector(formSelector);
        if (!this.form) {
            console.warn(`ContactForm: Form "${formSelector}" not found`);
            return;
        }

        this.emailJSConfig = emailJSConfig;
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.init();
    }

    init() {
        // Initialize EmailJS
        if (window.emailjs && this.emailJSConfig.publicKey) {
            emailjs.init(this.emailJSConfig.publicKey);
        }

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.submitBtn) return;

        const originalBtnText = this.submitBtn.textContent;

        // Get status texts from translations
        const sendingText = this.submitBtn.getAttribute('data-sending') || 'Sending...';
        const sentText = this.submitBtn.getAttribute('data-sent') || 'Message Sent!';
        const failedText = this.submitBtn.getAttribute('data-failed') || 'Failed to Send';

        // Show loading state
        this.submitBtn.textContent = sendingText;
        this.submitBtn.disabled = true;

        try {
            // Send the email using EmailJS
            await emailjs.sendForm(
                this.emailJSConfig.serviceId,
                this.emailJSConfig.templateId,
                this.form
            );

            // Success message
            this.submitBtn.textContent = sentText;
            this.form.reset();

            // Reset button after delay
            setTimeout(() => {
                this.submitBtn.textContent = originalBtnText;
                this.submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            // Error handling
            console.error('EmailJS error:', error);
            this.submitBtn.textContent = failedText;

            // Reset button after delay
            setTimeout(() => {
                this.submitBtn.textContent = originalBtnText;
                this.submitBtn.disabled = false;
            }, 3000);
        }
    }
}

// Initialize function
export function initContactForm(emailJSConfig) {
    return new ContactForm('#contactForm', emailJSConfig);
}
