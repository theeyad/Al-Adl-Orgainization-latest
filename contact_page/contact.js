// Booking System Functionality
let selectedService = {
  id: null,
  title: null,
  price: null,
  parentService: null,
};

document.addEventListener("DOMContentLoaded", function () {
  // WhatsApp contact functionality
  const whatsappContacts = document.querySelectorAll(".whatsapp-contact");

  whatsappContacts.forEach((contact) => {
    contact.addEventListener("click", function () {
      const phoneNumber = this.getAttribute("data-phone");
      if (phoneNumber) {
        window.open(`https://wa.me/${phoneNumber}`, "_blank");
      }
    });
  });

  // Create modal HTML
  createModals();

  // Get selected service from URL or sessionStorage
  checkForSelectedService();

  // Handle booking form submission
  const bookingForm = document.getElementById("form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
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
});

// Create modal overlay and modals
function createModals() {
  if (document.getElementById("modalOverlay")) return;

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "modalOverlay";
  modalOverlay.className = "modal-overlay";
  modalOverlay.innerHTML = `
    <div class="modal-content" id="modalContent">
      <h3 id="modalTitle"></h3>
      <p id="modalMessage"></p>
      <div class="modal-buttons" id="modalButtons"></div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  // Add click listener for outside clicks
  modalOverlay.addEventListener("click", function (e) {
    // Only trigger if clicking on the overlay itself, not the modal content
    if (e.target === modalOverlay) {
      handleOutsideClick();
    }
  });
}

// Handle outside click on modal overlay
function handleOutsideClick() {
  const modalOverlay = document.getElementById("modalOverlay");
  const allowOutsideClick = modalOverlay.dataset.allowOutsideClick === "true";

  if (!allowOutsideClick) {
    return; // Don't close if outside click is not allowed
  }

  const cancelButton = document.querySelector(".modal-button.cancel");
  if (cancelButton) {
    cancelButton.click();
  } else {
    // For modals with no cancel button (like success modal), click confirm
    const confirmButton = document.querySelector(".modal-button.confirm");
    if (confirmButton) {
      confirmButton.click();
    }
  }
}

// Show modal with custom content
function showModal(title, message, buttons, allowOutsideClick = true) {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalButtons = document.getElementById("modalButtons");

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalButtons.innerHTML = "";

  buttons.forEach((btn) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `modal-button ${btn.type}`;
    button.textContent = btn.text;
    button.onclick = btn.onClick;
    modalButtons.appendChild(button);
  });

  // Store the allowOutsideClick flag on the overlay for handleOutsideClick to use
  modalOverlay.dataset.allowOutsideClick = allowOutsideClick;

  modalOverlay.classList.add("active");
}

// Hide modal
function hideModal() {
  const modalOverlay = document.getElementById("modalOverlay");
  modalOverlay.classList.remove("active");
}

// Check if service was selected from services page
function checkForSelectedService() {
  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get("service");
  const serviceName = params.get("name");
  const servicePrice = params.get("price");
  const parentService = params.get("parent");

  if (serviceId && serviceName) {
    selectedService = {
      id: serviceId,
      title: serviceName,
      price: servicePrice,
      parentService: parentService,
    };
    updateServiceDisplay();
    // Clean URL
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + "#contact-form"
    );
  } else {
    // Check sessionStorage as fallback
    const stored = sessionStorage.getItem("selectedService");
    if (stored) {
      selectedService = JSON.parse(stored);
      updateServiceDisplay();
    }
  }
}

// Update the selected service display
function updateServiceDisplay() {
  const displayElement = document.getElementById("selectedServiceDisplay");

  if (selectedService.id) {
    displayElement.className = "selected-service-display active";
    displayElement.innerHTML = `
      <div>
        <p class="service-name">${selectedService.title}</p>
        <p class="service-price">${selectedService.price}</p>
      </div>
    `;
  } else {
    displayElement.className = "selected-service-display";
    displayElement.innerHTML =
      '<p style="color: var(--color-secondary-links); margin: 0;">لم يتم اختيار استشارة</p>';
  }
}

// Handle booking form submission
function handleBookingSubmit(e) {
  e.preventDefault();

  // If no service selected, show warning modal
  if (!selectedService.id) {
    showModal("اختر استشارة", "اختر استشارة من صفحة الخدمات حتي نقوم بحجزها", [
      {
        type: "cancel",
        text: "حسناً",
        onClick: () => hideModal(),
      },
    ]);
    return;
  }

  // Get user data from localStorage
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPhone = localStorage.getItem("userPhone");
  const username = localStorage.getItem("username");

  // Check if user is logged in
  if (!userName || !userEmail || !userPhone || !username) {
    showModal("تسجيل دخول مطلوب", "يرجى تسجيل الدخول أولاً لحجز استشارة", [
      {
        type: "cancel",
        text: "حسناً",
        onClick: () => hideModal(),
      },
    ]);
    return;
  }

  // Show confirmation modal
  showModal(
    "تأكيد الحجز",
    `هل أنت متأكد من حجز استشارة ${selectedService.title}؟`,
    [
      {
        type: "confirm",
        text: "نعم، تأكيد الحجز",
        onClick: () => confirmBooking(userName, userEmail, userPhone, username),
      },
      {
        type: "cancel",
        text: "إلغاء",
        onClick: () => hideModal(),
      },
    ]
  );
}

// Confirm booking and save data
function confirmBooking(name, email, phone, username) {
  hideModal();

  // Create booking object
  const booking = {
    id: Date.now().toString(),
    serviceName: selectedService.title,
    serviceId: selectedService.id,
    servicePrice: selectedService.price,
    parentService: selectedService.parentService,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    customerUsername: username,
    bookingDate: new Date().toLocaleString("ar-EG"),
    status: "pending",
  };

  // Save to localStorage
  let bookings = JSON.parse(localStorage.getItem("adl_bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("adl_bookings", JSON.stringify(bookings));

  // Show success modal
  showModal(
    "تم الحجز بنجاح",
    `تم حجز استشارة ${selectedService.title} بنجاح. سيتم التواصل معك قريباً على رقم ${phone}`,
    [
      {
        type: "confirm",
        text: "تم",
        onClick: () => {
          hideModal();
          window.location.href = "./contact.html#contact-form";
        },
      },
    ],
    true // Enable outside click for success modal
  );

  // Reset form and service selection
  document.getElementById("form").reset();
  selectedService = { id: null, title: null, price: null, parentService: null };
  updateServiceDisplay();
}

// Make function globally available for services.js to call
window.bookService = function (
  serviceId,
  serviceName,
  servicePrice,
  parentService
) {
  selectedService = {
    id: serviceId,
    title: serviceName,
    price: servicePrice,
    parentService: parentService,
  };
  sessionStorage.setItem("selectedService", JSON.stringify(selectedService));
  // Redirect to contact form
  window.location.href = "../contact_page/contact.html#contact-form";
};
