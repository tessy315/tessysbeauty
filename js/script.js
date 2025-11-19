// Hide header on scroll down, show on scroll up
let lastScrollY = window.scrollY;
const header = document.getElementById("man-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    // scrolling down
    header.style.transform = "translateY(-100%)";
  } else {
    // scrolling up
    header.style.transform = "translateY(0)";
  }
  lastScrollY = window.scrollY;
});

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("max-h-0");
  mobileMenu.classList.toggle("max-h-screen"); // Tailwind utility pou max height total
});

// Fèmen menu otomatik lè yo klike sou yon lyen
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("max-h-0");
    mobileMenu.classList.remove("max-h-screen");
  });
});

// ------------------------------
// Fonksyon jeneral pou slider
// ------------------------------
function initSlider(
  containerId,
  prevId,
  nextId,
  counterId,
  intervalTime = 5000
) {
  const container = document.getElementById(containerId);
  const slides = container.querySelectorAll(".slide");
  if (slides.length <= 1) return; // si gen 0 oswa 1 slide, pa fè anyen

  const totalSlides = slides.length;
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const counter = document.getElementById(counterId);
  let current = 0;
  let interval;

  function updateSlidePosition() {
    const slideWidth = slides[0].offsetWidth;
    container.style.transform = `translateX(-${current * slideWidth}px)`;
    counter.textContent = `${current + 1} / ${totalSlides}`;
  }

  function nextSlide() {
    current = (current + 1) % totalSlides;
    updateSlidePosition();
  }

  function prevSlide() {
    current = (current - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, intervalTime);
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  // Evenement bouton
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });
  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  // Ajiste slide lè window resize
  window.addEventListener("resize", updateSlidePosition);

  // Initial position & autoplay
  updateSlidePosition();
  startAutoplay();
}

// ------------------------------
// Inisyalizasyon chak slider
// ------------------------------

// Services Slider
initSlider(
  "slides-container", // container
  "prev", // bouton prev
  "next", // bouton next
  "counter" // counter
);
function initFadeSlider(
  containerId,
  prevId,
  nextId,
  counterId,
  intervalTime = 5000
) {
  const container = document.getElementById(containerId);
  const slides = container.querySelectorAll(".slide");
  if (slides.length <= 1) return;

  const totalSlides = slides.length;
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const counter = document.getElementById(counterId);
  let current = 0;
  let interval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("opacity-100", i === index);
      slide.classList.toggle("opacity-0", i !== index);
      slide.style.zIndex = i === index ? "1" : "0";
    });
    counter.textContent = `${index + 1} / ${totalSlides}`;
  }

  function nextSlide() {
    current = (current + 1) % totalSlides;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + totalSlides) % totalSlides;
    showSlide(current);
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, intervalTime);
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });
  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  showSlide(current);
  startAutoplay();
}

// A propos Slider
initFadeSlider(
  "legalite-slides-container",
  "legalite-prev",
  "legalite-next",
  "legalite-counter"
);

const API_URL =
  "https://script.google.com/macros/s/AKfycbxhPd5hfU-lmxTKxk5lPCev4ZYXfS7AkyCO5GsbMHPb9ETMhPmZfgj8-dct28xoPtbH/exec";

// --- DOM Elements
let selectedRating = 0;
const openBtn = document.getElementById("open-review-form");
const closeBtn = document.getElementById("close-popup");
const popup = document.getElementById("review-popup");
const form = document.getElementById("review-form");
const reviewsList = document.getElementById("reviews-list");
const stars = document.querySelectorAll("#rating-stars span");
const imageInput = document.getElementById("review-image");

// --- Show/Hide Popup
openBtn.addEventListener("click", () =>
  popup.classList.remove("hidden", "opacity-0")
);
closeBtn.addEventListener("click", () => popup.classList.add("hidden"));

// --- Rating system
stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    stars.forEach((s) =>
      s.classList.toggle("text-yellow-400", s.dataset.value <= selectedRating)
    );
  });
});

// --- Load all reviews
async function loadReviews() {
  reviewsList.innerHTML =
    "<p class='text-center col-span-2 text-gray-500'>Chargement...</p>";
  try {
    // Fetch reviews
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data || data.length === 0) {
      reviewsList.innerHTML =
        "<p class='text-center col-span-2 text-gray-500'>Aucun avis pour le moment. Soyez le premier !</p>";
      return;
    }

    reviewsList.innerHTML = data
      .reverse()
      .map(
        (r) => `
      <div class="bg-white/70 rounded-xl p-4 shadow-md flex flex-col items-center text-center">
        ${
          r.image
            ? `<img src="${r.image}" alt="photo" class="w-full h-48 object-cover rounded-lg mb-3">`
            : ""
        }
        <p class="text-yellow-400 text-lg">${"★".repeat(r.rating)}${"☆".repeat(
          5 - r.rating
        )}</p>
        <p class="italic text-gray-800 mb-2">"${r.message}"</p>
        <p class="font-semibold text-gray-700">– ${r.name}</p>
      </div>
    `
      )
      .join("");
  } catch (e) {
    reviewsList.innerHTML =
      "<p class='text-center text-red-500'>Erreur de chargement des avis.</p>";
  }
}

// --- Save new review
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedRating) return alert("Merci de sélectionner une note ⭐");

  const name = document.getElementById("review-name").value.trim();
  const message = document.getElementById("review-message").value.trim();
  const file = imageInput.files[0];

  if (!name || !message) return alert("Veuillez remplir tous les champs.");

  let imageBase64 = "";
  if (file && file.size <= 4 * 1024 * 1024) {
    imageBase64 = await toBase64(file);
  } else if (file) {
    return alert(
      "L’image dépasse 4 MB. Veuillez choisir une image plus légère."
    );
  }

  const reviewData = { name, message, rating: selectedRating, image: imageBase64 };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    // Reset form + UI
    form.reset();
    popup.classList.add("hidden");
    selectedRating = 0;
    stars.forEach((s) => s.classList.remove("text-yellow-400"));

    loadReviews(); // reload reviews
  } catch (e) {
    alert("Erreur d’envoi. Réessayez plus tard.");
  }
});

// --- Convert image → base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Initial Load
loadReviews();


// === Formats de Cours Fade Slider ===

const formatSlides = document.querySelectorAll("#formats-slides .format-slide");
const prevFormat = document.getElementById("formats-prev");
const nextFormat = document.getElementById("formats-next");
const formatCounter = document.getElementById("formats-counter");

let formatIndex = 0;
const formatTotal = formatSlides.length;

function showFormatSlide(i) {
  formatSlides.forEach((slide, idx) => {
    slide.style.opacity = idx === i ? "1" : "0";
  });
  formatCounter.textContent = `${i + 1} / ${formatTotal}`;
}

nextFormat.addEventListener("click", () => {
  formatIndex = (formatIndex + 1) % formatTotal;
  showFormatSlide(formatIndex);
});

prevFormat.addEventListener("click", () => {
  formatIndex = (formatIndex - 1 + formatTotal) % formatTotal;
  showFormatSlide(formatIndex);
});

// Auto transition chak 6s
setInterval(() => {
  formatIndex = (formatIndex + 1) % formatTotal;
  showFormatSlide(formatIndex);
}, 6000);

// Montre premye slide a
showFormatSlide(formatIndex);

const LS_STEP = "academyCurrentStep";
const LS_FORM_FILLED_AT = "academyFormFilledAt";
const LS_FORM_OPENED = "academyFormOpened"; // Flag si moun nan ouvri form nan
const PROOF_DELAY_MS = 60 * 1000; // 120 secondes

// === ADMIN : GET MASTER PIN FROM CLOUDFLARE ===
(() => {
  const PIN_API_URL = "https://tess.tessysbeautyy.workers.dev/pin";
  const btnValidate = document.getElementById("pin-validate");
  const inputEl = document.getElementById("pin-input");
  const msgEl = document.getElementById("pin-msg");
  const classroomLink = document.getElementById("classroom-link");

  let MASTER_PIN = null; // cache PIN lokalman

  function showMessage(text, type = "info") {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.classList.remove("text-red-500", "text-green-500", "text-gray-600");
    if (type === "error") msgEl.classList.add("text-red-500");
    else if (type === "success") msgEl.classList.add("text-green-500");
    else msgEl.classList.add("text-gray-600");
  }

  async function fetchMasterPin() {
  try {
    const res = await fetch(PIN_API_URL, {
      method: "GET",
      cache: "no-cache",
      headers: { "x-api-key": "admin2025_secret_key" }
    });

    if (!res.ok) {
      console.warn("PIN fetch failed:", res.status);
      return;
    }

    const data = await res.json().catch(() => null);
    console.log("PIN API data:", data); // 🔍 Gade sa API a retounen

    // Eseye jwenn PIN a swa nan 'pin' oswa 'masterPin'
    MASTER_PIN = data?.pin ?? data?.masterPin ?? null;

    if (MASTER_PIN) {
      console.log("MASTER_PIN set to:", MASTER_PIN);
    } else {
      console.warn("PIN non disponib nan repons API a.");
    }

  } catch (err) {
    console.error("Erreur lors du fetch PIN:", err);
    }
  }

  async function checkPinWhenClicked() {
    if (!inputEl) return;
    const userPin = inputEl.value.trim();
    if (!userPin) return showMessage("Veuillez entrer le PIN, s'il vous plaît.", "error");

    btnValidate.disabled = true;
    btnValidate.classList?.add("opacity-60", "cursor-not-allowed");
    showMessage("Vérification en cours...");

    try {
      if (!MASTER_PIN) {
        showMessage(
          "PIN non disponible. Vérifiez votre e-mail/WhatsApp et saisissez-le ci-dessous. Si vous ne le recevez pas, contactez l'administrateur.",
          "error"
        );
        return;
      }

      if (userPin === String(MASTER_PIN)) {
        showMessage("Code PIN valide ✅", "success");
        if (classroomLink) classroomLink.classList.remove("hidden");
        localStorage.setItem("academyAccessGranted", "1");
      } else {
        showMessage("Code PIN invalide ❌", "error");
      }
    } catch (err) {
      console.error("Erreur vérification PIN:", err);
      showMessage("Erreur réseau lors de la vérification. Veuillez réessayer.", "error");
    } finally {
      btnValidate.disabled = false;
      btnValidate.classList?.remove("opacity-60", "cursor-not-allowed");
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await fetchMasterPin();

    if (btnValidate) {
      btnValidate.replaceWith(btnValidate.cloneNode(true));
      const newBtn = document.getElementById("pin-validate");
      if (newBtn) newBtn.addEventListener("click", checkPinWhenClicked);
    }

    try {
      if (localStorage.getItem("academyAccessGranted") === "1" && classroomLink) {
        classroomLink.classList.remove("hidden");
        showMessage("Accès déjà autorisé.", "success");
      }
    } catch (e) {}
  });
})();



function showStep(step) {
  const steps = [1, 2, 3, 4];
  steps.forEach((s) =>
    document.getElementById("step-" + s)?.classList.add("hidden")
  );
  document.getElementById("step-" + step)?.classList.remove("hidden");
  document.getElementById("progress-bar").style.width =
    (step / steps.length) * 100 + "%";
  localStorage.setItem(LS_STEP, step);
}

function restoreState() {
  const step = parseInt(localStorage.getItem(LS_STEP) || "1", 10);
  showStep(step);

  const ts = Number(localStorage.getItem(LS_FORM_FILLED_AT) || 0);
  if (ts) {
    const elapsed = Date.now() - ts;
    if (elapsed >= PROOF_DELAY_MS) activateProof();
    else setTimeout(activateProof, PROOF_DELAY_MS - elapsed);
  }



  // restore bouton "J’ai terminé le formulaire"
  const confirmBtn = document.getElementById("confirm-form-btn");
  const opened = localStorage.getItem(LS_FORM_OPENED) === "1";
}

function activateProof() {
  const proofBtn = document.getElementById("proof-btn");
  const proofNext = document.getElementById("proof-next");

  if (proofBtn) {
    proofBtn.classList.remove(
      "cursor-not-allowed",
      "bg-gray-300",
      "text-gray-600"
    );
    proofBtn.classList.add("bg-green-500", "text-white");
    proofBtn.disabled = false;

    proofBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open("https://wa.me/50939310139", "_blank", "noopener,noreferrer");
    });
  }

  if (proofNext) {
    proofNext.disabled = false;
    proofNext.classList.remove("cursor-not-allowed", "bg-gray-300");
    proofNext.classList.add("bg-pink-600", "text-white");
  }

  const helper = document.getElementById("proof-helper");
  if (helper)
    helper.textContent =
      "Bouton activé ✅ — envoyez votre preuve sur WhatsApp puis cliquez sur 'Étape suivante'.";
}

document.addEventListener("DOMContentLoaded", () => {
  restoreState();

  const home = document.getElementById("home");
  const academy = document.getElementById("academy");

  // WhatsApp toujou ouvri deyo CodePen
  const contactBtn = document.querySelector('#contact a[href*="wa.me"]');
  if (contactBtn) contactBtn.href = "https://wa.me/50939310139";

  // “Services” bouton
  document.querySelectorAll('a[href="#services"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      academy.classList.add("hidden");
      home.classList.remove("hidden");
      window.scrollTo({
        top: document.getElementById("services").offsetTop,
        behavior: "smooth"
      });
    });
  });

  document.getElementById("to-academy-btn").addEventListener("click", () => {
    home.classList.add("hidden");
    academy.classList.remove("hidden");
    showStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.getElementById("to-academy-btn-2").addEventListener("click", () => {
    home.classList.add("hidden");
    academy.classList.remove("hidden");
    showStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.getElementById("nav-academy").addEventListener("click", (e) => {
    e.preventDefault();
    home.classList.add("hidden");
    academy.classList.remove("hidden");
    showStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("back-home-btn").addEventListener("click", () => {
    academy.classList.add("hidden");
    home.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Bouton "Ouvrir le formulaire d'inscription"
  const openFormBtn = document.getElementById("open-form-btn");
  const confirmBtn = document.getElementById("confirm-form-btn");

  if (openFormBtn) {
    openFormBtn.addEventListener("click", () => {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLScNXYe30tva_f3BmVvknZaqqfzHT0FCFjQl8TwphTrxOZh3uA/viewform?usp=header",
        "_blank"
      );
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.classList.remove(
          "cursor-not-allowed",
          "bg-gray-300",
          "text-gray-600"
        );
        confirmBtn.classList.add("bg-pink-600", "text-white");
      }
      localStorage.setItem(LS_FORM_OPENED, "1");
    });
  }

  // Bouton "J’ai terminé le formulaire"
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      confirmBtn.disabled = true;
      confirmBtn.classList.add(
        "cursor-not-allowed",
        "bg-gray-300",
        "text-gray-600"
      );
      confirmBtn.classList.remove("bg-pink-600", "text-white");
      localStorage.setItem(LS_FORM_FILLED_AT, Date.now());
      showStep(2);

      const helper = document.getElementById("proof-helper");

      // apati de la, countdown lan kòmanse pou 2 min
      setTimeout(activateProof, PROOF_DELAY_MS);
    });
  }

  // Navigasyon
  document
    .getElementById("step2-prev")
    .addEventListener("click", () => showStep(1));
  document
    .getElementById("step2-next")
    .addEventListener("click", () => showStep(3));
  document
    .getElementById("step3-prev")
    .addEventListener("click", () => showStep(2));
  document
    .getElementById("proof-next")
    .addEventListener("click", () => showStep(4));
  document
    .getElementById("step4-prev")
    .addEventListener("click", () => showStep(3));

  

  const step5 = document.getElementById("step-5");
  if (step5) step5.classList.remove("hidden");
});
