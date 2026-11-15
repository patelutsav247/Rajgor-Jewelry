"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Demo guard only. This is not secure authentication.
  if (sessionStorage.getItem("rajgorDemoAdmin") !== "true") {
    window.location.replace("admin-login.html");
    return;
  }

  const $ = id => document.getElementById(id);

  function readData(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function allProducts() {
    const saved = readData("rajgorProducts", null);
    return Array.isArray(saved) ? saved : SAMPLE_PRODUCTS;
  }

  function saveProducts(products) {
    saveData("rajgorProducts", products);
  }

  function allEnquiries() {
    const data = readData("rajgorEnquiries", []);
    return Array.isArray(data) ? data : [];
  }

  function showMessage(element, text, type = "success") {
    element.textContent = text;
    element.className = `form-message ${type}`;
  }

  function activateSection(name) {
    document.querySelectorAll(".admin-section").forEach(section => {
      section.classList.toggle("active", section.id === `section-${name}`);
    });

    document.querySelectorAll("[data-section]").forEach(button => {
      button.classList.toggle("active", button.dataset.section === name);
    });
  }

  document.querySelectorAll("[data-section]").forEach(button => {
    button.addEventListener("click", () => activateSection(button.dataset.section));
  });

  document.querySelectorAll("[data-open-section]").forEach(button => {
    button.addEventListener("click", () => activateSection(button.dataset.openSection));
  });

  $("logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("rajgorDemoAdmin");
    window.location.href = "admin-login.html";
  });

  function renderStats() {
    const products = allProducts();
    const enquiries = allEnquiries();

    $("statProducts").textContent = products.length;
    $("statEnquiries").textContent = enquiries.length;
    $("statNewEnquiries").textContent =
      enquiries.filter(item => (item.status || "New") === "New").length;
  }

  function resetProductForm() {
    $("adminProductForm").reset();
    $("editProductId").value = "";
    $("productFormTitle").textContent = "Add New Product";
    $("saveProductButton").textContent = "Save Product";
    $("cancelEditButton").hidden = true;
  }

  function renderProducts() {
    const products = allProducts();
    $("productListCount").textContent = products.length;
    const list = $("adminProductList");

    if (!products.length) {
      list.innerHTML = '<p class="empty-state">No products found.</p>';
      renderStats();
      return;
    }

    list.innerHTML = products.map(product => `
      <article class="admin-product-row">
        <img src="${escapeHTML(product.image || "")}" alt="${escapeHTML(product.name)}">
        <div>
          <h3>${escapeHTML(product.name)}</h3>
          <p>${escapeHTML(product.category)} · ${formatPrice(product.price)}</p>
          <p>${escapeHTML(product.description || "")}</p>
        </div>
        <div class="row-actions">
          <button type="button" class="small-button" data-edit-product="${escapeHTML(product.id)}">Edit</button>
          <button type="button" class="small-button danger" data-delete-product="${escapeHTML(product.id)}">Delete</button>
        </div>
      </article>
    `).join("");

    renderStats();
  }

  $("adminProductForm").addEventListener("submit", event => {
    event.preventDefault();

    const message = $("productFormMessage");
    const editId = $("editProductId").value;
    const name = $("productName").value.trim();
    const category = $("productCategory").value;
    const price = Number($("productPrice").value);
    const image = $("productImage").value.trim() ||
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80";
    const description = $("productDescription").value.trim();

    if (!name || !Number.isFinite(price) || price <= 0) {
      showMessage(message, "Enter a product name and a valid price.", "error");
      return;
    }

    const products = allProducts();
    const productData = {
      id: editId || `custom-${Date.now()}`,
      name,
      category,
      price,
      image,
      description
    };

    if (editId) {
      const index = products.findIndex(product => String(product.id) === String(editId));
      if (index === -1) {
        showMessage(message, "Product not found.", "error");
        return;
      }
      products[index] = productData;
    } else {
      products.unshift(productData);
    }

    saveProducts(products);
    resetProductForm();
    showMessage(message, editId ? "Product updated in this browser." : "Product added in this browser.");
    renderProducts();
  });

  $("cancelEditButton").addEventListener("click", resetProductForm);

  $("adminProductList").addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit-product]");
    const deleteButton = event.target.closest("[data-delete-product]");

    if (editButton) {
      const product = allProducts().find(item =>
        String(item.id) === String(editButton.dataset.editProduct));

      if (!product) return;

      $("editProductId").value = product.id;
      $("productName").value = product.name || "";
      $("productCategory").value = product.category || "Gold";
      $("productPrice").value = product.price || "";
      $("productImage").value = product.image || "";
      $("productDescription").value = product.description || "";
      $("productFormTitle").textContent = "Edit Product";
      $("saveProductButton").textContent = "Update Product";
      $("cancelEditButton").hidden = false;

      activateSection("products");
      $("productName").focus();
    }

    if (deleteButton) {
      const id = deleteButton.dataset.deleteProduct;
      const product = allProducts().find(item => String(item.id) === String(id));
      if (!product) return;

      if (!confirm(`Delete "${product.name}" from this browser's demo catalogue?`)) return;

      saveProducts(allProducts().filter(item => String(item.id) !== String(id)));
      renderProducts();
    }
  });

  function renderEnquiries() {
    const enquiries = allEnquiries();
    $("enquiryListCount").textContent = enquiries.length;
    const list = $("adminEnquiryList");

    if (!enquiries.length) {
      list.innerHTML = '<p class="empty-state">No enquiries yet. Submit the form on the website to test it.</p>';
      renderStats();
      return;
    }

    list.innerHTML = enquiries.map(enquiry => `
      <article class="enquiry-card">
        <div class="enquiry-header">
          <div>
            <h3>${escapeHTML(enquiry.name || "Unnamed customer")}</h3>
            <p>${escapeHTML(enquiry.phone || "")}</p>
            <p>${escapeHTML(enquiry.email || "No email provided")}</p>
          </div>
          <select class="enquiry-status" data-enquiry-status="${escapeHTML(enquiry.id)}" aria-label="Change enquiry status">
            ${["New", "Contacted", "Resolved"].map(status =>
              `<option value="${status}" ${(enquiry.status || "New") === status ? "selected" : ""}>${status}</option>`
            ).join("")}
          </select>
        </div>
        <p class="enquiry-message">${escapeHTML(enquiry.message || "")}</p>
        <p>Received: ${escapeHTML(enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : "Unknown date")}</p>
      </article>
    `).join("");

    renderStats();
  }

  $("adminEnquiryList").addEventListener("change", event => {
    const select = event.target.closest("[data-enquiry-status]");
    if (!select) return;

    const enquiries = allEnquiries();
    const enquiry = enquiries.find(item =>
      String(item.id) === String(select.dataset.enquiryStatus));

    if (!enquiry) return;

    enquiry.status = select.value;
    saveData("rajgorEnquiries", enquiries);
    renderEnquiries();
  });

  renderProducts();
  renderEnquiries();
  renderStats();
});