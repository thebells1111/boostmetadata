import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import cookie from "cookie";
import cors from "cors"; // Import the CORS package
import { fileURLToPath } from "url";

import albyRoutes from "./routes/alby/albyRoutes.js";
import inMemoryStore from "./stores/inMemoryStore.js";
import {
  paymentMetadataRouter,
  configureStore,
} from "./routes/paymentMetadata/index.js";
import splitBoxRouter from "./routes/splitbox/router.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json()); // Parse JSON request bodies

configureStore(inMemoryStore);

// Enable CORS for localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // Allow credentials (cookies, headers, etc.)
  })
);

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

let tempTokens = {};

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use((req, res, next) => {
  req.cookies = cookie.parse(req.headers.cookie || "");
  next();
});

if (process.env.ALBY_JWT) {
  app.use("/alby", albyRoutes(tempTokens));
}

app.use("/splitbox", splitBoxRouter);

app.use("/payment-metadata", paymentMetadataRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});
app.get("/demo/bitcoin-connect", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bitcoinConnect.html"));
});
app.get("/demo/alby-connect", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "albyConnect.html"));
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
