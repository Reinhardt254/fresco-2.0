const SEARCH_TEMPLATE_URL = "/search/index.html";
const SEARCH_STYLES_URL = "/assets/styles/search.css";

let popupInitialized = false;
let popupOverlay = null;
let popupInput = null;

const ensureSearchStyles = () => {
  const existingStyles = document.querySelector(
    `link[data-search-popup-styles="${SEARCH_STYLES_URL}"]`,
  );
  if (existingStyles) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = SEARCH_STYLES_URL;
  link.dataset.searchPopupStyles = SEARCH_STYLES_URL;
  document.head.appendChild(link);
};

const injectSearchTemplate = async () => {
  const response = await fetch(SEARCH_TEMPLATE_URL);
  if (!response.ok) {
    throw new Error("Could not load search template");
  }

  const templateHtml = await response.text();
  document.body.insertAdjacentHTML("beforeend", templateHtml);

  popupOverlay = document.getElementById("search-popup-overlay");
  popupInput = document.getElementById("search-popup-input");
};

const closeSearchPopup = () => {
  if (!popupOverlay) return;

  popupOverlay.classList.remove("is-open");
  popupOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("search-popup-open");
};

const openSearchPopup = () => {
  if (!popupOverlay) return;

  popupOverlay.classList.add("is-open");
  popupOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("search-popup-open");

  if (popupInput) {
    popupInput.focus();
  }
};
 
const bindPopupInteractions = () => {
  if (!popupOverlay) return;

  popupOverlay.addEventListener("click", (event) => {
    if (event.target === popupOverlay) {
      closeSearchPopup();
    }
  });

  popupOverlay
    .querySelectorAll("[data-search-close]")
    .forEach((closeButton) =>
      closeButton.addEventListener("click", closeSearchPopup),
    );

  popupOverlay
    .querySelectorAll(".search-popup-tag")
    .forEach((tagButton) =>
      tagButton.addEventListener("click", () => {
        if (popupInput) {
          popupInput.value = tagButton.textContent.trim();
          popupInput.focus();
        }
      }),
    );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popupOverlay.classList.contains("is-open")) {
      closeSearchPopup();
    }
  });
};

const initSearchPopup = async () => {
  if (popupInitialized) return;

  ensureSearchStyles();
  await injectSearchTemplate();
  bindPopupInteractions();
  popupInitialized = true;
};

const setupSearchTriggers = () => {
  const triggers = document.querySelectorAll(".search-icon");
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.style.cursor = "pointer";
    trigger.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        await initSearchPopup();
        openSearchPopup();
      } catch (error) {
        console.error("Search popup failed to initialize:", error);
      }
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupSearchTriggers);
} else {
  setupSearchTriggers();
}
