import '../scss/main.scss';
import { initAnimations } from './animations';
import { initEmailForm } from './email';
import { debounce } from './utils';

class App {
  constructor() {
    this.init();
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  private onDOMReady(): void {
    console.log('Portfolio initialized');
    
    this.setupNavigation();
    this.setupSmoothScroll();
    this.setupMobileMenu();
    initAnimations();
    initEmailForm();
  }

  private setupNavigation(): void {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const handleScroll = debounce(() => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, 50);

    window.addEventListener('scroll', handleScroll);
    
    const currentPath = window.location.pathname;
    const navLinks = nav.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '/' && href === '/'))) {
        link.classList.add('active');
      }
    });
  }

  private setupSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  private setupMobileMenu(): void {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-menu');
    
    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

new App();
