// ------------------------------
// UTILS - SAFE QUERY & EVENT
// ------------------------------
function $(id) { return document.getElementById(id); }
function on(el, event, fn) { if (el) el.addEventListener(event, fn); }

document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // HEADER HIDE/SHOW ON SCROLL
  // ==============================
  let lastScrollY = window.scrollY;
  const header = $("man-header");
  window.addEventListener("scroll", () => {
    if (!header) return;
    header.style.transform = window.scrollY > lastScrollY ? "translateY(-100%)" : "translateY(0)";
    lastScrollY = window.scrollY;
  });

 // ==============================
// MOBILE MENU TOGGLE (AUTO-HIDE)
// ==============================
const hamburger = $("hamburger");
const mobileMenu = $("mobile-menu");

function openMenu() {
  mobileMenu.classList.remove("max-h-0");
  mobileMenu.classList.add("max-h-screen");
}

function closeMenu() {
  mobileMenu.classList.add("max-h-0");
  mobileMenu.classList.remove("max-h-screen");
}

on(hamburger, "click", () => {
  if (!mobileMenu) return;

  const isOpen = !mobileMenu.classList.contains("max-h-0");
  isOpen ? closeMenu() : openMenu();
});

// Auto-close when clicking a menu link
document.querySelectorAll("#mobile-menu a").forEach(link => {
  on(link, "click", closeMenu);
});


  // ==============================
  // GENERAL SLIDER FUNCTIONS
  // ==============================
  function initSlider(containerId, prevId, nextId, counterId, intervalTime = 5000) {
    const container = $(containerId);
    if (!container) return;
    const slides = container.querySelectorAll(".slide");
    if (slides.length <= 1) return;

    const prevBtn = $(prevId);
    const nextBtn = $(nextId);
    const counter = $(counterId);
    let current = 0;
    let interval;

    function updateSlidePosition() {
      const slideWidth = slides[0].offsetWidth;
      container.style.transform = `translateX(-${current * slideWidth}px)`;
      if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    }

    function nextSlide() { current = (current + 1) % slides.length; updateSlidePosition(); }
    function prevSlide() { current = (current - 1 + slides.length) % slides.length; updateSlidePosition(); }
    function startAutoplay() { interval = setInterval(nextSlide, intervalTime); }
    function resetAutoplay() { clearInterval(interval); startAutoplay(); }

    on(nextBtn, "click", () => { nextSlide(); resetAutoplay(); });
    on(prevBtn, "click", () => { prevSlide(); resetAutoplay(); });
    window.addEventListener("resize", updateSlidePosition);

    updateSlidePosition();
    startAutoplay();
  }

  function initFadeSlider(containerId, prevId, nextId, counterId, intervalTime = 5000) {
    const container = $(containerId);
    if (!container) return;
    const slides = container.querySelectorAll(".slide");
    if (slides.length <= 1) return;

    const prevBtn = $(prevId);
    const nextBtn = $(nextId);
    const counter = $(counterId);
    let current = 0;
    let interval;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("opacity-100", i === index);
        slide.classList.toggle("opacity-0", i !== index);
        slide.style.zIndex = i === index ? "1" : "0";
      });
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
    }

    function nextSlide() { current = (current + 1) % slides.length; showSlide(current); }
    function prevSlide() { current = (current - 1 + slides.length) % slides.length; showSlide(current); }
    function startAutoplay() { interval = setInterval(nextSlide, intervalTime); }
    function resetAutoplay() { clearInterval(interval); startAutoplay(); }

    on(nextBtn, "click", () => { nextSlide(); resetAutoplay(); });
    on(prevBtn, "click", () => { prevSlide(); resetAutoplay(); });

    showSlide(current);
    startAutoplay();
  }

  // ==============================
  // INIT SLIDERS
  // ==============================
  initSlider("slides-container", "prev", "next", "counter");
  initFadeSlider("legalite-slides-container", "legalite-prev", "legalite-next", "legalite-counter");

  // ==============================
  // FORMATS SLIDER
  // ==============================
  const formatSlides = document.querySelectorAll("#formats-slides .format-slide");
  const prevFormat = $("formats-prev");
  const nextFormat = $("formats-next");
  const formatCounter = $("formats-counter");
  let formatIndex = 0;
  const formatTotal = formatSlides.length;

  function showFormatSlide(i) {
    formatSlides.forEach((slide, idx) => slide.style.opacity = idx === i ? "1" : "0");
    if (formatCounter) formatCounter.textContent = `${i + 1} / ${formatTotal}`;
  }

  on(nextFormat, "click", () => { formatIndex = (formatIndex + 1) % formatTotal; showFormatSlide(formatIndex); });
  on(prevFormat, "click", () => { formatIndex = (formatIndex - 1 + formatTotal) % formatTotal; showFormatSlide(formatIndex); });

  setInterval(() => { formatIndex = (formatIndex + 1) % formatTotal; showFormatSlide(formatIndex); }, 6000);
  showFormatSlide(formatIndex);

  // ==============================
  // FIX WHATSAPP LINK
  // ==============================
  const contactBtn = document.querySelector('#contact a[href*="wa.me"]');
  if (contactBtn) contactBtn.href = "https://wa.me/50939310139";

});
