const express = require("express");
const router = express.Router();
const createHandler = require("./create");
const deleteHandler = require("./delete");
const getAllHandler = require("./getAll");
const getByIdHandler = require("./getById");
const findByRSSItemHandler = require("./findByRSSItem");
const updateHandler = require("./update");

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

module.exports.paymentMetadataRouter = router;
module.exports.configureStore = configureStore;
