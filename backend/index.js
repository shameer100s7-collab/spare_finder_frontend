const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ------------------------------
// Sample spare shops database
// ------------------------------
const SHOPS = [
  {
    id: 1,
    name: "TVS Service Center",
    lat: 10.8760,
    long: 78.6920,
    parts: ["brake pad", "oil filter", "clutch cable"],
  },
  {
    id: 2,
    name: "Royal Enfield Spare Shop",
    lat: 10.8755,
    long: 78.6905,
    parts: ["chain sprocket", "air filter", "brake pad"],
  },
  {
    id: 3,
    name: "General Bike Spare Shop",
    lat: 10.8790,
    long: 78.6950,
    parts: ["spark plug", "clutch cable", "brake pad"],
  }
];

// ------------------------------
// Distance calculator (Haversine)
// ------------------------------
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ------------------------------
// API Endpoint → Search Spare Parts
// ------------------------------
app.get("/api/search", (req, res) => {
  const item = req.query.item?.toLowerCase();
  const userLat = parseFloat(req.query.lat);
  const userLong = parseFloat(req.query.long);

  if (!item || !userLat || !userLong) {
    return res.status(400).json({
      error: "Missing required fields: item, lat, long"
    });
  }

  const results = SHOPS
    .filter(shop =>
      shop.parts.some(part =>
        part.toLowerCase().includes(item) ||
        item.includes(part.toLowerCase().split(" ")[0])
      )
    )
    .map(shop => {
      const distance = calculateDistance(userLat, userLong, shop.lat, shop.long).toFixed(2);

      return {
        name: shop.name,
        partsAvailable: shop.parts,
        distanceKm: distance,
        googleMapLink: `https://www.google.com/maps?q=${shop.lat},${shop.long}`
      };
    });

  res.json({
    query: item,
    count: results.length,
    shops: results
  });
});

// ------------------------------
// Start Backend Server
// ------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


