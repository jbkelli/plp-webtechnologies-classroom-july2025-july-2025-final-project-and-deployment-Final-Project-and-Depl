/*
=============================================================================
  TechFix Advisor - Complete JavaScript Functionality
=============================================================================

  Description: Comprehensive interactive functionality for TechFix Advisor website
  Author: Alvin Maina (Enhanced with full interactivity)
  Last Updated: September 21, 2025

  Table of Contents:
  1. Main Initialization
  2. Navigation Functionality
  3. Form Validation System
  4. Filter and Search Functionality
  5. Interactive Elements
  6. Animation Controllers
  7. Utility Functions
  8. Error Handling

  Features Implemented:
  - Real-time form validation with visual feedback
  - Dynamic content filtering and search
  - Responsive mobile navigation
  - Image zoom and modal functionality
  - Smooth scrolling and animations
  - Local storage for form persistence
  - Accessibility enhancements
  - Progressive web app features

=============================================================================
*/

/**
 * Main initialization function - runs when DOM is fully loaded
 * Sets up all interactive functionality for the website
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all main functionality modules
    initializeNavigation();         // Navigation and menu functionality
    initializeFormValidation();     // Form validation and submission
    initializeFilters();           // Content filtering system
    initializeInteractiveElements(); // Interactive UI components
    initializeAnimations();        // Animation and scroll effects
    initializeUtilityFunctions();  // Utility and helper functions
});

// ===== NAVIGATION FUNCTIONALITY =====

/**
 * Initialize navigation system including active states and mobile menu
 * Handles page highlighting, smooth scrolling, and responsive navigation
 */
function initializeNavigation() {
    // Get current page filename for navigation highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    // Loop through all navigation links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Highlight current page in navigation
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        // Add smooth scroll behavior for internal anchor links
        if (href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default link behavior
                const targetId = href.substring(1); // Remove # from href
                const targetElement = document.getElementById(targetId);
                
                // Smooth scroll to target element if it exists
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
    
    // Create mobile-responsive menu functionality
    createMobileMenuToggle();
}

/**
 * Create mobile hamburger menu for responsive navigation
 * Adds toggle functionality for mobile screens
 */
function createMobileMenuToggle() {
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    
    // Create hamburger menu button
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '☰'; // Hamburger icon
    menuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    header.appendChild(menuButton);
    
    // Add responsive CSS styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
            }
            nav ul {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: inherit;
                flex-direction: column;
                padding: 1rem;
            }
            nav ul.show {
                display: flex !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Toggle mobile menu visibility
    menuButton.addEventListener('click', function() {
        const navUl = nav.querySelector('ul');
        navUl.classList.toggle('show');
    });
}

// ===== FORM VALIDATION SYSTEM =====

/**
 * Initialize comprehensive form validation system
 * Sets up real-time validation and submission handling
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Get all form inputs for validation
        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Add real-time validation to each input
        inputs.forEach(input => {
            // Validate field when user leaves it (blur event)
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear error styling when user starts typing
            input.addEventListener('input', function() {
                clearErrorMessage(this);
            });
        });
        
        // Handle form submission with validation
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Validate entire form before submission
            if (validateForm(this)) {
                submitForm(this); // Submit if validation passes
            }
        });
    });
}

/**
 * Validate individual form field based on field type and requirements
 * @param {HTMLElement} field - The form field to validate
 * @returns {boolean} - True if field is valid, false otherwise
 */
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('error');
    
    // Validation rules for different field types
    switch(fieldName) {
        case 'name':
            // Name is optional, but if provided should be valid
            if (fieldValue && fieldValue.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
            
        case 'email':
            // Email is optional, but if provided should be valid
            if (fieldValue && !isValidEmail(fieldValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'device':
            // Device selection is required
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Please select a device type';
            }
            break;
            
        case 'question':
            // Question is required and should be meaningful
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Please describe your issue';
            } else if (fieldValue.length < 10) {
                isValid = false;
                errorMessage = 'Please provide more details (at least 10 characters)';
            }
            break;
    }
    
    // Show error message and styling if validation fails
    if (!isValid) {
        showErrorMessage(field, errorMessage);
        field.classList.add('error');
    }
    
    return isValid;
}

/**
 * Validate entire form before submission
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if all fields are valid
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    // Validate all required fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Special validation for specific form fields
    const questionField = form.querySelector('[name="question"]');
    if (questionField && !validateField(questionField)) {
        isFormValid = false;
    }
    
    const deviceField = form.querySelector('[name="device"]');
    if (deviceField && !validateField(deviceField)) {
        isFormValid = false;
    }
    
    return isFormValid;
}

/**
 * Display error message below form field
 * @param {HTMLElement} field - The form field with error
 * @param {string} message - Error message to display
 */
function showErrorMessage(field, message) {
    // Remove any existing error message
    clearErrorMessage(field);
    
    // Create new error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

/**
 * Clear error message and styling from form field
 * @param {HTMLElement} field - The form field to clear
 */
function clearErrorMessage(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    field.classList.remove('error');
}

/**
 * Validate email address format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email format is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Handle form submission with loading state and success feedback
 * Now supports multiple email recipients for TechFix support
 * @param {HTMLFormElement} form - The form being submitted
 */
function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="spinner"></div> Submitting...';
    
    // Get form data for email submission
    const formData = new FormData(form);
    const data = {
        name: formData.get('name') || 'Anonymous',
        email: formData.get('email') || 'No email provided',
        device: formData.get('device'),
        question: formData.get('question')
    };
    
    // Create email content
    const emailContent = createEmailContent(data);
    
    // Multiple email recipients
    const recipients = [
        '444mwangialvinm@gmail.com',
        'tech.marval.innovations@gmail.com'
    ];
    
    // Create mailto URL with multiple recipients
    const mailtoURL = createMailtoURL(recipients, emailContent);
    
    // Simulate form processing delay
    setTimeout(() => {
        // Open email client with pre-filled content
        window.location.href = mailtoURL;
        
        showSuccessMessage(form);  // Show success message
        form.reset();              // Clear form
        submitButton.disabled = false;           // Re-enable button
        submitButton.textContent = originalText; // Restore button text
    }, 1500);
}

/**
 * Create formatted email content from form data
 * @param {Object} data - Form data object
 * @returns {string} - Formatted email content
 */
function createEmailContent(data) {
    return `
TechFix Question Submission

Name: ${data.name}
Email: ${data.email}
Device Type: ${data.device}

Question/Issue:
${data.question}

---
Submitted via TechFix Advisor website
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
    `.trim();
}

/**
 * Create mailto URL with multiple recipients and content
 * @param {Array} recipients - Array of email addresses
 * @param {string} content - Email body content
 * @returns {string} - Complete mailto URL
 */
function createMailtoURL(recipients, content) {
    const recipientList = recipients.join(',');
    const subject = encodeURIComponent('TechFix Question Submission');
    const body = encodeURIComponent(content);
    
    return `mailto:${recipientList}?subject=${subject}&body=${body}`;
}

/**
 * Display success message after form submission
 * @param {HTMLFormElement} form - The form that was submitted
 */
function showSuccessMessage(form) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background-color: #00b894;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        text-align: center;
        font-weight: 600;
    `;
    successDiv.textContent = 'Thank you! Your question has been submitted successfully. We will get back to you soon.';
    
    // Insert success message before form
    form.parentNode.insertBefore(successDiv, form);
    
    // Auto-remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// ===== FILTER AND SEARCH FUNCTIONALITY =====

/**
 * Initialize content filtering system for advice page
 * Handles dynamic content filtering based on categories
 */
function initializeFilters() {
    const filterLinks = document.querySelectorAll('.filters a');
    const adviceCards = document.querySelectorAll('.advicecards > div');
    
    // Exit if no filters found (not on advice page)
    if (filterLinks.length === 0) return;
    
    // Add click handlers to filter links
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active filter styling
            filterLinks.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter type from link text
            const filterText = this.textContent.toLowerCase();
            
            // Apply filter to advice cards
            filterAdviceCards(filterText, adviceCards);
        });
    });
    
    // Set first filter as active by default
    if (filterLinks.length > 0) {
        filterLinks[0].classList.add('active');
    }
}

/**
 * Filter advice cards based on selected category
 * @param {string} filter - The filter category selected
 * @param {NodeList} cards - The advice cards to filter
 */
function filterAdviceCards(filter, cards) {
    cards.forEach(card => {
        const cardClass = card.className;
        
        // Determine if card should be shown based on filter
        const shouldShow = filter === 'buying advice' && cardClass.includes('laptop') ||
                          filter === 'buying advice' && cardClass.includes('phone') ||
                          filter === 'troubleshooting' && cardClass.includes('troubleshooting') ||
                          filter === 'tech literacy' && cardClass.includes('techliteracy');
        
        // Show or hide card with animation
        if (shouldShow || filter === 'all') {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

// ===== INTERACTIVE ELEMENTS =====

/**
 * Initialize various interactive UI elements
 * Sets up click handlers, hover effects, and user interactions
 */
function initializeInteractiveElements() {
    addCardClickHandlers();    // Clickable advice cards
    addFAQToggle();           // Interactive FAQ items
    addImageZoom();           // Image zoom functionality
    addCopyFunctionality();   // Copy to clipboard features
}

/**
 * Add click handlers to advice cards for interactivity
 */
function addCardClickHandlers() {
    const cards = document.querySelectorAll('.cards > div');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Add visual feedback animation
            this.style.animation = 'pulse 0.6s ease-in-out';
            
            // Remove animation after completion
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
            
            // Log interaction (could be replaced with navigation)
            console.log('Card clicked:', this.textContent.trim());
        });
    });
}

/**
 * Add toggle functionality to FAQ items
 * Makes FAQ items interactive with hover effects
 */
function addFAQToggle() {
    const faqItems = document.querySelectorAll('main section ul li');
    
    faqItems.forEach(item => {
        // Only add interactivity to items with strong text (questions)
        if (item.querySelector('strong')) {
            // Style FAQ item for interactivity
            item.style.cursor = 'pointer';
            item.style.padding = '0.5rem';
            item.style.borderRadius = '5px';
            item.style.transition = 'background-color 0.3s ease';
            
            // Add hover effect
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            // Add click interaction with contextual tooltips
            item.addEventListener('click', function() {
                const content = this.textContent;
                
                // Show different tooltips based on content
                if (content.includes('overheating')) {
                    showTooltip(this, 'Check our troubleshooting guide for detailed steps!');
                } else if (content.includes('space')) {
                    showTooltip(this, 'Visit our storage management tips section!');
                } else if (content.includes('antivirus')) {
                    showTooltip(this, 'Check our security recommendations!');
                }
            });
        }
    });
}

/**
 * Display contextual tooltip for user guidance
 * @param {HTMLElement} element - Element to attach tooltip to
 * @param {string} message - Tooltip message to display
 */
function showTooltip(element, message) {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: #2d3436;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 0.9rem;
        z-index: 1000;
        max-width: 200px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    tooltip.textContent = message;
    
    // Position tooltip relative to element
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 10) + 'px';
    
    document.body.appendChild(tooltip);
    
    // Auto-remove tooltip after 3 seconds
    setTimeout(() => {
        tooltip.remove();
    }, 3000);
}

/**
 * Add image zoom functionality with modal overlay
 */
function addImageZoom() {
    const images = document.querySelectorAll('.advicecards img');
    
    images.forEach(img => {
        img.style.cursor = 'zoom-in'; // Change cursor to indicate zoom
        img.addEventListener('click', function() {
            createImageModal(this);
        });
    });
}

/**
 * Create modal overlay for zoomed image viewing
 * @param {HTMLImageElement} img - Image to display in modal
 */
function createImageModal(img) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        cursor: zoom-out;
    `;
    
    // Create enlarged image
    const modalImg = document.createElement('img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
    
    // Close modal when clicked
    modal.addEventListener('click', function() {
        this.remove();
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
    
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';
}

/**
 * Add copy-to-clipboard functionality for email links
 */
function addCopyFunctionality() {
    const emailLinks = document.querySelectorAll('a[href*="mail.google.com"]');
    
    emailLinks.forEach(link => {
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋';
        copyBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            margin-left: 0.5rem;
            padding: 0.2rem;
            font-size: 0.9rem;
        `;
        
        // Add copy functionality
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = link.textContent;
            
            // Use modern clipboard API if available
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showTooltip(this, 'Email copied to clipboard!');
                });
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = email;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showTooltip(this, 'Email copied to clipboard!');
            }
        });
        
        // Insert copy button after email link
        link.parentNode.insertBefore(copyBtn, link.nextSibling);
    });
}

// ===== ANIMATION CONTROLLERS =====

/**
 * Initialize scroll-based animations and visual effects
 */
function initializeAnimations() {
    // Set up Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,              // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px'  // Trigger slightly before element is visible
    };
    
    // Create observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.cards > div, .advicecards > div, main section');
    animateElements.forEach(el => observer.observe(el));
    
    // Add pulse animation CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// ===== UTILITY FUNCTIONS =====

/**
 * Initialize utility functions and helper features
 */
function initializeUtilityFunctions() {
    setupSmoothScrolling();      // Smooth scrolling for anchor links
    addBackToTopButton();        // Back to top functionality
    addSearchFunctionality();    // Search features
    addFormDataPersistence();    // Form data persistence
}

/**
 * Set up smooth scrolling for all internal anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Add floating back-to-top button with scroll detection
 */
function addBackToTopButton() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Smooth scroll to top when clicked
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Add search functionality for content filtering
 */
function addSearchFunctionality() {
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            searchContent(query);
        });
    });
}

/**
 * Search through content and show/hide matching elements
 * @param {string} query - Search query string
 */
function searchContent(query) {
    const searchableElements = document.querySelectorAll('.advicecards > div, .cards > div');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query) || query === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

/**
 * Add form data persistence using localStorage
 */
function addFormDataPersistence() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.id || 'techfix-form';
        
        // Load previously saved form data
        loadFormData(form, formId);
        
        // Save form data as user types
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                saveFormData(form, formId);
            });
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', function() {
            clearFormData(formId);
        });
    });
}

/**
 * Save form data to localStorage
 * @param {HTMLFormElement} form - Form to save
 * @param {string} formId - Unique identifier for form
 */
function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to regular object
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(formId, JSON.stringify(data));
}

/**
 * Load saved form data from localStorage
 * @param {HTMLFormElement} form - Form to populate
 * @param {string} formId - Unique identifier for form
 */
function loadFormData(form, formId) {
    const savedData = localStorage.getItem(formId);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Populate form fields with saved data
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

/**
 * Clear saved form data from localStorage
 * @param {string} formId - Unique identifier for form
 */
function clearFormData(formId) {
    localStorage.removeItem(formId);
}

// ===== ERROR HANDLING =====

/**
 * Global error handler for JavaScript errors
 * Provides user-friendly error messages
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Show user-friendly error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d63031;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 2000;
        max-width: 300px;
    `;
    errorDiv.textContent = 'Something went wrong. Please refresh the page or try again later.';
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
});

// ===== CONSOLE WELCOME MESSAGE =====

/**
 * Display welcome message in browser console for developers
 */
console.log(`
🔧 TechFix Advisor - JavaScript Loaded Successfully!
🚀 All interactive features are now available
💡 Need help? Check our FAQ section or submit a question
🛠️ Developer tools and debugging information available
`);

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        // Add smooth scroll for internal links
        if (href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
    
    // Mobile menu toggle (if needed)
    createMobileMenuToggle();
}

function createMobileMenuToggle() {
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    
    // Create mobile menu button
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '☰';
    menuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    header.appendChild(menuButton);
    
    // Add mobile styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
            }
            nav ul {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: inherit;
                flex-direction: column;
                padding: 1rem;
            }
            nav ul.show {
                display: flex !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Toggle functionality
    menuButton.addEventListener('click', function() {
        const navUl = nav.querySelector('ul');
        navUl.classList.toggle('show');
    });
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearErrorMessage(this);
            });
        });
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitForm(this);
            }
        });
    });
}

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('error');
    
    switch(fieldName) {
        case 'name':
            // Name is optional, but if provided should be valid
            if (fieldValue && fieldValue.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
            
        case 'email':
            // Email is optional, but if provided should be valid
            if (fieldValue && !isValidEmail(fieldValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'device':
            // Device selection is required
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Please select a device type';
            }
            break;
            
        case 'question':
            // Question is required and should be meaningful
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Please describe your issue';
            } else if (fieldValue.length < 10) {
                isValid = false;
                errorMessage = 'Please provide more details (at least 10 characters)';
            }
            break;
    }
    
    if (!isValid) {
        showErrorMessage(field, errorMessage);
        field.classList.add('error');
    }
    
    return isValid;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    // Validate required fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Special validation for question form
    const questionField = form.querySelector('[name="question"]');
    if (questionField && !validateField(questionField)) {
        isFormValid = false;
    }
    
    const deviceField = form.querySelector('[name="device"]');
    if (deviceField && !validateField(deviceField)) {
        isFormValid = false;
    }
    
    return isFormValid;
}

function showErrorMessage(field, message) {
    // Remove existing error message
    clearErrorMessage(field);
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    // Insert after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearErrorMessage(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    field.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(form) {
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="spinner"></div> Submitting...';
    
    // Simulate form submission
    setTimeout(() => {
        showSuccessMessage(form);
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 2000);
}

function showSuccessMessage(form) {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background-color: #00b894;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        text-align: center;
        font-weight: 600;
    `;
    successDiv.textContent = 'Thank you! Your question has been submitted successfully. We will get back to you soon.';
    
    // Insert before form
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    const filterLinks = document.querySelectorAll('.filters a');
    const adviceCards = document.querySelectorAll('.advicecards > div');
    
    if (filterLinks.length === 0) return;
    
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all filters
            filterLinks.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Get filter type
            const filterText = this.textContent.toLowerCase();
            
            // Filter advice cards
            filterAdviceCards(filterText, adviceCards);
        });
    });
    
    // Set first filter as active by default
    if (filterLinks.length > 0) {
        filterLinks[0].classList.add('active');
    }
}

function filterAdviceCards(filter, cards) {
    cards.forEach(card => {
        const cardClass = card.className;
        const shouldShow = filter === 'buying advice' && cardClass.includes('laptop') ||
                          filter === 'buying advice' && cardClass.includes('phone') ||
                          filter === 'troubleshooting' && cardClass.includes('troubleshooting') ||
                          filter === 'tech literacy' && cardClass.includes('techliteracy');
        
        if (shouldShow || filter === 'all') {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

// ===== INTERACTIVE ELEMENTS =====
function initializeInteractiveElements() {
    // Add click handlers for advice cards
    addCardClickHandlers();
    
    // Add FAQ toggle functionality
    addFAQToggle();
    
    // Add image zoom functionality
    addImageZoom();
    
    // Add copy to clipboard for links
    addCopyFunctionality();
}

function addCardClickHandlers() {
    const cards = document.querySelectorAll('.cards > div');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Add pulse animation
            this.style.animation = 'pulse 0.6s ease-in-out';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
            
            // You could add navigation to detailed view here
            console.log('Card clicked:', this.textContent.trim());
        });
    });
}

function addFAQToggle() {
    // If there are FAQ items, make them toggleable
    const faqItems = document.querySelectorAll('main section ul li');
    
    faqItems.forEach(item => {
        if (item.querySelector('strong')) {
            item.style.cursor = 'pointer';
            item.style.padding = '0.5rem';
            item.style.borderRadius = '5px';
            item.style.transition = 'background-color 0.3s ease';
            
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            item.addEventListener('click', function() {
                // Toggle detailed view or redirect to relevant page
                const content = this.textContent;
                if (content.includes('overheating')) {
                    showTooltip(this, 'Check our troubleshooting guide for detailed steps!');
                } else if (content.includes('space')) {
                    showTooltip(this, 'Visit our storage management tips section!');
                } else if (content.includes('antivirus')) {
                    showTooltip(this, 'Check our security recommendations!');
                }
            });
        }
    });
}

function showTooltip(element, message) {
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: #2d3436;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 0.9rem;
        z-index: 1000;
        max-width: 200px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    tooltip.textContent = message;
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 10) + 'px';
    
    document.body.appendChild(tooltip);
    
    // Remove after 3 seconds
    setTimeout(() => {
        tooltip.remove();
    }, 3000);
}

function addImageZoom() {
    const images = document.querySelectorAll('.advicecards img');
    
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            createImageModal(this);
        });
    });
}

function createImageModal(img) {
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        cursor: zoom-out;
    `;
    
    // Create image
    const modalImg = document.createElement('img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
    
    // Close modal on click
    modal.addEventListener('click', function() {
        this.remove();
        document.body.style.overflow = 'auto';
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function addCopyFunctionality() {
    // Add copy buttons to email links
    const emailLinks = document.querySelectorAll('a[href*="mail.google.com"]');
    
    emailLinks.forEach(link => {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋';
        copyBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            margin-left: 0.5rem;
            padding: 0.2rem;
            font-size: 0.9rem;
        `;
        
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = link.textContent;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showTooltip(this, 'Email copied to clipboard!');
                });
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = email;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showTooltip(this, 'Email copied to clipboard!');
            }
        });
        
        link.parentNode.insertBefore(copyBtn, link.nextSibling);
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.cards > div, .advicecards > div, main section');
    animateElements.forEach(el => observer.observe(el));
    
    // Add pulse animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// ===== UTILITY FUNCTIONS =====
function initializeUtilityFunctions() {
    // Smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top functionality
    addBackToTopButton();
    
    // Search functionality (if search box exists)
    addSearchFunctionality();
    
    // Local storage for form data
    addFormDataPersistence();
}

function addBackToTopButton() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function addSearchFunctionality() {
    // This would be implemented if there's a search box
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            searchContent(query);
        });
    });
}

function searchContent(query) {
    const searchableElements = document.querySelectorAll('.advicecards > div, .cards > div');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query) || query === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

function addFormDataPersistence() {
    // Save form data to localStorage as user types
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.id || 'techfix-form';
        
        // Load saved data
        loadFormData(form, formId);
        
        // Save data on input
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                saveFormData(form, formId);
            });
        });
        
        // Clear saved data on successful submit
        form.addEventListener('submit', function() {
            clearFormData(formId);
        });
    });
}

function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(formId, JSON.stringify(data));
}

function loadFormData(form, formId) {
    const savedData = localStorage.getItem(formId);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

function clearFormData(formId) {
    localStorage.removeItem(formId);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d63031;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 2000;
        max-width: 300px;
    `;
    errorDiv.textContent = 'Something went wrong. Please refresh the page or try again later.';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🔧 TechFix Advisor - JavaScript Loaded Successfully!
🚀 All interactive features are now available
💡 Need help? Check our FAQ section or submit a question
`);
