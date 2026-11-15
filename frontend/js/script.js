
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- MongoDB Connection ---------- */
// Jo tamari project ma db connection file hoy to,
// tena actual path pramane niche ni line uncomment karjo.
// require("./config/db");

/* ---------- Contact Routes ---------- */
// Tamari contactRoutes.js file available hoy to aa routes use karo.
try {
  const contactRoutes = require("./routes/contactRoutes");
  app.use("/api/contact", contactRoutes);
  console.log("Contact routes loaded");
} catch (error) {
  console.log("Contact routes not loaded:", error.message);
}

/* ---------- Live Gold and Silver Prices ---------- */
let metalPriceCache = null;
let metalPriceCacheTime = 0;

app.get("/api/metal-prices", async (req, res) => {
  // Cache prices for 60 seconds
  if (
    metalPriceCache &&
    Date.now() - metalPriceCacheTime < 60000
  ) {
    return res.json({
      success: true,
      ...metalPriceCache,
      cached: true
    });
  }

  try {
    const response = await fetch(
      "https://api.oropocket.com/public/prices",
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data;

    if (
      !data?.gold ||
      !data?.silver ||
      !Number.isFinite(Number(data.gold.buy)) ||
      !Number.isFinite(Number(data.silver.buy))
    ) {
      throw new Error("Invalid gold/silver response");
    }

    metalPriceCache = {
      gold: {
        buy: Number(data.gold.buy),
        sell: Number(data.gold.sell),
        change24h: data.gold.change24h?.buy ?? null
      },
      silver: {
        buy: Number(data.silver.buy),
        sell: Number(data.silver.sell),
        change24h: data.silver.change24h?.buy ?? null
      },
      updatedAt: data.timestamp || new Date().toISOString()
    };

    metalPriceCacheTime = Date.now();

    return res.json({
      success: true,
      ...metalPriceCache,
      cached: false
    });
  } catch (error) {
    console.error("Metal price error:", error.message);

    return res.status(503).json({
      success: false,
      message: "Live rates are temporarily unavailable."
    });
  }
});

/* ---------- API Test ---------- */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Rajgor Jewelry backend is running"
  });
});

/* ---------- Serve Frontend ---------- */
// Rajgor-Jewelry/frontend folder serve karva mate
app.use(express.static(path.join(__dirname, "..", "frontend")));

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Website: http://localhost:${PORT}/index.html`);
  console.log(`Metal prices: http://localhost:${PORT}/api/metal-prices`);
});
