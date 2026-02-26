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
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  grabCursor: false, // Allows free scrolling
  breakpoints: {
    // Responsive breakpoints
    768: {
      slidesPerView: 6, // Show 3 slides at a time on mobile
    },
  },
});
