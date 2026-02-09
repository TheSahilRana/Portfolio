// ==================== ANIMATED PARTICLE BACKGROUND ====================
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: this.getRandomColor()
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            'rgba(0, 240, 255, 0.8)',      // Cyan
            'rgba(255, 0, 255, 0.6)',      // Magenta
            'rgba(157, 0, 255, 0.7)',      // Purple
            'rgba(57, 255, 20, 0.5)'       // Green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        
        // Mouse interaction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (this.mouse.radius - distance) / this.mouse.radius;
            particle.vx -= Math.cos(angle) * force * 0.5;
            particle.vy -= Math.sin(angle) * force * 0.5;
        }
        
        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// Initialize particle background
let particleBackground;
window.addEventListener('load', () => {
    particleBackground = new ParticleBackground();
});

// ==================== NAVIGATION ==================== 
// Navbar scroll effect - optimized
const navbar = document.getElementById('navbar');
let lastScroll = 0;
let ticking = false;

function updateNavbar() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==================== SMOOTH SCROLLING ====================
// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Adjust for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== ACTIVE NAV LINK ====================
// Highlight active section in navigation
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ==================== SKILL BARS ANIMATION ====================
// Animate skill bars on scroll with stagger effect
const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

function animateSkillBars() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const sectionTop = skillsSection.offsetTop;
    const sectionHeight = skillsSection.offsetHeight;
    const scrollY = window.pageYOffset + window.innerHeight;

    // Trigger animation when skills section is in view
    if (scrollY > sectionTop + 100 && !skillsAnimated) {
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            }, index * 100); // Stagger animation
        });
        skillsAnimated = true;
    }
}

// Use requestAnimationFrame for better performance
let skillAnimationFrame;
window.addEventListener('scroll', () => {
    if (skillAnimationFrame) {
        cancelAnimationFrame(skillAnimationFrame);
    }
    skillAnimationFrame = requestAnimationFrame(animateSkillBars);
});

window.addEventListener('load', animateSkillBars);

// ==================== INTERSECTION OBSERVER ====================
// Fade in elements on scroll with stagger effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.classList.add('fade-in');
            }, index * 50);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
const animatedElements = document.querySelectorAll(
    '.glass-card, .project-card, .timeline-item, .cert-card, .skill-card'
);

animatedElements.forEach(element => {
    observer.observe(element);
});

// ==================== TYPING EFFECT ====================
// Typing animation for hero role
const typingText = document.querySelector('.typing-text');
const roles = [
    '--C++ programmer--',
    '--Frontend Developer--',
    '--DSA/CP--'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        // Remove characters
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        // Add characters
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    // Check if word is complete
    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Move to next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeRole, typingSpeed);
}

// Start typing effect
if (typingText) {
    setTimeout(typeRole, 1000);
}

// ==================== CONTACT FORM ====================
// Handle contact form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Log form data (in production, send to backend)
    console.log('Form submitted:', formData);
    
    // Show success message
    showNotification('Message sent successfully! 🚀', 'success');
    
    // Reset form
    contactForm.reset();
});

// ==================== NOTIFICATION SYSTEM ====================
// Create and show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles dynamically
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(20, 20, 30, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid var(--primary-cyan);
                border-radius: 10px;
                padding: 1rem 1.5rem;
                box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                color: var(--text-primary);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-primary);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            
            .notification-success {
                border-color: var(--neon-green);
                box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @media (max-width: 640px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ==================== SCROLL PROGRESS BAR ====================
// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(0, 240, 255, 0.1);
            z-index: 10000;
        }
        
        .scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-cyan), var(--primary-magenta));
            width: 0%;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px var(--primary-cyan);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        document.querySelector('.scroll-progress-bar').style.width = scrolled + '%';
    });
}

createScrollProgress();

// ==================== PARTICLE EFFECT ====================
// Optimized cursor particle effect
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // Add particle styles if not exists
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            .cursor-particle {
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-cyan);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: particleFade 1s ease-out forwards;
                box-shadow: 0 0 10px var(--primary-cyan);
            }
            
            @keyframes particleFade {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-30px) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Throttle particle creation with RAF
let lastParticleTime = 0;
let particleAnimationFrame;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastParticleTime > 80) { // Reduced frequency
        if (particleAnimationFrame) {
            cancelAnimationFrame(particleAnimationFrame);
        }
        particleAnimationFrame = requestAnimationFrame(() => {
            createParticle(e.clientX, e.clientY);
            lastParticleTime = now;
        });
    }
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Debounce function for scroll events
function debounce(func, wait) {
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

// Optimize scroll events
const optimizedScroll = debounce(() => {
    highlightNavigation();
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ==================== PRELOADER ====================
// Optional: Add page preloader
window.addEventListener('load', () => {
    // Remove any existing preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
    
    // Trigger initial animations
    animateSkillBars();
});

// ==================== EASTER EGG ====================
// Konami code easter egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    showNotification('🎮 Cheat code activated! Matrix mode enabled.', 'success');
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 5000);
}

// ==================== INITIALIZATION ====================
// Initialize all features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 Portfolio Loaded!', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
    console.log('%c⚡ Built with vanilla JavaScript', 'color: #ff00ff; font-size: 14px;');
    
    // Set initial skill bar widths to 0
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
    
    // Trigger animations for elements in view
    highlightNavigation();
    animateSkillBars();
});

// ==================== UTILITY FUNCTIONS ====================
// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add "back to top" button when scrolling down
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        if (!document.querySelector('.back-to-top')) {
            const backToTop = document.createElement('button');
            backToTop.className = 'back-to-top';
            backToTop.innerHTML = '↑';
            backToTop.onclick = scrollToTop;
            
            const style = document.createElement('style');
            style.textContent = `
                .back-to-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, var(--primary-cyan), var(--primary-magenta));
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
                    z-index: 1000;
                    animation: fadeInUp 0.3s ease;
                    transition: all 0.3s ease;
                }
                
                .back-to-top:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0 30px rgba(0, 240, 255, 0.8);
                }
                
                @media (max-width: 640px) {
                    .back-to-top {
                        bottom: 20px;
                        right: 20px;
                        width: 45px;
                        height: 45px;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(backToTop);
        }
    } else {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.remove();
        }
    }
});
