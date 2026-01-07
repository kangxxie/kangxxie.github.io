import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';
import 'aos/dist/aos.css';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(): void {
  initAOS();
  initGSAPAnimations();
  setupReducedMotion();
}

function initAOS(): void {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100,
    delay: 100,
  });
}

function initGSAPAnimations(): void {
  animateHero();
  animateParallax();
  animateSkills();
  animateProjects();
}

function animateHero(): void {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  timeline
    .from('.hero h1', {
      y: 100,
      opacity: 0,
      duration: 1,
    })
    .from('.hero p', {
      y: 50,
      opacity: 0,
      duration: 0.8,
    }, '-=0.5')
    .from('.hero .cta-button', {
      y: 30,
      opacity: 0,
      duration: 0.6,
    }, '-=0.4');
}

function animateParallax(): void {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  parallaxElements.forEach((element) => {
    const speed = element.getAttribute('data-parallax') || '0.5';
    
    gsap.to(element, {
      y: () => window.innerHeight * parseFloat(speed),
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

function animateSkills(): void {
  const skillBars = document.querySelectorAll('.skill-bar');
  
  skillBars.forEach((bar) => {
    const progress = bar.querySelector('.skill-progress') as HTMLElement;
    if (!progress) return;
    
    const level = progress.getAttribute('data-level') || '0';
    
    gsap.from(progress, {
      width: 0,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bar,
        start: 'top 80%',
        once: true,
      },
      onComplete: () => {
        progress.style.width = `${level}%`;
      },
    });
  });
  
  const skillFills = document.querySelectorAll('.skill-fill');
  
  skillFills.forEach((fill) => {
    const skillItem = fill.closest('.skill-item');
    if (!skillItem) return;
    
    const level = skillItem.querySelector('.skill-bar')?.getAttribute('data-level') || '0';
    
    ScrollTrigger.create({
      trigger: skillItem,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(fill, {
          width: `${level}%`,
          duration: 1.5,
          ease: 'power2.out',
        });
      },
    });
  });
}

function animateProjects(): void {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach((card) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
    });

    const image = card.querySelector('.project-image');
    if (image) {
      card.addEventListener('mouseenter', () => {
        gsap.to(image, {
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(image, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    }
  });
}

/**
 * Respect user's motion preferences
 */
function setupReducedMotion(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Disable complex animations
    gsap.globalTimeline.timeScale(0);
    AOS.init({ disable: true });
  }
  
  // Listen for changes
  prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
      gsap.globalTimeline.timeScale(0);
      AOS.init({ disable: true });
    } else {
      gsap.globalTimeline.timeScale(1);
      AOS.init({ disable: false });
    }
  });
}
