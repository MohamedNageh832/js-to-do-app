//============================= functions ================================//
class Settings {
  static statusOfOptions() {
    const togglers = document.querySelectorAll(".option-toggler");

    togglers.forEach((el, i) => {
      let optionName = Object.keys(languages["EN"]["settings"])[i + 1];

      if (settings[optionName] === "on") {
        el.classList.add("active");
        el.nextElementSibling.textContent = "on";
      } else {
        el.classList.remove("active");
        el.nextElementSibling.textContent = "off";
      }
    });

    let radios = document.querySelectorAll(".radio-holder input");

    settings["theme"] === "Light"
      ? (radios[0].checked = true)
      : (radios[1].checked = true);

    let langSelectBox = document.querySelector(".lang-select-box");

    settings["lang"] === "AR"
      ? (langSelectBox.value = 0)
      : (langSelectBox.value = 1);
  }

  static togglerClick(el) {
    if (el.classList.contains("option-toggler")) {
      const togglerStatusText = language["settings"]["togglerStatus"];

      el.classList.toggle("active");

      let statusIndex = el.classList.contains("active") ? 0 : 1;

      el.nextElementSibling.textContent = togglerStatusText[statusIndex];

      let optionName = el.parentElement.previousElementSibling.dataset.text;

      settings[optionName] =
        languages["EN"]["settings"]["togglerStatus"][statusIndex];

      if (statusIndex === 0 && optionName === "play-complettion-sound")
        completeTaskAudio.play();

      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }

  static inpRadioClick(el) {
    if (el.nodeName === "INPUT") {
      settings["theme"] = el.nextElementSibling.textContent;

      localStorage.setItem("settings", JSON.stringify(settings));

      MainMethods.checkTheme();
    }
  }

  static selectChange(el) {
    if (el.classList.contains("lang-select-box")) {
      settings["lang"] = el.value == 0 ? "AR" : "EN";

      localStorage.setItem("settings", JSON.stringify(settings));

      MainMethods.checkLanguage();
      AutoUI.applyLanguage();
    }
  }
}

class AutoUI {
  static applyLanguage() {
    MainMethods.loadingMsg();

    document.querySelector(".main-title").textContent =
      language["settings"]["main-title"];

    let options = document.querySelectorAll(".settings-option .title");
    let optionsText = language["settings"];

    options.forEach((el, i) => {
      let currentOption = Object.keys(optionsText)[i + 1];

      el.setAttribute("data-text", currentOption);

      el.textContent = optionsText[currentOption];
    });

    let statusOfTogglers = document.querySelectorAll(".toggler-status");
    let togglerStatus = language["settings"]["togglerStatus"];

    console.log(togglerStatus);

    statusOfTogglers.forEach((el) => {
      el.textContent = el.previousElementSibling.classList.contains("active")
        ? togglerStatus[0]
        : togglerStatus[1];
    });
  }
}

//============================= window Events ============================//
window.addEventListener("load", () => {
  Settings.statusOfOptions();

  AutoUI.applyLanguage();
});

window.addEventListener("click", (e) => {
  Settings.togglerClick(e.target);
  Settings.inpRadioClick(e.target);
});

window.addEventListener("change", (e) => {
  Settings.selectChange(e.target);
});
