"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cartContent");
  if (!container) return;

  document.getElementById("currentYear").textContent = new Date().getFullYear();

  function renderCart() {
    const cart = getCart();

    if (!cart.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>Your bag is empty</h2>
          <p>Discover something beautiful for your collection.</p>
          <a href="index.html#featured" class="btn btn-gold">Explore Jewellery</a>
        </div>
      `;
      updateCartCount();
      return;
    }

    const subtotal = cart.reduce((sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

    container.innerHTML = `
      <div class="cart-table-wrap">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td>
                  <div class="cart-product">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">
                    <div>
                      <strong>${escapeHTML(item.name)}</strong>
                      <div class="product-category">${escapeHTML(item.category || "")}</div>
                    </div>
                  </div>
                </td>
                <td>${formatPrice(item.price)}</td>
                <td>
                  <div class="cart-qty">
                    <button type="button" data-action="minus" data-id="${escapeHTML(item.id)}" aria-label="Decrease quantity">−</button>
                    <span>${Number(item.quantity) || 1}</span>
                    <button type="button" data-action="plus" data-id="${escapeHTML(item.id)}" aria-label="Increase quantity">+</button>
                  </div>
                </td>
                <td>${formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 0))}</td>
                <td><button class="remove-btn" type="button" data-action="remove" data-id="${escapeHTML(item.id)}">Remove</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="cart-summary">
        <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div>
        <div class="summary-row"><span>Delivery</span><span>To be confirmed</span></div>
        <div class="summary-row summary-total"><span>Estimated Total</span><span>${formatPrice(subtotal)}</span></div>
        <p class="small-note">Final prices, availability and delivery must be confirmed by the store.</p>
        <a class="btn btn-gold" style="width:100%" href="contact.html">Enquire About These Items</a>
      </div>
    `;

    updateCartCount();
  }

  container.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    let cart = getCart();

    if (action === "remove") {
      cart = cart.filter(item => String(item.id) !== String(id));
    } else {
      const item = cart.find(product => String(product.id) === String(id));
      if (!item) return;

      if (action === "plus") item.quantity = Math.min(20, (Number(item.quantity) || 1) + 1);
      if (action === "minus") item.quantity = (Number(item.quantity) || 1) - 1;

      if (item.quantity < 1) {
        cart = cart.filter(product => String(product.id) !== String(id));
      }
    }

    saveCart(cart);
    renderCart();
  });

  renderCart();
});