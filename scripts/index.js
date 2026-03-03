// ==========================================Mobile Menu Toggle==============================================
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu-close");
const mobileDropdownTriggers = document.querySelectorAll(
  ".mobile-dropdown-trigger",
);

if (menuToggle && mobileMenu) {
  const setExpanded = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };

  const openMobileMenu = () => {
    mobileMenu.classList.add("mobile-menu-open");
    menuToggle.classList.add("is-active");
    document.body.classList.add("no-scroll");
    setExpanded(true);
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove("mobile-menu-open");
    menuToggle.classList.remove("is-active");
    document.body.classList.remove("no-scroll");
    setExpanded(false);

    // Close all dropdowns when closing menu
    mobileDropdownTriggers.forEach((trigger) => {
      const dropdown = trigger.nextElementSibling;
      if (dropdown) {
        dropdown.classList.remove("mobile-dropdown-open");
        const icon = trigger.querySelector("i");
        if (icon) {
          icon.classList.remove("rotate");
        }
      }
    });
  };

  // Toggle menu on hamburger click
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("mobile-menu-open");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu on close button click
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  // Close menu when clicking on overlay
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  // Close menu when clicking on nav links (excluding dropdown triggers)
  const mobileNavLinks = mobileMenu.querySelectorAll(
    ".mobile-nav-link:not(.mobile-dropdown-trigger)",
  );
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking on dropdown links
  const mobileDropdownLinks = mobileMenu.querySelectorAll(
    ".mobile-dropdown-link",
  );
  mobileDropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Handle mobile dropdown toggles
  mobileDropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const dropdown = trigger.nextElementSibling;
      const icon = trigger.querySelector("i");

      if (dropdown) {
        const isOpen = dropdown.classList.contains("mobile-dropdown-open");

        // Close all other dropdowns
        mobileDropdownTriggers.forEach((otherTrigger) => {
          if (otherTrigger !== trigger) {
            const otherDropdown = otherTrigger.nextElementSibling;
            const otherIcon = otherTrigger.querySelector("i");
            if (otherDropdown) {
              otherDropdown.classList.remove("mobile-dropdown-open");
            }
            if (otherIcon) {
              otherIcon.classList.remove("rotate");
            }
          }
        });

        // Toggle current dropdown
        if (isOpen) {
          dropdown.classList.remove("mobile-dropdown-open");
          if (icon) {
            icon.classList.remove("rotate");
          }
        } else {
          dropdown.classList.add("mobile-dropdown-open");
          if (icon) {
            icon.classList.add("rotate");
          }
        }
      }
    });
  });

  // Close menu on window resize if desktop
  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 900 &&
      mobileMenu.classList.contains("mobile-menu-open")
    ) {
      closeMobileMenu();
    }
  });

  // Close menu on Escape key
  window.addEventListener("keyup", (event) => {
    if (
      event.key === "Escape" &&
      mobileMenu.classList.contains("mobile-menu-open")
    ) {
      closeMobileMenu();
    }
  });
}

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
