document.addEventListener("DOMContentLoaded", () => {
  const carouselEl = document.querySelector(".cart-recommended-swiper");

  if (!carouselEl || typeof Swiper === "undefined") {
    return;
  }

  // Recommended products Swiper on cart page
  // Mirrors the design: 3 cards on desktop, fewer on smaller screens
  // with bottom navigation arrows and no pagination dots.
  // eslint-disable-next-line no-unused-vars
  const cartRecommendedSwiper = new Swiper(".cart-recommended-swiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".cart-recommended-next",
      prevEl: ".cart-recommended-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  });
});

