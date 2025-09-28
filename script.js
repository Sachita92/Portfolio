document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    if (burger && nav) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Project Filtering
    function initProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');

                projectCards.forEach(card => {
                    card.style.display = (filterValue === 'all' || card.getAttribute('data-category') === filterValue) ? 'block' : 'none';
                });
            });
        });
    }

    initProjectFiltering();

    // Testimonial Slider
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    if (track && slides.length > 0) {
        track.style.width = `${slides.length * 100}%`;
        slides.forEach(slide => slide.style.width = `${100 / slides.length}%`);

        const dotsContainer = document.querySelector('.testimonial-dots');
        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = i === 0 ? 'dot active' : 'dot';
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSliderPosition();
                    updateDots();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateSliderPosition() {
            track.style.transform = `translateX(-${currentIndex * (100 / slides.length)}%)`;
        }

        function updateDots() {
            document.querySelectorAll('.dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
        track.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50 && currentIndex < slides.length - 1) currentIndex++;
            if (touchEndX > touchStartX + 50 && currentIndex > 0) currentIndex--;
            updateSliderPosition();
            updateDots();
        }

        let slideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSliderPosition();
            updateDots();
        }, 3000);

        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            testimonialSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
            testimonialSlider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % slides.length;
                    updateSliderPosition();
                    updateDots();
                }, 3000);
            });
        }
    }

    // Contact Form Submission
    const contactForm = document.querySelector('#contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            showFormMessage('Sending message...', 'sending');

            // Temporary hardcoded URL for local testing
            const API_URL = 'http://localhost:5000';
            
            console.log('Current hostname:', window.location.hostname);
            console.log('API_URL:', API_URL);
            console.log('Full URL:', `${API_URL}/api/contact`);

            try {
                const contactURL = `${API_URL}/api/contact`;
                console.log('About to fetch:', contactURL);
                
                const res = await fetch(contactURL, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage(data.message || 'Failed to send message. Please try again.', 'error');
                }

            } catch (err) {
                console.error('Contact form error:', err);
                showFormMessage('Network error. Please check your connection and try again.', 'error');
            }
        });
    }

    function showFormMessage(message, type) {
        if (formStatus) {
            formStatus.innerHTML = `<p class="${type}">${message}</p>`;
            formStatus.style.display = 'block';
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }
        }
    }

    // Add scroll-based navigation highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initialize active nav link on page load
    updateActiveNavLink();
});