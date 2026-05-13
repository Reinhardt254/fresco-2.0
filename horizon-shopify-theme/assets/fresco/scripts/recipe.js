function initKeyProductsSwiper() {
  if (typeof window.Swiper === "undefined") {
    return;
  }

  const swipers = document.querySelectorAll(".key-products__swiper");

  for (const el of swipers) {
    if (el.classList.contains("swiper-initialized")) {
      continue;
    }

    const root = el.closest(".key-products__carousel") || el.parentElement;
    const prevEl = root?.querySelector(".key-products__nav--prev");
    const nextEl = root?.querySelector(".key-products__nav--next");
    const slideCount = el.querySelectorAll(".swiper-slide").length;
    const countFromData = Number.parseInt(
      root?.dataset.keyProductCount || `${slideCount}`,
      10,
    );
    const effectiveCount = Number.isFinite(countFromData)
      ? countFromData
      : slideCount;

    // Loop needs enough duplicated slides; keep off for short lists.
    const useLoop = effectiveCount >= 5;

    // eslint-disable-next-line no-new
    new window.Swiper(el, {
      slidesPerView: 2,
      spaceBetween: 12,
      speed: 450,
      watchOverflow: true,
      grabCursor: true,
      loop: true,
      navigation: {
        prevEl,
        nextEl,
      },
      breakpoints: {
        680: {
          slidesPerView: 3,
          spaceBetween: 25,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 25,
        },
      },
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initKeyProductsSwiper();
  });
} else {
  initKeyProductsSwiper();
}
