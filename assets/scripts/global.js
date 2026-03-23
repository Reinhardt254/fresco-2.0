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

// ==========================================Footer scroll to top==============================================
const footerScrollTop = document.querySelector(".footer-scroll-top");
if (footerScrollTop) {
  // 150svh ≈ 150% of viewport height
  const getScrollThreshold = () => (150 / 100) * window.innerHeight;

  const updateScrollTopVisibility = () => {
    const threshold = getScrollThreshold();
    if (window.scrollY >= threshold) {
      footerScrollTop.classList.add("is-visible");
    } else {
      footerScrollTop.classList.remove("is-visible");
    }
  };

  updateScrollTopVisibility();
  window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });
  window.addEventListener("resize", updateScrollTopVisibility);

  footerScrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


