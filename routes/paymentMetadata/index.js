import express from "express";
import createHandler from "./create.js";
import deleteHandler from "./delete.js";
import getAllHandler from "./getAll.js";
import getByIdHandler from "./getById.js";
import findByRSSItemHandler from "./findByRSSItem.js";
import updateHandler from "./update.js";

const router = express.Router();

let storeMetadata; // Placeholder for the store

// Pass the store to route handlers after it is configured
router.post("/", (req, res) => createHandler(storeMetadata)(req, res));
router.delete("/:paymentMetadataId", (req, res) =>
  deleteHandler(storeMetadata)(req, res)
);
router.get("/", (req, res) => getAllHandler(storeMetadata)(req, res));
router.get("/:paymentMetadataId", (req, res) =>
  getByIdHandler(storeMetadata)(req, res)
);
router.get("/findByRSSItem", (req, res) =>
  findByRSSItemHandler(storeMetadata)(req, res)
);
router.put("/", (req, res) => updateHandler(storeMetadata)(req, res));

const configureStore = (customStore) => {
  if (
    typeof customStore.add === "function" &&
    typeof customStore.getAll === "function"
  ) {
    storeMetadata = customStore;
  } else {
    throw new Error(
      "Invalid store. Must implement `add` and `getAll` methods."
    );
  }
};

const paymentMetadataRouter = router;

export { paymentMetadataRouter, configureStore };
