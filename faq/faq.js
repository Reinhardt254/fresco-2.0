/**
 * FAQ page: category tabs + accordion with animated open/close
 */
(function () {
  const categoryBtns = document.querySelectorAll(".faq-category-btn");
  const panels = document.querySelectorAll(".faq-panel");
  const accordionItems = document.querySelectorAll(".faq-accordion-item");
  const accordionTriggers = document.querySelectorAll(".faq-accordion-trigger");

  // Category switching
  if (categoryBtns.length && panels.length) {
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        const targetId = `${category}-faqs`;

        // Update active button
        categoryBtns.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        // Show target panel, hide others
        panels.forEach((panel) => {
          const isTarget = panel.id === targetId;
          panel.classList.toggle("active", isTarget);
          panel.hidden = !isTarget;
        });

        // Close all accordions in the newly shown panel
        const activePanel = document.getElementById(targetId);
        if (activePanel) {
          activePanel.querySelectorAll(".faq-accordion-item").forEach((item) => {
            item.classList.remove("is-open");
            const trigger = item.querySelector(".faq-accordion-trigger");
            const answer = item.querySelector(".faq-accordion-answer");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
            if (answer) answer.setAttribute("aria-hidden", "true");
          });
        }
      });
    });
  }

  // Accordion toggle with animation
  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-accordion-item");
      const answer = item.querySelector(".faq-accordion-answer");
      const isOpen = item.classList.contains("is-open");

      if (isOpen) {
        item.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        if (answer) answer.setAttribute("aria-hidden", "true");
      } else {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        if (answer) answer.setAttribute("aria-hidden", "false");
      }
    });
  });
})();
