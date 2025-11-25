// Contact form functionality
document.addEventListener("DOMContentLoaded", function () {
  // WhatsApp contact functionality
  const whatsappContacts = document.querySelectorAll('.whatsapp-contact');
  
  whatsappContacts.forEach(contact => {
    contact.addEventListener('click', function() {
      const phoneNumber = this.getAttribute('data-phone');
      if (phoneNumber) {
        window.open(`https://wa.me/${phoneNumber}`, '_blank');
      }
    });
  });
  
  const contactForm = document.getElementById("form");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitButton = this.querySelector("button[type='submit']");
      const originalText = submitButton.textContent;

      try {
        submitButton.textContent = "جاري الإرسال...";
        submitButton.disabled = true;

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          alert("تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.");
          this.reset();
        } else {
          alert("فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.");
        }
      } catch (error) {
        alert("حدث خطأ. يرجى المحاولة مرة أخرى.");
      } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }

  // Form input animations
  const formInputs = document.querySelectorAll(".form-input, .form-textarea");
  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused");
      }
    });
  });

  // Phone number formatting removed as phone field is removed

  // Contact info hover effects
  const contactLinks = document.querySelectorAll(".info-item a");
  contactLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(-5px)";
      this.style.color = "var(--color-primary)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
      this.style.color = "";
    });
  });

  // Map interaction
  const mapContainer = document.querySelector(".map-container");
  if (mapContainer) {
    mapContainer.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.02)";
      this.style.transition = "transform 0.3s ease";
    });

    mapContainer.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }
});

// Web3Forms integration function (to be implemented)
function submitToWeb3Forms(formData) {
  // This function will be implemented when you set up web3forms
  // For now, it's a placeholder
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      console.log("Submitting to web3forms:", formData);
      resolve({ success: true });
    }, 1000);
  });
}

// Form validation helper functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation removed as phone field is removed

function validateName(name) {
  return name.trim().length >= 2;
}

function validateMessage(message) {
  return message.trim().length >= 10;
}

// Utility function to show form errors
function showFormError(message) {
  // Create error element if it doesn't exist
  let errorElement = document.querySelector(".form-error");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "form-error";
    errorElement.style.cssText = `
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      text-align: right;
    `;
    document.querySelector(".form-group:last-child").appendChild(errorElement);
  }
  errorElement.textContent = message;
}

// Utility function to clear form errors
function clearFormErrors() {
  const errorElement = document.querySelector(".form-error");
  if (errorElement) {
    errorElement.remove();
  }
}
