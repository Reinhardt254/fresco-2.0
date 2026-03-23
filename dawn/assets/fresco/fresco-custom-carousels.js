// Fresco Custom Carousels
// Initialize all carousels when DOM is ready and Swiper is loaded

(function () {
  'use strict';

  // Wait for Swiper to be available
  function initCarousels() {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper.js is not loaded. Please ensure Swiper.js CDN is included.');
      return;
    }

    // Sliding Text Carousel
    const slidingTextElement = document.querySelector('.sliding-text-swiper');
    if (slidingTextElement) {
      new Swiper('.sliding-text-swiper', {
        loop: true,
        loopedSlides: 10,
        slidesPerView: 'auto',
        spaceBetween: 40,
        freeMode: {
          enabled: true,
          momentum: false,
          momentumBounce: false,
        },
        speed: 3000,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        grabCursor: false,
      });
    }

    // Hero Swiper
    const heroSwiperElement = document.querySelector('.hero-swiper');
    if (heroSwiperElement) {
      const autoplayDelay = heroSwiperElement.getAttribute('data-autoplay-delay')
        ? parseInt(heroSwiperElement.getAttribute('data-autoplay-delay'), 10)
        : 7000;

      new Swiper('.hero-swiper', {
        loop: true,
        effect: 'fade',
        speed: 1200,
        autoplay: {
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        },
        navigation: {
          nextEl: '.hero__control--next',
          prevEl: '.hero__control--prev',
        },
        pagination: {
          el: '.hero__pagination',
          clickable: true,
        },
        fadeEffect: {
          crossFade: true,
        },
      });
    }

    // Partners/Quality Commitment Swiper
    const partnersSwiperElement = document.querySelector('.swiper-partners');
    if (partnersSwiperElement) {
      new Swiper('.swiper-partners', {
        loop: true,
        slidesPerView: 4,
        loopedSlides: 10,
        spaceBetween: 1,
        freeMode: {
          enabled: true,
          momentum: false,
          momentumBounce: false,
        },
        speed: 2500,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        grabCursor: false,
        breakpoints: {
          768: {
            slidesPerView: 6,
          },
        },
      });
    }

    // Recipes Ingredients Swiper - Handle multiple instances
    const recipesIngredientsElements = document.querySelectorAll('.recipes-ingredients-swiper');
    recipesIngredientsElements.forEach((swiperElement) => {
      const sectionId = swiperElement.getAttribute('data-section-id');
      const prevButton = document.querySelector(`.recipes-ingredients__nav--prev[data-section-id="${sectionId}"]`);
      const nextButton = document.querySelector(`.recipes-ingredients__nav--next[data-section-id="${sectionId}"]`);

      new Swiper(swiperElement, {
        slidesPerView: 4,
        spaceBetween: 16,
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 2.5,
            spaceBetween: 14,
          },
          900: {
            slidesPerView: 3.5,
            spaceBetween: 16,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        },
      });
    });

    // Recipe Video Play Functionality
    const recipePlayButtons = document.querySelectorAll('.recipes__play');

    recipePlayButtons.forEach((button) => {
      // Skip if already initialized
      if (button.dataset.initialized === 'true') return;
      button.dataset.initialized = 'true';

      const mediaContainer = button.closest('.recipes__media');
      if (!mediaContainer) return;

      const video = mediaContainer.querySelector('video');
      if (!video) return;

      const recipePlayIcon = button.querySelector('i');

      const syncRecipeButtonState = () => {
        const isPlaying = !video.paused && !video.ended;
        button.classList.toggle('is-playing', isPlaying);
        button.setAttribute('aria-label', isPlaying ? 'Pause recipe video' : 'Play recipe video');

        if (recipePlayIcon) {
          recipePlayIcon.classList.toggle('fa-play', !isPlaying);
          recipePlayIcon.classList.toggle('fa-pause', isPlaying);
        }
      };

      // Add click handler with proper event handling
      button.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          e.stopPropagation();

          try {
            if (video.paused || video.ended) {
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    syncRecipeButtonState();
                  })
                  .catch((error) => {
                    console.error('Error playing video:', error);
                  });
              } else {
                syncRecipeButtonState();
              }
            } else {
              video.pause();
              syncRecipeButtonState();
            }
          } catch (error) {
            console.error('Error toggling video:', error);
          }
        },
        { passive: false }
      );

      // Add video event listeners
      video.addEventListener('play', syncRecipeButtonState);
      video.addEventListener('pause', syncRecipeButtonState);
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        syncRecipeButtonState();
      });
      video.addEventListener('loadedmetadata', syncRecipeButtonState);
      video.addEventListener('canplay', syncRecipeButtonState);

      // Initial sync after a short delay to ensure video is ready
      setTimeout(() => {
        syncRecipeButtonState();
      }, 100);
    });

    // Testimonials Swiper - Handle multiple instances
    const testimonialsSwiperElements = document.querySelectorAll('.testimonials__swiper');
    testimonialsSwiperElements.forEach((swiperElement) => {
      const sectionId = swiperElement.getAttribute('data-section-id');
      const prevButton = document.querySelector(`.testimonials__arrow--prev[data-section-id="${sectionId}"]`);
      const nextButton = document.querySelector(`.testimonials__arrow--next[data-section-id="${sectionId}"]`);

      new Swiper(swiperElement, {
        loop: true,
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        },
        spaceBetween: 0,
        autoplay: {
          delay: 15000,
          disableOnInteraction: false,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
        },
      });
    });

    // Video Overlay Functionality
    const videoPlayButtons = document.querySelectorAll('.video-play[id^="chef-video-play-"]');
    videoPlayButtons.forEach((button) => {
      const buttonId = button.getAttribute('id');
      const sectionId = buttonId.replace('chef-video-play-', '');
      const overlayId = `chef-overlay-video-${sectionId}`;
      const closeButtonId = `chef-close-button-${sectionId}`;

      const overlay = document.getElementById(overlayId);
      const closeButton = document.getElementById(closeButtonId);

      if (overlay && closeButton) {
        button.addEventListener('click', () => {
          overlay.style.display = 'flex';
          document.body.classList.add('no-scroll');
        });

        closeButton.addEventListener('click', () => {
          overlay.style.display = 'none';
          document.body.classList.remove('no-scroll');
        });

        // Close overlay if clicking outside the video/content
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) {
            overlay.style.display = 'none';
            document.body.classList.remove('no-scroll');
          }
        });
      }
    });

    // About Values Swiper - Handle multiple instances
    const aboutValuesSwiperElements = document.querySelectorAll('.about-values-swiper');
    aboutValuesSwiperElements.forEach((swiperElement) => {
      const sectionId = swiperElement.getAttribute('data-section-id');
      const navContainer = document.querySelector(`.about-values__nav[data-section-id="${sectionId}"]`);
      const prevButton = navContainer ? navContainer.querySelector('.about-values__arrow--prev') : null;
      const nextButton = navContainer ? navContainer.querySelector('.about-values__arrow--next') : null;
      const pagination = navContainer ? navContainer.querySelector('.about-values__pagination') : null;

      new Swiper(swiperElement, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        },
        pagination: {
          el: pagination,
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          900: {
            slidesPerView: 2.2,
            spaceBetween: 24,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 14,
          },
        },
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // Wait a bit for Swiper to load if it's loaded asynchronously
      setTimeout(initCarousels, 100);
    });
  } else {
    // DOM is already ready
    setTimeout(initCarousels, 100);
  }

  // Also try to initialize when Swiper might be loaded later
  window.addEventListener('load', function () {
    setTimeout(initCarousels, 100);
  });
})();
