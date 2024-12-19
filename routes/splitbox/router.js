import express from "express";
import { v4 as uuidv4 } from "uuid";
import getInvoice from "./functions/getInvoice.js";
import confirmInvoice from "./functions/confirmInvoice.js";
import getSplits from "./functions/getSplits.js";
import processPayments from "./functions/processPayments.js";
import sendSats from "./functions/sendSats.js";

import inMemoryStore from "../../stores/inMemoryStore.js";

const storeMetadata = inMemoryStore;

const router = express.Router();

router.post("/invoice", async (req, res) => {
  const { address } = req.query;

  const tlv = req.body;

  // process TLV from the POST, if there's a feedGuid, then do the rest.

  if (tlv.feed_guid) {
    //fetch account based on address
    const account = {
      address: "steven@getalby.com",
      allowedGuids: ["6dfbd8e4-f9f3-5ea1-98a1-574134999b3b"],
    };

    //check to see if tlv has a feed_guid that's allowed to send sats. Prevents storing undesired data.
    if (account.allowedGuids.find((v) => v === tlv.feed_guid)) {
      try {
        const metaID = uuidv4();
        const invoice = await getInvoice(account.address, tlv.value_msat_total);
        const newMetadata = {
          id: metaID,
          type: "bitcoin-lightning",
          invoice,
          metadata: tlv,
        };

        storeMetadata.add(newMetadata);

        // sendSats(metaData, newToken);
        res.json(invoice);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }
    } else {
      res.json({});
    }
  } else {
    res.json({});
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    if (data.payment_request) {
      let preimage = data.preimage;
      let invoice = data.payment_request;
      if (confirmInvoice(preimage, invoice)) {
        await storeMetadata.updateByInvoice(invoice, { settled: true });

        const data = await storeMetadata.getByInvoice(invoice);
        const { metadata } = data;
        let splits = await getSplits(metadata);

        res.json(splits);
      }
    } else {
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

export default router;
