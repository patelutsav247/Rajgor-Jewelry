"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productDetails");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = getProducts().find(item => String(item.id) === String(productId));

  if (!product) {
    container.innerHTML = `
      <div>
        <h2>Product not found</h2>
        <p>Please return to the collection and choose a product.</p>
        <a class="btn btn-gold" href="index.html#featured">Browse Products</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div>
      <img class="details-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}">
    </div>
    <div class="details-info">
      <p class="eyebrow">${escapeHTML(product.category)} COLLECTION</p>
      <h2>${escapeHTML(product.name)}</h2>
      <p class="details-price">${formatPrice(product.price)}</p>
      <p>${escapeHTML(product.description || "A beautiful jewellery design for your collection.")}</p>
      <p><strong>Category:</strong> ${escapeHTML(product.category)}</p>
      <p class="small-note">Displayed price and product details are sample data for this frontend demo.</p>
      <div class="quantity-control">
        <span>Quantity</span>
        <button type="button" id="qtyMinus" aria-label="Decrease quantity">−</button>
        <input type="number" id="productQuantity" value="1" min="1" max="20" aria-label="Quantity">
        <button type="button" id="qtyPlus" aria-label="Increase quantity">+</button>
      </div>
      <button type="button" id="addDetailToCart" class="btn btn-gold">Add to Bag</button>
      <a class="btn btn-dark" href="cart.html">View Bag</a>
    </div>
  `;

  const quantityInput = document.getElementById("productQuantity");

  document.getElementById("qtyMinus").addEventListener("click", () => {
    quantityInput.value = Math.max(1, (Number(quantityInput.value) || 1) - 1);
  });

  document.getElementById("qtyPlus").addEventListener("click", () => {
    quantityInput.value = Math.min(20, (Number(quantityInput.value) || 1) + 1);
  });

  document.getElementById("addDetailToCart").addEventListener("click", () => {
    const quantity = Math.max(1, Math.min(20, Number(quantityInput.value) || 1));
    addToCart(product.id, quantity);
  });

  document.getElementById("currentYear").textContent = new Date().getFullYear();
});