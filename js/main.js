document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  const mobileMenuButton = document.querySelector(
    ".mobile-menu-button .toggle"
  );
  const nav = document.querySelector("nav");

  if (mobileMenuButton && nav) {
    mobileMenuButton.addEventListener("click", () => {
      nav.classList.toggle("mobile-nav-active");
      mobileMenuButton.classList.toggle("active");
      // Add aria-expanded attribute for accessibility
      const isExpanded = nav.classList.contains("mobile-nav-active");
      mobileMenuButton.setAttribute("aria-expanded", isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !nav.contains(e.target) &&
        !mobileMenuButton.contains(e.target) &&
        nav.classList.contains("mobile-nav-active")
      ) {
        nav.classList.remove("mobile-nav-active");
        mobileMenuButton.classList.remove("active");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("mobile-nav-active")) {
        nav.classList.remove("mobile-nav-active");
        mobileMenuButton.classList.remove("active");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Update active nav link based on current page
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    // Handle both relative and absolute paths
    const linkPath = href.startsWith("./") ? href.substring(2) : href;
    const currentPage = currentPath.substring(currentPath.lastIndexOf("/") + 1);

    // Check if the link matches the current page
    if (
      linkPath === currentPage ||
      (currentPage === "" && linkPath === "home.html") ||
      (currentPage === "" && linkPath === "./home.html")
    ) {
      link.classList.add("active");
    }
  });

  // Update copyright year
  const yearElement = document.querySelector(".copyright-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize social media links hover effects
  const socialLinks = document.querySelectorAll(".social-links a");
  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Theme toggle functionality
  const themeToggle = document.querySelector("#theme-toggle");
  if (themeToggle) {
    // Load saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      // Apply new theme
      document.documentElement.setAttribute("data-theme", newTheme);

      // Update icon
      updateThemeIcon(newTheme);

      // Save preference to localStorage
      localStorage.setItem("theme", newTheme);

      // Add transition class for smooth animation
      document.documentElement.classList.add("theme-transition");
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 300);
    });
  }

  // Function to update theme icon
  function updateThemeIcon(theme) {
    const themeToggle = document.querySelector("#theme-toggle");
    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      if (theme === "dark") {
        icon.className = "fa-solid fa-moon";
      } else {
        icon.className = "fa-solid fa-sun";
      }
    }
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Handle consultation booking buttons
  const bookButtons = document.querySelectorAll(".cta-button");
  bookButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      // Add your booking logic here
      console.log("Booking consultation...");
      // Example: You could open a modal, redirect to a booking page, etc.
    });
  });

  // Optional: Add animation on scroll
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add("visible");
      }
    });
  };

  // Optional: Initialize animations
  if (document.querySelector(".animate-on-scroll")) {
    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll(); // Initial check
  }

  // Scroll to top button functionality
  const backToTopButton = document.querySelector(".back-to-top");
  if (backToTopButton) {
    const amountScrolled = 200;

    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.scrollY > amountScrolled) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    });

    // Smooth scroll to top when button is clicked
    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
