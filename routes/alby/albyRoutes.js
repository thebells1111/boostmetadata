import express from "express";
import auth from "./auth.js";
import auth5173 from "./auth5173.js";
import refresh from "./refresh.js";
import refresh5173 from "./refresh5173.js";
import boost from "./boost.js";
import logout from "./logout.js";
import lnurlp from "./lnurlp.js";
import invoice from "./invoice.js";

import bodyParser from "body-parser";

const router = express.Router();

const albyRoutes = (tempTokens) => {
  router.use((req, res, next) => {
    req.tempTokens = tempTokens;
    next();
  });

  router.get("/auth", auth);
  router.get("/auth5173", auth5173);
  router.get("/refresh", refresh);
  router.get("/refresh5173", refresh5173);
  router.get("/account", refresh);
  router.post("/boost", bodyParser.json(), boost);
  router.post("/invoice", bodyParser.json(), invoice);
  router.post("/lnurlp", bodyParser.json(), lnurlp);
  router.get("/logout", logout);

  return router;
};

export default albyRoutes;
