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
        "Full-Stack Developer (MERN · FastAPI)",
        "AI/ML & Computer Vision Enthusiast",
        "CS Student @ BRACU",
        "LLM & SLM Explorer",
        "Developing Skills in Data Analytics"
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
       PROJECT DETAILS MODAL
       ========================================================================== */
    const PROJECTS = {"sync-space": {"tag": "GitHub Project", "title": "Sync Space", "overview": "Sync Space is a public repository on my GitHub. A detailed description of the problem it solves, its features and its architecture is being added; the repository holds the full source code.", "features": ["See the repository for features and setup"], "tech": ["See repository"], "repo": "https://github.com/SHARIYAR2201/Sync_space"}, "academic-predictor": {"tag": "AI / ML \u00b7 Full-Stack", "title": "Academic Performance Predictor", "overview": "Designed as an early-warning tool that surfaces students who may be struggling so support can come sooner. Combines a scikit-learn modelling workflow with SHAP explanations, a FastAPI backend, PostgreSQL storage and a Next.js interface.", "features": ["Predicts student GPA and risk level using 8 ML models", "Role-based dashboards for different user types", "Explainable AI insights using SHAP, so predictions can be interpreted"], "tech": ["Python", "FastAPI", "Next.js", "PostgreSQL", "scikit-learn", "SHAP"], "repo": "https://github.com/SHARIYAR2201/Academic-Performance-Predictor"}, "veldora": {"tag": "Full-Stack \u00b7 FastAPI", "title": "V-E-L-D-O-R-A", "overview": "V-E-L-D-O-R-A stands for Virtual Enhanced Lifestyle, Diet, Optimization, Recommendation & Analytics. It is an informational health, nutrition, fitness and wellness platform with a FastAPI, PostgreSQL and Redis backend and a Next.js 14 front end using Tailwind, Framer Motion, Three.js and Recharts. Recommendations are rule-based and trend figures are estimates; it is not a medical tool.", "features": ["Nutrition and calorie tracking", "Workout planning", "Progress analytics with trend estimates", "Rule-based recommendations"], "tech": ["FastAPI", "PostgreSQL", "Redis", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js", "Recharts"], "repo": "https://github.com/SHARIYAR2201/V-E-L-D-O-R-A"}, "thesis-portal": {"tag": "MERN Stack \u00b7 Academic", "title": "BRACU Thesis Management Portal", "overview": "A full-stack portal that brings the thesis lifecycle at BRAC University into one place, with different roles for students and supervisors. Built with React on the front end and Node.js and Express on the back end.", "features": ["Thesis proposal submission and research discovery", "Supervisor allocation", "Meetings and feedback", "Role-based workflows"], "tech": ["React", "Node.js", "Express"], "repo": "https://github.com/SHARIYAR2201/BRACU-THEIS-PORTAL-updated-self-"}, "job-nest": {"tag": "MERN Stack", "title": "Job-Nest", "overview": "A MERN-stack job portal with separate role-based dashboards, job applications and a built-in blog system.", "features": ["Role-based dashboards", "Job applications", "Integrated blog system"], "tech": ["MongoDB", "Express", "React", "Node.js"], "repo": "https://github.com/SHARIYAR2201/JOB_NEST"}, "gesture-volume": {"tag": "Computer Vision", "title": "Gesture Volume Control", "overview": "Uses a webcam and MediaPipe hand tracking to turn hand positions into desktop actions, with PyAutoGUI sending the controls to the operating system.", "features": ["Controls volume, brightness and media playback with hand gestures", "Mute and lock controls", "Webcam-based hand tracking with MediaPipe"], "tech": ["Python", "OpenCV", "MediaPipe", "PyAutoGUI"], "repo": "https://github.com/SHARIYAR2201/Gesture_Volume_Control"}, "alien-shooter": {"tag": "OpenGL Game", "title": "Alien Shooter 3D", "overview": "A project built with Python and OpenGL APIs, centred on 3D math, rendering and collision detection.", "features": ["3D survival shooting gameplay", "Low-level graphics rendering with OpenGL", "Collision detection"], "tech": ["Python", "OpenGL", "Pygame", "3D Graphics"], "repo": "https://github.com/SHARIYAR2201"}, "travelora": {"tag": "Team Web Project", "title": "Travelora", "overview": "A team web project covering the booking flow end to end, built on Node.js, Express and MongoDB with a Tailwind CSS interface.", "features": ["Flight, hotel and tour booking", "Personalised itineraries and dynamic search", "User dashboard"], "tech": ["Node.js", "Express", "MongoDB", "Tailwind CSS"], "repo": "https://github.com/SHARIYAR2201"}};
    const pm = document.getElementById('pm');
    const pmClose = document.getElementById('pm-close');
    let lastFocus = null;

    function openProject(id) {
        const p = PROJECTS[id];
        if (!p) return;
        lastFocus = document.activeElement;
        document.getElementById('pm-tag').textContent = p.tag;
        document.getElementById('pm-title').textContent = p.title;
        document.getElementById('pm-overview').textContent = p.overview;
        document.getElementById('pm-feat').innerHTML = p.features.map(f => `<li></li>`).join('');
        document.querySelectorAll('#pm-feat li').forEach((li, i) => li.textContent = p.features[i]);
        const tech = document.getElementById('pm-tech');
        tech.innerHTML = '';
        p.tech.forEach(t => { const sp = document.createElement('span'); sp.textContent = t; tech.appendChild(sp); });
        document.getElementById('pm-repo').href = p.repo;
        pm.hidden = false;
        document.body.style.overflow = 'hidden';
        pmClose.focus();
    }
    function closeProject() {
        pm.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('.project-card[data-project]').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('a')) return; // GitHub icon keeps its own link
            openProject(card.dataset.project);
        });
        card.addEventListener('keydown', e => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
                e.preventDefault();
                openProject(card.dataset.project);
            }
        });
    });
    pmClose.addEventListener('click', closeProject);
    pm.addEventListener('click', e => { if (e.target === pm) closeProject(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pm.hidden) closeProject(); });

    /* ==========================================================================
       CONTACT FORM: real delivery to sapunno@gmail.com via FormSubmit
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            statusEl.className = 'form-status';
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="ph ph-spinner-gap" style="animation: spin 1s linear infinite"></i>';
            statusEl.textContent = '';

            try {
                const res = await fetch('https://formsubmit.co/ajax/sapunno@gmail.com', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(contactForm)
                });
                const out = await res.json().catch(() => ({}));
                if (res.ok && String(out.success) !== 'false') {
                    statusEl.textContent = 'Message sent. Thank you! I will reply to your email shortly.';
                    statusEl.classList.add('ok');
                    contactForm.reset();
                } else {
                    throw new Error(out.message || 'Request failed');
                }
            } catch (err) {
                statusEl.innerHTML = 'Could not send right now. Please email me directly at <a href="mailto:sapunno@gmail.com">sapunno@gmail.com</a>.';
                statusEl.classList.add('err');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
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
