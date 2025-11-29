// Form switching functions
function switchToSignup(event) {
  event.preventDefault();
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const pageTitle = document.getElementById("pageTitle");

  loginForm.classList.remove("active");
  signupForm.classList.add("active");
  pageTitle.textContent = "إنشاء حساب جديد";
}

function switchToLogin(event) {
  event.preventDefault();
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const pageTitle = document.getElementById("pageTitle");

  signupForm.classList.remove("active");
  loginForm.classList.add("active");
  pageTitle.textContent = "تسجيل الدخول";
}

// Handle country selection for WhatsApp number
const countrySelect = document.getElementById("whatsapp-country");
const phonePrefix = document.getElementById("phone-prefix");

if (countrySelect) {
  countrySelect.addEventListener("change", function () {
    if (this.value === "egypt") {
      phonePrefix.textContent = "+20";
    } else if (this.value === "saudi") {
      phonePrefix.textContent = "+966";
    }
  });
}

// Handle form submissions
const loginForm = document.getElementById("login-auth-form");
const signupForm = document.getElementById("signup-auth-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    // Validate
    if (!username || !password) {
      showAlert("يرجى ملء جميع الحقول", "error");
      return;
    }

    // Show success message
    showAlert("جاري معالجة تسجيل دخولك...", "success");

    // Simulate login process
    setTimeout(() => {
      // Store user data in localStorage
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("username", username);

      // Redirect to home page
      window.location.href = "./home_page/home.html";
    }, 1500);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const country = document.getElementById("whatsapp-country").value;
    const whatsapp = document.getElementById("signup-whatsapp").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    // Validate
    if (!name || !email || !country || !whatsapp || !username || !password) {
      showAlert("يرجى ملء جميع الحقول", "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("يرجى إدخال بريد إلكتروني صحيح", "error");
      return;
    }

    // Validate phone number (basic validation)
    if (whatsapp.length < 8) {
      showAlert("يرجى إدخال رقم هاتف صحيح", "error");
      return;
    }

    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      showAlert("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
      return;
    }

    // Show success message
    showAlert("جاري إنشاء حسابك...", "success");

    // Simulate signup process
    setTimeout(() => {
      // Store user data in localStorage
      const fullPhone = phonePrefix.textContent + whatsapp;
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPhone", fullPhone);
      localStorage.setItem("userCountry", country);
      localStorage.setItem("username", username);

      // Redirect to home page
      window.location.href = "./home_page/home.html";
    }, 1500);
  });
}

// Alert function
function showAlert(message, type) {
  // Create alert element
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  // Add alert styles
  const style = document.createElement("style");
  if (!document.querySelector("style[data-alert-styles]")) {
    style.setAttribute("data-alert-styles", "true");
    style.textContent = `
      .alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 9999;
        font-family: "Cairo", sans-serif;
        animation: slideInAlert 0.3s ease-out;
      }
      
      .alert-success {
        background-color: #4caf50;
        color: white;
      }
      
      .alert-error {
        background-color: #f44336;
        color: white;
      }
      
      @keyframes slideInAlert {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @media (max-width: 576px) {
        .alert {
          left: 10px;
          right: 10px;
          top: auto;
          bottom: 20px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(alertDiv);

  // Remove alert after 3 seconds
  setTimeout(() => {
    alertDiv.style.animation = "slideInAlert 0.3s ease-out reverse";
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}
