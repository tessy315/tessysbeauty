// formulaire.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("academy-form"); // chanje ak ID fòm ou a si li diferan

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // evite reload page, si ou itilize GAS oubyen fetch pou poste done
    // --- PLACEHOLDER pou GAS: voye done fòm lan --- 
    alert("Formulaire soumis ✅"); 

    // Mete nan localStorage ke fòm lan fin soumèt
    localStorage.setItem("formSubmitted", "1");

    // Opsyonèl: si ou vle retounen otomatikman sou academy.html
    // window.location.href = "/academy.html"; // ak step2 otomatik, paske localStorage deja la
  });
});
