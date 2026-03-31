(function () {
  const STORAGE_KEY = 'fresco-wishlist-handles-v1';
  const CUSTOMER_TOKEN_KEY = 'shopify_customer_token';
  const TOGGLE_SELECTOR = '[data-wishlist-toggle="true"][data-wishlist-handle]';
  const LOGIN_PATH = '/account/login';
  const STOREFRONT_API_VERSION = '2025-01';
  const WISHLIST_NAMESPACE = 'custom';
  const WISHLIST_KEY = 'wishlist';
  const ENABLE_LOCALSTORAGE_BACKUP = true;

  /** @type {string[]} */
  let handlesCache = [];
  let cacheLoaded = false;

  function isAuthenticated() {
    return document.documentElement.getAttribute('data-customer-authenticated') === 'true';
  }

  function redirectToLogin() {
    const returnUrl = `${window.location.pathname}${window.location.search}`;
    window.location.href = `${LOGIN_PATH}?return_url=${encodeURIComponent(returnUrl)}`;
  }

  function getApiConfig() {
    const cfg = /** @type {any} */ (window).ShopifyWishlist || {};
    return {
      shopDomain: typeof cfg.shopDomain === 'string' ? cfg.shopDomain : '',
      storefrontToken: typeof cfg.storefrontToken === 'string' ? cfg.storefrontToken : '',
      customerAccessToken: localStorage.getItem(CUSTOMER_TOKEN_KEY) || '',
    };
  }

  function canUseMetafields() {
    const cfg = getApiConfig();
    return Boolean(isAuthenticated() && cfg.shopDomain && cfg.storefrontToken && cfg.customerAccessToken);
  }

  function readBackupHandles() {
    if (!ENABLE_LOCALSTORAGE_BACKUP) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((x) => typeof x === 'string' && x.length > 0);
    } catch (e) {
      return [];
    }
  }

  /**
   * @param {string[]} handles
   */
  function writeBackupHandles(handles) {
    if (!ENABLE_LOCALSTORAGE_BACKUP) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
    } catch (e) {
      // Ignore storage errors
    }
  }

  async function loadHandlesFromMetafield() {
    try {
      const { shopDomain, storefrontToken, customerAccessToken } = getApiConfig();
      const query = `
        query GetCustomerWishlist($customerAccessToken: String!) {
          customer(customerAccessToken: $customerAccessToken) {
            metafield(namespace: "${WISHLIST_NAMESPACE}", key: "${WISHLIST_KEY}") {
              value
            }
          }
        }
      `;
      const res = await fetch(`https://${shopDomain}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
        },
        body: JSON.stringify({
          query: query,
          variables: { customerAccessToken: customerAccessToken },
        }),
      });
      if (!res.ok) return [];
      const data = await res.json();
      const rawValue = data?.data?.customer?.metafield?.value;
      if (!rawValue) return [];
      const parsed = JSON.parse(rawValue);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((x) => typeof x === 'string' && x.length > 0);
    } catch (e) {
      return [];
    }
  }

  /**
   * @param {string[]} handles
   */
  async function saveHandlesToMetafield(handles) {
    try {
      const { shopDomain, storefrontToken, customerAccessToken } = getApiConfig();
      const escapedValue = JSON.stringify(handles).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const mutation = `
        mutation UpdateCustomerWishlist($customerAccessToken: String!) {
          customerUpdate(
            customerAccessToken: $customerAccessToken,
            customer: {
              metafields: [{
                namespace: "${WISHLIST_NAMESPACE}",
                key: "${WISHLIST_KEY}",
                type: "json",
                value: "${escapedValue}"
              }]
            }
          ) {
            customer { id }
            customerUserErrors { message }
          }
        }
      `;
      await fetch(`https://${shopDomain}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { customerAccessToken: customerAccessToken },
        }),
      });
    } catch (e) {
      // Ignore API write errors to avoid breaking UX.
    }
  }

  async function loadWishlistHandles() {
    if (cacheLoaded) return handlesCache;
    if (canUseMetafields()) {
      handlesCache = await loadHandlesFromMetafield();
    } else {
      handlesCache = readBackupHandles();
    }
    cacheLoaded = true;
    return handlesCache;
  }

  /**
   * @param {string[]} handles
   */
  async function persistWishlistHandles(handles) {
    handlesCache = handles.filter((x) => typeof x === 'string' && x.length > 0);
    cacheLoaded = true;
    if (canUseMetafields()) {
      await saveHandlesToMetafield(handlesCache);
    } else {
      writeBackupHandles(handlesCache);
    }
  }

  /**
   * @param {string} handle
   */
  function isWishlisted(handle) {
    if (!isAuthenticated()) return false;
    return handlesCache.includes(handle);
  }

  /**
   * @param {Element} btn
   * @param {boolean} on
   */
  function setButtonState(btn, on) {
    btn.classList.toggle('is-wishlisted', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (on) {
      icon.classList.add('fa-solid');
      icon.classList.remove('fa-regular');
    } else {
      icon.classList.add('fa-regular');
      icon.classList.remove('fa-solid');
    }
  }

  /**
   * @param {ParentNode} root
   */
  function syncWishlistButtons(root) {
    const scope = root || document;
    const loggedIn = isAuthenticated();
    scope.querySelectorAll(TOGGLE_SELECTOR).forEach(function (btn) {
      const handle = btn.getAttribute('data-wishlist-handle');
      if (!handle) return;
      setButtonState(btn, loggedIn ? isWishlisted(handle) : false);
    });
  }

  function getWishlistPageRoot() {
    return /** @type {HTMLElement | null} */ (
      document.querySelector('[data-wishlist-page-root]')
    );
  }

  async function renderWishlistPage() {
    const root = getWishlistPageRoot();
    if (!root) return;
    const grid = /** @type {HTMLElement | null} */ (root.querySelector('[data-wishlist-grid]'));
    const emptyEl = /** @type {HTMLElement | null} */ (root.querySelector('[data-wishlist-empty]'));
    if (!grid) return;

    const handles = await loadWishlistHandles();
    if (handles.length === 0) {
      grid.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    grid.innerHTML = '<div class="wishlist-loading">Loading...</div>';
    /** @type {Array<{ handle: string, product: any, variant: any }>} */
    const items = [];
    for (const handle of handles) {
      try {
        const res = await fetch(`/products/${encodeURIComponent(handle)}.js`, { credentials: 'same-origin' });
        if (!res.ok) continue;
        const product = await res.json();
        const variant =
          product.variants?.find(
            /**
             * @param {{ available?: boolean }} v
             * @returns {boolean}
             */
            function (v) {
              return Boolean(v?.available);
            },
          ) || product.variants?.[0];
        if (!variant) continue;
        items.push({ handle, product, variant });
      } catch (e) {
        // Ignore per-item failures
      }
    }

    grid.innerHTML = '';
    const currencyCode = root.getAttribute('data-wishlist-currency') || 'USD';
    /**
     * @param {number|string} minorUnits
     * @returns {string}
     */
    const formatPrice = (minorUnits) => {
      const n = typeof minorUnits === 'string' ? parseInt(minorUnits, 10) : minorUnits;
      const value = (Number.isFinite(n) ? n : 0) / 100;
      try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(value);
      } catch (e) {
        return `$${value.toFixed(2)}`;
      }
    };

    if (items.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    /**
     * @param {any} img
     * @returns {string}
     */
    const getImageSrc = (img) => {
      if (!img) return '';
      if (typeof img === 'string') return img;
      if (typeof img !== 'object') return '';
      return img.src || img.url || img.original_src || img.original_url || img.preview_image?.src || '';
    };

    const frag = document.createDocumentFragment();
    items.forEach(({ handle, product, variant }) => {
      const productUrl = product?.handle ? `/products/${product.handle}` : `/products/${handle}`;
      const imageSrc =
        getImageSrc(product?.featured_image) ||
        getImageSrc(product?.images?.[0]) ||
        getImageSrc(variant?.featured_image) ||
        getImageSrc(variant?.image) ||
        '';
      const title = product?.title || handle;
      const priceText = variant?.price != null ? formatPrice(variant.price) : '';
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <a href="${productUrl}" class="product-card__link">
          <div class="product-image">${imageSrc ? `<img class="product-card__image" src="${imageSrc}" alt="${String(title).replace(/"/g, '&quot;')}" loading="lazy" width="400" height="400">` : ''}</div>
          <h3 class="product-name"><span>${title}</span></h3>
        </a>
        <div class="product-price"><span class="current-price">${priceText}</span></div>
        <button type="button" class="product-card-add" data-variant-id="${variant.id}" data-variants-count="${product?.variants?.length ?? 1}" data-product-url="${productUrl}" data-fresco-related-wired="true">Add to cart</button>
        <button type="button" class="product-details-wishlist wishlist-heart-overlay" data-wishlist-toggle="true" data-wishlist-handle="${handle}" aria-label="Remove from wishlist" aria-pressed="true">
          <i class="fa-regular fa-heart" aria-hidden="true"></i>
        </button>
      `;
      frag.appendChild(card);
    });
    grid.appendChild(frag);
    syncWishlistButtons(root);
  }

  /**
   * @param {string} handle
   */
  async function removeHandle(handle) {
    await persistWishlistHandles(handlesCache.filter((h) => h !== handle));
  }

  /**
   * @param {string} handle
   */
  async function addHandle(handle) {
    const next = [...handlesCache];
    if (!next.includes(handle)) next.push(handle);
    await persistWishlistHandles(next);
  }

  document.addEventListener(
    'click',
    async function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const toggleEl = target.closest(TOGGLE_SELECTOR);
      if (!toggleEl) return;
      const handle = toggleEl.getAttribute('data-wishlist-handle');
      if (!handle) return;

      event.preventDefault();
      event.stopPropagation();

      if (!isAuthenticated()) {
        redirectToLogin();
        return;
      }

      await loadWishlistHandles();
      const nextOn = !isWishlisted(handle);
      if (nextOn) await addHandle(handle);
      else await removeHandle(handle);
      setButtonState(toggleEl, nextOn);
      renderWishlistPage();
    },
    true,
  );

  document.addEventListener('click', async function (event) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const clearBtn = target.closest('[data-wishlist-clear-all="true"]');
    if (clearBtn) {
      await persistWishlistHandles([]);
      syncWishlistButtons(document);
      renderWishlistPage();
      return;
    }
    const addBtn = target.closest('[data-wishlist-add="true"][data-wishlist-variant-id]');
    if (addBtn) {
      const variantId = addBtn.getAttribute('data-wishlist-variant-id');
      if (!variantId) return;
      event.preventDefault();
      event.stopPropagation();
      addBtn.textContent = 'Adding...';
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: parseInt(variantId, 10), quantity: 1 }] }),
      })
        .then(function () {
          addBtn.textContent = 'Added!';
          window.setTimeout(function () {
            addBtn.textContent = 'Add to cart';
          }, 1500);
        })
        .catch(function () {
          addBtn.textContent = 'Add to cart';
        });
    }
  });

  const quickAddModalContent = document.getElementById('quick-add-modal-content');
  if (quickAddModalContent && 'MutationObserver' in window) {
    const mo = new MutationObserver(function () {
      syncWishlistButtons(quickAddModalContent);
    });
    mo.observe(quickAddModalContent, { childList: true, subtree: true });
  }

  const init = async function () {
    await loadWishlistHandles();
    syncWishlistButtons(document);
    renderWishlistPage();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

