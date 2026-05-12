

// ==========================================Hero Swiper==============================================
const heroSwiper = new Swiper(".hero-swiper", {
  loop: true,
  effect: "fade",
  speed: 1200,
  // autoplay: {
  //   delay: 7000,
  //   disableOnInteraction: false,
  //   pauseOnMouseEnter: false,
  // },
  navigation: {
    nextEl: ".hero__control--next",
    prevEl: ".hero__control--prev",
  },
  pagination: {
    el: ".hero__pagination",
    clickable: true,
  },
  fadeEffect: {
    crossFade: true,
  },
});

// =======================SWIPER PARTNERS===================================
const swiperPartners = new Swiper(".swiper-partners", {
  loop: true, // Enable infinite loop
  slidesPerView: 4, // Show 6 slides at a time on desktop
  loopedSlides: 10,
  spaceBetween: 1, // Space between items
  // freeMode prevents hard snapping and gives fluid feel
  freeMode: {
    enabled: true,
    momentum: false,
    momentumBounce: false,
  },
  speed: 2500, // time (ms) it takes to complete transition — increase for slower continuous movement
  autoplay: {
    delay: 0, // no delay between transitions
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
  grabCursor: false, // Allows free scrolling
  breakpoints: {
    // Responsive breakpoints
    768: {
      slidesPerView: 6, // Show 3 slides at a time on mobile
    },
  },
});

// =======================FEATURED PRODUCTS CAROUSEL===================================
const featuredProductsSwiperEl = document.querySelector(
  ".featured-products .featured-products-swiper",
);

if (featuredProductsSwiperEl) {
  const featuredProductsSwiper = new Swiper(".featured-products-swiper", {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: false,
    grabCursor: true,
    pagination: {
      el: ".featured-products-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  });
}
 
// =======================CATEGORY DEALS CAROUSEL===================================
const categorySwiperEl = document.querySelector(".category-swiper");

if (categorySwiperEl) {
  const categorySwiper = new Swiper(".category-swiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: ".category-swiper-next",
      prevEl: ".category-swiper-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 18,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      // 1320: {
      //   slidesPerView: 3,
      //   spaceBetween: 24,
      // },
    },
  });
}

// =======================ABOUT PAGE HERO SWIPER===================================
const homeHeroSwiperEl = document.querySelector(".home-hero-swiper");

if (homeHeroSwiperEl) {
  const homeHeroSwiper = new Swiper(".home-hero-swiper", {
    loop: true,
    speed: 1000,
    effect: "fade",
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: ".pagination-custom-inner",
      clickable: true,
    },
    navigation: {
      nextEl: ".home-hero-swiper .swiper-button-next",
      prevEl: ".home-hero-swiper .swiper-button-prev",
    },
    fadeEffect: {
      crossFade: true,
    },
  });
}

// =======================ABOUT PAGE OUR MISSION SWIPER===================================
const aboutSwiperEl = document.querySelector(".our-mission .about-swiper");

if (aboutSwiperEl) {
  const setMissionDepthClasses = (swiper) => {
    const slides = swiper.slides;

    slides.forEach((slide) => {
      slide.classList.remove("prev-2", "next-2");
    });

    const { activeIndex } = swiper;
    const prev2 = slides[activeIndex - 2];
    const next2 = slides[activeIndex + 2];

    if (prev2) prev2.classList.add("prev-2");
    if (next2) next2.classList.add("next-2");
  };

  const aboutSwiper = new Swiper(".our-mission .about-swiper", {
    effect: "creative",
    creativeEffect: {
      prev: {
        shadow: false,
        translate: ["-10%", "0%", -1],
        rotate: [0, 0, 0],
        origin: ["50%", "50%", 0],
        scale: 0.95,
      },
      next: {
        shadow: false,
        translate: ["10%", "0%", -1],
        rotate: [0, 0, 0],
        origin: ["50%", "50%", 0],
        scale: 0.95,
      },

      limitProgress: 1,
    },
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 5,
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
      pauseOnMouseEnter: false,
    },
    navigation: {
      nextEl: ".about-swiper-button-next",
      prevEl: ".about-swiper-button-prev",
    },
    pagination: {
      el: ".about-swiper-pagination",
      clickable: true,
    },
    loop: true,
    loopedSlides: 10,
    loopAdditionalSlides: 3,
    on: {
      init(swiper) {
        setMissionDepthClasses(swiper);
      },
      slideChange(swiper) {
        setMissionDepthClasses(swiper);
      },
    },
  });
}

// =======================REVIEWS HERO SWIPER===================================
const reviewsHeroSwiperEl = document.querySelector(".reviews-hero-swiper");

if (reviewsHeroSwiperEl) {
  const reviewsHeroSwiper = new Swiper(".reviews-hero-swiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "slide",
    speed: 900,
    navigation: {
      nextEl: ".review-nav-btn-next",
      prevEl: ".review-nav-btn-prev",
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    fadeEffect: {
      crossFade: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });
}

