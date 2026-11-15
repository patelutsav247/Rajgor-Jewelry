"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const message = document.getElementById("loginMessage");

  if (!form) return;

  // Frontend-only demo credentials. Backend authentication will replace this.
  const DEMO_EMAIL = "admin@rajgorjewelry.com";
  const DEMO_PASSWORD = "Admin123!";

  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("adminEmail").value.trim().toLowerCase();
    const password = document.getElementById("adminPassword").value;

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem("rajgorDemoAdmin", "true");
      window.location.href = "admin.html";
    } else {
      message.textContent = "Incorrect demo email or password.";
      message.className = "form-message error";
    }
  });
});