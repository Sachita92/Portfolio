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
                
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Testimonial Slider
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    if (track && slides.length > 0) {
        // Set initial position
        track.style.width = `${slides.length * 100}%`;
        slides.forEach(slide => {
            slide.style.width = `${100 / slides.length}%`;
        });
        
        // Create dot indicators
        const dotsContainer = document.querySelector('.testimonial-dots');
        
        if (dotsContainer) {
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div');
                dot.className = i === 0 ? 'dot active' : 'dot';
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSliderPosition();
                    updateDots();
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        function updateSliderPosition() {
            track.style.transform = `translateX(-${currentIndex * (100 / slides.length)}%)`;
        }
        
        function updateDots() {
            document.querySelectorAll('.dot').forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Add touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            // Left swipe
            if (touchEndX < touchStartX - 50) {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                    updateSliderPosition();
                    updateDots();
                }
            }
            
            // Right swipe
            if (touchEndX > touchStartX + 50) {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                    updateDots();
                }
            }
        }
        
        // Auto slide every 5 seconds
        let slideInterval = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSliderPosition();
            updateDots();
        }, 3000);
        
        // Pause auto slide on hover
        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            testimonialSlider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            testimonialSlider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    if (currentIndex < slides.length - 1) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    updateSliderPosition();
                    updateDots();
                }, 3000);
            });
        }
    }
    
    // Form Validation and Submission
    const contactForm = document.querySelector('#contactForm');
    const formStatus = document.getElementById('formStatus');    

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                isValid = false;
                showError(nameInput, 'Name is required');
            } else {
                removeError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                isValid = false;
                showError(emailInput, 'Email is required');
            } else if (!isValidEmail(emailInput.value)) {
                isValid = false;
                showError(emailInput, 'Please enter a valid email');
            } else {
                removeError(emailInput);
            }
            
            if (!subjectInput.value.trim()) {
                isValid = false;
                showError(subjectInput, 'Subject is required');
            } else {
                removeError(subjectInput);
            }
            
            if (!messageInput.value.trim()) {
                isValid = false;
                showError(messageInput, 'Message is required');
            } else {
                removeError(messageInput);
            }
            
            if (isValid) {
                // Show sending message
                formStatus.innerHTML = '<p class="sending">Sending message...</p>';
                formStatus.style.display = 'block';
                
                // Prepare form data
                const formData = {
                    name: nameInput.value,
                    email: emailInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                };
                
                // Send data to backend API
                fetch('http://localhost:5000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Show success message
                    formStatus.innerHTML = '<p class="success">Thank you for your message! I will get back to you soon.</p>';
                    
                    // Reset form
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Show error message
                    formStatus.innerHTML = '<p class="error">Sorry, there was an error sending your message. Please try again later.</p>';
                })
                .finally(() => {
                    // Hide status message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                });
            }
        });
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '5px';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = 'red';
    }
    
    function removeError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.style.borderColor = '#ddd';
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Fetch and display projects from backend
    function fetchProjects() {
        const projectsContainer = document.querySelector('.projects-container');
        
        if (projectsContainer) {
            fetch('http://localhost:5000/api/projects')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(projects => {
                    // Clear existing projects
                    projectsContainer.innerHTML = '';
                    
                    // Display projects
                    projects.forEach(project => {
                        const projectCard = document.createElement('div');
                        projectCard.className = 'project-card';
                        projectCard.setAttribute('data-category', project.category);
                        
                        // Create tags HTML
                        const tagsHTML = project.tags.map(tag => 
                            `<span class="project-tag">${tag}</span>`
                        ).join('');
                        
                        projectCard.innerHTML = `
                            <div class="project-image">
                                <img src="${project.imageUrl}" alt="${project.title}">
                            </div>
                            <div class="project-info">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <div class="project-tags">
                                    ${tagsHTML}
                                </div>
                                <div class="project-links">
                                    <a href="${project.liveUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                                    <a href="${project.githubUrl}" target="_blank"><i class="fab fa-github"></i> Source Code</a>
                                </div>
                            </div>
                        `;
                        
                        projectsContainer.appendChild(projectCard);
                    });
                    
                    // Re-initialize project filtering after loading projects
                    initProjectFiltering();
                })
                // .catch(error => {
                //     console.error('Error fetching projects:', error);
                //     projectsContainer.innerHTML = '<p class="error">Failed to load projects. Please try again later.</p>';
                // });
        }
    }
    
    // Initialize project filtering after dynamic loading
    function initProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Try to fetch projects if backend is available
    try {
        fetchProjects();
    } catch (error) {
        console.log('Using static projects - backend may not be available');
    }
});