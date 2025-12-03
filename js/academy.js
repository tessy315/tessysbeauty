// ------------------------------
// ACADEMY: STEPS, PIN & ACCESS
// ------------------------------
function $(id) { return document.getElementById(id); }
function on(el, event, fn) { if(el) el.addEventListener(event, fn); }

document.addEventListener("DOMContentLoaded", async () => {

  // -----------------------------
  // NAVIGATION ETAP & PROGRESS
  // -----------------------------
  const progressBar = $("progress-bar");
  function updateProgress(step){
    if(!progressBar) return;
    const percent = step === 1 ? 16.66
                  : step === 2 ? 33.33
                  : step === 3 ? 66.66
                  : step === 4 ? 100 : 0;
    progressBar.style.width = percent + "%";
  }

  function showStep(step) {
    document.querySelectorAll(".step").forEach(el => el.classList.add("hidden"));
    const el = $("step-" + step);
    if(el) el.classList.remove("hidden");
    updateProgress(step);
  }

  // Ouvrir step selon URL ou localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const stepParam = urlParams.get("step");
  let initialStep = 1;
  if(stepParam==="2" || localStorage.getItem("formSubmitted")==="1") initialStep=2;
  showStep(initialStep);

  // -----------------------------
  // Step buttons
  // -----------------------------
  on($("step2-next"), "click", ()=> showStep(3));
  on($("proof-next"), "click", ()=> {
    const isFormSubmitted = localStorage.getItem("formSubmitted")==="1";
    if(isFormSubmitted) showStep(4);
    else alert("Veuillez remplir le formulaire d'inscription d'abord, puis effectuer votre paiement et revenir à cette étape aussitôt après.");
  });

  on($("step2-prev"), "click", ()=> showStep(1));
  on($("step3-prev"), "click", ()=> showStep(2));
  on($("step4-prev"), "click", ()=> showStep(3));

  // Step 5 toujours visible
  $("step-5")?.classList.remove("hidden");

  // -----------------------------
  // STEP3: Soumettre preuve de paiement
  // -----------------------------
  const proofNextBtn = $("proof-next");
  const proofBtn = $("proof-btn");

  function setProofNextState(enabled){
    if(!proofNextBtn) return;
    proofNextBtn.disabled = !enabled;
    proofNextBtn.classList.toggle("cursor-not-allowed", !enabled);
    proofNextBtn.classList.toggle("bg-pink-600", enabled);
    proofNextBtn.classList.toggle("bg-gray-300", !enabled);
    proofNextBtn.classList.toggle("text-white", enabled);
    proofNextBtn.classList.toggle("text-gray-600", !enabled);
  }

  const isFormSubmitted = localStorage.getItem("formSubmitted")==="1";
  setProofNextState(isFormSubmitted);

  // proofBtn ouvè toujou WhatsApp
  if(proofBtn) {
    proofBtn.setAttribute("href", "https://wa.me/50939310139");
    proofBtn.setAttribute("target", "_blank");
    proofBtn.setAttribute("rel", "noopener noreferrer");
    proofBtn.classList.remove("cursor-not-allowed");
    proofBtn.classList.remove("bg-gray-300");
    proofBtn.classList.add("bg-gray-300"); // style selon design
  }

  // open form bouton
  on($("open-form-btn"), "click", ()=> {
    window.open("https://www.tessysbeauty.com/formulaire", "_blank");
  });

  // -----------------------------
  // PIN & ACCESS (step4)
  // -----------------------------
  const PIN_API_URL = "https://tess.tessysbeautyy.workers.dev/pin";
  let MASTER_PIN = null;

  async function fetchMasterPin(){
    try{
      const res = await fetch(PIN_API_URL, {
        method:"GET",
        headers:{ "x-api-key":"admin2025_secret_key" },
        cache:"no-cache"
      });
      if(!res.ok){ console.error(await res.text()); return; }
      const data = await res.json();
      MASTER_PIN = data?.pin ?? null;
    }catch(err){ console.error("Erreur fetch PIN:", err);}
  }
  await fetchMasterPin();

  const btnValidate = $("pin-validate");
  const inputEl = $("pin-input");
  const classroomLink = $("classroom-link");
  const msgEl = $("pin-msg");

  function showMessage(msg, type="info"){
    if(!msgEl) return;
    msgEl.textContent = msg;
    msgEl.className = "";
    msgEl.classList.add(type==="error"?"text-red-500":type==="success"?"text-green-500":"text-gray-600");
  }

  on(btnValidate, "click", ()=>{
    const userPin = inputEl?.value.trim();
    if(!userPin) return showMessage("Veuillez entrer le PIN","error");
    if(MASTER_PIN && userPin===String(MASTER_PIN)){
      showMessage("Code PIN valide ✅","success");
      classroomLink?.classList.remove("hidden");
      localStorage.setItem("academyAccessGranted","1");
    } else showMessage("Code PIN invalide ❌","error");
  });

  if(localStorage.getItem("academyAccessGranted")==="1"){
    classroomLink?.classList.remove("hidden");
    showMessage("Accès déjà autorisé.","success");
  }

  // -----------------------------
  // REVIEWS (optionnel)
  // -----------------------------
  const reviewForm = $("review-form");
  if(reviewForm){
    reviewForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      alert("Formulaire soumis ✅");
      reviewForm.reset();
      $("review-popup")?.classList.add("hidden");
    });
  }
  on($("open-review-form"), "click", ()=> $("review-popup")?.classList.remove("hidden"));
  on($("close-popup"), "click", ()=> $("review-popup")?.classList.add("hidden"));

});
