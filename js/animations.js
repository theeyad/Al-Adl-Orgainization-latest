// Function to check if an element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to handle scroll animations
function handleScrollAnimations() {
  // Get all cards that need animation
  const cards = document.querySelectorAll(
    ".service-card, .publication-card, .testimonial-card"
  );

  cards.forEach((card, index) => {
    if (isInViewport(card)) {
      // Add delay based on index for stagger effect
      setTimeout(() => {
        card.classList.add("animate");
      }, index * 100); // 100ms delay between each card
    }
  });
}

// Initial check for elements in viewport
document.addEventListener("DOMContentLoaded", () => {
  handleScrollAnimations();
});

// Check on scroll
window.addEventListener("scroll", () => {
  handleScrollAnimations();
});
