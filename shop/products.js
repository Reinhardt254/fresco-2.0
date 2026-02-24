(function () {
  "use strict";

  // Price filter range (easy to change)
  var PRICE_RANGE_MIN = 0;
  var PRICE_RANGE_MAX = 50;

  var DEBOUNCE_MS = 300;

  function debounce(fn, delay) {
    var timeoutId;
    return function () {
      var args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  var gridEl = document.getElementById("products-grid");
  var cards = gridEl ? gridEl.querySelectorAll(".product-card") : [];
  var resultsCountEl = document.querySelector(".products-results-count");
  var initialCardOrder = gridEl ? Array.prototype.slice.call(cards, 0) : [];

  function updateResultsCount(visible) {
    if (!resultsCountEl) return;
    var total = cards.length;
    resultsCountEl.textContent = visible === 0
      ? "Showing 0 of " + total + " results"
      : "Showing 1-" + visible + " of " + total + " results";
  }

  function getProductNameFromCard(card) {
    var nameEl = card.querySelector(".product-name span");
    return nameEl ? (nameEl.textContent || "").trim() : "";
  }

  function applyFilters() {
    var priceMinEl = document.getElementById("price-min");
    var priceMaxEl = document.getElementById("price-max");
    var rangeMin = document.querySelector(".price-range-min");
    var rangeMax = document.querySelector(".price-range-max");
    var minPrice = rangeMin ? parseInt(rangeMin.value, 10) : PRICE_RANGE_MIN;
    var maxPrice = rangeMax ? parseInt(rangeMax.value, 10) : PRICE_RANGE_MAX;

    var activeCategory = document.querySelector(".sidebar-categories .category-link.active");
    var category = activeCategory && activeCategory.dataset.category ? activeCategory.dataset.category : "all";

    var searchInput = document.getElementById("products-search-input");
    var query = searchInput ? (searchInput.value || "").trim().toLowerCase() : "";

    var visible = 0;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var price = parseInt(card.getAttribute("data-price"), 10);
      var collections = (card.getAttribute("data-collections") || "").split(",").map(function (s) { return s.trim(); });
      var name = getProductNameFromCard(card).toLowerCase();

      var matchPrice = price >= minPrice && price <= maxPrice;
      var matchCategory = category === "all" || collections.indexOf(category) !== -1;
      var matchSearch = query === "" || name.indexOf(query) !== -1;
      var show = matchPrice && matchCategory && matchSearch;

      card.style.display = show ? "" : "none";
      if (show) visible++;
    }
    updateResultsCount(visible);
  }

  // Price range labels + fill
  var priceMinEl = document.getElementById("price-min");
  var priceMaxEl = document.getElementById("price-max");
  var rangeMin = document.querySelector(".price-range-min");
  var rangeMax = document.querySelector(".price-range-max");
  var rangeFill = document.getElementById("range-fill");

  if (priceMinEl && priceMaxEl && rangeMin && rangeMax) {
    rangeMin.setAttribute("min", PRICE_RANGE_MIN);
    rangeMin.setAttribute("max", PRICE_RANGE_MAX);
    rangeMax.setAttribute("min", PRICE_RANGE_MIN);
    rangeMax.setAttribute("max", PRICE_RANGE_MAX);
    if (parseInt(rangeMin.value, 10) < PRICE_RANGE_MIN) rangeMin.value = PRICE_RANGE_MIN;
    if (parseInt(rangeMax.value, 10) > PRICE_RANGE_MAX) rangeMax.value = PRICE_RANGE_MAX;

    function updatePriceLabels() {
      var min = parseInt(rangeMin.value, 10);
      var max = parseInt(rangeMax.value, 10);
      if (min > max) {
        rangeMin.value = max;
        min = max;
      }
      if (max < min) {
        rangeMax.value = min;
        max = min;
      }
      priceMinEl.textContent = min;
      priceMaxEl.textContent = max;
      if (rangeFill) {
        var leftPct = (min / PRICE_RANGE_MAX) * 100;
        var widthPct = ((max - min) / PRICE_RANGE_MAX) * 100;
        rangeFill.style.left = leftPct + "%";
        rangeFill.style.width = widthPct + "%";
      }
    }

    var debouncedApplyFilters = debounce(applyFilters, DEBOUNCE_MS);

    function onRangeInput() {
      updatePriceLabels();
      debouncedApplyFilters();
    }

    rangeMin.addEventListener("input", onRangeInput);
    rangeMax.addEventListener("input", onRangeInput);
    updatePriceLabels();
  }

  // Search products
  var searchInput = document.getElementById("products-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(applyFilters, DEBOUNCE_MS));
    searchInput.addEventListener("search", applyFilters);
  }

  // Sort by
  var sortSelect = document.getElementById("products-sort");
  if (gridEl && sortSelect) {
    function getProductName(card) {
      var nameEl = card.querySelector(".product-name span");
      return nameEl ? (nameEl.textContent || "").trim() : "";
    }
    function getProductPrice(card) {
      return parseInt(card.getAttribute("data-price"), 10) || 0;
    }
    function applySort() {
      var value = sortSelect.value;
      var cardsArray = Array.prototype.slice.call(gridEl.querySelectorAll(".product-card"));
      if (value === "default") {
        cardsArray = initialCardOrder.slice();
      } else if (value === "price-asc") {
        cardsArray.sort(function (a, b) { return getProductPrice(a) - getProductPrice(b); });
      } else if (value === "price-desc") {
        cardsArray.sort(function (a, b) { return getProductPrice(b) - getProductPrice(a); });
      } else if (value === "name-asc") {
        cardsArray.sort(function (a, b) {
          return getProductName(a).localeCompare(getProductName(b), undefined, { sensitivity: "base" });
        });
      } else if (value === "name-desc") {
        cardsArray.sort(function (a, b) {
          return getProductName(b).localeCompare(getProductName(a), undefined, { sensitivity: "base" });
        });
      }
      for (var i = 0; i < cardsArray.length; i++) {
        gridEl.appendChild(cardsArray[i]);
      }
      applyFilters();
    }
    sortSelect.addEventListener("change", applySort);
  }

  // Category links
  var categoryLinks = document.querySelectorAll(".sidebar-categories .category-link");
  categoryLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      categoryLinks.forEach(function (l) { l.classList.remove("active"); });
      link.classList.add("active");
      applyFilters();
    });
  });

  // View toggle (list / grid)
  var viewListBtn = document.querySelector(".view-btn.view-list");
  var viewGridBtn = document.querySelector(".view-btn.view-grid");

  if (gridEl && viewListBtn && viewGridBtn) {
    viewListBtn.addEventListener("click", function () {
      viewListBtn.classList.add("active");
      viewGridBtn.classList.remove("active");
      gridEl.classList.add("view-list");
    });
    viewGridBtn.addEventListener("click", function () {
      viewGridBtn.classList.add("active");
      viewListBtn.classList.remove("active");
      gridEl.classList.remove("view-list");
    });
  }

  applyFilters();
})();
