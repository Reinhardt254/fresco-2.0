import { ThemeEvents } from '@theme/events';

/**
 * Initializes Swiper on Fresco thumbnail strips inside product media-gallery.
 * @param {ParentNode} [root]
 */
function initFrescoThumbnails(root = document) {
  if (typeof Swiper === 'undefined') return;

  root.querySelectorAll('[data-fresco-product-swiper]:not([data-fresco-swiper-ready])').forEach((el) => {
    const wrap = el.closest('.product-details-thumbnails-wrap');
    const next = wrap?.querySelector('[data-fresco-thumb-next]');
    const prev = wrap?.querySelector('[data-fresco-thumb-prev]');
    if (!next || !prev) return;

    const slideCount = el.querySelectorAll('.swiper-slide').length;
    void new Swiper(el, {
      slidesPerView: 3,
      spaceBetween: 16,
      freeMode: true,
      loop: slideCount > 3,
      watchSlidesProgress: true,
      navigation: { nextEl: next, prevEl: prev },
      breakpoints: {
        320: { slidesPerView: 3, spaceBetween: 12 },
        640: { slidesPerView: 3, spaceBetween: 16 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      },
    });
    el.dataset.frescoSwiperReady = 'true';
  });
}

/**
 * @param {Event} event
 */
function handleFrescoThumbClick(event) {
  const btn = event.target.closest('[data-fresco-media-index]');
  if (!btn) return;
  const gallery = btn.closest('media-gallery.media-gallery--fresco_swiper');
  if (!gallery) return;

  const idx = btn.getAttribute('data-fresco-media-index');
  if (idx == null) return;

  gallery.querySelectorAll('.fresco-main-media-item').forEach((item) => {
    const i = item.getAttribute('data-fresco-main-index');
    const show = i === idx;
    item.classList.toggle('is-active', show);
    item.toggleAttribute('hidden', !show);
  });

  gallery.querySelectorAll('.product-details-thumb-slide').forEach((slide) => {
    const b = slide.querySelector('[data-fresco-media-index]');
    const match = Boolean(b && b.getAttribute('data-fresco-media-index') === idx);
    slide.classList.toggle('is-active', match);
    if (b) b.setAttribute('aria-current', match ? 'true' : 'false');
  });
}

function initAll() {
  initFrescoThumbnails();
}

document.addEventListener('click', handleFrescoThumbClick);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

document.addEventListener(ThemeEvents.variantUpdate, () => {
  requestAnimationFrame(initAll);
});

const quickAddModal = document.getElementById('quick-add-modal-content');
if (quickAddModal) {
  const scheduleInit = () => requestAnimationFrame(() => initFrescoThumbnails(quickAddModal));
  new MutationObserver(scheduleInit).observe(quickAddModal, {
    childList: true,
    subtree: true,
  });
}
