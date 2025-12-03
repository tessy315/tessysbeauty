// ------------------------------
// ACADEMY: STEPS, PIN & ACCESS (Slide Horizontal, Always Active Buttons)
// ------------------------------
function $(id) { return document.getElementById(id); }
function on(el, event, fn) { if (el) el.addEventListener(event, fn); }

document.addEventListener("DOMContentLoaded", async () => {

  const steps = Array.from(document.querySelectorAll(".step"));
  const progressBar = $("progress-bar");
  let currentStep = 1;

  // -----------------------------
  // INIT: Mete steps sou pozisyon horizontal
  // -----------------------------
  steps.forEach((stepEl, idx) => {
    stepEl.style.position = "absolute";
    stepEl.style.top = "0";
    stepEl.style.left = "0";
    stepEl.style.width = "100%";
    stepEl.style.transition = "transform 0.5s ease, opacity 0.5s ease";
    stepEl.style.transform = `translateX(${idx * 100}%)`;
  });

  function updateSteps(step) {
    currentStep = step;
    steps.forEach((stepEl, idx) => {
      stepEl.style.transform = `translateX(${(idx - (step-1)) * 100}%)`;
      stepEl.style.opacity = (idx === step-1) ? "1" : "0.6";
      stepEl.style.zIndex = (idx === step-1) ? "10" : "1";
    });

    // Update progress bar
    const percent = step === 1 ? 16.66
                  : step === 2 ? 33.33
                  : step === 3 ? 66.66
                  : step === 4 ? 100 : 0;
    if(progressBar) progressBar.style.width = percent + "%";
  }

  // -----------------------------
  // Ouvrir step selon URL ou localStorage
  // -----------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const stepParam = urlParams.get("step");
  const initialStep = (stepParam === "2" || localStorage.getItem("formSubmitted") === "1") ? 2 : 1;
  updateSteps(initialStep);

  // -----------------------------
  // Boutons "Suivant" & "Précédent"
  // -----------------------------
  on($("step2-next"), "click", () => updateSteps(3));
  on($("proof-next"), "click", () => updateSteps(4));
  on($("step2-prev"), "click", () => updateSteps(1));
  on($("step3-prev"), "click", () => updateSteps(2));
  on($("step4-prev"), "click", () => updateSteps(3));

  // -----------------------------
  // STEP3: Soumettre preuve paiement
  // -----------------------------
  const proofBtn = $("proof-btn");
  const proofNextBtn = $("proof-next");

  if(proofBtn){
    proofBtn.classList.remove("cursor-not-allowed");
    proofBtn.classList.remove("bg-gray-300");
    proofBtn.classList.add("bg-green-600", "text-white");
    on(proofBtn, "click", () => {
      window.open("https://wa.me/50939310139", "_blank");
    });
  }

  if(proofNextBtn){
    proofNextBtn.classList.remove("cursor-not-allowed");
    proofNextBtn.classList.remove("bg-gray-300", "text-gray-600");
    proofNextBtn.classList.add("bg-pink-600", "text-white");
    proofNextBtn.disabled = false;
  }

  // -----------------------------
  // Formulaire (ouvrir form)
  // -----------------------------
  on($("open-form-btn"), "click", () => {
    window.open("https://www.tessysbeauty.com/formulaire", "_blank");
  });

  // -----------------------------
  // PIN & ACCESS
  // -----------------------------
  const PIN_API_URL = "https://tess.tessysbeautyy.workers.dev/pin";
  let MASTER_PIN = null;

  async function fetchMasterPin() {
    try {
      const res = await fetch(PIN_API_URL, {
        method: "GET",
        headers: { "x-api-key": "admin2025_secret_key" },
        cache: "no-cache"
      });
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

  // -----------------------------
  // REVIEWS (optionnel)
  // -----------------------------
  const reviewForm = $("review-form");
  if(reviewForm){
    reviewForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      alert("Formulaire soumis ✅"); // Placeholder pou GAS
      reviewForm.reset();
      $("review-popup")?.classList.add("hidden");
    });
  }
  on($("open-review-form"), "click", () => $("review-popup")?.classList.remove("hidden"));
  on($("close-popup"), "click", () => $("review-popup")?.classList.add("hidden"));

});
