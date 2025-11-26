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
  // REVIEWS SYSTEM
  // ==============================
  const API_URL = "https://script.google.com/macros/s/AKfycbwQf-_JdtupPMOe6DBVu-hzfCcPHuRVo9P6zUS6fkbVKy0Op2PqrS9O1pghBXPOVGBf/exec";
  let selectedRating = 0;

  const openBtn = $("open-review-form");
  const closeBtn = $("close-popup");
  const popup = $("review-popup");
  const form = $("review-form");
  const reviewsList = $("reviews-list");
  const stars = document.querySelectorAll("#rating-stars span");
  const imageInput = $("review-image");

  on(openBtn, "click", () => popup?.classList.remove("hidden", "opacity-0"));
  on(closeBtn, "click", () => popup?.classList.add("hidden"));

  stars.forEach(star => on(star, "click", () => {
    selectedRating = parseInt(star.dataset.value);
    stars.forEach(s => s.classList.toggle("text-yellow-400", s.dataset.value <= selectedRating));
  }));

  async function loadReviews() {
    if (!reviewsList) return;
    reviewsList.innerHTML = "<p class='text-center col-span-2 text-gray-500'>Chargement...</p>";
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (!data || data.length === 0) {
        reviewsList.innerHTML = "<p class='text-center col-span-2 text-gray-500'>Aucun avis pour le moment. Soyez le premier !</p>";
        return;
      }
      reviewsList.innerHTML = data.reverse().map(r => `
        <div class="bg-white/70 rounded-xl p-4 shadow-md flex flex-col items-center text-center">
          ${r.image ? `<img src="${r.image}" alt="photo" class="w-full h-48 object-cover rounded-lg mb-3">` : ""}
          <p class="text-yellow-400 text-lg">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</p>
          <p class="italic text-gray-800 mb-2">"${r.message}"</p>
          <p class="font-semibold text-gray-700">– ${r.name}</p>
        </div>
      `).join("");
    } catch (e) {
      reviewsList.innerHTML = "<p class='text-center text-red-500'>Erreur de chargement des avis.</p>";
    }
  }

  on(form, "submit", async e => {
    e.preventDefault();
    if (!form) return;
    if (!selectedRating) return alert("Merci de sélectionner une note ⭐");

    const name = $("review-name")?.value.trim() || "";
    const message = $("review-message")?.value.trim() || "";
    const file = imageInput?.files[0];

    if (!name || !message) return alert("Veuillez remplir tous les champs.");

    let imageBase64 = "";
    if (file && file.size <= 4 * 1024 * 1024) {
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else if (file) return alert("L’image dépasse 4 MB. Veuillez choisir une image plus légère.");

    const reviewData = { name, message, rating: selectedRating, image: imageBase64 };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
      });
      form.reset();
      popup?.classList.add("hidden");
      selectedRating = 0;
      stars.forEach(s => s.classList.remove("text-yellow-400"));
      loadReviews();
    } catch (e) { alert("Erreur d’envoi. Réessayez plus tard."); }
  });

  loadReviews();

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

  

