
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const dropdown = document.querySelector('.nav-dropdown');
const dropdownButton = document.querySelector('.nav-dropdown > button');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('is-open');
  });
}

if (dropdownButton && dropdown) {
  dropdownButton.addEventListener('click', () => {
    const expanded = dropdownButton.getAttribute('aria-expanded') === 'true';
    dropdownButton.setAttribute('aria-expanded', String(!expanded));
    dropdown.classList.toggle('is-open');
  });
}

document.addEventListener('click', (event) => {
  if (siteNav && navToggle && !siteNav.contains(event.target) && !navToggle.contains(event.target)) {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.classList.remove('is-open');
    if (dropdownButton) dropdownButton.setAttribute('aria-expanded', 'false');
  }
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const sliders = document.querySelectorAll('[data-slider]');

sliders.forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll('.hero-slider__slide'));
  const dotsWrap = slider.querySelector('.hero-slider__dots');
  if (slides.length < 2) return;
  const viewport = slider.querySelector('.hero-slider__viewport');
  const isProjectSlider = slider.classList.contains('project-slider');

  const dots = slides.map((_, index) => {
    const dot = document.createElement('span');
    dot.className = `hero-slider__dot${index === 0 ? ' is-active' : ''}`;
    dotsWrap?.appendChild(dot);
    return dot;
  });

  let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  const visibleSlides = () => {
    if (!isProjectSlider) return 1;
    if (window.matchMedia('(max-width: 560px)').matches) return 1;
    if (window.matchMedia('(max-width: 1060px)').matches) return 2;
    return 3;
  };

  const moveTrack = () => {
    if (!isProjectSlider || !viewport) return;
    const firstSlide = slides[0];
    const secondSlide = slides[1];
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const gap = secondSlide
      ? secondSlide.getBoundingClientRect().left - firstSlide.getBoundingClientRect().right
      : 0;
    viewport.style.transform = `translateX(-${activeIndex * (slideWidth + gap)}px)`;
  };

  const showSlide = (nextIndex) => {
    slides[activeIndex].classList.remove('is-active');
    dots[activeIndex]?.classList.remove('is-active');
    activeIndex = nextIndex;
    slides[activeIndex].classList.add('is-active');
    dots[activeIndex]?.classList.add('is-active');
    moveTrack();
  };

  moveTrack();

  window.setInterval(() => {
    const maxIndex = Math.max(0, slides.length - visibleSlides());
    showSlide(activeIndex >= maxIndex ? 0 : activeIndex + 1);
  }, 2000);

  window.addEventListener('resize', () => {
    activeIndex = Math.min(activeIndex, Math.max(0, slides.length - visibleSlides()));
    moveTrack();
  });
});
