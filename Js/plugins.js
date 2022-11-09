// Getting main parent and main overlay
let btnsHolder = document.querySelector(".btns-holder");
let announcementOverlay = document.querySelector(".announcement-overlay");
let overlayTransparent = document.querySelector(".overlay-transparent");

overlayDark.addEventListener("click", () => Controls.overlayDarkClick());
overlayTransparent.addEventListener("click", () =>
  Controls.overlayTransparentClick()
);

// Getting main buttons (footer buttons)
let addNewTaskBtn = document.querySelector(".add-new-task-btn");
let controlsBtns = document.querySelectorAll(".controls-btn");

// Class for tasks
class Task {
  constructor(text, hint) {
    this.text = text;
    this.hint = hint;
    this.taskDay = new Date().getDate();
    this.completed = false;
  }
}

// Class for storage
class Database {
  // Getting tasks form localStorage
  static getStoredTasks(category) {
    let storedTasks;

    if (localStorage.getItem(category) === null) {
      storedTasks = [];
    } else {
      storedTasks = JSON.parse(localStorage.getItem(category));
    }

    return storedTasks;
  }

  // Saving newly created task in localStorage
  static saveTask(task, category, method) {
    let storedTasks = this.getStoredTasks(category);

    method === "unshift" ? storedTasks.unshift(task) : storedTasks.push(task);

    localStorage.setItem(category, JSON.stringify(storedTasks));
  }
}

class Controls {
  static appendSaveBtn(className) {
    const button = document.createElement("button");
    const checkIcon = document.createElement("i");

    checkIcon.className = "fas fa-check";

    button.appendChild(checkIcon);

    button.className = `controls-btn save-btn ${className}`;

    btnsHolder.appendChild(button);
  }

  static appendCancelBtn(className) {
    const button = document.createElement("button");
    const closeIcon = document.createElement("i");

    closeIcon.className = `fas fa-close`;

    button.appendChild(closeIcon);

    button.className = `controls-btn cancel-btn ${className}`;

    button.addEventListener("click", () => {
      button.remove();
    });

    btnsHolder.appendChild(button);
  }

  static deleteTaskBtn() {
    let button = document.createElement("button");

    button.classList.add("delete-task-btn");
    button.textContent = "x";

    return button;
  }

  static overlayDarkClick() {
    overlayDark.classList.add("hidden");
    navbarToggler.classList.remove("active");
    mainSidebar.classList.remove("active");
  }

  static overlayTransparentClick() {
    overlayTransparent.classList.add("hidden");
    MoreOptions.hideMenu();
  }
}

// Class for user interface
class UI {
  static adjustInputHeight(el) {
    if (el.classList.contains("task-hint")) {
      el.addEventListener("input", function () {
        this.style.height = `10px`;
        this.style.height = `${this.scrollHeight}px`;
      });
    }
  }

  // Getting saved tasks from localStorage
  static showAllSavedTasks(category, target) {
    let storedTasks = Database.getStoredTasks(category);

    storedTasks.forEach((task) => UI.addTask(task, target));

    AutoUI.refreshTasksIDs("allTasks", tasksList);
  }

  // Adding new tasks
  static addTask(task, parent) {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const textInput = document.createElement("input");
    const hintInput = document.createElement("textarea");

    textInput.className = "custom-input task-text task-info";
    textInput.setAttribute("type", "text");
    textInput.setAttribute("placeholder", language["add-task-placeholders"][0]);

    hintInput.className = "custom-input task-hint task-info";
    hintInput.setAttribute("placeholder", language["add-task-placeholders"][1]);

    li.classList.add("task-holder");

    if (task !== undefined && parent !== undefined) {
      const newInp = document.createElement("input");

      newInp.setAttribute("type", "checkbox");
      newInp.classList.add("task-checkbox");

      textInput.value = task.text;
      textInput.classList.remove("custom-input");
      textInput.disabled = true;

      if (task.completed === true) {
        li.classList.add("completed");
        newInp.checked = true;

        div.append(textInput, Controls.deleteTaskBtn());
      } else {
        div.appendChild(textInput);
      }

      if (task.hint !== "") {
        hintInput.value = task.hint;
        hintInput.classList.remove("custom-input");
        hintInput.disabled = true;

        div.appendChild(hintInput);
      }

      li.append(newInp, div);
    } else {
      li.classList.add("new-task");

      div.append(textInput, hintInput);
      li.appendChild(div);
    }

    parent.appendChild(li);

    textInput.focus();

    AutoUI.adjustTextareaHeight();
    parent.querySelector(".no-tasks-msg")
      ? parent.querySelector(".no-tasks-msg").remove()
      : false;
  }

  static checkNewTask() {
    let newTaskText = document.querySelector(
      ".current-tasks .task-holder:last-of-type .task-text"
    );
    let NewTaskHint = document.querySelector(
      ".current-tasks .task-holder:last-of-type .task-hint"
    );

    if (newTaskText.value !== "") {
      let newTask = new Task(newTaskText.value, NewTaskHint.value);

      UI.saveCreatedTask(newTask, "allTasks", tasksList);

      UI.alert(language["alerts"]["task-added"], "green");

      AutoUI.refreshTasksIDs("allTasks", tasksList);

      addNewTaskBtn.classList.remove("hidden");

      return true;
    } else {
      UI.alert(language["alerts"]["empty-fields"], "red");

      return false;
    }
  }

  // Saving newly created tasks to tasks list
  static saveCreatedTask(task, category, parent) {
    let lastTaskHolder = parent;

    const newInp = document.createElement("input");

    newInp.setAttribute("type", "checkbox");
    newInp.classList.add("task-checkbox");

    lastTaskHolder.classList.add("new-task");
    lastTaskHolder.querySelector(".task-holder:last-of-type").prepend(newInp);

    lastTaskHolder.querySelectorAll(".task-info").forEach((inp) => {
      inp.disabled = true;

      if (inp.classList.contains("task-hint") && inp.value === "") {
        inp.remove();
      }

      inp.classList.remove("custom-input");

      //

      AutoUI.refreshTasksIDs("allTasks", tasksList);
    });

    if (settings["add-new-tasks-on-top"] !== "on") {
      document
        .querySelector(".task-holder.new-task")
        .classList.remove("new-task");

      Database.saveTask(task, category);
    } else {
      Database.saveTask(task, category, "unshift");
    }

    AutoUI.refreshTasksIDs();
  }

  static closeAllMenus(...params) {
    const [menu, overlay] = params;

    document.querySelectorAll(".togglable-menu").forEach((el) => {
      el !== menu ? el.classList.remove("active") : false;
    });

    document.querySelectorAll(".overlay").forEach((el) => {
      el !== overlay ? el.classList.add("hidden") : false;
    });
  }

  // custom alert for user interface
  static alert(text, color) {
    const span = document.createElement("span");

    span.textContent = text;
    span.className = `alert alert-${color}`;

    wrapperDiv.appendChild(span);

    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  // complete task with checkbox checked
  static completeTask(el) {
    document
      .querySelectorAll(".task-holder .task-checkbox")
      .forEach((checkbox) => {
        if (el == checkbox) {
          let allTasks = Database.getStoredTasks("allTasks");

          if (el.checked === true) {
            el.parentElement.classList.add("completed");

            allTasks[el.getAttribute("id") - 1].completed = true;

            settings["play-complettion-sound"] === "on"
              ? completeTaskAudio.play()
              : false;

            el.nextElementSibling.appendChild(Controls.deleteTaskBtn());
          } else {
            el.parentElement.classList.remove("completed");

            allTasks[el.getAttribute("id") - 1].completed = false;

            document.querySelector(".delete-task-btn")
              ? document.querySelector(".delete-task-btn").remove()
              : false;
          }

          localStorage.setItem("allTasks", JSON.stringify(allTasks));

          AutoUI.checkTasks("allTasks");
        }
      });
  }

  static confirmDeletion(el, type) {
    const div = document.createElement("div");
    const title = document.createElement("h3");
    const p = document.createElement("p");
    const confirmBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");

    title.classList.add("title");
    title.textContent = language["confirm-deletion"]["title"];

    p.classList.add("text");
    p.textContent =
      language["confirm-deletion"][
        type === "multi" ? "text-multi" : "text-single"
      ];

    confirmBtn.className = "btn confirm-btn";
    confirmBtn.textContent = language["confirm-deletion"]["confirm"];

    confirmBtn.addEventListener("click", () => {
      confirmBtn.parentElement.remove();
      overlayDark.classList.add("hidden");

      type === "multi"
        ? MoreOptions.deleteAllTasks(el)
        : MoreOptions.deleteTask(el);
    });

    cancelBtn.className = "btn cancel-btn";
    cancelBtn.textContent = language["confirm-deletion"]["cancel"];

    cancelBtn.addEventListener("click", () => {
      cancelBtn.parentElement.remove();
      overlayDark.classList.add("hidden");
    });

    div.classList.add("confirm-deletion");
    div.append(title, p, confirmBtn, cancelBtn);

    wrapperDiv.appendChild(div);
    overlayDark.classList.remove("hidden");
  }
}

// Class for auto methods
class AutoUI {
  static tasksTitle = document.querySelector(".current-tasks .title");

  // Checking wether there is an update or not
  static getUpdate(category1, category2, title, text, labelID, category) {
    if (
      localStorage.getItem(category1) == null ||
      localStorage.getItem(category1) == "true"
    ) {
      localStorage.setItem("showUpdate", true);
      localStorage.setItem(category2, true);
    } else {
      localStorage.setItem("showUpdate", false);
    }

    AutoUI.showAnnouncement(title, text, labelID, category, category1);
  }

  // Checking wether the provided category is set true or false
  static showAnnouncement(title, text, labelID, category, checkUpdate) {
    if (
      localStorage.getItem(category) == "true" ||
      localStorage.getItem(category) == null
    ) {
      AutoUI.announcement(title, text, labelID, category, checkUpdate);
    }
  }

  // Announcemect layout
  static announcement(title, text, labelID, category, checkUpdate) {
    let div = document.createElement("div");
    let h3 = document.createElement("h3");
    let checkBoxHolder = document.createElement("div");
    let ul = document.createElement("ul");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let button = document.createElement("button");

    div.classList.add("announcement");

    h3.classList.add("title");
    h3.textContent = title;

    announcementOverlay.classList.remove("hidden");

    ul.className = "announcement-details";
    ul.appendChild(document.createElement("li")).appendChild(
      document.createTextNode(text)
    );

    input.setAttribute("type", "checkbox");
    input.setAttribute("id", labelID);

    label.setAttribute("for", labelID);
    label.textContent = language["announcement"]["show-msg"];

    checkBoxHolder.className = "checkbox-holder";
    checkBoxHolder.append(input, label);

    button.textContent = language["btns"]["close"];
    button.setAttribute("type", "button");
    button.className = "btn announcement-btn";

    div.append(h3, ul, checkBoxHolder, button);

    wrapperDiv.appendChild(div);

    button.addEventListener("click", () => {
      if (input.checked === true) {
        localStorage.setItem(category, false);
        if (checkUpdate !== undefined) {
          localStorage.setItem(checkUpdate, false);
        }
      }

      announcementOverlay.classList.add("hidden");

      div.remove();
    });
  }

  static backgroundImg() {
    let time = new Date().getHours();

    let infoHolder = document.querySelector(".info-holder");

    let morningBackgrounds = [
      "https://media.istockphoto.com/photos/smoky-mountain-valley-view-picture-id543180862?b=1&k=20&m=543180862&s=170667a&w=0&h=g0W99elhmoLJv2fjl2jHVU8dEfSTFHayW6Zm04AwOZ8=",
      "https://images.unsplash.com/photo-1561239905-d620f213c5f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80",
      "https://media.istockphoto.com/photos/aerial-view-of-lake-tahoe-shoreline-with-mountains-and-turquoise-blue-picture-id1302742624?b=1&k=20&m=1302742624&s=170667a&w=0&h=10t9qpPCwQ2JIb4N9pA04OWlff7TP8McxSxtqQkcCYM=",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fG5hdHVyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60",
    ];
    let afternoonBackgrounds = [
      "https://unsplash.com/photos/eOpewngf68w",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
      "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fG5hdHVyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60",
      "https://images.unsplash.com/photo-1517370091901-aa7e3ab63ab1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dHdpbGlnaHR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c3Vuc2V0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
    ];

    let backgroundsArray;

    if (time < 12) {
      backgroundsArray = morningBackgrounds;
    } else {
      backgroundsArray = afternoonBackgrounds;
    }

    infoHolder.style.backgroundImage = `url(${
      backgroundsArray[Math.floor(Math.random() * backgroundsArray.length)]
    })`;
  }

  // Checking wether username is provided or not
  static showUsername() {
    if (localStorage.getItem("username") !== null) {
      AutoUI.welcomeMsg();
    } else {
      AutoUI.getUsername();
    }
  }

  // Getting username for first entry
  static getUsername() {
    const div = document.createElement("div");
    const logo = document.createElement("span");
    const title = document.createElement("h4");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const button = document.createElement("button");

    div.className = "announcement username-getter";

    logo.className = "announcement-logo";
    logo.insertAdjacentHTML(
      "beforeend",
      `<span class="logo-span">Mah</span>amy`
    );

    title.textContent = language["get-username"]["title"];

    label.setAttribute("for", "username");
    label.textContent = language["get-username"]["text"];

    input.setAttribute("type", "text");

    button.className = "btn username-submit";
    button.setAttribute("type", "button");
    button.textContent = language["btns"]["submit"];

    div.append(logo, title, label, input, button);

    announcementOverlay.classList.remove("hidden");

    wrapperDiv.appendChild(div);

    button.addEventListener("click", () => {
      let username = input.value.split(" ");
      localStorage.setItem("username", username[0]);

      announcementOverlay.classList.add("hidden");

      AutoUI.checkTasks();
      AutoUI.showUsername();
      div.remove();
    });
  }

  // Refreshsing checkboxes ids for localStorage items edit
  static refreshTasksIDs(category, parent) {
    let taskHolders = document.querySelectorAll(
      ".task-holder:not(.no-tasks-msg)"
    );

    if (taskHolders.length > 0) {
      let j = 1;

      taskHolders.forEach((el) => {
        el.querySelector('input[type="checkbox"]').setAttribute("id", j);

        j++;
      });
    }

    AutoUI.checkTasks(category, parent);
  }

  // Updating tasks stats
  static checkTasks(category, parent) {
    let storedTasks = Database.getStoredTasks(category);

    // Getting all stored tasks count
    let allTasksCount = storedTasks.length;

    this.tasksTitle.textContent = `${language["current-tasks-title"]} ${allTasksCount}`;

    // Getting completed tasks count
    let completedTasks = storedTasks.filter((el) => el.completed === true);
    let completedTasksCount = completedTasks.length;

    // Adding completed tasks count
    document.querySelector(".tasks-num .completed").textContent =
      completedTasksCount;

    // Adding in progress tasks count
    document.querySelector(".tasks-num .in-progress").textContent =
      allTasksCount - completedTasksCount;

    // Getting progress percentage
    let progressPercentage = Math.round(
      (completedTasksCount / allTasksCount) * 100
    );

    // Function for updating progress bar
    (() => {
      if (isNaN(progressPercentage)) {
        document.querySelector(".progress-fill").style.width = "1%";

        document.querySelector(
          ".progress-info .progress-percentage"
        ).textContent = language["no-tasks-percentage"];
      } else {
        document.querySelector(
          ".progress-fill"
        ).style.width = `${progressPercentage}%`;
        document.querySelector(
          ".progress-info .progress-percentage"
        ).textContent = `${progressPercentage}${language["progress-percentage"]}`;
      }
    })();

    // Function to do is the parameter parent isn't provided
    if (parent !== undefined) {
      if (
        localStorage.getItem(category) === null ||
        JSON.parse(localStorage.getItem(category)).length === 0
      ) {
        const noTasksMsg = document.createElement("li");

        noTasksMsg.className = "no-tasks-msg";
        noTasksMsg.textContent = language["no-tasks-msg"];

        document.querySelector(".no-tasks-msg")
          ? false
          : parent.appendChild(noTasksMsg);
      } else if (
        (localStorage.getItem(category) !== null ||
          JSON.parse(localStorage.getItem(category)).length === 0) &&
        parent.querySelector(".no-tasks-msg") !== null
      ) {
        parent.querySelector(".no-tasks-msg").remove();
      }
    }

    AutoUI.adjustTextareaHeight();
  }

  static applyLanguage() {
    MainMethods.loadingMsg();

    // Getting required texts to be changed based on language
    let pageTitle = document.querySelector("head title");
    let date = document.querySelector(".date");
    let moreOptionsDropdownElements = document.querySelectorAll(
      ".more-options-dropdown li"
    );
    let tasksNumElements = document.querySelectorAll(".tasks-num small");

    document.querySelector("html").setAttribute("dir", language["direction"]);

    pageTitle.textContent = language["page-title"];

    AutoUI.welcomeMsg();

    (function getDate() {
      let todayDate = new Date().getDate();
      let todayIndex = new Date().getDay();
      let year = new Date().getFullYear();

      date.textContent = `${todayDate} ${language["days-names"][todayIndex]} ${year}`;
    })();

    for (let j = 0; j < moreOptionsDropdownElements.length; j++) {
      moreOptionsDropdownElements[j].textContent =
        language["more-options-dropdown-options"][j];
    }

    for (let k = 0; k < tasksNumElements.length; k++) {
      tasksNumElements[k].textContent = language["tasks-stats"][k];
    }

    AutoUI.refreshTasksIDs("allTasks", tasksList);
  }

  static welcomeMsg() {
    let time = new Date().getHours();
    let welcomeMsgText;

    if (time < 12) {
      welcomeMsgText = language["welcome-msg"][0];
    } else {
      welcomeMsgText = language["welcome-msg"][1];
    }

    document.querySelector(".welcome-msg").textContent = `${welcomeMsgText} 
    ${localStorage.getItem("username")}`;
  }

  static adjustTextareaHeight() {
    document.querySelectorAll("textarea").forEach((inp) => {
      inp.value = inp.value.trim();
      inp.style.height = `10px`;
      inp.style.height = `${inp.scrollHeight}px`;
    });
  }
}

// Class for more options menu
let moreOptionsMenu = document.querySelector(".more-options-dropdown");

class MoreOptions {
  static openMenu(el) {
    if (el == document.querySelector(".more-options-btn")) {
      UI.closeAllMenus(moreOptionsMenu, overlayTransparent);

      moreOptionsMenu.classList.toggle("active");

      overlayTransparent.classList.remove("hidden");

      document.querySelectorAll(".more-options-dropdown li").forEach((el) => {
        el.addEventListener("click", () => {
          overlayTransparent.classList.add("hidden");

          MoreOptions.hideMenu();
        });
      });
    }
  }

  static hideMenu() {
    document.querySelector(".more-options-dropdown").classList.remove("active");
  }

  static editTasks(el) {
    if (el === document.querySelector(".edit-tasks")) {
      let taskHolders = document.querySelectorAll(
        ".task-holder:not(.completed)"
      );

      if (taskHolders.length > 0) {
        Controls.appendSaveBtn("save-edit-tasks");

        let saveBtn = document.querySelector(".save-edit-tasks");

        taskHolders.forEach((el) => {
          el.childNodes.forEach((child) => {
            if (child.querySelector(".task-hint") === null) {
              let hintInput = document.createElement("textarea");

              hintInput.className = "custom-input task-hint task-info";
              hintInput.setAttribute("placeholder", "Enter a hint (optional)");

              child.appendChild(hintInput);
            }
          });

          saveBtn.addEventListener("click", () => {
            addNewTaskBtn.classList.remove("hidden");

            // Showing checkboxes
            checkboxes.forEach((el) => el.classList.remove("hidden"));

            // Disabling input fields

            taskText.disabled = true;
            taskText.classList.remove("custom-input");

            taskHint.disabled = true;
            taskHint.classList.remove("custom-input");

            if (taskHint !== null && taskHint.value == "") {
              taskHint.remove();
            }

            if (el.querySelector('input[type="checkbox"]') !== null) {
              let storedTasks = Database.getStoredTasks("allTasks");
              let elIndex =
                el.querySelector('input[type="checkbox"]').getAttribute("id") -
                1;

              if (storedTasks.length > 0) {
                storedTasks[elIndex].text = taskText.value;
                storedTasks[elIndex].hint = taskHint.value;
              }

              if (taskText !== null && taskText.value == "") {
                el.remove();
                storedTasks.splice(elIndex, 1);
              }

              localStorage.setItem("allTasks", JSON.stringify(storedTasks));

              AutoUI.refreshTasksIDs("allTasks", tasksList);

              UI.alert(language["alerts"]["task-edited"], "green");
            }

            saveBtn.remove();
          });

          let taskText = el.childNodes[1].querySelector(".task-text");
          let taskHint = el.childNodes[1].querySelector(".task-hint");

          // Appending delete-task button for each task-holder
          let checkboxes = el.querySelectorAll('input[type="checkbox"]');

          addNewTaskBtn.classList.add("hidden");

          // Removing disabled attribute from input fields
          taskText.disabled = false;
          taskText.classList.add("custom-input");

          taskHint.disabled = false;
          taskHint.classList.add("custom-input");

          AutoUI.adjustTextareaHeight();

          checkboxes.forEach((el) => el.classList.add("hidden"));
        });
      } else {
        UI.alert(language["alerts"]["no-tasks"], "red");
      }

      MoreOptions.hideMenu();
    }
  }

  static deleteTaskBtn(el) {
    if (el.classList.contains("delete-task-btn")) {
      if (settings["confirm-before-deletion"] === "on") {
        UI.confirmDeletion(el, "single");
      } else {
        MoreOptions.deleteTask(el);
      }
    }
  }

  static deleteTask(el) {
    el.parentElement.parentElement.remove();

    let elCheckbox = el.parentElement.parentElement.querySelector(
      'input[type="checkbox"]'
    );

    let storedTasks = Database.getStoredTasks("allTasks");

    storedTasks.splice(elCheckbox.getAttribute("id") - 1, 1);

    localStorage.setItem("allTasks", JSON.stringify(storedTasks));

    UI.alert(language["alerts"]["task-deleted"], "green");

    AutoUI.checkTasks("allTasks", tasksList);

    AutoUI.refreshTasksIDs("allTasks", tasksList);
  }

  static addDeleteTaskBtn(el) {
    if (el == document.querySelector(".delete-task")) {
      let taskHolders = document.querySelectorAll(
        ".task-holder:not(.completed)"
      );

      if (taskHolders.length > 0) {
        taskHolders.forEach((el) =>
          el.querySelector("div").appendChild(Controls.deleteTaskBtn())
        );

        Controls.appendSaveBtn("save-delete-tasks");

        let saveBtn = document.querySelector(".save-delete-tasks");

        saveBtn.addEventListener("click", () => {
          taskHolders.forEach((el) =>
            el.querySelector(".delete-task-btn")
              ? el.querySelector(".delete-task-btn").remove()
              : false
          );

          saveBtn.remove();
        });
      } else {
        UI.alert(language["alerts"]["no-tasks"], "red");
      }
    }
  }

  // Method for completing all tasks
  static completeAllTasks(el) {
    if (el === document.querySelector(".check-all-tasks")) {
      let taskHolders = document.querySelectorAll(
        ".task-holder:not(.completed)"
      );

      if (taskHolders.length > 0) {
        tasksList.querySelectorAll(".task-holder").forEach((task) => {
          task.querySelector(".task-checkbox").checked = true;
          UI.completeTask(task.querySelector(".task-checkbox"));
        });

        settings["play-complettion-sound"] === "on"
          ? completeTaskAudio.play()
          : false;

        UI.alert(language["alerts"]["tasks-completed"], "green");
      } else {
        UI.alert(language["alerts"]["no-tasks"], "red");
      }

      MoreOptions.hideMenu();
    }
  }

  static deleteAllTasksBtn(el) {
    if (el === document.querySelector(".delete-all-tasks")) {
      if (settings["confirm-before-deletion"] === "on") {
        UI.confirmDeletion(el, "multi");
      } else {
        MoreOptions.deleteAllTasks(el);
      }
      MoreOptions.hideMenu();
    }
  }

  static deleteAllTasks(el) {
    let taskHolders = document.querySelectorAll(".task-holder");

    if (
      tasksList.querySelector(".task-info") !== null &&
      tasksList.querySelector(".task-info").disabled === true
    ) {
      localStorage.setItem("allTasks", JSON.stringify([]));

      taskHolders.forEach((el) => el.remove());

      el.parentElement.classList.remove("active");

      AutoUI.refreshTasksIDs("allTasks", tasksList);

      UI.alert(language["alerts"]["tasks-deleted"], "green");
    } else {
      UI.alert(language["alerts"]["no-tasks"], "red");
    }
  }
}

// Getting tasks holders
let tasksList = document.querySelector(".current-tasks .tasks-list");

// Event for toggling sidebar
navbarToggler.addEventListener("click", () => {
  UI.closeAllMenus(mainSidebar, overlayDark);
});

// Event for adding tasks
addNewTaskBtn.addEventListener("click", () => {
  UI.addTask(undefined, tasksList);

  addNewTaskBtn.classList.add("hidden");

  Controls.appendSaveBtn("save-new-task");

  let saveBtn = document.querySelector(".save-new-task");

  saveBtn.addEventListener("click", () => {
    UI.checkNewTask() === true ? saveBtn.remove() : false;
  });
});

// Document loaded Event
document.addEventListener("DOMContentLoaded", () => {
  AutoUI.applyLanguage();
  AutoUI.backgroundImg();

  let updateCategory1 = "checkUpdate1";
  let updateCategory2 = "checkUpdate2";

  AutoUI.getUpdate(
    updateCategory1,
    updateCategory2,
    language["update"]["title"],
    language["update"]["text"],
    "label1",
    "showUpdate"
  );

  AutoUI.showAnnouncement(
    language["announcement"]["title"],
    language["announcement"]["text"],
    "label2",
    "showAnnouncement"
  );

  wrapperDiv.style.minHeight = `${window.innerHeight}px`;

  tasksList.style.height = `${
    window.innerHeight -
    document.querySelector(".info-holder").scrollHeight -
    document.querySelector(".current-tasks .title").scrollHeight
  }px`;

  AutoUI.showUsername();

  UI.showAllSavedTasks("allTasks", tasksList);

  document.querySelectorAll("textarea").forEach((inp) => {
    inp.style.height = `${inp.scrollHeight}px`;
    inp.addEventListener("input", () => {
      inp.style.height = `${inp.scrollHeight}px`;
    });
  });
});

// Event for completing tasks
document.addEventListener("change", (e) => {
  UI.completeTask(e.target);
});

document.addEventListener("click", (e) => {
  MoreOptions.addDeleteTaskBtn(e.target);

  MoreOptions.deleteTaskBtn(e.target);

  MoreOptions.openMenu(e.target);
  MoreOptions.editTasks(e.target);
  MoreOptions.completeAllTasks(e.target);
  MoreOptions.deleteAllTasksBtn(e.target);
});

window.addEventListener("input", (e) => {
  UI.adjustInputHeight(e.target);
});
