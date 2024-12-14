const express = require("express");
const app = express();
const path = require("path");

const inMemoryStore = require("./stores/inMemoryStore");

const {
  paymentMetadataRouter,
  configureStore,
} = require("./routes/paymentMetadata/index");

app.use(express.json()); // Parse JSON request bodies

configureStore(inMemoryStore);

// API Documentation Metadata
const PORT = 3000; // Server port

// Example schemas as per OpenAPI 3.0
const schemas = {
  PaymentMetadata: {
    id: "0ce03790-b2b4-47da-9401-5e587d1deac8",
    jpt: { foo: "example" },
    type: "bitcoin-lightning",
  },
  PaymentMetadataResponse: {
    id: "0ce03790-b2b4-47da-9401-5e587d1deac8",
    updateToken: "0ce03790-b2b4-47da-9401-5e587d1deac9",
  },
};

app.use("/payment-metadata", paymentMetadataRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});
app.get("/demo/bitcoin-connect", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bitcoinConnect.html"));
});
app.get("/demo/all-metadata", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "viewMetadata.html"));
});
app.get("/demo/add-metadata", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "addMetadata.html"));
});

app.get("/demo/update-metadata", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "updateMetadata.html"));
});

app.get("/demo/get-by-id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "findItemById.html"));
});
app.get("/demo/delete-metadata", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "deleteMetadata.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`MetaBoost API is running on http://localhost:${PORT}`);
});
