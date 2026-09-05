// ==========================================
// FUTURISTIC CURSOR LOGIC (GPU Accelerated)
// ==========================================
const cursorCore = document.getElementById('cursor-core');
const cursorOrbitWrapper = document.getElementById('cursor-orbit-wrapper');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let coreX = mouseX;
let coreY = mouseY;
let orbitX = mouseX;
let orbitY = mouseY;
let isMouseMoving = false;

// Use passive listener for better scroll/mouse performance
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!isMouseMoving) {
    if (cursorCore) cursorCore.style.opacity = 1;
    if (cursorOrbitWrapper) cursorOrbitWrapper.style.opacity = 1;
    isMouseMoving = true;
  }
}, { passive: true });

function animateCursor() {
  // Fast follow for the core dot
  coreX += (mouseX - coreX) * 0.5;
  coreY += (mouseY - coreY) * 0.5;
  
  // Slower, smooth follow for the orbit ring
  orbitX += (mouseX - orbitX) * 0.15;
  orbitY += (mouseY - orbitY) * 0.15;
  
  // Apply transforms
  if (cursorCore) cursorCore.style.transform = `translate3d(calc(${coreX}px - 50%), calc(${coreY}px - 50%), 0)`;
  if (cursorOrbitWrapper) cursorOrbitWrapper.style.transform = `translate3d(calc(${orbitX}px - 50%), calc(${orbitY}px - 50%), 0)`;
  
  requestAnimationFrame(animateCursor);
}

// Only run cursor loop if on a device with a fine pointer (mouse)
if (window.matchMedia("(pointer: fine)").matches) {
    animateCursor();
}

function attachHoverEvents() {
  const hoverTargets = document.querySelectorAll('.hover-target, button, .auth-input');
  hoverTargets.forEach(el => {
    if(el.dataset.cursorBound) return;
    el.dataset.cursorBound = "true";
    
    el.addEventListener('mouseenter', () => {
      if (cursorCore) cursorCore.classList.add('hovering');
      if (cursorOrbitWrapper) cursorOrbitWrapper.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorCore) cursorCore.classList.remove('hovering');
      if (cursorOrbitWrapper) cursorOrbitWrapper.classList.remove('hovering');
    });
  });
}

// ==========================================
// MAGNETIC ENGINE (Optimized)
// ==========================================
function attachMagneticEvents() {
  const magneticItems = document.querySelectorAll('.magnetic-btn, .magnetic-card');
  
  magneticItems.forEach((item) => {
    if(item.dataset.magneticBound) return;
    item.dataset.magneticBound = "true";

    // Cache the bounding box on enter to avoid layout thrashing on every mousemove
    item.addEventListener('mouseenter', () => {
        item.cachedRect = item.getBoundingClientRect();
    });

    item.addEventListener('mousemove', (e) => {
      if (!item.cachedRect) return;
      const rect = item.cachedRect;
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const isCard = item.classList.contains('magnetic-card');
      const pullStrength = isCard ? 0.08 : 0.35; 
      const scaleHover = isCard ? 1.02 : 1.05;

      item.style.transform = `translate3d(${x * pullStrength}px, ${y * pullStrength}px, 0) scale(${scaleHover})`;
      item.style.transition = 'transform 0.1s linear, box-shadow 0.3s ease'; 
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = `translate3d(0px, 0px, 0) scale(1)`;
      item.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease';
      item.cachedRect = null; // clear cache
    });
  });
}

// ==========================================
// HERO TILT EFFECT (Optimized)
// ==========================================
const mockupWindow = document.querySelector('.mockup-window');
const heroVisual = document.querySelector('.hero-visual');

if (mockupWindow && heroVisual) {
  let floatTimeout;
  let heroRect = null;

  heroVisual.addEventListener('mouseenter', () => {
      heroRect = heroVisual.getBoundingClientRect();
  });

  heroVisual.addEventListener('mousemove', (e) => {
    if (!heroRect || window.innerWidth <= 992) return; 

    const x = e.clientX - heroRect.left;
    const y = e.clientY - heroRect.top;
    const centerX = heroRect.width / 2;
    const centerY = heroRect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    clearTimeout(floatTimeout);
    mockupWindow.style.transition = 'none';
    mockupWindow.style.animation = 'none'; 
    mockupWindow.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  }, { passive: true });

  heroVisual.addEventListener('mouseleave', () => {
    if (window.innerWidth <= 992) return;

    mockupWindow.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    mockupWindow.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg) scale3d(1, 1, 1)`; 
    
    floatTimeout = setTimeout(() => {
      mockupWindow.style.animation = 'floatWidget 6s ease-in-out infinite alternate';
      mockupWindow.style.transition = ''; 
    }, 600); 
  });
}

// ==========================================
// DEVX BOOT SEQUENCE CHOREOGRAPHY
// ==========================================
const DEVX_CONFIG = {
  timings: {
    startDelay: 300, lineInterval: 300, terminalFade: 1600, logoReveal: 1900, 
    glitchStart: 2300, glitchDuration: 600, crossfadeStart: 2900, blastStart: 3100, maskFade: 3450, destroy: 4000                  
  }
};

(function initDevXBootSequence() {
  const body = document.body;
  const bootLayer = document.getElementById('devx-boot-overlay');
  const visualWrapper = document.getElementById('devx-logo-visual-wrapper');
  const visualLogo = document.getElementById('devx-logo-visual');
  const maskLayer = document.getElementById('devx-mask-overlay');
  const maskWrapper = document.getElementById('devx-logo-mask-wrapper');
  const terminal = document.getElementById('devx-terminal');
  const lines = document.querySelectorAll('.devx-line');

  if (!bootLayer || !maskLayer) return;

  setTimeout(() => {
    lines.forEach((line, index) => {
      setTimeout(() => line.classList.add('devx-visible'), index * DEVX_CONFIG.timings.lineInterval);
    });
  }, DEVX_CONFIG.timings.startDelay);

  setTimeout(() => terminal.style.opacity = '0', DEVX_CONFIG.timings.terminalFade);
  setTimeout(() => visualWrapper.classList.add('devx-visible'), DEVX_CONFIG.timings.logoReveal);

  setTimeout(() => {
    visualLogo.classList.add('devx-glitch');
    setTimeout(() => visualLogo.classList.remove('devx-glitch'), DEVX_CONFIG.timings.glitchDuration);
  }, DEVX_CONFIG.timings.glitchStart);

  setTimeout(() => {
    body.classList.remove('devx-is-booting'); 
    maskLayer.style.opacity = '1';            
    bootLayer.style.opacity = '0';            
  }, DEVX_CONFIG.timings.crossfadeStart);

  setTimeout(() => { maskWrapper.classList.add('devx-blast'); }, DEVX_CONFIG.timings.blastStart);
  setTimeout(() => { maskLayer.style.opacity = '0'; }, DEVX_CONFIG.timings.maskFade);

  setTimeout(() => {
    if (bootLayer.parentNode) bootLayer.parentNode.removeChild(bootLayer);
    if (maskLayer.parentNode) maskLayer.parentNode.removeChild(maskLayer);
  }, DEVX_CONFIG.timings.destroy);
})();

// ==========================================
// INITIALIZATION ON DOM CONTENT LOADED
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById('navbar');
  
  // Update Nav State from main.js if available
  if (typeof updateNavState === 'function') updateNavState();
  
  attachHoverEvents();
  attachMagneticEvents();

  // Optimized Scroll Listener (Throttled via requestAnimationFrame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 20 && navbar) navbar.classList.add('scrolled');
            else if (navbar) navbar.classList.remove('scrolled');
            ticking = false;
        });
        ticking = true;
    }
  }, { passive: true });
  
  if (window.scrollY > 20 && navbar) navbar.classList.add('scrolled');

  // Optimized Reveal Animations via Intersection Observer
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Unobserve after revealing to save resources
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.reveal-up, .reveal-fade').forEach((el) => {
    observer.observe(el);
  });

  // Typewriter Optimization
  const rawCode = `// DevX\n\nconst ideas = [\n  "Web Apps",\n  "AI Tools",\n  "Open Source",\n  "Startups"\n];\n\nideas.forEach((idea) => {\n  build(idea);\n  deploy(idea);\n  improve(idea);\n});`;
  const codeContent = document.getElementById('code-content');
  const lineNumbers = document.getElementById('line-numbers');
  
  function highlight(text) {
    return text
      .replace(/(\/\/.*)/g, "<span class='token-comment'>$1</span>")
      .replace(/\b(const)\b/g, "<span class='token-keyword'>$1</span>")
      .replace(/(=>)/g, "<span class='token-keyword'>$1</span>")
      .replace(/("(?:[^"\\]|\\.)*")/g, "<span class='token-string'>$1</span>")
      .replace(/\b(build|deploy|improve|forEach)\b/g, "<span class='token-function'>$1</span>")
      .replace(/\b(ideas|idea)\b/g, "<span class='token-variable'>$1</span>");
  }

  let currentText = "", charIndex = 0, currentLineCount = 1;
  function typeWriter() {
    if (charIndex < rawCode.length) {
      currentText += rawCode.charAt(charIndex);
      
      // Execute DOM write in animation frame to prevent stutter
      requestAnimationFrame(() => {
          if (codeContent) codeContent.innerHTML = highlight(currentText) + '<span class="cursor"></span>';
          const newLines = (currentText.match(/\n/g) || []).length + 1;
          if (newLines > currentLineCount) {
             currentLineCount = newLines;
             const lineSpan = document.createElement('span');
             lineSpan.textContent = currentLineCount;
             if (lineNumbers) lineNumbers.appendChild(lineSpan);
          }
      });
      
      charIndex++;
      setTimeout(typeWriter, Math.random() * 30 + 15);
    }
  }
  setTimeout(typeWriter, 3800);
});

// ==========================================
// OPTIMIZED CANVAS PARTICLES
// ==========================================
const canvas = document.getElementById('particle-canvas');
if (canvas && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5;
            this.speedY = Math.random() * 0.5 + 0.1;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.y -= this.speedY;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(217, 70, 239, ${this.opacity})`;
            ctx.beginPath();
            // Using | 0 truncates to integer, massively speeding up canvas rendering
            ctx.arc(this.x | 0, this.y | 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 40; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}