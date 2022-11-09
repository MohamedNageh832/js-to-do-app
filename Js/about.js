class About {
  static applyLanguage() {
    MainMethods.loadingMsg();

    document.querySelector(".copyrights-text").textContent =
      language["copyrights"];
  }
}

// =========================== Events ============================//
window.addEventListener("load", () => {
  About.applyLanguage();
});
