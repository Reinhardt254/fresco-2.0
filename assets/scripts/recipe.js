function initKeyProductsSwiper() {
  if (typeof window.Swiper === "undefined") return;

  const swipers = document.querySelectorAll(".key-products__swiper");
  swipers.forEach((el) => {
    const root = el.closest(".key-products__carousel") || el.parentElement;
    const prevEl = root?.querySelector(".key-products__nav--prev");
    const nextEl = root?.querySelector(".key-products__nav--next");

    // eslint-disable-next-line no-new
    new window.Swiper(el, {
      slidesPerView: 4,
      spaceBetween: 18,
      speed: 450,
      watchOverflow: true,
      grabCursor: true,
      loop: true,
      navigation: {
        prevEl,
        nextEl,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 12,
        },
        680: {
          slidesPerView: 3,
          spaceBetween: 25,
        },
      },
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initKeyProductsSwiper();
  });
} else {
  initKeyProductsSwiper();
}
