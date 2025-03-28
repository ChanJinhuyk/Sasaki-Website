document.addEventListener('DOMContentLoaded', function() {
    // ===== VARIABLES =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const contactForm = document.getElementById('contactForm');
    const heroSection = document.querySelector('.hero-section');
    const header = document.querySelector('.sticky-header');
    const categoryHeaders = document.querySelectorAll('.category-header');
    const coursesLists = document.querySelectorAll('.courses-list');

    // ===== MOBILE MENU =====
    mobileMenuToggle.addEventListener('click', function() {
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
        mainNav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            mainNav.classList.remove('active');
        });

        // ===== MODE CRASH =====
        link.addEventListener('contextmenu', () => {
            throw new Error("Boom! Le site vient de planter exprès !");
        });
    });

    // ===== TAB SYSTEM =====
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            tabLinks.forEach(tab => tab.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // ===== FORMATIONS ACCORDION =====
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const categoryCard = this.parentElement;
            const coursesList = this.nextElementSibling;
            categoryCard.classList.toggle('active');
            if (categoryCard.classList.contains('active')) {
                coursesList.style.maxHeight = coursesList.scrollHeight + 'px';
            } else {
                coursesList.style.maxHeight = '0';
            }
        });
    });

    coursesLists.forEach((list, index) => {
        if (index !== 0) {
            list.style.maxHeight = '0';
            list.style.overflow = 'hidden';
            list.style.transition = 'max-height 0.3s ease';
        }
    });

    // ===== FORM HANDLING =====
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                service: this.querySelector('#service').value,
                message: this.querySelector('#message').value
            };

            const submitButton = this.querySelector('.submit-button');
            const originalButtonText = submitButton.innerHTML;
            
            try {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                submitButton.disabled = true;
                await new Promise(resolve => setTimeout(resolve, 1500));
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                this.reset();
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('Erreur:', error);
                submitButton.innerHTML = '<i class="fas fa-times"></i> Erreur';
                submitButton.style.backgroundColor = 'var(--danger-color)';
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.style.backgroundColor = '';
                    submitButton.disabled = false;
                }, 2000);
            }
        });
    }

    // ===== STICKY HEADER =====
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ANIMATIONS ON SCROLL =====
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .formation-item, .contact-item, .category-card');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    document.querySelectorAll('.service-card, .formation-item, .contact-item, .category-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // ===== HERO SCROLL INDICATOR =====
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: heroSection.offsetHeight,
                behavior: 'smooth'
            });
        });
    }

    // ===== GESTION DES SERVICES PRO =====
    const serviceTabLinks = document.querySelectorAll('.pro-services-section .tab-link');
    const serviceTabPanes = document.querySelectorAll('.pro-services-section .tab-pane');

    serviceTabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            serviceTabLinks.forEach(tab => tab.classList.remove('active'));
            serviceTabPanes.forEach(pane => pane.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    const quoteButtons = document.querySelectorAll('.request-quote');
    const quoteModal = document.getElementById('quote-modal');
    const closeModal = document.querySelector('.close-modal');
    const selectedServiceSpan = document.getElementById('selected-service');
    const serviceNameInput = document.getElementById('service-name');

    quoteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.dataset.service;
            selectedServiceSpan.textContent = serviceName;
            serviceNameInput.value = serviceName;
            quoteModal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', () => {
        quoteModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === quoteModal) {
            quoteModal.style.display = 'none';
        }
    });

    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                service: serviceNameInput.value,
                email: document.getElementById('quote-email').value,
                phone: document.getElementById('quote-phone').value,
                details: document.getElementById('quote-details').value
            };
            console.log('Demande de devis:', formData);
            alert('Demande envoyée! Nous vous contacterons sous 48h.');
            quoteModal.style.display = 'none';
            this.reset();
        });
    }
});

// ===== EMAIL FUNCTIONALITY =====
async function sendEmail(formData) {
    console.log('Email simulation:', formData);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: 'success' });
        }, 1000);
    });
}
