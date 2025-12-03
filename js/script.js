// ------------------------------
// UTILS - SAFE QUERY & EVENT
// ------------------------------
function $(id) {
  return document.getElementById(id);
}

function on(el, event, fn) {
  if (el) el.addEventListener(event, fn);
}

// ------------------------------
// ALL SCRIPT INSIDE DOM LOADED
// ------------------------------
document.addEventListener("DOMContentLoaded", async () => {

  //Retreive step2
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("step") === "2") {
    showStep(2);
}

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
  // MOBILE MENU TOGGLE
  // ==============================
  on($("hamburger"), "click", () => {
    const mobileMenu = $("mobile-menu");
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("max-h-0");
    mobileMenu.classList.toggle("max-h-screen");
  });

  // Close mobile menu on link click
  document.querySelectorAll("#mobile-menu a").forEach(link => {
    on(link, "click", () => {
      const mobileMenu = $("mobile-menu");
      if (!mobileMenu) return;
      mobileMenu.classList.add("max-h-0");
      mobileMenu.classList.remove("max-h-screen");
    });
  });

  // ==============================
  // GENERAL SLIDER FUNCTION
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
  // ACADEMY STEPS & PIN
  // ==============================
  const LS_STEP = "academyCurrentStep";
  const LS_FORM_FILLED_AT = "academyFormFilledAt";
  const LS_FORM_OPENED = "academyFormOpened";
  const PROOF_DELAY_MS = 60 * 1000;
  const PIN_API_URL = "https://tess.tessysbeautyy.workers.dev/pin";
  let MASTER_PIN = null;

  async function fetchMasterPin() {
    try {
      const res = await fetch(PIN_API_URL, { method: "GET", headers: { "x-api-key": "admin2025_secret_key" }, cache: "no-cache" });
      if (!res.ok) { console.error(await res.text()); return; }
      const data = await res.json();
      MASTER_PIN = data?.pin ?? null;
    } catch(err) { console.error("Erreur fetch PIN:", err); }
  }

  await fetchMasterPin();

  const btnValidate = $("pin-validate");
  const inputEl = $("pin-input");
  const classroomLink = $("classroom-link");
  const msgEl = $("pin-msg");

  function showMessage(msg, type="info") {
    if (!msgEl) return;
    msgEl.textContent = msg;
    msgEl.className = "";
    msgEl.classList.add(type === "error" ? "text-red-500" : type === "success" ? "text-green-500" : "text-gray-600");
  }

  on(btnValidate, "click", () => {
    const userPin = inputEl?.value.trim();
    if (!userPin) return showMessage("Veuillez entrer le PIN", "error");
    if (MASTER_PIN && userPin === String(MASTER_PIN)) {
      showMessage("Code PIN valide ✅", "success");
      classroomLink?.classList.remove("hidden");
      localStorage.setItem("academyAccessGranted", "1");
    } else showMessage("Code PIN invalide ❌", "error");
  });

  if (localStorage.getItem("academyAccessGranted") === "1") {
    classroomLink?.classList.remove("hidden");
    showMessage("Accès déjà autorisé.", "success");
  }

  
function showStep(step) {
  document.querySelectorAll(".step").forEach(el => el.classList.add("hidden"));
  document.getElementById("step" + step).classList.remove("hidden");
}

/* Auto-open correct step if redirected from GAS */
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("step") === "2") {
  showStep(2);
} else {
  showStep(1); // default
}

/* Step Navigation Buttons */
document.getElementById("step2-next")?.addEventListener("click", () => showStep(3));
document.getElementById("step3-next")?.addEventListener("click", () => showStep(4));

document.getElementById("step2-prev")?.addEventListener("click", () => showStep(1));
document.getElementById("step3-prev")?.addEventListener("click", () => showStep(2));
document.getElementById("step4-prev")?.addEventListener("click", () => showStep(3));

  $("step-5")?.classList.remove("hidden");

  // Fix WhatsApp links
  const contactBtn = document.querySelector('#contact a[href*="wa.me"]');
  if (contactBtn) contactBtn.href = "https://wa.me/50939310139";

});

//Forms Script

 console.log("Données envoyées:", formData); // debug nan console

  

