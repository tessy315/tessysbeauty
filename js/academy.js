// ------------------------------
// ACADEMY: STEPS, PIN & ACCESS
// ------------------------------
function $(id) { return document.getElementById(id); }
function on(el, event, fn) { if (el) el.addEventListener(event, fn); }

document.addEventListener("DOMContentLoaded", async () => {

  // -----------------------------
  // NAVIGATION ETAP
  // -----------------------------
  function showStep(step) {
    document.querySelectorAll(".step").forEach(el => el.classList.add("hidden"));
    const el = $("step-" + step);
    if (el) el.classList.remove("hidden");
  }

  // Ouvrir step selon URL ou localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const stepParam = urlParams.get("step");
  let initialStep = 1;

  if (stepParam === "2" || localStorage.getItem("formSubmitted") === "1") {
    initialStep = 2; // step2 si URL ?step=2 oswa fòm te deja soumèt
  }

  showStep(initialStep);

  // -----------------------------
  // Step buttons
  // -----------------------------
  on($("step2-next"), "click", () => showStep(3));
  on($("proof-next"), "click", () => showStep(4));
  on($("step2-prev"), "click", () => showStep(1));
  on($("step3-prev"), "click", () => showStep(2));
  on($("step4-prev"), "click", () => showStep(3));

  // Step 5 toujou montre
  $("step-5")?.classList.remove("hidden");

  // -----------------------------
  // STEP3: Soumettre preuve de paiement
  // -----------------------------
  const proofNextBtn = $("proof-next");
  const proofBtn = $("proof-btn");

  function setProofNextState(enabled) {
    if (!proofNextBtn) return;
    proofNextBtn.disabled = !enabled;
    proofNextBtn.classList.toggle("cursor-not-allowed", !enabled);
    proofNextBtn.classList.toggle("bg-pink-600", enabled);
    proofNextBtn.classList.toggle("bg-gray-300", !enabled);
    proofNextBtn.classList.toggle("text-white", enabled);
    proofNextBtn.classList.toggle("text-gray-600", !enabled);
  }

  // Aktive bouton proof-next sèlman si form te soumèt
  const isFormSubmitted = localStorage.getItem("formSubmitted") === "1";
  setProofNextState(isFormSubmitted);

  // Bouton proof pou ouvri form nan
  on($("open-form-btn"), "click", () => {
    window.open("https://www.tessysbeauty.com/formulaire", "_blank");
  });

  on(proofBtn, "click", () => {
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
