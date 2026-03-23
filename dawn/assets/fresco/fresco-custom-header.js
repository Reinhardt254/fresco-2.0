// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('#menu-toggle-button');
  const closeMenuToggle = document.querySelector('#close-menu-toggle-button');
  const siteNav = document.querySelector('#site-navigation');

  if (menuToggle && siteNav) {
    const setExpanded = (isOpen) => {
      if (menuToggle) menuToggle.setAttribute('aria-expanded', String(isOpen));
      if (closeMenuToggle) closeMenuToggle.setAttribute('aria-expanded', String(isOpen));
    };

    const openNav = () => {
      siteNav.classList.add('nav--open');
      if (menuToggle) menuToggle.classList.add('is-active');
      document.body.classList.add('no-scroll');
      setExpanded(true);
    };

    const closeNav = () => {
      siteNav.classList.remove('nav--open');
      if (menuToggle) menuToggle.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
      setExpanded(false);
    };

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.contains('nav--open');
        if (isOpen) {
          closeNav();
        } else {
          openNav();
        }
      });
    }

    if (closeMenuToggle) {
      closeMenuToggle.addEventListener('click', closeNav);
    }

    if (siteNav) {
      siteNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && siteNav.classList.contains('nav--open')) {
        closeNav();
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && siteNav.classList.contains('nav--open')) {
        closeNav();
      }
    });
  }
});
