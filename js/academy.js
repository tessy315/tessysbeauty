// ------------------------------
// ACADEMY: STEPS, PIN & ACCESS
// ------------------------------
function $(id) { return document.getElementById(id); }
function on(el, event, fn) { if (el) el.addEventListener(event, fn); }

document.addEventListener("DOMContentLoaded", async () => {

  // -----------------------------
  // NAVIGATION ETAP
  // -----------------------------
  const steps = ["step-1","step-2","step-3","step-4"];
  const progressBar = $("progress-bar");

  function showStep(step) {
    // Maske tout etap
    steps.forEach((id,i)=>{
      const el = $(id);
      if(!el) return;
      if(i+1 === step){
        el.classList.remove("hidden");
        el.classList.add("flex","transition-transform","translate-x-0");
      } else {
        el.classList.add("hidden");
        el.classList.remove("flex","translate-x-0");
      }
    });

    // Update progress bar
    const percent = step === 1 ? 16.66
                  : step === 2 ? 33.33
                  : step === 3 ? 66.66
                  : step === 4 ? 100 : 0;
    if(progressBar) progressBar.style.width = percent + "%";
  }

  // Ouvrir step selon URL ou localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const stepParam = urlParams.get("step");
  let initialStep = 1;
  if(stepParam === "2" || localStorage.getItem("formSubmitted") === "1"){
    initialStep = 2;
  }
  showStep(initialStep);

  // -----------------------------
  // Boutons précédent / suivant
  // -----------------------------
  document.getElementById("step2-prev")?.addEventListener("click",()=>showStep(1));
  document.getElementById("step2-next")?.addEventListener("click",()=>showStep(3));
  document.getElementById("step3-prev")?.addEventListener("click",()=>showStep(2));
  document.getElementById("proof-next")?.addEventListener("click",()=>showStep(4));
  document.getElementById("step4-prev")?.addEventListener("click",()=>showStep(3));

  // -----------------------------
  // STEP3: Soumettre preuve paiement
  // -----------------------------
  const proofBtn = $("proof-btn");
  const proofNextBtn = $("proof-next");

  if(proofBtn){
    proofBtn.classList.remove("cursor-not-allowed","bg-gray-300","text-gray-600");
    proofBtn.classList.add("bg-green-600","text-white");
    on(proofBtn,"click",()=> window.open("https://wa.me/50939310139","_blank"));
  }

  if(proofNextBtn){
    proofNextBtn.classList.remove("cursor-not-allowed","bg-gray-300","text-gray-600");
    proofNextBtn.classList.add("bg-pink-600","text-white");
    proofNextBtn.disabled = false;
  }

  // -----------------------------
  // PIN & ACCESS
  // -----------------------------
  const PIN_API_URL = "https://tess.tessysbeautyy.workers.dev/pin";
  let MASTER_PIN = null;

  async function fetchMasterPin() {
    try{
      const res = await fetch(PIN_API_URL,{
        method:"GET",
        headers:{"x-api-key":"admin2025_secret_key"},
        cache:"no-cache"
      });
      if(!res.ok){ console.error(await res.text()); return; }
      const data = await res.json();
      MASTER_PIN = data?.pin ?? null;
    } catch(err){ console.error("Erreur fetch PIN:", err);}
  }
  await fetchMasterPin();

  const btnValidate = $("pin-validate");
  const inputEl = $("pin-input");
  const classroomLink = $("classroom-link");
  const msgEl = $("pin-msg");

  function showMessage(msg,type="info"){
    if(!msgEl) return;
    msgEl.textContent = msg;
    msgEl.className = "";
    msgEl.classList.add(type==="error" ? "text-red-500" : type==="success" ? "text-green-500" : "text-gray-600");
  }

  on(btnValidate,"click",()=>{
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
  on($("open-review-form"),"click",()=> $("review-popup")?.classList.remove("hidden"));
  on($("close-popup"),"click",()=> $("review-popup")?.classList.add("hidden"));

});
