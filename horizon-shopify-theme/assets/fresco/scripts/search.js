(function () {
  const popupOverlay = document.getElementById("search-popup-overlay");
  if (!popupOverlay) return;

  const popupInput = document.getElementById("search-popup-input");
  const resultsSection = document.getElementById("search-popup-results");
  const resultsGrid = document.getElementById("search-popup-results-grid");
  const defaultsSection = document.getElementById("search-popup-defaults");

  let debounceTimer = null;

  const closeSearchPopup = () => {
    popupOverlay.classList.remove("is-open");
    popupOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("search-popup-open");
  };

  const openSearchPopup = () => {
    popupOverlay.classList.add("is-open");
    popupOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("search-popup-open");
    if (popupInput) popupInput.focus();
  };

  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) closeSearchPopup();
  });

  popupOverlay.querySelectorAll("[data-search-close]").forEach((btn) =>
    btn.addEventListener("click", closeSearchPopup)
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popupOverlay.classList.contains("is-open")) {
      closeSearchPopup();
    }
  });

  popupOverlay.querySelectorAll(".search-popup-tag").forEach((tag) =>
    tag.addEventListener("click", () => {
      if (popupInput) {
        popupInput.value = tag.textContent.trim();
        popupInput.focus();
        popupInput.dispatchEvent(new Event("input"));
      }
    })
  );

  const renderResults = (products) => {
    if (!resultsGrid) return;
    resultsGrid.innerHTML = "";

    if (!products || products.length === 0) {
      resultsGrid.innerHTML =
        '<p style="grid-column:1/-1;color:#888;font-size:14px;">No products found.</p>';
      return;
    }

    products.forEach((product) => {
      const img = product.featured_image
        ? product.featured_image.url
        : "";
      const card = document.createElement("a");
      card.href = product.url;
      card.className = "search-popup-card";
      card.innerHTML =
        (img
          ? '<img src="' + img + '" alt="' + (product.title || "") + '" width="400" height="400" loading="lazy">'
          : "") +
        "<span>" + product.title + "</span>";
      resultsGrid.appendChild(card);
    });
  };

  const fetchPredictiveSearch = async (query) => {
    if (!query || query.length < 2) {
      if (resultsSection) resultsSection.style.display = "none";
      if (defaultsSection) defaultsSection.style.display = "";
      return;
    }

    try {
      const res = await fetch(
        "/search/suggest.json?q=" +
          encodeURIComponent(query) +
          "&resources[type]=product&resources[limit]=8"
      );
      if (!res.ok) return;
      const data = await res.json();
      const products =
        data.resources && data.resources.results && data.resources.results.products
          ? data.resources.results.products
          : [];

      renderResults(products);
      if (resultsSection) resultsSection.style.display = "";
      if (defaultsSection) defaultsSection.style.display = "none";
    } catch (err) {
      console.error("Predictive search error:", err);
    }
  };

  if (popupInput) {
    popupInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      const q = popupInput.value.trim();
      if (q.length < 2) {
        if (resultsSection) resultsSection.style.display = "none";
        if (defaultsSection) defaultsSection.style.display = "";
        return;
      }
      debounceTimer = setTimeout(() => fetchPredictiveSearch(q), 300);
    });
  }

  document.querySelectorAll(".search-icon, #search-open-icon").forEach((trigger) => {
    trigger.style.cursor = "pointer";
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openSearchPopup();
    });
  });
})();
