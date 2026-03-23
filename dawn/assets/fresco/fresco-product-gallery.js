// Fresco Product Gallery
// Handle product image gallery and quantity controls

(function () {
  'use strict';

  function initProductGallery() {
    // Thumbnail swiper initialization
    const thumbSwiper = document.querySelector('.product-gallery__thumbnails.swiper');
    if (thumbSwiper && typeof Swiper !== 'undefined') {
      new Swiper('.product-gallery__thumbnails.swiper', {
        slidesPerView: 3,
        spaceBetween: 16,
        grabCursor: true,
        breakpoints: {
          0: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        },
      });
    }

    // Main image update on thumbnail click
    const mainImage = document.getElementById('product-main-image');
    const thumbButtons = document.querySelectorAll('.thumb');

    if (mainImage && thumbButtons.length > 0) {
      thumbButtons.forEach((thumb) => {
        thumb.addEventListener('click', function () {
          const image = this.dataset.image;
          const alt = this.dataset.alt;

          if (image && mainImage) {
            mainImage.src = image;
          }
          if (alt && mainImage) {
            mainImage.alt = alt;
          }

          // Update active state
          thumbButtons.forEach((btn) => btn.classList.remove('thumb--active'));
          this.classList.add('thumb--active');
        });
      });
    }

    // Quantity controls
    const qtyInput = document.querySelector('.product-qty input');
    const qtyDecrease = document.querySelector('.qty-decrease');
    const qtyIncrease = document.querySelector('.qty-increase');

    if (qtyInput) {
      if (qtyDecrease) {
        qtyDecrease.addEventListener('click', function () {
          const current = parseInt(qtyInput.value, 10) || 1;
          if (current > 1) {
            qtyInput.value = current - 1;
          }
        });
      }

      if (qtyIncrease) {
        qtyIncrease.addEventListener('click', function () {
          const current = parseInt(qtyInput.value, 10) || 1;
          qtyInput.value = current + 1;
        });
      }
    }

    // Variant selection (jar buttons)
    const jarButtons = document.querySelectorAll('.jar-button');
    if (jarButtons.length > 0) {
      jarButtons.forEach((button) => {
        button.addEventListener('click', function () {
          jarButtons.forEach((btn) => btn.classList.remove('active'));
          this.classList.add('active');

          // Update variant selection if needed
          const optionPosition = this.dataset.variantOption;
          const value = this.dataset.value;
          if (optionPosition && value) {
            // This would need to be integrated with Shopify's variant selection
            // For now, just update the visual state
          }
        });
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductGallery);
  } else {
    initProductGallery();
  }

  // Also initialize on dynamic content load
  if (typeof window.Shopify !== 'undefined' && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', initProductGallery);
  }
})();
