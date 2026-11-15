
"use strict";

/* ==========================================
   RAJGOR JEWELRY - MAIN JAVASCRIPT
   Frontend demo version
========================================== */

/* 1. SAMPLE PRODUCTS */

const SAMPLE_PRODUCTS = [
  {
    id: "gold-001",
    name: "Classic Gold Necklace",
    category: "Gold",
    price: 45999,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80",
    description: "An elegant gold necklace design for celebrations and special occasions."
  },
  {
    id: "diamond-001",
    name: "Diamond Pendant",
    category: "Diamond",
    price: 28999,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    description: "A refined pendant design that adds a touch of sparkle to your look."
  },
  {
    id: "silver-001",
    name: "Silver Everyday Bracelet",
    category: "Silver",
    price: 2499,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80",
    description: "A versatile silver bracelet for everyday wear and thoughtful gifting."
  },
  {
    id: "bridal-001",
    name: "Bridal Jewellery Set",
    category: "Bridal",
    price: 75999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIpzcpu1y9H1EqrlGHtILe6JXQ0gNm1wkDS3cmFs7B1Q&s=10",
    description: "A statement jewellery set inspired by traditional bridal elegance."
  },
  {
    id: "gold-002",
    name: "Gold Statement Earrings",
    category: "Gold",
    price: 12999,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
    description: "Beautiful statement earrings to complement festive outfits."
  },
  {
    id: "diamond-002",
    name: "Diamond Ring",
    category: "Diamond",
    price: 35999,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "A timeless ring design for gifts, milestones and special moments."
  },
  {
    id: "silver-002",
    name: "Silver Pendant",
    category: "Silver",
    price: 1799,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
    description: "A simple silver pendant designed for versatile styling."
  },
  {
    id: "bridal-002",
    name: "Bridal Earrings",
    category: "Bridal",
    price: 18999,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    description: "Decorative earrings for weddings and grand celebrations."
  }
];


/* 2. LOCAL STORAGE HELPERS */

function readLocalJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Could not read local data:", key, error);
    return fallback;
  }
}


/* 3. GET PRODUCTS */

function getProducts() {
  const saved = readLocalJSON("rajgorProducts", null);

  return Array.isArray(saved) && saved.length > 0
    ? saved
    : SAMPLE_PRODUCTS;
}


/* 4. GET CART */

function getCart() {
  const cart = readLocalJSON("rajgorCart", []);
  return Array.isArray(cart) ? cart : [];
}


/* 5. SAVE CART */

function saveCart(cart) {
  localStorage.setItem("rajgorCart", JSON.stringify(cart));
  updateCartCount();
}


/* 6. FORMAT PRICE */

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(price) || 0);
}


/* 7. ESCAPE HTML */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}


/* 8. UPDATE CART COUNT */

function updateCartCount() {
  const countElement = document.getElementById("cartCount");

  if (!countElement) return;

  const total = getCart().reduce((sum, item) => {
    return sum + Math.max(0, Number(item.quantity) || 0);
  }, 0);

  countElement.textContent = total;
}


/* 9. ADD PRODUCT TO CART */

function addToCart(productId, quantity = 1) {
  const product = getProducts().find(
    item => String(item.id) === String(productId)
  );

  if (!product) {
    alert("Product not found. Please refresh the page.");
    return;
  }

  const cart = getCart();

  const existing = cart.find(
    item => String(item.id) === String(productId)
  );

  const amount = Math.max(
    1,
    Math.min(20, Number(quantity) || 1)
  );

  if (existing) {
    existing.quantity = Math.min(
      20,
      (Number(existing.quantity) || 0) + amount
    );
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price) || 0,
      image: product.image,
      quantity: amount
    });
  }

  saveCart(cart);

  alert("Product added to your demo cart!");
}


/* 10. RENDER PRODUCTS */

function renderProducts() {
  const grid = document.getElementById("productGrid");

  if (!grid) return;

  const search = (
    document.getElementById("productSearch")?.value || ""
  ).trim().toLowerCase();

  const category =
    document.getElementById("categoryFilter")?.value || "All";

  const sort =
    document.getElementById("sortProducts")?.value || "default";

  let products = getProducts().filter(product => {
    const matchesSearch =
      String(product.name || "").toLowerCase().includes(search) ||
      String(product.category || "").toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    products.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (sort === "high") {
    products.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  if (products.length === 0) {
    grid.innerHTML =
      '<p class="empty-state">No products found. Try another search.</p>';
    return;
  }

  grid.innerHTML = products.map(product => {

    /* FIXED PRODUCT DETAILS URL */
    const detailsURL =
      `./product-details.html?id=${encodeURIComponent(product.id)}`;

    return `
      <article class="product-card">

        <a class="product-image" href="${detailsURL}">
          <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
          >
        </a>

        <div class="product-info">

          <span class="product-category">
            ${escapeHTML(product.category)}
          </span>

          <h3>
            <a href="${detailsURL}">
              ${escapeHTML(product.name)}
            </a>
          </h3>

          <p class="product-price">
            ${formatPrice(product.price)}
          </p>

          <div class="product-actions">

            <a
              class="btn btn-dark"
              href="${detailsURL}"
            >
              View Details
            </a>

            <button
              class="btn btn-gold"
              type="button"
              data-add-cart="${escapeHTML(product.id)}"
            >
              Add to Bag
            </button>

          </div>
        </div>
      </article>
    `;
  }).join("");
}


/* 11. INITIALIZE WEBSITE */

document.addEventListener("DOMContentLoaded", () => {

  /* Mobile navigation */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
  });

  /* Close mobile navigation after clicking a link */
  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });

  /* Current year */
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* Search */
  document
    .getElementById("productSearch")
    ?.addEventListener("input", renderProducts);

  /* Category filter */
  document
    .getElementById("categoryFilter")
    ?.addEventListener("change", renderProducts);

  /* Price sorting */
  document
    .getElementById("sortProducts")
    ?.addEventListener("change", renderProducts);

  /* Add to cart */
  document
    .getElementById("productGrid")
    ?.addEventListener("click", event => {

      const button = event.target.closest("[data-add-cart]");

      if (button) {
        addToCart(button.dataset.addCart);
      }
    });

  /* Collection category links */
  document.querySelectorAll("[data-category-link]").forEach(link => {

    link.addEventListener("click", () => {

      const filter = document.getElementById("categoryFilter");

      if (filter) {
        filter.value = link.dataset.categoryLink;
        renderProducts();
      }
    });
  });

  // /* Contact enquiry form */
  // document
  //   .getElementById("enquiryForm")
  //   ?.addEventListener("submit", event => {

  //     event.preventDefault();

  //     const form = event.currentTarget;
  //     const message = document.getElementById("formMessage");

  //     const enquiry = {
  //       id: "enq-" + Date.now(),
  //       name: form.elements.name.value.trim(),
  //       phone: form.elements.phone.value.trim(),
  //       email: form.elements.email.value.trim(),
  //       message: form.elements.message.value.trim(),
  //       status: "New",
  //       createdAt: new Date().toISOString()
  //     };

  //     if (
  //       !enquiry.name ||
  //       !enquiry.phone ||
  //       !enquiry.message
  //     ) {
  //       if (message) {
  //         message.textContent =
  //           "Please fill in your name, phone number and enquiry.";

  //         message.className = "form-message error";
  //       }

  //       return;
  //     }

  //     /* Frontend demo only: saves to this browser */
  //     const enquiries = readLocalJSON("rajgorEnquiries", []);

  //     enquiries.unshift(enquiry);

  //     localStorage.setItem(
  //       "rajgorEnquiries",
  //       JSON.stringify(enquiries)
  //     );

  //     if (message) {
  //       message.textContent =
  //         "Your demo enquiry has been saved in this browser.";

  //       message.className = "form-message success";
  //     }

  //     form.reset();
  //   });

  
/* Contact enquiry form */
document
  .getElementById("enquiryForm")
  ?.addEventListener("submit", event => {

    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("formMessage");

    const enquiry = {
      id: "enq-" + Date.now(),
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
      status: "New",
      createdAt: new Date().toISOString()
    };

    // Show validation message
    function showError(text) {
      if (message) {
        message.textContent = text;
        message.className = "form-message error";
      }
    }

    // 1. Name condition
    if (!enquiry.name) {
      showError("Please enter your name.");
      form.elements.name.focus();
      return;
    }

    // 2. Phone condition: Indian 10-digit mobile number
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(enquiry.phone)) {
      showError("Please enter a valid 10-digit Indian mobile number.");
      form.elements.phone.focus();
      return;
    }

    // 3. Email condition
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(enquiry.email)) {
      showError("Please enter a valid email address.");
      form.elements.email.focus();
      return;
    }

    // 4. Enquiry condition
    if (!enquiry.message) {
      showError("Please enter your enquiry.");
      form.elements.message.focus();
      return;
    }

    // 5. Minimum enquiry length
    if (enquiry.message.length < 10) {
      showError("Your enquiry must contain at least 10 characters.");
      form.elements.message.focus();
      return;
    }

    // All validations passed
    const enquiries = JSON.parse(
      localStorage.getItem("rajgorEnquiries") || "[]"
    );

    enquiries.push(enquiry);

    localStorage.setItem(
      "rajgorEnquiries",
      JSON.stringify(enquiries)
    );

    if (message) {
      message.textContent =
        "Thank you! Your enquiry has been submitted successfully.";
      message.className = "form-message success";
    }

    form.reset();
  });




  /* Initial page setup */
  updateCartCount();
  renderProducts();

});
