// Dashboard Page JavaScript

// Logout Function
function logout() {
  window.location.href = "../login_page/login.html";
}

// Export Cases to Excel
function exportCasesToExcel() {
  if (cases.length === 0) {
    showToast("لا توجد قضايا لتصديرها", "info");
    return;
  }

  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent +=
    "اسم العميل,البريد الإلكتروني,رقم المحضر,رقم القضية,تاريخ الجلسة,الحالة\n";

  cases.forEach((caseItem) => {
    const row = [
      caseItem.name,
      caseItem.recordNumber,
      caseItem.email,
      caseItem.caseNumber,
      caseItem.date,
      caseItem.status,
    ]
      .map((field) => `"${field}"`)
      .join(",");
    csvContent += row + "\n";
  });

  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "القضايا.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("تم تصدير القضايا بنجاح", "success");
}

// Export Administrative Tasks to Excel
function exportAdministrativeToExcel() {
  if (administrative.length === 0) {
    showToast("لا توجد أعمال إدارية لتصديرها", "info");
    return;
  }

  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "اسم العمل,صاحب العمل,رقم العمل,تاريخ الموعد,الأولوية\n";

  administrative.forEach((task) => {
    const row = [task.name, task.owner, task.number, task.date, task.priority]
      .map((field) => `"${field}"`)
      .join(",");
    csvContent += row + "\n";
  });

  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "الأعمال_الإدارية.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("تم تصدير الأعمال الإدارية بنجاح", "success");
}

const defaultConfig = {
  firm_name: "مكتب المحاماة",
  add_case_button: "+ إضافة قضية جديدة",
  export_button: "تصدير Excel",
  background_color: "#000000",
  surface_color: "#1f2937",
  text_color: "#f3f4f6",
  primary_action_color: "#f3c623",
  secondary_action_color: "#059669",
  font_family: "Cairo",
  font_size: 16,
};

let allCards = [];
let publications = [];
let cases = [];
let administrative = [];
let filteredCases = [];
let filteredAdministrative = [];
let currentPage = "home";
let currentModalPage = "";
let currentModalSection = "";
let isDarkMode = true;
let caseFilter = {
  status: null,
  searchTerm: "",
};
let administrativeFilter = {
  priority: null,
  searchTerm: "",
};

// Clock
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("clock").textContent = timeString;
}
updateClock();
setInterval(updateClock, 1000);

// Sidebar Toggle Functionality
function setupSidebarToggle() {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".toggle");

  if (sidebarToggle && sidebar && toggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      toggle.classList.toggle("active");
      document.body.classList.toggle("sidebar-open");
    });

    // Close sidebar when clicking on a nav item
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Only close on mobile
        if (window.innerWidth < 1200) {
          sidebar.classList.remove("active");
          toggle.classList.remove("active");
          document.body.classList.remove("sidebar-open");
        }
      });
    });

    // Close sidebar when clicking outside (on overlay)
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth < 1200 &&
        !sidebar.contains(e.target) &&
        !sidebarToggle.contains(e.target)
      ) {
        if (sidebar.classList.contains("active")) {
          sidebar.classList.remove("active");
          toggle.classList.remove("active");
          document.body.classList.remove("sidebar-open");
        }
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1200) {
        sidebar.classList.remove("active");
        toggle.classList.remove("active");
        document.body.classList.remove("sidebar-open");
      }
    });
  }
}

// Navigation
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const page = item.dataset.page;
    switchPage(page);
  });
});

function switchPage(page) {
  currentPage = page;
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  document.querySelector(`[data-page="${page}"]`).classList.add("active");

  document.querySelectorAll(".page-content").forEach((content) => {
    content.classList.add("page-hidden");
  });
  document.getElementById(`${page}-page`).classList.remove("page-hidden");
}

// Modal Functions
function showAddCardModal(page, section) {
  currentModalPage = page;
  currentModalSection = section;

  // Determine which modal to show based on section
  let modalId = "add-card-modal-services"; // default
  if (section === "header2") {
    modalId = "add-card-modal-publications";
  } else if (section === "header3") {
    modalId = "add-card-modal-testimonials";
  }

  document.getElementById(modalId).classList.remove("modal-hidden");

  // Reset the appropriate form
  const formId = modalId.replace("modal", "form");
  const form = document.getElementById(formId);
  if (form) form.reset();
}

// Show Service Modal
function showAddServiceModal() {
  document.getElementById("add-service-modal").classList.remove("modal-hidden");
  document.getElementById("add-service-form").reset();
}

// Show Sub-Service Modal
function showAddSubServiceModal(serviceId, serviceTitle) {
  document
    .getElementById("add-subservice-modal")
    .classList.remove("modal-hidden");
  document.getElementById("parent-service-id").value = serviceId;
  document.getElementById("add-subservice-form").reset();
  // Update the modal title to show which service we're adding to
  document.querySelector(
    "#add-subservice-modal h3"
  ).textContent = `إضافة خدمة فرعية لـ ${serviceTitle}`;
}

// Close any modal
function closeModal(modalId) {
  document.getElementById(modalId).classList.add("modal-hidden");
}

// Handle Add Service Form Submission
async function handleAddService(event) {
  event.preventDefault();

  const serviceData = {
    title: document.getElementById("service-title").value,
    icon: document.getElementById("service-icon").value,
    description: document.getElementById("service-description").value,
    subServices: [], // Initialize empty array for sub-services
  };

  try {
    // Save the service to the database
    const result = await window.dataSdk.create(serviceData);

    if (result && result.isOk) {
      showToast("تمت إضافة الخدمة بنجاح", "success");
      closeModal("add-service-modal");
      // Refresh the services list
      renderServices();
    } else {
      throw new Error("Failed to save service");
    }
  } catch (error) {
    console.error("Error adding service:", error);
    showToast("حدث خطأ أثناء إضافة الخدمة", "error");
  }
}

// Handle Add Sub-Service Form Submission
async function handleAddSubService(event) {
  event.preventDefault();

  const subServiceData = {
    title: document.getElementById("subservice-title").value,
    description: document.getElementById("subservice-description").value,
    parentServiceId: document.getElementById("parent-service-id").value,
  };

  try {
    // Get the parent service
    const parentServiceId = subServiceData.parentServiceId;
    const parentService = await window.dataSdk.get(parentServiceId);

    if (!parentService) {
      throw new Error("Parent service not found");
    }

    // Add the sub-service to the parent's subServices array
    if (!parentService.subServices) {
      parentService.subServices = [];
    }

    parentService.subServices.push({
      title: subServiceData.title,
      description: subServiceData.description,
    });

    // Update the parent service with the new sub-service
    const result = await window.dataSdk.update(parentServiceId, parentService);

    if (result && result.isOk) {
      showToast("تمت إضافة الخدمة الفرعية بنجاح", "success");
      closeModal("add-subservice-modal");
      // Refresh the services list
      renderServices();
    } else {
      throw new Error("Failed to save sub-service");
    }
  } catch (error) {
    console.error("Error adding sub-service:", error);
    showToast("حدث خطأ أثناء إضافة الخدمة الفرعية", "error");
  }
}

// Render Services
async function renderServices() {
  const container = document.getElementById("services-cards");
  if (!container) return;

  try {
    // Fetch all services
    const services = await window.dataSdk.getAll(); // Adjust based on your SDK

    container.innerHTML = services
      .map(
        (service) => `
            <div class="service-card" data-service-id="${service.__backendId}">
                <div class="service-card-header">
                    <span class="material-symbols-outlined service-icon">${
                      service.icon
                    }</span>
                    <h3 class="service-title">${service.title}</h3>
                </div>
                <p class="service-description">${service.description}</p>
                
                <div class="service-actions">
                    <button class="btn-secondary" onclick="showAddSubServiceModal('${
                      service.__backendId
                    }', '${service.title}')">
                        <i class="fas fa-plus"></i> إضافة خدمة فرعية
                    </button>
                </div>
                
                ${
                  service.subServices && service.subServices.length > 0
                    ? `
                    <div class="sub-services">
                        <h4>الخدمات الفرعية:</h4>
                        <ul>
                            ${service.subServices
                              .map(
                                (sub) => `
                                <li class="sub-service-item">
                                    <strong>${sub.title}</strong>
                                    <p>${sub.description}</p>
                                </li>
                            `
                              )
                              .join("")}
                        </ul>
                    </div>
                `
                    : ""
                }
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading services:", error);
    showToast("حدث خطأ أثناء تحميل الخدمات", "error");
  }
}

// Add click-outside functionality for modals
document.addEventListener("DOMContentLoaded", () => {
  // For add service modal
  const addServiceModal = document.getElementById("add-service-modal");
  if (addServiceModal) {
    addServiceModal.addEventListener("click", (e) => {
      if (e.target === addServiceModal) {
        closeModal("add-service-modal");
      }
    });
  }

  // For add sub-service modal
  const addSubServiceModal = document.getElementById("add-subservice-modal");
  if (addSubServiceModal) {
    addSubServiceModal.addEventListener("click", (e) => {
      if (e.target === addSubServiceModal) {
        closeModal("add-subservice-modal");
      }
    });
  }

  // Call renderServices when the services page loads
  document
    .querySelector('.nav-item[data-page="services"]')
    ?.addEventListener("click", renderServices);
});

function showAddCardModal(page, section) {
  currentModalPage = page;
  currentModalSection = section;

  // If we're in the services page, show the add service modal
  if (page === "services") {
    showAddServiceModal();
    return;
  }

  // Existing code for other modals
  let modalId = "add-card-modal-services"; // default
  if (section === "header2") {
    modalId = "add-card-modal-publications";
  } else if (section === "header3") {
    modalId = "add-card-modal-testimonials";
  }

  document.getElementById(modalId).classList.remove("modal-hidden");

  // Reset the appropriate form
  const formId = modalId.replace("modal", "form");
  const form = document.getElementById(formId);
  if (form) form.reset();
}

// Show toast notification
function showToast(message, type = "info") {
  // Create toast element if it doesn't exist
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    document.body.appendChild(toast);
  }

  // Set toast content and style
  toast.textContent = message;
  toast.className = `toast toast-${type} toast-show`;

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("toast-show");
  }, 3000);
}

// Add toast styles to the head
const toastStyles = document.createElement("style");
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        min-width: 250px;
        text-align: center;
    }
    
    .toast-show {
        opacity: 1;
    }
    
    .toast-success {
        background-color: #10B981;
    }
    
    .toast-error {
        background-color: #EF4444;
    }
    
    .toast-info {
        background-color: #3B82F6;
    }
`;
document.head.appendChild(toastStyles);

function closeAddCardModal(type = "services") {
  const modalId = `add-card-modal-${type}`;
  document.getElementById(modalId).classList.add("modal-hidden");
}

function showEditCardModal(card, type = "services") {
  const modalId = `edit-card-modal-${type}`;
  const modal = document.getElementById(modalId);

  if (type === "services") {
    document.getElementById("edit-card-id-services").value = card.__backendId;
    document.getElementById("edit-card-title-services").value = card.title;
    document.getElementById("edit-card-icon-services").value = card.icon;
  } else if (type === "publications") {
    document.getElementById("edit-card-id-publications").value =
      card.__backendId;
    document.getElementById("edit-card-title-publications").value = card.title;
    document.getElementById("edit-card-excerpt-publications").value =
      card.description || "";
  } else if (type === "testimonials") {
    document.getElementById("edit-card-id-testimonials").value =
      card.__backendId;
    document.getElementById("edit-card-text-testimonials").value =
      card.description || "";
    document.getElementById("edit-card-name-testimonials").value = card.title;
  }

  modal.classList.remove("modal-hidden");
}

function closeEditCardModal(type = "services") {
  const modalId = `edit-card-modal-${type}`;
  document.getElementById(modalId).classList.add("modal-hidden");
}

// Setup click-outside listeners for all modals
document.addEventListener("DOMContentLoaded", () => {
  const modalTypes = ["services", "publications", "testimonials"];

  modalTypes.forEach((type) => {
    // Add modal click listeners
    const addModal = document.getElementById(`add-card-modal-${type}`);
    if (addModal) {
      addModal.addEventListener("click", (e) => {
        if (e.target === addModal) {
          closeAddCardModal(type);
        }
      });
    }

    // Edit modal click listeners
    const editModal = document.getElementById(`edit-card-modal-${type}`);
    if (editModal) {
      editModal.addEventListener("click", (e) => {
        if (e.target === editModal) {
          closeEditCardModal(type);
        }
      });
    }
  });

  // Delete confirmation modal listeners
  const deleteConfirmModal = document.getElementById("delete-confirm-modal");
  if (deleteConfirmModal) {
    // Click outside to close
    deleteConfirmModal.addEventListener("click", (e) => {
      if (e.target === deleteConfirmModal) {
        closeDeleteConfirmModal();
      }
    });
  }

  // Confirm delete button
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", confirmDelete);
  }

  // Cancel delete button
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", closeDeleteConfirmModal);
  }
});

// Handle Add Card
async function handleAddCard(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("submit-card-btn");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="loading-spinner"></div>';

  if (allCards.length >= 999) {
    showToast(
      "تم الوصول للحد الأقصى (999 بطاقة). يرجى حذف بعض البطاقات أولاً.",
      "error"
    );
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    return;
  }

  const title = document.getElementById("card-title").value;
  const description = document.getElementById("card-description").value;
  const icon = document.getElementById("card-icon").value;
  const value = document.getElementById("card-value").value;

  const newCard = {
    id: Date.now().toString(),
    type: currentModalSection,
    title: title,
    description: description,
    icon: icon,
    value: value,
    page: currentModalPage,
    order: allCards.filter(
      (c) => c.page === currentModalPage && c.type === currentModalSection
    ).length,
    createdAt: new Date().toISOString(),
  };

  const result = await window.dataSdk.create(newCard);

  if (result.isOk) {
    closeAddCardModal();
    showToast("تم إضافة البطاقة بنجاح", "success");
  } else {
    showToast("حدث خطأ أثناء إضافة البطاقة", "error");
  }

  submitBtn.disabled = false;
  submitBtn.textContent = originalText;
}

// Handle Edit Card
async function handleEditCard(event) {
  event.preventDefault();

  const updateBtn = document.getElementById("update-card-btn");
  const originalText = updateBtn.textContent;
  updateBtn.disabled = true;
  updateBtn.innerHTML = '<div class="loading-spinner"></div>';

  const cardId = document.getElementById("edit-card-id").value;
  const card = allCards.find((c) => c.__backendId === cardId);

  if (!card) {
    showToast("البطاقة غير موجودة", "error");
    updateBtn.disabled = false;
    updateBtn.textContent = originalText;
    return;
  }

  card.title = document.getElementById("edit-card-title").value;
  card.description = document.getElementById("edit-card-description").value;
  card.icon = document.getElementById("edit-card-icon").value;
  card.value = document.getElementById("edit-card-value").value;

  const result = await window.dataSdk.update(card);

  if (result.isOk) {
    closeEditCardModal();
    showToast("تم تحديث البطاقة بنجاح", "success");
  } else {
    showToast("حدث خطأ أثناء تحديث البطاقة", "error");
  }

  updateBtn.disabled = false;
  updateBtn.textContent = originalText;
}

// Store card data for deletion
let cardToDelete = null;
let deleteButtonElement = null;

// Delete Card - Show confirmation modal
function deleteCard(card, deleteBtn) {
  cardToDelete = card;
  deleteButtonElement = deleteBtn;

  // Show delete confirmation modal
  document
    .getElementById("delete-confirm-modal")
    .classList.remove("modal-hidden");
}

// Confirm delete
async function confirmDelete() {
  if (!cardToDelete || !deleteButtonElement) return;

  const cardElement = deleteButtonElement.closest(".service-card");
  const originalHTML = deleteButtonElement.innerHTML;
  deleteButtonElement.disabled = true;
  deleteButtonElement.innerHTML = '<div class="loading-spinner"></div>';

  try {
    // Try to delete via SDK if it has a valid backend ID
    if (
      cardToDelete.__backendId &&
      cardToDelete.__backendId !== cardToDelete.title
    ) {
      const result = await window.dataSdk.delete(cardToDelete);
      if (!result || !result.isOk) {
        throw new Error("Backend delete failed");
      }
    }

    // Remove the card from DOM
    if (cardElement) {
      cardElement.remove();
    }

    showToast("تم حذف البطاقة بنجاح", "success");
    closeDeleteConfirmModal();
  } catch (error) {
    console.error("Delete error:", error);
    showToast("حدث خطأ أثناء حذف البطاقة", "error");
    deleteButtonElement.disabled = false;
    deleteButtonElement.innerHTML = originalHTML;
  }

  cardToDelete = null;
  deleteButtonElement = null;
}

// Close delete confirmation modal
function closeDeleteConfirmModal() {
  document.getElementById("delete-confirm-modal").classList.add("modal-hidden");
  cardToDelete = null;
  deleteButtonElement = null;
}

// Render Service Cards (for "ما نقوم به" section - matches home page style)
function renderServiceCards() {
  const container = document.getElementById("service-cards-section");
  if (!container) return;

  const config = window.elementSdk?.config || defaultConfig;
  const primaryColor =
    config.primary_action_color || defaultConfig.primary_action_color;

  const services = [
    {
      title: "خدمات الشركات",
      icon: "business_center",
    },
    {
      title: "خدمات المستثمرين والأجانب",
      icon: "monetization_on",
    },
    {
      title: "خدمات القطاع الصناعي",
      icon: "factory",
    },
  ];

  container.innerHTML = services
    .map(
      (service) => `
    <div class="service-card" data-service-title="${service.title}">
      <div class="card-actions">
        <button class="card-action-btn edit-btn" style="background: #756a41;" title="تعديل">
          <i class="fas fa-edit"></i>
        </button>
        <button class="card-action-btn card-action-delete delete-btn" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <span class="material-symbols-outlined service-icon">${service.icon}</span>
      <h3 class="service-title">${service.title}</h3>
    </div>
  `
    )
    .join("");

  // Add event listeners to edit and delete buttons
  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".service-card");
      const title = card.dataset.serviceTitle;
      const mockCard = {
        __backendId: title,
        title: title,
        description: "",
        icon: "business_center",
        value: "",
      };
      showEditCardModal(mockCard, "services");
    });
  });

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".service-card");
      const title = card.dataset.serviceTitle;
      const mockCard = {
        __backendId: title,
        title: title,
        description: "",
        icon: "business_center",
        value: "",
      };
      deleteCard(mockCard, btn);
    });
  });
}

// Show Add Publication Modal
function showAddPublicationModal() {
  document
    .getElementById("add-publication-modal")
    .classList.remove("modal-hidden");
  document.getElementById("add-publication-form").reset();
}

// Handle Add Publication Form Submission
async function handleAddPublication(event) {
  event.preventDefault();

  const publicationData = {
    icon: document.getElementById("publication-icon").value,
    title: document.getElementById("publication-title").value,
    description: document.getElementById("publication-description").value,
  };

  try {
    const result = await window.dataSdk.create(publicationData);
    if (result.isOk) {
      showToast("تم إضافة المنشور بنجاح", "success");
      closeModal("add-publication-modal");
      renderPublications();
    } else {
      showToast("خطأ في إضافة المنشور", "error");
    }
  } catch (error) {
    showToast("حدث خطأ: " + error.message, "error");
  }
}

// Handle Edit Publication Form Submission
async function handleEditPublication(event) {
  event.preventDefault();

  const publicationId = document.getElementById("edit-publication-id").value;

  const publicationData = {
    icon: document.getElementById("edit-publication-icon").value,
    title: document.getElementById("edit-publication-title").value,
    description: document.getElementById("edit-publication-description").value,
  };

  try {
    const result = await window.dataSdk.update(publicationData);
    if (result.isOk) {
      showToast("تم تحديث المنشور بنجاح", "success");
      closeModal("edit-publication-modal");
      renderPublications();
    } else {
      showToast("خطأ في تحديث المنشور", "error");
    }
  } catch (error) {
    showToast("حدث خطأ: " + error.message, "error");
  }
}

// Render Publications
function renderPublications() {
  const container = document.getElementById("publications-cards");
  if (!container) return;

  container.innerHTML = publications
    .map(
      (pub) => `
    <div class="card" data-publication-id="${pub.id}">
      <div class="card-actions">
        <button class="card-action-btn edit-pub-btn" style="background: #756a41;" title="تعديل">
          <i class="fas fa-edit"></i>
        </button>
        <button class="card-action-btn card-action-delete delete-pub-btn" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="publication-icon">
        <span class="material-symbols-outlined">${pub.icon}</span>
      </div>
      <h3>${pub.title}</h3>
      <p>${pub.description}</p>
      <button class="btn-primary read-more-pub-btn" style="margin-top: 1rem; width: 100%;">
        <i class="fas fa-arrow-left"></i>
        <span>اعرف المزيد</span>
      </button>
    </div>
  `
    )
    .join("");

  // Add event listeners
  container.querySelectorAll(".read-more-pub-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".card");
      const pubId = card.dataset.publicationId;
      const pub = publications.find((p) => p.id === pubId);
      if (pub) {
        showPublicationDetail(pub);
      }
    });
  });

  container.querySelectorAll(".edit-pub-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".card");
      const pubId = card.dataset.publicationId;
      const pub = publications.find((p) => p.id === pubId);
      if (pub) {
        showEditPublicationModal(pub);
      }
    });
  });

  container.querySelectorAll(".delete-pub-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".card");
      const pubId = card.dataset.publicationId;
      const pub = publications.find((p) => p.id === pubId);
      if (pub) {
        deletePublication(pub, btn);
      }
    });
  });
}

// Show Publication Detail Modal
function showPublicationDetail(publication) {
  document.getElementById("view-publication-title").textContent =
    publication.title;
  document.getElementById("view-publication-content").innerHTML =
    publication.description;
  document
    .getElementById("view-publication-modal")
    .classList.remove("modal-hidden");

  // Setup edit button in modal
  document.getElementById("edit-publication-btn").onclick = () => {
    closeModal("view-publication-modal");
    showEditPublicationModal(publication);
  };
}

// Show Edit Publication Modal
function showEditPublicationModal(publication) {
  document.getElementById("edit-publication-id").value = publication.id;
  document.getElementById("edit-publication-icon").value = publication.icon;
  document.getElementById("edit-publication-title").value = publication.title;
  document.getElementById("edit-publication-description").value =
    publication.description;
  document
    .getElementById("edit-publication-modal")
    .classList.remove("modal-hidden");
}

// Delete Publication
function deletePublication(publication, deleteBtn) {
  if (confirm("هل أنت متأكد من حذف هذا المنشور؟")) {
    // Remove from publications array
    publications = publications.filter((p) => p.id !== publication.id);
    showToast("تم حذف المنشور", "success");
    renderPublications();
  }
}

// Setup click-outside for publication modals
document.addEventListener("DOMContentLoaded", () => {
  const addPubModal = document.getElementById("add-publication-modal");
  if (addPubModal) {
    addPubModal.addEventListener("click", (e) => {
      if (e.target === addPubModal) {
        closeModal("add-publication-modal");
      }
    });
  }

  const editPubModal = document.getElementById("edit-publication-modal");
  if (editPubModal) {
    editPubModal.addEventListener("click", (e) => {
      if (e.target === editPubModal) {
        closeModal("edit-publication-modal");
      }
    });
  }

  const viewPubModal = document.getElementById("view-publication-modal");
  if (viewPubModal) {
    viewPubModal.addEventListener("click", (e) => {
      if (e.target === viewPubModal) {
        closeModal("view-publication-modal");
      }
    });
  }

  document
    .querySelector('.nav-item[data-page="posts"]')
    ?.addEventListener("click", renderPublications);
});

// Filter and Search Cases
function applyFiltersAndRender() {
  filteredCases = cases.filter((caseItem) => {
    // Search filter
    const matchesSearch =
      !caseFilter.searchTerm ||
      caseItem.name.toLowerCase().includes(caseFilter.searchTerm) ||
      caseItem.email.toLowerCase().includes(caseFilter.searchTerm) ||
      caseItem.caseNumber.toLowerCase().includes(caseFilter.searchTerm);

    // Status filter
    const matchesStatus =
      !caseFilter.status || caseItem.status === caseFilter.status;

    return matchesSearch && matchesStatus;
  });

  renderCasesTable();
}

// Show Case Filter Modal
function showCaseFilterModal() {
  document.getElementById("case-filter-modal").classList.remove("modal-hidden");
}

// Close Case Filter Modal
function closeCaseFilterModal() {
  document.getElementById("case-filter-modal").classList.add("modal-hidden");
}

// Handle Filter Submit
function handleCaseFilter(event) {
  event.preventDefault();
  const statusFilter = document.getElementById("filter-status-select").value;
  caseFilter.status = statusFilter === "all" ? null : statusFilter;
  closeCaseFilterModal();
  applyFiltersAndRender();
}

// Reset Filters
function resetCaseFilters() {
  caseFilter.status = null;
  caseFilter.searchTerm = "";
  document.getElementById("case-search-input").value = "";
  document.getElementById("filter-status-select").value = "all";
  applyFiltersAndRender();
}

// Render Cases Table
function renderCasesTable() {
  const container = document.getElementById("cases-table-container");
  if (!container) return;

  const config = window.elementSdk?.config || defaultConfig;
  const bgColor = config.background_color || defaultConfig.background_color;
  const surfaceColor = config.surface_color || defaultConfig.surface_color;
  const textColor = config.text_color || defaultConfig.text_color;
  const primaryColor =
    config.primary_action_color || defaultConfig.primary_action_color;
  const secondaryColor =
    config.secondary_action_color || defaultConfig.secondary_action_color;

  // Use filtered cases for rendering
  const displayCases =
    filteredCases.length > 0 || caseFilter.searchTerm || caseFilter.status
      ? filteredCases
      : cases;

  const getStatusStyle = (status) => {
    switch (status) {
      case "نشطة":
        return `background: ${secondaryColor}; color: white;`;
      case "معلقة":
        return "background: #f59e0b; color: white;";
      case "مغلقة":
        return "background: #6b7280; color: white;";
      default:
        return `background: ${secondaryColor}; color: white;`;
    }
  };

  const casesRows =
    displayCases.length > 0
      ? displayCases
          .map((caseItem) => {
            const avatarLetters = caseItem.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("");
            return `
      <tr class="table-row" data-case-id="${caseItem.id}">
        <td>
          <div class="table-cell-user">
            <div class="user-avatar-small" style="background: ${primaryColor}30; color: ${primaryColor};">${avatarLetters}</div>
            <div>
              <div class="user-name-small">${caseItem.name}</div>
              <div class="user-email-small">${caseItem.email}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="case-id" style="background: ${primaryColor}20; color: ${primaryColor};">${
              caseItem.recordNumber
            }</span>
        </td>
        <td>
          <span class="case-id" style="background: ${primaryColor}20; color: ${primaryColor};">${
              caseItem.caseNumber
            }</span>
        </td>
        <td>
          <div class="table-cell-date">
            <i class="fas fa-calendar-day"></i>
            <span>${caseItem.date}</span>
          </div>
        </td>
        <td>
          <span class="case-status" style="${getStatusStyle(caseItem.status)}">
            <i class="fas fa-check-circle"></i>${caseItem.status}
          </span>
        </td>
        <td>
          <button class="action-btn notes-btn" title="الملاحظات" data-case-id="${
            caseItem.id
          }" style="background: ${primaryColor}30; color: ${primaryColor};">
            <i class="fas fa-sticky-note"></i>
          </button>
        </td>
        <td>
          <div class="table-cell-actions">
            <button class="action-btn view-case-btn" title="عرض" data-case-id="${
              caseItem.id
            }">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit-case-btn" style="background: ${primaryColor}; color: ${bgColor};" title="تعديل" data-case-id="${
              caseItem.id
            }">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn action-btn-delete delete-case-btn" title="حذف" data-case-id="${
              caseItem.id
            }">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
          })
          .join("")
      : `
    <tr>
      <td colspan="7" style="text-align: center; padding: 40px; color: #9ca3af;">
        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
        لا توجد قضايا حالياً
      </td>
    </tr>
  `;

  container.innerHTML = `
    <div class="cases-table-wrapper" style="background-color: ${surfaceColor}; color: ${textColor};">
      <div class="cases-table-header" style="background: linear-gradient(135deg, ${surfaceColor} 0%, ${bgColor} 100%);">
        <div class="cases-table-title">
          <div class="cases-table-icon" style="background: ${primaryColor};">
            <i class="fas fa-gavel" style="color: ${bgColor};"></i>
          </div>
          <div>
            <h3 style="color: ${primaryColor};">جدول القضايا</h3>
            <p>إدارة ومتابعة جميع القضايا (${displayCases.length})</p>
          </div>
        </div>
      </div>
      
      <div class="cases-table-controls">
        <div class="cases-table-buttons">
          <button class="btn-primary add-case-btn" style="background: ${primaryColor}; color: ${bgColor};">
            <i class="fas fa-plus"></i>
            <span>إضافة قضية جديدة</span>
          </button>
          <button class="btn-secondary" onclick="exportCasesToExcel()">
            <i class="fas fa-file-excel"></i>
            <span>تصدير Excel</span>
          </button>
        </div>
        <div class="cases-table-search">
        <div class="search-bar-container" >
            <input type="text" placeholder="بحث في القضايا..." 
                  class="search-input case-search-input" 
                  id="case-search-input"
                  value="${caseFilter.searchTerm}"
                  style="border: 1px solid ${primaryColor}40;" />
            <label for="case-search-input"><i class="fas fa-search"></i></label>
          </div>
          <button class="filter-btn" title="الفلاتر">
            <i class="fas fa-filter"></i>
          </button>
          ${
            caseFilter.searchTerm || caseFilter.status
              ? `<button class="reset-filter-btn" title="إعادة تعيين" onclick="resetCaseFilters()" style="background: none; border: none; color: ${primaryColor}; cursor: pointer; font-size: 18px; padding: 0 8px;"><i class="fas fa-times"></i></button>`
              : ""
          }
        </div>
      </div>
      
      <div class="cases-table-scroll">
        <table class="cases-table">
          <thead>
            <tr style="border-color: ${primaryColor}40; background: ${bgColor};">
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-user"></i>
                  <span>اسم العميل</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-hashtag"></i>
                  <span>رقم المحضر</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-hashtag"></i>
                  <span>رقم القضية</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-calendar"></i>
                  <span>تاريخ الجلسة</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-cog"></i>
                  <span>الحالة</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-sticky-note"></i>
                  <span>الملاحظات</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-tools"></i>
                  <span>الإجراءات</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${casesRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach event listeners
  const addCaseBtn = container.querySelector(".add-case-btn");
  if (addCaseBtn) {
    addCaseBtn.addEventListener("click", showAddCaseModal);
  }

  // View case buttons
  container.querySelectorAll(".view-case-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const caseId = btn.dataset.caseId;
      const caseItem = cases.find((c) => c.id === caseId);
      if (caseItem) {
        showCaseDetailModal(caseItem);
      }
    });
  });

  // Edit case buttons
  container.querySelectorAll(".edit-case-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const caseId = btn.dataset.caseId;
      const caseItem = cases.find((c) => c.id === caseId);
      if (caseItem) {
        showEditCaseModal(caseItem);
      }
    });
  });

  // Delete case buttons
  container.querySelectorAll(".delete-case-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const caseId = btn.dataset.caseId;
      const caseItem = cases.find((c) => c.id === caseId);
      if (caseItem) {
        deleteCase(caseItem);
      }
    });
  });

  // Notes buttons
  container.querySelectorAll(".notes-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const caseId = btn.dataset.caseId;
      const caseItem = cases.find((c) => c.id === caseId);
      if (caseItem) {
        showCaseNotesModal(caseItem);
      }
    });
  });

  // Search input
  const searchInput = container.querySelector(".case-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      caseFilter.searchTerm = e.target.value.toLowerCase();
      applyFiltersAndRender();
    });
  }

  // Filter button
  const filterBtn = container.querySelector(".filter-btn");
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      showCaseFilterModal();
    });
  }
}

// Show Add Case Modal
function showAddCaseModal() {
  document.getElementById("add-case-modal").classList.remove("modal-hidden");
  document.getElementById("add-case-form").reset();
}

// Handle Add Case Form Submission
async function handleAddCase(event) {
  event.preventDefault();

  const newCase = {
    id: Date.now().toString(),
    name: document.getElementById("case-name").value,
    recordNumber: document.getElementById("case-record-number").value,
    email: document.getElementById("case-email").value,
    caseNumber: document.getElementById("case-number").value,
    date: document.getElementById("case-date").value,
    status: document.getElementById("case-status").value,
    notes: "",
  };

  cases.push(newCase);
  showToast("تمت إضافة القضية بنجاح", "success");
  closeModal("add-case-modal");
  applyFiltersAndRender();
}

// Show Case Detail Modal
function showCaseDetailModal(caseItem) {
  document.getElementById("detail-case-name").textContent = caseItem.name;
  document.getElementById("detail-case-record-number").textContent =
    caseItem.recordNumber;
  document.getElementById("detail-case-email").textContent = caseItem.email;
  document.getElementById("detail-case-number").textContent =
    caseItem.caseNumber;
  document.getElementById("detail-case-date").textContent = caseItem.date;
  document.getElementById("detail-case-status").textContent = caseItem.status;
  document.getElementById("view-case-modal").classList.remove("modal-hidden");

  document.getElementById("edit-case-from-detail-btn").onclick = () => {
    closeModal("view-case-modal");
    showEditCaseModal(caseItem);
  };
}

// Show Edit Case Modal
function showEditCaseModal(caseItem) {
  document.getElementById("edit-case-id").value = caseItem.id;
  document.getElementById("edit-case-name").value = caseItem.name;
  document.getElementById("edit-case-record-number").value =
    caseItem.recordNumber;
  document.getElementById("edit-case-email").value = caseItem.email;
  document.getElementById("edit-case-number").value = caseItem.caseNumber;
  document.getElementById("edit-case-date").value = caseItem.date;
  document.getElementById("edit-case-status").value = caseItem.status;
  document.getElementById("edit-case-modal").classList.remove("modal-hidden");
}

// Handle Edit Case Form Submission
async function handleEditCase(event) {
  event.preventDefault();

  const caseId = document.getElementById("edit-case-id").value;
  const caseIndex = cases.findIndex((c) => c.id === caseId);

  if (caseIndex !== -1) {
    cases[caseIndex] = {
      id: caseId,
      name: document.getElementById("edit-case-name").value,
      recordNumber: document.getElementById("edit-case-record-number").value,
      email: document.getElementById("edit-case-email").value,
      caseNumber: document.getElementById("edit-case-number").value,
      date: document.getElementById("edit-case-date").value,
      status: document.getElementById("edit-case-status").value,
      notes: cases[caseIndex].notes,
    };

    showToast("تم تحديث القضية بنجاح", "success");
    closeModal("edit-case-modal");
    applyFiltersAndRender();
  }
}

// Delete Case
function deleteCase(caseItem) {
  if (confirm(`هل أنت متأكد من حذف قضية ${caseItem.name}؟`)) {
    cases = cases.filter((c) => c.id !== caseItem.id);
    showToast("تم حذف القضية بنجاح", "success");
    applyFiltersAndRender();
  }
}

// Show Case Notes Modal
function showCaseNotesModal(caseItem) {
  const notesTextarea = document.getElementById("case-notes-text");
  notesTextarea.value = caseItem.notes || "";

  document.getElementById("case-notes-modal").classList.remove("modal-hidden");

  // Store current case ID for saving
  document.getElementById("save-notes-btn").onclick = () => {
    const caseIndex = cases.findIndex((c) => c.id === caseItem.id);
    if (caseIndex !== -1) {
      cases[caseIndex].notes = notesTextarea.value;
      showToast("تم حفظ الملاحظات بنجاح", "success");
      closeModal("case-notes-modal");
      applyFiltersAndRender();
    }
  };
}

// ==================== Administrative Functions ====================

// Filter and Search Administrative Tasks
function applyAdministrativeFiltersAndRender() {
  filteredAdministrative = administrative.filter((task) => {
    // Search filter
    const matchesSearch =
      !administrativeFilter.searchTerm ||
      task.name.toLowerCase().includes(administrativeFilter.searchTerm) ||
      task.owner.toLowerCase().includes(administrativeFilter.searchTerm) ||
      task.number.toLowerCase().includes(administrativeFilter.searchTerm);

    // Priority filter
    const matchesPriority =
      !administrativeFilter.priority ||
      task.priority === administrativeFilter.priority;

    return matchesSearch && matchesPriority;
  });

  renderAdministrativeTable();
}

// Show Administrative Filter Modal
function showAdministrativeFilterModal() {
  document
    .getElementById("administrative-filter-modal")
    .classList.remove("modal-hidden");
}

// Close Administrative Filter Modal
function closeAdministrativeFilterModal() {
  document
    .getElementById("administrative-filter-modal")
    .classList.add("modal-hidden");
}

// Handle Administrative Filter Submit
function handleAdministrativeFilter(event) {
  event.preventDefault();
  const priorityFilter = document.getElementById(
    "filter-priority-select"
  ).value;
  administrativeFilter.priority =
    priorityFilter === "all" ? null : priorityFilter;
  closeAdministrativeFilterModal();
  applyAdministrativeFiltersAndRender();
}

// Reset Administrative Filters
function resetAdministrativeFilters() {
  administrativeFilter.priority = null;
  administrativeFilter.searchTerm = "";
  document.getElementById("administrative-search-input").value = "";
  document.getElementById("filter-priority-select").value = "all";
  applyAdministrativeFiltersAndRender();
}

// Render Administrative Table
function renderAdministrativeTable() {
  const container = document.getElementById("administrative-table-container");
  if (!container) return;

  const config = window.elementSdk?.config || defaultConfig;
  const bgColor = config.background_color || defaultConfig.background_color;
  const surfaceColor = config.surface_color || defaultConfig.surface_color;
  const textColor = config.text_color || defaultConfig.text_color;
  const primaryColor =
    config.primary_action_color || defaultConfig.primary_action_color;
  const secondaryColor =
    config.secondary_action_color || defaultConfig.secondary_action_color;

  // Use filtered tasks for rendering
  const displayTasks =
    filteredAdministrative.length > 0 ||
    administrativeFilter.searchTerm ||
    administrativeFilter.priority
      ? filteredAdministrative
      : administrative;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "عالية":
        return "background: #ef4444; color: white;";
      case "متوسطة":
        return "background: #f59e0b; color: white;";
      case "منخفضة":
        return "background: #3b82f6; color: white;";
      default:
        return "background: #6b7280; color: white;";
    }
  };

  const administrativeRows =
    displayTasks.length > 0
      ? displayTasks
          .map((task) => {
            const avatarLetters = task.owner
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("");
            return `
      <tr class="table-row" data-administrative-id="${task.id}">
        <td>
          <div class="table-cell-user">
            <div class="user-avatar-small" style="background: ${primaryColor}30; color: ${primaryColor};">${avatarLetters}</div>
            <div>
              <div class="user-name-small">${task.name}</div>
              <div class="user-email-small">${task.owner}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="case-id" style="background: ${primaryColor}20; color: ${primaryColor};">${
              task.number
            }</span>
        </td>
        <td>
          <div class="table-cell-date">
            <i class="fas fa-calendar-day"></i>
            <span>${task.date}</span>
          </div>
        </td>
        <td>
          <span class="case-status" style="${getPriorityStyle(task.priority)}">
            <i class="fas fa-exclamation-circle"></i>${task.priority}
          </span>
        </td>
        <td>
          <button class="action-btn notes-btn" title="الملاحظات" data-administrative-id="${
            task.id
          }" style="background: ${primaryColor}30; color: ${primaryColor};">
            <i class="fas fa-sticky-note"></i>
          </button>
        </td>
        <td>
          <div class="table-cell-actions">
            <button class="action-btn view-administrative-btn" title="عرض" data-administrative-id="${
              task.id
            }">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit-administrative-btn" style="background: ${primaryColor}; color: ${bgColor};" title="تعديل" data-administrative-id="${
              task.id
            }">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn action-btn-delete delete-administrative-btn" title="حذف" data-administrative-id="${
              task.id
            }">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
          })
          .join("")
      : `
    <tr>
      <td colspan="6" style="text-align: center; padding: 40px; color: #9ca3af;">
        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
        لا توجد أعمال إدارية حالياً
      </td>
    </tr>
  `;

  container.innerHTML = `
    <div class="cases-table-wrapper" style="background-color: ${surfaceColor}; color: ${textColor};">
      <div class="cases-table-header" style="background: linear-gradient(135deg, ${surfaceColor} 0%, ${bgColor} 100%);">
        <div class="cases-table-title">
          <div class="cases-table-icon" style="background: ${primaryColor};">
            <i class="fas fa-book" style="color: ${bgColor};"></i>
          </div>
          <div>
            <h3 style="color: ${primaryColor};">الأعمال الإدارية</h3>
            <p>إدارة ومتابعة الأعمال الإدارية (${displayTasks.length})</p>
          </div>
        </div>
      </div>
      
      <div class="cases-table-controls">
        <div class="cases-table-buttons">
          <button class="btn-primary add-administrative-btn" style="background: ${primaryColor}; color: ${bgColor};">
            <i class="fas fa-plus"></i>
            <span>إضافة عمل جديد</span>
          </button>
          <button class="btn-secondary" onclick="exportAdministrativeToExcel()">
            <i class="fas fa-file-excel"></i>
            <span>تصدير Excel</span>
          </button>
        </div>
        <div class="cases-table-search">
          <div class="search-bar-container">
            <input type="text" placeholder="بحث في الأعمال الإدارية..." 
                  class="search-input administrative-search-input" 
                  id="administrative-search-input"
                  value="${administrativeFilter.searchTerm}"
                  style="border: 1px solid ${primaryColor}40;" />
            <label for="administrative-search-input"><i class="fas fa-search"></i></label>
          </div>
          <button class="filter-btn" title="الفلاتر">
            <i class="fas fa-filter"></i>
          </button>
          ${
            administrativeFilter.searchTerm || administrativeFilter.priority
              ? `<button class="reset-filter-btn" title="إعادة تعيين" onclick="resetAdministrativeFilters()" style="background: none; border: none; color: ${primaryColor}; cursor: pointer; font-size: 18px; padding: 0 8px;"><i class="fas fa-times"></i></button>`
              : ""
          }
        </div>
      </div>
      
      <div class="cases-table-scroll">
        <table class="cases-table">
          <thead>
            <tr style="border-color: ${primaryColor}40; background: ${bgColor};">
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-user"></i>
                  <span>اسم العمل / الصاحب</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-hashtag"></i>
                  <span>رقم العمل</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-calendar"></i>
                  <span>تاريخ الموعد</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-exclamation-circle"></i>
                  <span>الأولوية</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-sticky-note"></i>
                  <span>الملاحظات</span>
                </div>
              </th>
              <th style="color: ${primaryColor};">
                <div>
                  <i class="fas fa-tools"></i>
                  <span>الإجراءات</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${administrativeRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach event listeners
  const addBtn = container.querySelector(".add-administrative-btn");
  if (addBtn) {
    addBtn.addEventListener("click", showAddAdministrativeModal);
  }

  // View buttons
  container.querySelectorAll(".view-administrative-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = btn.dataset.administrativeId;
      const task = administrative.find((t) => t.id === taskId);
      if (task) {
        showAdministrativeDetailModal(task);
      }
    });
  });

  // Edit buttons
  container.querySelectorAll(".edit-administrative-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = btn.dataset.administrativeId;
      const task = administrative.find((t) => t.id === taskId);
      if (task) {
        showEditAdministrativeModal(task);
      }
    });
  });

  // Delete buttons
  container.querySelectorAll(".delete-administrative-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = btn.dataset.administrativeId;
      const task = administrative.find((t) => t.id === taskId);
      if (task) {
        deleteAdministrative(task);
      }
    });
  });

  // Notes buttons
  container.querySelectorAll(".notes-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = btn.dataset.administrativeId;
      const task = administrative.find((t) => t.id === taskId);
      if (task) {
        showAdministrativeNotesModal(task);
      }
    });
  });

  // Search input
  const searchInput = container.querySelector(".administrative-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      administrativeFilter.searchTerm = e.target.value.toLowerCase();
      applyAdministrativeFiltersAndRender();
    });
  }

  // Filter button
  const filterBtn = container.querySelector(".filter-btn");
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      showAdministrativeFilterModal();
    });
  }
}

// Show Add Administrative Modal
function showAddAdministrativeModal() {
  document
    .getElementById("add-administrative-modal")
    .classList.remove("modal-hidden");
  document.getElementById("add-administrative-form").reset();
}

// Handle Add Administrative Form Submission
async function handleAddAdministrative(event) {
  event.preventDefault();

  const newTask = {
    id: Date.now().toString(),
    name: document.getElementById("administrative-name").value,
    owner: document.getElementById("administrative-owner").value,
    number: document.getElementById("administrative-number").value,
    date: document.getElementById("administrative-date").value,
    priority: document.getElementById("administrative-priority").value,
    notes: "",
  };

  administrative.push(newTask);
  showToast("تمت إضافة العمل الإداري بنجاح", "success");
  closeModal("add-administrative-modal");
  applyAdministrativeFiltersAndRender();
}

// Show Administrative Detail Modal
function showAdministrativeDetailModal(task) {
  document.getElementById("detail-administrative-name").textContent = task.name;
  document.getElementById("detail-administrative-owner").textContent =
    task.owner;
  document.getElementById("detail-administrative-number").textContent =
    task.number;
  document.getElementById("detail-administrative-date").textContent = task.date;
  document.getElementById("detail-administrative-priority").textContent =
    task.priority;
  document
    .getElementById("view-administrative-modal")
    .classList.remove("modal-hidden");

  document.getElementById("edit-administrative-from-detail-btn").onclick =
    () => {
      closeModal("view-administrative-modal");
      showEditAdministrativeModal(task);
    };
}

// Show Edit Administrative Modal
function showEditAdministrativeModal(task) {
  document.getElementById("edit-administrative-id").value = task.id;
  document.getElementById("edit-administrative-name").value = task.name;
  document.getElementById("edit-administrative-owner").value = task.owner;
  document.getElementById("edit-administrative-number").value = task.number;
  document.getElementById("edit-administrative-date").value = task.date;
  document.getElementById("edit-administrative-priority").value = task.priority;
  document
    .getElementById("edit-administrative-modal")
    .classList.remove("modal-hidden");
}

// Show Administrative Notes Modal
function showAdministrativeNotesModal(task) {
  const notesTextarea = document.getElementById("case-notes-text");
  notesTextarea.value = task.notes || "";
  document.getElementById("case-notes-modal").classList.remove("modal-hidden");
  document.getElementById("save-notes-btn").onclick = () => {
    const taskIndex = administrative.findIndex((t) => t.id === task.id);
    if (taskIndex !== -1) {
      administrative[taskIndex].notes = notesTextarea.value;
      showToast("تم حفظ الملاحظات بنجاح", "success");
      closeModal("case-notes-modal");
      applyAdministrativeFiltersAndRender();
    }
  };
}

// Handle Edit Administrative Form Submission
async function handleEditAdministrative(event) {
  event.preventDefault();

  const taskId = document.getElementById("edit-administrative-id").value;
  const taskIndex = administrative.findIndex((t) => t.id === taskId);

  if (taskIndex !== -1) {
    administrative[taskIndex] = {
      id: taskId,
      name: document.getElementById("edit-administrative-name").value,
      owner: document.getElementById("edit-administrative-owner").value,
      number: document.getElementById("edit-administrative-number").value,
      date: document.getElementById("edit-administrative-date").value,
      priority: document.getElementById("edit-administrative-priority").value,
      notes: administrative[taskIndex].notes,
    };

    showToast("تم تحديث العمل الإداري بنجاح", "success");
    closeModal("edit-administrative-modal");
    applyAdministrativeFiltersAndRender();
  }
}

// Delete Administrative Task
function deleteAdministrative(task) {
  if (confirm(`هل أنت متأكد من حذف العمل "${task.name}"؟`)) {
    administrative = administrative.filter((t) => t.id !== task.id);
    showToast("تم حذف العمل الإداري بنجاح", "success");
    applyAdministrativeFiltersAndRender();
  }
}

// Render Cards
function renderCards() {
  const containers = {
    "home-header1": document.getElementById("home-header1-cards"),
    "home-header2": document.getElementById("home-header2-cards"),
    "home-header3": document.getElementById("home-header3-cards"),
    services: document.getElementById("services-cards"),
    publications: document.getElementById("publications-cards"),
  };

  Object.values(containers).forEach((container) => {
    if (container) container.innerHTML = "";
  });
}

// Show Toast Notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 30px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 1000;
    animation: slideDown 0.3s ease;
    background: ${type === "success" ? "#10b981" : "#ef4444"};
    color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideUp 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize sidebar toggle
  setupSidebarToggle();

  // Initialize theme
  const root = document.documentElement;
  root.setAttribute("data-theme", "dark");
  root.style.setProperty("--color-bg", "#000000");
  root.style.setProperty("--color-primary", "#f3c623");
  root.style.setProperty("--color-primary-sec", "#ffdf6d");
  root.style.setProperty("--color-secondary", "#ffffff");
  root.style.setProperty("--color-icons", "#ffffff");
  root.style.setProperty("--shadows", "0px 0px 15px 1px #f3c623");

  // Setup case modal click-outside listeners
  const addCaseModal = document.getElementById("add-case-modal");
  if (addCaseModal) {
    addCaseModal.addEventListener("click", (e) => {
      if (e.target === addCaseModal) {
        closeModal("add-case-modal");
      }
    });
  }

  const editCaseModal = document.getElementById("edit-case-modal");
  if (editCaseModal) {
    editCaseModal.addEventListener("click", (e) => {
      if (e.target === editCaseModal) {
        closeModal("edit-case-modal");
      }
    });
  }

  const viewCaseModal = document.getElementById("view-case-modal");
  if (viewCaseModal) {
    viewCaseModal.addEventListener("click", (e) => {
      if (e.target === viewCaseModal) {
        closeModal("view-case-modal");
      }
    });
  }

  const filterCaseModal = document.getElementById("case-filter-modal");
  if (filterCaseModal) {
    filterCaseModal.addEventListener("click", (e) => {
      if (e.target === filterCaseModal) {
        closeCaseFilterModal();
      }
    });
  }

  // Administrative modals click-outside listeners
  const addAdministrativeModal = document.getElementById(
    "add-administrative-modal"
  );
  if (addAdministrativeModal) {
    addAdministrativeModal.addEventListener("click", (e) => {
      if (e.target === addAdministrativeModal) {
        closeModal("add-administrative-modal");
      }
    });
  }

  const editAdministrativeModal = document.getElementById(
    "edit-administrative-modal"
  );
  if (editAdministrativeModal) {
    editAdministrativeModal.addEventListener("click", (e) => {
      if (e.target === editAdministrativeModal) {
        closeModal("edit-administrative-modal");
      }
    });
  }

  const viewAdministrativeModal = document.getElementById(
    "view-administrative-modal"
  );
  if (viewAdministrativeModal) {
    viewAdministrativeModal.addEventListener("click", (e) => {
      if (e.target === viewAdministrativeModal) {
        closeModal("view-administrative-modal");
      }
    });
  }

  const filterAdministrativeModal = document.getElementById(
    "administrative-filter-modal"
  );
  if (filterAdministrativeModal) {
    filterAdministrativeModal.addEventListener("click", (e) => {
      if (e.target === filterAdministrativeModal) {
        closeAdministrativeFilterModal();
      }
    });
  }

  renderServiceCards();
  renderPublications();
  renderCasesTable();
  renderAdministrativeTable();
  renderCards();
});
