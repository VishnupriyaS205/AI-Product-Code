import express from "express";
import listings from "./src/data/listings.js";

const app = express();
const PORT = 4000;
const inquiries = [];

function findListingById(id) {
  return listings.find((item) => item.id === Number(id));
}

function validateInquiry(body) {
  const { listingId, name, message } = body;

  if (!listingId || !name?.trim() || !message?.trim()) {
    return "Listing, name, and message are required";
  }

  return "";
}

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Rental Scout API is Running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Rental Scout API is working",
  });
});

app.get("/api/listings", (req, res) => {
  res.json({
    count: listings.length,
    data: listings,
  });
});

app.get("/api/listings/:id", (req, res) => {
  const listing = findListingById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      error: "Listing not found",
    });
  }

  res.json({
    data: listing,
  });
});

app.post("/api/inquiries", (req, res) => {
  const { listingId, name, message } = req.body;
  const validationError = validateInquiry(req.body);

  if (validationError) {
    return res.status(400).json({
      error: validationError,
    });
  }

  const listing = findListingById(listingId);

  if (!listing) {
    return res.status(404).json({
      error: "Listing not found",
    });
  }

  
  const inquiry = {
    id: inquiries.length + 1,
    listingId: Number(listingId),
    name: name.trim(),
    message: message.trim(),
  };

  inquiries.push(inquiry);

  res.status(201).json({
    message: "Inquiry received",
    data: inquiry,
  });
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Welcome to Rental Scout API",
  });
});

app.listen(PORT, () => {
  console.log(`Rental Scout API running on http://localhost:${PORT}`);
});
