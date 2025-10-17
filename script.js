// Scroll reveal animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal(); // Call on page load

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Project filtering with animation
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Animate cards
        projectCards.forEach((card, index) => {
            card.classList.remove('show');
            
            setTimeout(() => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 50);
                } else {
                    card.style.display = 'none';
                }
            }, index * 50);
        });
    });
});

// Initialize all projects as visible
projectCards.forEach((card, index) => {
    setTimeout(() => card.classList.add('show'), index * 100);
});

// Skill bars animation
const skillItems = document.querySelectorAll('.skill-item');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            skillObserver.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

skillItems.forEach(item => skillObserver.observe(item));

// Back to top button
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.primary-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success
            formStatus.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon!';
            formStatus.className = 'form-status show success';
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formStatus.classList.remove('show');
            }, 5000);
        }, 1500);
        
        // For actual implementation, use EmailJS or your backend API:
        /*
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData)
            .then(function(response) {
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                formStatus.className = 'form-status show success';
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, function(error) {
                formStatus.textContent = 'Oops! Something went wrong. Please try again.';
                formStatus.className = 'form-status show error';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        */
    });
}

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Parallax effect for hero section (optional)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage && scrolled < 800) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add hover effect to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Typing effect for hero heading (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Intersection Observer for stagger animations
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            staggerObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Apply stagger animation to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    staggerObserver.observe(card);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElement = entry.target.querySelector('h3');
            const targetValue = parseInt(statElement.textContent);
            animateCounter(statElement, targetValue, 1500);
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Dynamic year in footer
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = `© ${currentYear} Sachita Sigdel. All rights reserved.`;
}

// Testimonial Slider
let currentSlide = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialTrack = document.querySelector('.testimonial-track');
const dots = document.querySelectorAll('.dot');

function updateSlider() {
    // Move track
    if (testimonialTrack) {
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Update active card
    testimonialCards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentSlide) {
            card.classList.add('active');
        }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonialCards.length;
    updateSlider();
}

// Dots click
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto-play testimonial slider every 2 seconds
let testimonialInterval = setInterval(nextSlide, 2000);

// Pause on hover
const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(nextSlide, 2000);
    });
}

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Add loading spinner functionality (optional)
function showLoading(button) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;
}

function hideLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Smooth scroll offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation classes when elements come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Performance optimization: Debounce scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
    reveal();
    animateOnScroll();
}, 10));

// Add preloader (optional)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Console log for developers
console.log('%c👋 Hello Developer!', 'font-size: 20px; color: #5E3BEE; font-weight: bold;');
console.log('%cInterested in the code? Check out my GitHub: https://github.com/Sachita92', 'font-size: 14px; color: #666;');

// Initialize all animations on load
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations
    reveal();
    animateOnScroll();
    
    // Add loaded class to body
    document.body.classList.add('loaded');
});