// const express = require("express");
// const router = express.Router();

// router.get("/metal-prices", (req, res) => {
//   res.json({
//     success: true,
//     gold: { buy: 7500, sell: 7400 },
//     silver: { buy: 95, sell: 92 },
//     updatedAt: new Date().toISOString()
//   });
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

const SPREAD = 0.01; // sell rate = buy rate thi 1% ochho (tamari marji mujab badlo)
const OUNCE_TO_GRAM = 31.1035;

let cache = null;
let cacheTime = 0;

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed: " + url);
  return res.json();
}

router.get("/metal-prices", async (req, res) => {
  try {
    // 60 second cache, vaarvaar API na hit karva padey
    if (cache && Date.now() - cacheTime < 60000) {
      return res.json(cache);
    }

    const [gold, silver, fx] = await Promise.all([
      getJson("https://api.gold-api.com/price/XAU"),
      getJson("https://api.gold-api.com/price/XAG"),
      getJson("https://open.er-api.com/v6/latest/USD")
    ]);

    const inr = fx.rates.INR;
    const goldPerGram = (gold.price / OUNCE_TO_GRAM) * inr;
    const silverPerGram = (silver.price / OUNCE_TO_GRAM) * inr;

    cache = {
      success: true,
      gold: {
        buy: Number(goldPerGram.toFixed(2)),
        sell: Number((goldPerGram * (1 - SPREAD)).toFixed(2))
      },
      silver: {
        buy: Number(silverPerGram.toFixed(2)),
        sell: Number((silverPerGram * (1 - SPREAD)).toFixed(2))
      },
      updatedAt: new Date().toISOString()
    };
    cacheTime = Date.now();

    res.json(cache);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Rates unavailable" });
  }
});

module.exports = router;
