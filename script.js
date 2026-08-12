document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       THEME SWITCHER (LIGHT/DARK)
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        root.classList.add('light-mode');
    } else {
        root.classList.remove('light-mode');
    }
    
    themeToggle.addEventListener('click', () => {
        root.classList.toggle('light-mode');
        const isLight = root.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    /* ==========================================================================
       STICKY HEADER & NAV ACTIVE INDICATOR
       ========================================================================== */
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Smooth layout indicator placement
    function moveIndicator(element) {
        if (!element || window.innerWidth <= 768) {
            navIndicator.style.opacity = '0';
            return;
        }
        
        const rect = element.getBoundingClientRect();
        const navRect = element.parentElement.parentElement.getBoundingClientRect();
        
        navIndicator.style.width = `${rect.width}px`;
        navIndicator.style.left = `${rect.left - navRect.left}px`;
        navIndicator.style.opacity = '1';
    }

    // Set indicator on load / resize
    const activeLink = document.querySelector('.nav-link.active');
    setTimeout(() => moveIndicator(activeLink), 300);

    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-link.active');
        moveIndicator(currentActive);
    });

    window.addEventListener('scroll', updateHeader);
    updateHeader();

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileMenuBtn.classList.toggle('open');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileMenuBtn.classList.remove('open');
        });
    });

    /* ==========================================================================
       TYPING ANIMATION
       ========================================================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const roles = [
        "Frontend Developer (MERN)",
        "MERN Stack Developer",
        "CS Student @ BRACU",
        "3D OpenGL Game Developer"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Short pause before typing next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       SKILLS TABS & PROGRESS BAR ANIMATION
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // Initialize bars to 0% width first for animated entrance
    progressBars.forEach(bar => {
        bar.dataset.width = bar.style.width;
        bar.style.width = '0%';
    });
    
    function animateProgressBars(panel) {
        const bars = panel.querySelectorAll('.progress-bar');
        bars.forEach(bar => {
            setTimeout(() => {
                bar.style.width = bar.dataset.width;
            }, 100);
        });
    }

    // Animate active panel on start
    animateProgressBars(document.querySelector('.tab-panel.active'));

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active states
            btn.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            targetPanel.classList.add('active');
            
            // Trigger animation
            animateProgressBars(targetPanel);
        });
    });

    /* ==========================================================================
       PROJECT FILTER LOGIC
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active states
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.dataset.filter;
            
            projectCards.forEach(card => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    /* ==========================================================================
       SCROLL REVEAL & SCROLL-SPY (NAV LINK HIGHLIGHT)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
    const scrollTargets = document.querySelectorAll('.scroll-target');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a progress bar panel, animate its bars
                if (entry.target.classList.contains('skills-tabs-container')) {
                    const activePanel = document.querySelector('.tab-panel.active');
                    animateProgressBars(activePanel);
                }
                
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Scroll Spy for nav links
    const spyOptions = {
        root: null,
        threshold: 0.25,
        rootMargin: '-10% 0px -60% 0px'
    };
    
    const spyCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const link = document.querySelector(`.nav-link[data-sec="${id}"]`);
                
                if (link) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    moveIndicator(link);
                }
            }
        });
    };
    
    const spyObserver = new IntersectionObserver(spyCallback, spyOptions);
    scrollTargets.forEach(target => spyObserver.observe(target));

    /* ==========================================================================
       CONTACT FORM VALIDATION & MOCK SUBMIT
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Temporary loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="ph ph-spinner-gap spin" style="animation: spin 1s linear infinite"></i>`;
            
            // Simulate API request delay
            setTimeout(() => {
                // Success message
                alert(`Thank you for reaching out, ${document.getElementById('name').value}! I will get back to you shortly at ${document.getElementById('email').value}.`);
                
                // Reset form
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        });
    }
});

// CSS spin animation keyframe helper injected on demand
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);
