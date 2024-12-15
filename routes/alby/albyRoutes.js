import express from "express";
import auth from "./auth.js";
import refresh from "./refresh.js";
import boost from "./boost.js";
import logout from "./logout.js";
import lnurlp from "./lnurlp.js";

import bodyParser from "body-parser";

const router = express.Router();

const albyRoutes = (tempTokens) => {
  router.use((req, res, next) => {
    req.tempTokens = tempTokens;
    next();
  });

  router.get("/auth", auth);
  router.get("/refresh", refresh);
  router.get("/account", refresh);
  router.post("/boost", bodyParser.json(), boost);
  router.post("/lnurlp", bodyParser.json(), lnurlp);
  router.get("/logout", logout);

  return router;
};

export default albyRoutes;
