
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const dropdown = document.querySelector('.nav-dropdown');
const dropdownButton = document.querySelector('.nav-dropdown > button');
const dropdownMenu = document.querySelector('.nav-dropdown__menu');

const setDropdownScroll = () => {
  if (!dropdownMenu) return;
  const menuTop = dropdownMenu.getBoundingClientRect().top;
  const availableHeight = window.innerHeight - menuTop - 16;
  const maxHeight = Math.max(180, availableHeight);
  dropdownMenu.style.maxHeight = `${maxHeight}px`;
  dropdownMenu.style.overflowY = dropdownMenu.scrollHeight > maxHeight ? 'auto' : '';
};

const resetDropdownScroll = () => {
  if (!dropdownMenu) return;
  dropdownMenu.scrollTop = 0;
  dropdownMenu.style.maxHeight = '';
  dropdownMenu.style.overflowY = '';
};

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('is-open');
    if (!expanded) setDropdownScroll();
  });
}

if (dropdownButton && dropdown) {
  dropdownButton.addEventListener('click', () => {
    const expanded = dropdownButton.getAttribute('aria-expanded') === 'true';
    dropdownButton.setAttribute('aria-expanded', String(!expanded));
    dropdown.classList.toggle('is-open');
    if (expanded) {
      resetDropdownScroll();
    } else {
      requestAnimationFrame(setDropdownScroll);
    }
  });
}

if (dropdown && dropdownMenu) {
  dropdown.addEventListener('mouseenter', setDropdownScroll);
  dropdown.addEventListener('focusin', setDropdownScroll);
  dropdown.addEventListener('mouseleave', () => {
    if (!dropdown.classList.contains('is-open')) resetDropdownScroll();
  });
}

document.addEventListener('click', (event) => {
  if (siteNav && navToggle && !siteNav.contains(event.target) && !navToggle.contains(event.target)) {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (dropdown) dropdown.classList.remove('is-open');
    if (dropdownButton) dropdownButton.setAttribute('aria-expanded', 'false');
    resetDropdownScroll();
  }
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.classList.remove('is-open');
    if (dropdownButton) dropdownButton.setAttribute('aria-expanded', 'false');
    resetDropdownScroll();
  }
});

window.addEventListener('resize', () => {
  if (dropdown?.matches(':hover') || dropdown?.classList.contains('is-open')) {
    setDropdownScroll();
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
