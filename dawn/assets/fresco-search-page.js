// Fresco Search Page enhancements
// - Mobile filter sidebar open/close (matches Fresco catalogue layout)
// - Sort select navigates with URL params preserved
//
// NOTE: This file exists at the asset root to satisfy theme-check resolution.
// Source is mirrored from `assets/fresco/fresco-search-page.js`.

(function () {
  'use strict';

  function initSearchPage() {
    const section = document.querySelector('.shop-main[data-template="search"]');
    if (!section) return;

    const shopSidebar = section.querySelector('.shop-sidebar');
    const sidebarOverlay = section.querySelector('.sidebar-overlay');
    const filterToggleBtn = section.querySelector('.filter-toggle');
    const sidebarCloseBtn = section.querySelector('.sidebar-close');
    const sortSelect = section.querySelector('.sort-select');

    const openSidebar = () => {
      if (!shopSidebar || !sidebarOverlay) return;
      shopSidebar.classList.add('shop-sidebar--open');
      sidebarOverlay.classList.add('sidebar-overlay--visible');
      document.body.classList.add('filters-open');
      if (filterToggleBtn) filterToggleBtn.setAttribute('aria-expanded', 'true');
    };

    const closeSidebar = () => {
      if (!shopSidebar || !sidebarOverlay) return;
      shopSidebar.classList.remove('shop-sidebar--open');
      sidebarOverlay.classList.remove('sidebar-overlay--visible');
      document.body.classList.remove('filters-open');
      if (filterToggleBtn) filterToggleBtn.setAttribute('aria-expanded', 'false');
    };

    if (filterToggleBtn && shopSidebar && sidebarOverlay) {
      filterToggleBtn.addEventListener('click', openSidebar);
    }
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeSidebar);
    }
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') closeSidebar();
    });

    // Sorting: preserve current query params (filters) and only change sort_by
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const url = new URL(window.location.href);
        url.searchParams.set('sort_by', sortSelect.value);
        window.location.href = url.toString();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPage);
  } else {
    initSearchPage();
  }

  // Theme editor support
  document.addEventListener('shopify:section:load', (event) => {
    if (!event?.target) return;
    if (event.target.querySelector?.('.shop-main[data-template="search"]')) {
      initSearchPage();
    }
  });
})();
