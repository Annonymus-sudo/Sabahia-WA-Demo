// imageLoader.js

function preloadImages() {
  return new Promise((resolve) => {
    const imgElements = document.querySelectorAll('img');
    if (imgElements.length === 0) {
      resolve();
      return;
    }
    let loadedCount = 0;
    imgElements.forEach(img => {
      if (img.src && !img.complete) {
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === imgElements.length) resolve();
        };
        // Force reload if cached image might be stale
        const src = img.src;
        img.src = ''; // Clear src
        img.src = src; // Reassign to trigger load
      } else {
        loadedCount++;
        if (loadedCount === imgElements.length) resolve();
      }
    });
    // Resolve immediately if all images are already loaded
    if (loadedCount === imgElements.length) resolve();
  });
}

function initializeContent() {
  // Ensure Lenis starts if available
  if (window.lenis) {
    window.lenis.start();
  }

  // Initialize sliders and other components (mimics Cp() function)
  const solutionsWrapper = document.querySelector('.solutions__wrapper');
  if (solutionsWrapper) {
    const isSlider = solutionsWrapper.classList.contains('--is-slider');
    if (isSlider || window.matchMedia('(max-width: 639px)').matches) {
      new window.Swiper(solutionsWrapper, { loop: true, slidesPerView: 'auto' });
    }
  }

  const teamWrapper = document.querySelector('.team__wrapper');
  if (teamWrapper) {
    const isSlider = teamWrapper.classList.contains('--is-slider');
    if (isSlider || window.matchMedia('(max-width: 639px)').matches) {
      new window.Swiper(teamWrapper, {
        modules: [window.SwiperNavigation],
        loop: true,
        slidesPerView: 'auto',
        navigation: {
          nextEl: teamWrapper.querySelector('.slider__next'),
          prevEl: teamWrapper.querySelector('.slider__prev'),
        },
      });
    }
  }

  const blocOffersSlider = document.querySelector('.bloc-offers__slider');
  if (blocOffersSlider && window.matchMedia('(max-width: 639px)').matches) {
    new window.Swiper(blocOffersSlider, { loop: true, slidesPerView: 'auto' });
  }

  // Initialize hero titles if present
  const heroTitles = [...document.querySelectorAll('.hero__title')];
  if (heroTitles.length && window.f0) {
    new window.f0(heroTitles).init();
  }

  // Initialize 3D elements if present
  const glElements = document.querySelector('.gl');
  if (glElements && window.Dp) {
    new window.Dp({ dom: glElements });
    if (document.querySelector('body').classList.contains('home') && window.cy) {
      new window.cy({ dom: glElements });
    }
  }

  const glModels = document.querySelectorAll('.gl-model');
  if (glModels.length && window.dy) {
    glModels.forEach(model => new window.dy({ dom: model }));
  }
}

// Handle initial page load
document.addEventListener('DOMContentLoaded', () => {
  preloadImages().then(() => {
    initializeContent();
    // Dispatch custom event to mimic preloaded behavior if needed
    document.dispatchEvent(new Event('imagesLoaded'));
  });
});

// Handle navigation events via Taxi
if (window.taxi) {
  window.taxi.on('NAVIGATE_IN', ({ to }) => {
    // Preload images for the new content
    preloadImages().then(() => {
      // Reinitialize content for the new page
      initializeContent();
      // Update body class and menu if Taxi provides this data
      if (to && to.page) {
        document.body.classList = to.page.body.classList;
        const menuInner = document.querySelector('.header__menu__inner');
        if (menuInner && to.page.querySelector('.header__menu__inner')) {
          menuInner.innerHTML = to.page.querySelector('.header__menu__inner').innerHTML;
        }
      }
    });
  });

  window.taxi.on('NAVIGATE_END', () => {
    // Ensure Lenis starts after navigation
    if (window.lenis) {
      window.lenis.start();
    }
  });
}

// Optional: Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
  initializeContent();
});