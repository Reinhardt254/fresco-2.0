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
    const variantDataScript = document.querySelector('script[id^="product-variants-"]');

    if (jarButtons.length > 0 && variantDataScript) {
      const variantData = JSON.parse(variantDataScript.textContent);
      const variantIdInput = document.getElementById('product-variant-id');
      const priceElement = document.querySelector('.product-price .price-amount');
      const comparePriceElement = document.querySelector('.product-price-note .compare-price-amount');
      const comparePriceContainer = document.querySelector('.product-price-note');
      const stockElement = document.querySelector('.product-stock');
      const sectionId = variantDataScript.id.replace('product-variants-', '');

      // Format money helper - matches Shopify's money format
      function formatMoney(cents) {
        const amount = (cents / 100).toFixed(2);
        // Use Shopify's currency symbol if available, otherwise default to $
        const currencySymbol =
          typeof window.Shopify !== 'undefined' && window.Shopify.currency?.active
            ? window.Shopify.currency.active === 'USD'
              ? '$'
              : window.Shopify.currency.active + ' '
            : '$';
        return currencySymbol + amount;
      }

      // Find variant by option value and position
      function findVariantByOption(optionValue, optionPosition) {
        return variantData.variants.find((variant) => {
          if (optionPosition === '1') {
            return variant.option1 === optionValue;
          } else if (optionPosition === '2') {
            return variant.option2 === optionValue;
          } else if (optionPosition === '3') {
            return variant.option3 === optionValue;
          }
          // Fallback: check all options
          return variant.option1 === optionValue || variant.option2 === optionValue || variant.option3 === optionValue;
        });
      }

      // Update product info based on variant
      function updateProductInfo(variant) {
        if (!variant) return;

        // Update variant ID
        if (variantIdInput) {
          variantIdInput.value = variant.id;
        }

        // Update price
        if (priceElement) {
          priceElement.textContent = formatMoney(variant.price);
        }

        // Update compare at price
        if (comparePriceElement && comparePriceContainer) {
          if (variant.compare_at_price > variant.price) {
            comparePriceElement.textContent = formatMoney(variant.compare_at_price);
            comparePriceContainer.style.display = '';
          } else {
            comparePriceContainer.style.display = 'none';
          }
        }

        // Update stock status
        if (stockElement) {
          if (variant.inventory_quantity > 0) {
            stockElement.innerHTML = `${variant.inventory_quantity} items in stock`;
            stockElement.style.color = '';
          } else if (!variant.available) {
            stockElement.innerHTML = '<span style="color: #d32f2f;">Out of stock</span>';
          } else {
            stockElement.innerHTML = 'In stock';
            stockElement.style.color = '';
          }
        }

        // Update primary action button state (Buy now)
        const actionEl = document.querySelector('.product-add');
        if (actionEl) {
          // Preserve whatever label is already rendered in Liquid (e.g., "Buy now")
          const buyNowLabel =
            actionEl.getAttribute('data-buy-now-label') ||
            actionEl.dataset.buyNowLabel ||
            actionEl.textContent?.trim() ||
            'Buy now';

          const soldOutLabel =
            actionEl.getAttribute('data-sold-out-label') || actionEl.dataset.soldOutLabel || 'Sold out';

          const isLink = actionEl.tagName === 'A';

          if (!variant.available) {
            actionEl.textContent = soldOutLabel;

            if (isLink) {
              // Disable link behavior
              if (!actionEl.dataset.originalHref) {
                actionEl.dataset.originalHref = actionEl.getAttribute('href') || '';
              }
              actionEl.removeAttribute('href');
              actionEl.setAttribute('aria-disabled', 'true');
              actionEl.classList.add('is-disabled');
            } else {
              actionEl.disabled = true;
            }
          } else {
            actionEl.textContent = buyNowLabel;

            if (isLink) {
              // Re-enable link behavior
              const originalHref = actionEl.dataset.originalHref;
              if (originalHref) {
                actionEl.setAttribute('href', originalHref);
              }
              actionEl.removeAttribute('aria-disabled');
              actionEl.classList.remove('is-disabled');
            } else {
              actionEl.disabled = false;
            }
          }
        }
      }

      jarButtons.forEach((button) => {
        button.addEventListener('click', function () {
          jarButtons.forEach((btn) => btn.classList.remove('active'));
          this.classList.add('active');

          const optionValue = this.dataset.value;
          const optionPosition = this.dataset.variantOption;
          if (optionValue) {
            const selectedVariant = findVariantByOption(optionValue, optionPosition);
            if (selectedVariant) {
              updateProductInfo(selectedVariant);
            }
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
