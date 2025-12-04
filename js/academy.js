// ----------------------------------------
// ACADEMY.JS 
// ----------------------------------------

function $(id) { return document.getElementById(id); }
function on(el, event, fn) { if (el) el.addEventListener(event, fn); }

document.addEventListener("DOMContentLoaded", async () => {

  // ----------------------------------------
  // SYSTEME ETAP + PROGRESS BAR
  // ----------------------------------------
  const steps = ["step-1", "step-2", "step-3", "step-4"];
  const progressBar = $("progress-bar");

  function showStep(step) {
    steps.forEach((id, index) => {
      const el = $(id);
      if (!el) return;

      if (index + 1 === step) {
        el.classList.remove("hidden");     // montre ETAP la
      } else {
        el.classList.add("hidden");        // kache lòt yo
      }
    });

    // MAJ PROGRESS BAR
    const percent =
      step === 1 ? 16.66 :
      step === 2 ? 33.33 :
      step === 3 ? 66.66 :
      step === 4 ? 100 : 0;

    if (progressBar) progressBar.style.width = percent + "%";
  }

  // ETAP INISYAL SUIVAN URL + FORM SUBMIT
  let startStep = 1;
  const urlParams = new URLSearchParams(window.location.search);
  const stepParam = urlParams.get("step");

  if (stepParam === "2" || localStorage.getItem("formSubmitted") === "1") {
    startStep = 2;
  }

  showStep(startStep);


  // ----------------------------------------
  // NAVIGATION — BOUTON PRECEDENT / SUIVANT
  // ----------------------------------------
  on($("step2-prev"), "click", () => showStep(1));
  on($("step2-next"), "click", () => showStep(3));
  on($("step3-prev"), "click", () => showStep(2));
  on($("step3-next"), "click", () => showStep(4));
  on($("step4-prev"), "click", () => showStep(3));


  // ----------------------------------------
  // STEP 1 — OUVRIR FORMULAIRE
  // ----------------------------------------
  const openFormBtn = $("open-form-btn");
  if (openFormBtn) {
    on($("open-form-btn"), "click", () => {
  window.location.href = "https://www.tessysbeauty.com/formulaire";
});
  }


  // ----------------------------------------
  // STEP 3 — PROOF PAIEMENT (Always Active)
  // ----------------------------------------
  const proofBtn = $("proof-btn");
  const step3Next = $("step3-next");

  if (proofBtn) {
    proofBtn.classList.remove("cursor-not-allowed", "bg-gray-300", "text-gray-600");
    proofBtn.classList.add("bg-green-600", "text-white", "cursor-pointer");

    on(proofBtn, "click", () => {
      window.open("https://wa.me/50939310139", "_blank");
    });
  }

  if (step3Next) {
    step3Next.classList.remove("cursor-not-allowed", "bg-gray-300", "text-gray-600");
    step3Next.classList.add("bg-pink-600", "text-white", "cursor-pointer");
    step3Next.disabled = false;
  }


  // ----------------------------------------
  // STEP 4 — PIN VALIDATION + GOOGLE CLASSROOM
  // ----------------------------------------
  const PIN_API_URL = "https://tess.tessysbeautyy.workers.dev/pin";
  let MASTER_PIN = null;

  async function fetchMasterPin() {
    try {
      const res = await fetch(PIN_API_URL, {
        method: "GET",
        headers: { "x-api-key": "admin2025_secret_key" },
        cache: "no-cache"
      });

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      const data = await res.json();
      MASTER_PIN = data?.pin ?? null;

    } catch (err) {
      console.error("Erreur fetch PIN:", err);
    }
  }
  await fetchMasterPin();

  const btnValidate = $("pin-validate");
  const inputPIN = $("pin-input");
  const classroomLink = $("classroom-link");
  const pinMsg = $("pin-msg");

  function showMessage(msg, type = "info") {
    if (!pinMsg) return;
    pinMsg.textContent = msg;

    pinMsg.className = "";
    pinMsg.classList.add(
      type === "error" ? "text-red-500" :
      type === "success" ? "text-green-500" :
      "text-gray-600"
    );
  }

  on(btnValidate, "click", () => {
    const userPin = inputPIN?.value.trim();
    if (!userPin) return showMessage("Veuillez entrer le PIN", "error");

    if (MASTER_PIN && userPin === String(MASTER_PIN)) {
      showMessage("Code PIN valide ✅", "success");
      classroomLink?.classList.remove("hidden");
      localStorage.setItem("academyAccessGranted", "1");
    } else {
      showMessage("Code PIN invalide ❌", "error");
    }
  });

  // Accès déjà validé
  if (localStorage.getItem("academyAccessGranted") === "1") {
    classroomLink?.classList.remove("hidden");
    showMessage("Accès déjà autorisé.", "success");
  }


  // ----------------------------------------
  // REVIEWS (Optionnel)
  // ----------------------------------------
  const reviewForm = $("review-form");
  if (reviewForm) {
    on(reviewForm, "submit", (e) => {
      e.preventDefault();
      alert("Formulaire soumis ✅");
      reviewForm.reset();
      $("review-popup")?.classList.add("hidden");
    });
  }

  on($("open-review-form"), "click", () => $("review-popup")?.classList.remove("hidden"));
  on($("close-popup"), "click", () => $("review-popup")?.classList.add("hidden"));

});
