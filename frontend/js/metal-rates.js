
const API_URL = "http://localhost:5000/api/metal-prices";

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

async function loadMetalRates() {
  setText("goldRate", "Loading...");
  setText("silverRate", "Loading...");

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || `API error: ${response.status}`);
    }

    const goldBuy = Number(result.gold?.buy);
    const silverBuy = Number(result.silver?.buy);

    if (!Number.isFinite(goldBuy) || !Number.isFinite(silverBuy)) {
      throw new Error("Gold/Silver prices missing in API response");
    }

    const formatINR = value =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
      }).format(value);

    setText("goldRate", formatINR(goldBuy));
    setText("silverRate", formatINR(silverBuy));

    if (result.gold?.sell != null) {
      setText("goldSell", "Sell rate: " + formatINR(Number(result.gold.sell)));
    }

    if (result.silver?.sell != null) {
      setText("silverSell", "Sell rate: " + formatINR(Number(result.silver.sell)));
    }

    const updated = result.updatedAt
      ? new Date(result.updatedAt)
      : new Date();

    setText(
      "ratesUpdated",
      "Last update: " + updated.toLocaleString("en-IN")
    );

    console.log("Metal prices loaded:", result);
  } catch (error) {
    console.error("Metal price error:", error);
    setText("goldRate", "Unavailable");
    setText("silverRate", "Unavailable");
    setText("ratesUpdated", "Rates could not load: " + error.message);
  }
}

loadMetalRates();
setInterval(loadMetalRates, 60000);
