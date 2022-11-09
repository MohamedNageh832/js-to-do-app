let userLanguage = "";

if (navigator.language.includes("en")) userLanguage = "EN";
else userLanguage = "AR";

let settings = JSON.parse(localStorage.getItem("settings")) || {
  ["add-new-tasks-on-top"]: "on",
  ["play-complettion-sound"]: "on",
  ["confirm-before-deletion"]: "on",
  theme: "Light",
  lang: userLanguage,
};

let wrapperDiv = document.querySelector(".wrapper");

let completeTaskAudio = new Audio("/Audios/task_complete.mp3");

class MainMethods {
  static checkTheme() {
    if (settings["theme"] === null) {
      settings["theme"] = "Light";
    }

    if (settings["theme"] === "Dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    localStorage.setItem("settings", JSON.stringify(settings));
  }

  static checkLanguage() {
    if (settings["lang"] === "EN") {
      language = languages["EN"];
      document.querySelector(".rtl-link")
        ? document.querySelector(".rtl-link").remove()
        : false;
    } else {
      language = languages["AR"];

      let rtlLink = document.createElement("link");
      rtlLink.setAttribute("rel", "stylesheet");
      rtlLink.setAttribute("href", "Css/main-rtl.css");
      rtlLink.classList.add("rtl-link");

      document.head.appendChild(rtlLink);
    }

    let mainSidebarElements = document.querySelectorAll(".main-sidebar a");

    for (let i = 0; i < mainSidebarElements.length; i++) {
      mainSidebarElements[i].textContent = language["main-sidebar-links"][i];
    }
  }

  static loadingMsg() {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const loadingIcon = document.createElement("span");

    p.textContent = language["loading-msg"];
    loadingIcon.classList.add("loading-icon");

    div.classList.add("loading-holder");
    div.append(p, loadingIcon);

    wrapperDiv.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, 500);
  }
}

//=========================== Events ==================================//
// Event for toggling sidebar
let navbarToggler = document.querySelector(".navbar-toggler");
let mainSidebar = document.querySelector(".main-sidebar");
let overlayDark = document.querySelector(".overlay");

navbarToggler.addEventListener("click", () => {
  navbarToggler.classList.toggle("active");

  mainSidebar.classList.toggle("active");

  overlayDark.classList.toggle("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  MainMethods.checkTheme();
  MainMethods.checkLanguage();
});
//=========================== language options ============================//
let languages = {
  EN: {
    direction: "ltr",
    "loading-msg": "loading...",
    ["get-username"]: {
      title: "new user?",
      text: "Please enter your name",
    },
    btns: {
      close: "close",
      submit: "submit",
    },
    alerts: {
      "empty-fields": "Please enter a task",
      "task-added": "task added",
      "task-edited": "task edited",
      "no-tasks": "No tasks were found",
      "tasks-completed": "All tasks were checked",
      "task-deleted": "Task was deleted successfully",
      "tasks-deleted": "All tasks were deleted successfully",
    },
    announcement: {
      title: "Note",
      text: "- your data is saved locally, clearing browser data will result in losing all your data",
      "show-msg": "don't show again",
    },
    update: {
      title: "New update",
      text: "Added Arabic language",
    },
    "page-title": "Mahamy",
    "main-sidebar-links": ["Home", "Settings", "About us"],
    "welcome-msg": ["Good Morning", "Good Afternoon"],
    "days-names": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wedensday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    "more-options-dropdown-options": [
      "Edit tasks",
      "Delete task",
      "Check all",
      "Delete all",
    ],
    "tasks-stats": ["Completed", "in progress"],
    "progress-percentage": "% done",
    "no-tasks-percentage": "add tasks",
    "current-tasks-title": "Today tasks:",
    "no-tasks-msg": "No tasks (add new ones)",
    "add-task-placeholders": ["Enter task name", "Enter task hint (optional)"],
    ["settings"]: {
      "main-title": "Settings",
      "add-new-tasks-on-top": "Add new tasks on top",
      "play-complettion-sound": "Play completion sound",
      "confirm-before-deletion": "Confirm before deletion",
      theme: "Theme",
      language: "Language",
      togglerStatus: ["on", "off"],
    },
    ["confirm-deletion"]: {
      title: "Are you sure?",
      "text-single": "you are about to delete a task!",
      "text-multi": "you are about to delete all tasks!",
      confirm: "confirm",
      cancel: "cancel",
    },
    copyrights: "All Rights Reserved",
  },
  AR: {
    direction: "rtl",
    "loading-msg": "جار التحميل...",
    ["get-username"]: {
      title: "مستخدم جديد؟",
      text: "رجاء قم بإدخال اسمك",
    },
    btns: {
      close: "إغلاق",
      submit: "تأكيد",
    },
    alerts: {
      "empty-fields": "برجاء إدخال مهمة",
      "task-added": "تمت إضافة مهمة بنجاح",
      "task-edited": "تم التعديل",
      "no-tasks": "لا يوجد مهام",
      "tasks-completed": "تم إكمال جميع المهام",
      "task-deleted": "تم الحذف",
      "tasks-deleted": "تم حذف جميع المهام",
    },
    announcement: {
      title: "ملحوظة",
      text: "- جميع البيانات محفوظة محليا, مسح بيانات المتصفح سيؤدي إلي فقدان جميع البيانات",
      "show-msg": "لا تظهر هذة الرسالة مجددا",
    },
    update: {
      title: "تحديث جديد",
      text: `تم اضافة اللغة العربية `,
    },
    "page-title": "مهامي",
    "main-sidebar-links": ["الرئيسية", "الإعدادات", "عنا"],
    "welcome-msg": ["صباح الخير يا", "مساء الخير يا"],
    "days-names": [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ],
    "more-options-dropdown-options": [
      "تعديل",
      "حذف",
      "إكمال جميع المهام",
      "حذف جميع المهام",
    ],
    "tasks-stats": ["مكتمل", "قيد الانتظار"],
    "progress-percentage": "% مكتمل",
    "no-tasks-percentage": "اضف مهام",
    "current-tasks-title": "مهام اليوم:",
    "no-tasks-msg": "لا يوجد مهام (اضف مهام جديدة)",
    "add-task-placeholders": ["اسم المهمة", "أضف تلميح (اختياري)"],
    ["settings"]: {
      "main-title": "الإعدادات",
      "add-new-tasks-on-top": "اضافة المهام الجديدة في الأعلي",
      "play-complettion-sound": "تفعيل صوت اتمام المهام",
      "confirm-before-deletion": "التأكيد قبل الحذف",
      theme: "الواجهة (الثيم)",
      language: "اللغة",
      togglerStatus: ["تشغيل", "إيقاف"],
    },
    ["confirm-deletion"]: {
      title: "هل انت متأكد؟",
      "text-single": "انت علي وشك حذف مهمه!",
      "text-multi": "انت علي وشك حذف جميع المهام",
      confirm: "تأكيد",
      cancel: "إلغاء",
    },
    copyrights: "جميع الحقوق محفوظة",
  },
};

let language;
