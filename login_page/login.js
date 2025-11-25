// Login Page JavaScript

const defaultConfig = {
  page_title: "تسجيل الدخول إلى نظام الإدارة المتكامل",
  company_name: "مؤسسة العدل للمحاماة والاستشارات القانونية",
  username_label: "اسم المستخدم",
  password_label: "كلمة المرور",
  button_text: "تسجيل الدخول",
  background_color: "#000000",
  gold_color: "#f3c623",
  button_color: "#ffdf6d",
  text_color: "#ffffff",
  font_family: "Segoe UI",
  font_size: 16,
};

async function onConfigChange(config) {
  const pageTitle = config.page_title || defaultConfig.page_title;
  const companyName = config.company_name || defaultConfig.company_name;
  const usernameLabel = config.username_label || defaultConfig.username_label;
  const passwordLabel = config.password_label || defaultConfig.password_label;
  const buttonText = config.button_text || defaultConfig.button_text;
  const fontFamily = config.font_family || defaultConfig.font_family;
  const fontSize = config.font_size || defaultConfig.font_size;

  document.getElementById("pageTitle").textContent = pageTitle;
  document.getElementById("companyName").textContent = companyName;
  document.getElementById("usernameLabel").textContent = usernameLabel;
  document.getElementById("passwordLabel").textContent = passwordLabel;
  document.getElementById("buttonText").textContent = buttonText;

  document.body.style.fontFamily = `${fontFamily}, Tahoma, Geneva, Verdana, sans-serif`;
  document.querySelector(".company-name").style.fontSize = `${
    fontSize * 1.375
  }px`;
  document.querySelector(".page-title").style.fontSize = `${fontSize}px`;
  document.querySelector(".form-group label").style.fontSize = `${
    fontSize * 0.875
  }px`;
  document.querySelector(".input-wrapper input").style.fontSize = `${
    fontSize * 0.9375
  }px`;
  document.querySelector(".login-button").style.fontSize = `${fontSize}px`;
}

function mapToCapabilities(config) {
  return {
    recolorables: [
      {
        get: () => config.background_color || defaultConfig.background_color,
        set: (value) => {
          config.background_color = value;
          if (window.elementSdk) {
            window.elementSdk.setConfig({ background_color: value });
          }
        },
      },
      {
        get: () => config.gold_color || defaultConfig.gold_color,
        set: (value) => {
          config.gold_color = value;
          if (window.elementSdk) {
            window.elementSdk.setConfig({ gold_color: value });
          }
        },
      },
      {
        get: () => config.button_color || defaultConfig.button_color,
        set: (value) => {
          config.button_color = value;
          if (window.elementSdk) {
            window.elementSdk.setConfig({ button_color: value });
          }
        },
      },
      {
        get: () => config.text_color || defaultConfig.text_color,
        set: (value) => {
          config.text_color = value;
          if (window.elementSdk) {
            window.elementSdk.setConfig({ text_color: value });
          }
        },
      },
    ],
    borderables: [],
    fontEditable: {
      get: () => config.font_family || defaultConfig.font_family,
      set: (value) => {
        config.font_family = value;
        if (window.elementSdk) {
          window.elementSdk.setConfig({ font_family: value });
        }
      },
    },
    fontSizeable: {
      get: () => config.font_size || defaultConfig.font_size,
      set: (value) => {
        config.font_size = value;
        if (window.elementSdk) {
          window.elementSdk.setConfig({ font_size: value });
        }
      },
    },
  };
}

function mapToEditPanelValues(config) {
  return new Map([
    ["page_title", config.page_title || defaultConfig.page_title],
    ["company_name", config.company_name || defaultConfig.company_name],
    ["username_label", config.username_label || defaultConfig.username_label],
    ["password_label", config.password_label || defaultConfig.password_label],
    ["button_text", config.button_text || defaultConfig.button_text],
  ]);
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues,
  });
}

// Form submission handler
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const button = document.querySelector(".login-button");
  const originalText = button.querySelector(".button-text").textContent;

  button.querySelector(".button-text").textContent = "جاري التحقق...";
  button.disabled = true;
  button.style.opacity = "0.7";

  setTimeout(() => {
    button.querySelector(".button-text").textContent = originalText;
    button.disabled = false;
    button.style.opacity = "1";

    // Navigate to dashboard page
    window.location.href = "../dashboard_page/dashboard.html";
  }, 1500);
});
