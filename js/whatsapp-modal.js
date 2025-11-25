// WhatsApp Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  const whatsappModal = document.querySelector("#whatsapp-modal");
  const whatsappModalClose = document.querySelector(".whatsapp-modal-close");
  const whatsappButtons = document.querySelectorAll(".whatsapp-open-modal");

  // Open modal when clicking WhatsApp button
  whatsappButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      if (whatsappModal) {
        whatsappModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      }
    });
  });

  // Close modal when clicking close button
  if (whatsappModalClose) {
    whatsappModalClose.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeWhatsAppModal();
    });
  }

  // Close modal when clicking outside
  if (whatsappModal) {
    whatsappModal.addEventListener("click", function (e) {
      if (e.target === whatsappModal) {
        closeWhatsAppModal();
      }
    });
  }

  // Close modal when pressing Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && whatsappModal?.classList.contains("active")) {
      closeWhatsAppModal();
    }
  });

  function closeWhatsAppModal() {
    if (whatsappModal) {
      whatsappModal.classList.remove("active");
      document.body.style.overflow = "auto"; // Restore scrolling
    }
  }

  // Handle option clicks
  const whatsappOptions = document.querySelectorAll(".whatsapp-option");
  whatsappOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      const whatsappUrl = this.getAttribute("data-whatsapp-url");
      if (whatsappUrl) {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        closeWhatsAppModal();
      }
    });
  });
});
