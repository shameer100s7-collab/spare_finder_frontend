const express = require("express");
const cors = require("cors");
const shops = require("./data/shops.json");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Spare Part Finder API is running 🚀" });
});

app.post("/search", (req, res) => {
  const { part } = req.body;

  if (!part) return res.status(400).json({ error: "Part name required" });

  const searchItem = part.toLowerCase();

  const matches = shops.filter(shop =>
    shop.parts.some(x => x.toLowerCase() === searchItem)
  );

  res.json({
    found: matches.length,
    data: matches
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
