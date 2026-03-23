// Fresco Catalogue Filters
// Initialize filtering and sorting functionality for catalogue sections

(function () {
  'use strict';

  function initCatalogueFilters(sectionId) {
    const section =
      document.querySelector(`.shop-main[data-section-id="${sectionId}"]`) || document.querySelector('.shop-main');
    if (!section) return;

    const searchInput = section.querySelector(`#search-input-${sectionId}`);
    const minPriceInput = section.querySelector(`#min-price-${sectionId}`);
    const maxPriceInput = section.querySelector(`#max-price-${sectionId}`);
    const priceFilterBtn = section.querySelector('.filter-btn');
    const categoryCheckboxes = section.querySelectorAll(`input[name="category-${sectionId}"]`);
    const clearFiltersBtn = section.querySelector('.clear-filters-btn');
    const sortSelect = section.querySelector(`#sort-select-${sectionId}`);
    const productsGrid = section.querySelector(`#products-grid-${sectionId}`);
    const productCards = section.querySelectorAll('.product-card');
    const productCountSpan = section.querySelector(`#product-count-${sectionId}`);
    const filterToggleBtn = section.querySelector('.filter-toggle');
    const shopSidebar = section.querySelector('.shop-sidebar');
    const sidebarOverlay = section.querySelector('.sidebar-overlay');
    const sidebarCloseBtn = section.querySelector('.sidebar-close');

    if (!productsGrid || productCards.length === 0) return;

    // Initialize product count
    if (productCountSpan) {
      productCountSpan.textContent = productCards.length;
    }

    // Filter products
    function filterProducts() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const minPrice = minPriceInput ? parseFloat(minPriceInput.value) || 0 : 0;
      const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) || Infinity : Infinity;
      const selectedCategories = Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      let visibleCount = 0;

      productCards.forEach((card) => {
        const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
        const price = parseFloat(card.dataset.price) || 0;
        const category = card.dataset.category || '';

        // Search filter
        const matchesSearch =
          !searchTerm ||
          name.includes(searchTerm) ||
          (card.querySelector('h3') && card.querySelector('h3').textContent.toLowerCase().includes(searchTerm));

        // Price filter
        const matchesPrice = price >= minPrice && price <= maxPrice;

        // Category filter - check if product belongs to any selected collection
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.some((selectedCat) => {
            const normalizedSelected = selectedCat.toLowerCase().trim();
            const normalizedCategory = category.toLowerCase().trim();
            // Check main category
            if (normalizedSelected === normalizedCategory) return true;
            // Check if product has multiple collections (data-collections attribute)
            const productCollections = card.dataset.collections;
            if (productCollections) {
              const collections = productCollections.split(',');
              return collections.some((coll) => coll.toLowerCase().trim() === normalizedSelected);
            }
            return false;
          });

        // Show/hide card
        if (matchesSearch && matchesPrice && matchesCategory) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Update product count
      if (productCountSpan) {
        productCountSpan.textContent = visibleCount;
      }
    }

    // Sort products
    function sortProducts() {
      if (!sortSelect) return;
      const sortValue = sortSelect.value;
      const cards = Array.from(productCards);
      const visibleCards = cards.filter((card) => !card.classList.contains('hidden'));
      const hiddenCards = cards.filter((card) => card.classList.contains('hidden'));

      visibleCards.sort((a, b) => {
        switch (sortValue) {
          case 'price-low':
            return (parseFloat(a.dataset.price) || 0) - (parseFloat(b.dataset.price) || 0);
          case 'price-high':
            return (parseFloat(b.dataset.price) || 0) - (parseFloat(a.dataset.price) || 0);
          case 'name-asc':
            return (a.dataset.name || '').localeCompare(b.dataset.name || '');
          case 'name-desc':
            return (b.dataset.name || '').localeCompare(a.dataset.name || '');
          default:
            return 0;
        }
      });

      // Reorder in DOM
      visibleCards.forEach((card) => productsGrid.appendChild(card));
      hiddenCards.forEach((card) => productsGrid.appendChild(card));
    }

    // Event listeners
    if (searchInput) {
      searchInput.addEventListener('input', filterProducts);
    }

    if (priceFilterBtn) {
      priceFilterBtn.addEventListener('click', filterProducts);
    }

    categoryCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', filterProducts);
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', sortProducts);
    }

    // Clear filters
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        categoryCheckboxes.forEach((cb) => (cb.checked = false));
        filterProducts();
      });
    }

    // Allow Enter key on price inputs
    if (minPriceInput) {
      minPriceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterProducts();
      });
    }
    if (maxPriceInput) {
      maxPriceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterProducts();
      });
    }

    // Initialize count on load
    filterProducts();

    // Sidebar toggle functionality
    function closeFilters() {
      if (shopSidebar) shopSidebar.classList.remove('shop-sidebar--open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('sidebar-overlay--visible');
      if (filterToggleBtn) filterToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('filters-open');
    }

    function openFilters() {
      if (shopSidebar) shopSidebar.classList.add('shop-sidebar--open');
      if (sidebarOverlay) sidebarOverlay.classList.add('sidebar-overlay--visible');
      if (filterToggleBtn) filterToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('filters-open');
    }

    if (filterToggleBtn) {
      filterToggleBtn.addEventListener('click', () => {
        const isOpen = shopSidebar && shopSidebar.classList.contains('shop-sidebar--open');
        if (isOpen) {
          closeFilters();
        } else {
          openFilters();
        }
      });
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeFilters);
    }

    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', closeFilters);
    }

    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        closeFilters();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        closeFilters();
      }
    });
  }

  // Initialize when DOM is ready
  function initAllCatalogues() {
    const catalogueSections = document.querySelectorAll('.shop-main[data-section-id]');
    catalogueSections.forEach((section) => {
      const sectionId = section.getAttribute('data-section-id');
      if (sectionId) {
        initCatalogueFilters(sectionId);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCatalogues);
  } else {
    initAllCatalogues();
  }

  // Also initialize on dynamic content load
  if (typeof window.Shopify !== 'undefined' && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', initAllCatalogues);
  }
})();
