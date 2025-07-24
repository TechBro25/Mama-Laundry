// Main JavaScript functionality for MAMA LAUNDARY website

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
});

// Sticky Navigation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade In Animation on Scroll
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.fade-in-scroll');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Initial check
fadeInOnScroll();

// Check on scroll
window.addEventListener('scroll', fadeInOnScroll);

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Voice Greeting Function (Web Speech API)
function playWelcomeVoice() {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const message = new SpeechSynthesisUtterance('Welcome to MAMA LAUNDRY. Mother touch in every wash. Your trusted laundry and dry cleaning service.');
        
        // Configure speech settings
        message.rate = 0.8;
        message.pitch = 1;
        message.volume = 0.8;
        
        // Try to use a female voice if available
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('susan')
        );
        
        if (femaleVoice) {
            message.voice = femaleVoice;
        }
        
        // Add event listeners
        message.onstart = function() {
            console.log('Voice greeting started');
            const button = document.querySelector('button[onclick="playWelcomeVoice()"]');
            if (button) {
                button.innerHTML = '🔊 Playing...';
                button.disabled = true;
            }
        };
        
        message.onend = function() {
            console.log('Voice greeting ended');
            const button = document.querySelector('button[onclick="playWelcomeVoice()"]');
            if (button) {
                button.innerHTML = '🔊 Play Welcome Message';
                button.disabled = false;
            }
        };
        
        message.onerror = function(event) {
            console.error('Speech synthesis error:', event.error);
            const button = document.querySelector('button[onclick="playWelcomeVoice()"]');
            if (button) {
                button.innerHTML = '🔊 Play Welcome Message';
                button.disabled = false;
            }
            alert('Sorry, voice playback is not available on this device.');
        };
        
        // Speak the message
        speechSynthesis.speak(message);
    } else {
        alert('Sorry, your browser does not support voice playback.');
    }
}

// Load voices when they become available
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function() {
        console.log('Voices loaded:', speechSynthesis.getVoices().length);
    };
}

// Intersection Observer for Better Performance
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in-scroll elements
    document.querySelectorAll('.fade-in-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Error Handling for Images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    });
});

// WhatsApp Integration Tracking
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function() {
        console.log('WhatsApp link clicked');
        // Add analytics tracking here if needed
    });
});

// Phone Call Tracking
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        console.log('Phone call initiated');
        // Add analytics tracking here if needed
    });
});

// Form Focus Enhancement
document.querySelectorAll('input, textarea, select').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    element.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Keyboard Navigation Enhancement
document.addEventListener('keydown', function(e) {
    // Enable keyboard navigation for mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Print Styles Handler
window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});

// Service Worker Registration (if needed for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you add a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Performance Monitoring
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});

// Lazy Loading for Images (if not using native loading="lazy")
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.classList.remove('lazy');
                imageObserver.unobserve(image);
            }
        });
    });

    images.forEach(image => imageObserver.observe(image));
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Utility Functions
const utils = {
    // Debounce function for scroll events
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for resize events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export utils for use in other scripts
window.MamaLaundaryUtils = utils;

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('MAMA LAUNDARY website initialized');
    
    // Add any additional initialization code here
    
    // Animate counters if present
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const animateCounters = () => {
            counters.forEach(counter => {
                if (utils.isInViewport(counter) && !counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    const target = counter.innerText;
                    const isPercentage = target.includes('%');
                    const targetNumber = parseInt(target.replace(/[^\d]/g, ''));
                    let current = 0;
                    const increment = targetNumber / 50;
                    
                    const updateCounter = () => {
                        if (current < targetNumber) {
                            current += increment;
                            counter.innerText = Math.ceil(current) + (isPercentage ? '%' : target.includes('+') ? '+' : target.includes('⭐') ? '⭐' : '');
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCounter();
                }
            });
        };
        
        window.addEventListener('scroll', utils.throttle(animateCounters, 100));
        animateCounters(); // Check on load
    }
});