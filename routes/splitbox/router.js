import express from "express";
import { v4 as uuidv4 } from "uuid";
import getInvoice from "./functions/getSplits/getInvoice.js";
import confirmInvoice from "./functions/getSplits/confirmInvoice.js";
import getSplits from "./functions/getSplits/getSplits.js";
import processPayments from "./functions/payments/processPayments.js";

import inMemoryStore from "../../stores/inMemoryStore.js";

//change this to whatever your preferred data storage is
const storeMetadata = inMemoryStore;

const router = express.Router();

router.post("/invoice", async (req, res) => {
  const { address } = req.query;

  console.log(address);

  const payload = req.body;
  const tlv = payload.metadata;

  delete tlv.name;
  delete tlv.value_msat;
  if (!tlv.reply_custom_value) {
    delete tlv.reply_custom_value;
  }

  if (!tlv.reply_custom_key) {
    delete tlv.reply_custom_key;
  }

  // process TLV from the POST, if there's a feedGuid, then do the rest.

  if (tlv.feed_guid) {
    //this is hardcoded, but could also be updated to fetch the allowedGuids from a DB based on the address
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
          invoice,
          ...payload,
        };

        storeMetadata.add(newMetadata);

        res.json({ invoice, id: metaID });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }
    } else {
      res.json({
        error: "This lightning address hasn't approved this feed for payments",
      });
    }
  } else {
    res.json({ error: "No feed_guid in TLV record" });
  }
});

router.post("/webhook-sync", async (req, res) => {
  try {
    const data = req.body;

    if (data.payment_request) {
      let preimage = data.preimage || data.payment_preimage;
      let invoice = data.payment_request;

      if (confirmInvoice(preimage, invoice)) {
        await storeMetadata.updateByInvoice(invoice, { settled: true });

        const data = await storeMetadata.getByInvoice(invoice);
        const { metadata, id } = data;
        let splits = await getSplits(metadata);
        let completedPayments = await processPayments({ splits, metadata });
        await storeMetadata.updateByInvoice(invoice, { completedPayments });
        res.json({ completedPayments, id });
      }
    } else {
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post("/webhook-async", async (req, res) => {
  try {
    res.json({ message: "Payment request received" });
    setImmediate(async () => {
      const data = req.body;
      if (data.payment_request) {
        let preimage = data.preimage;
        let invoice = data.payment_request;

        // Send the response immediately, so the client isn't waiting

        // Now process the data asynchronously after the response

        try {
          if (confirmInvoice(preimage, invoice)) {
            await storeMetadata.updateByInvoice(invoice, { settled: true });

            const metadataData = await storeMetadata.getByInvoice(invoice);
            const { metadata } = metadataData;
            let splits = await getSplits(metadata);

            // You can log or handle the results here as needed
          }
        } catch (processingError) {
          console.error(
            "Error during post-response processing:",
            processingError.message
          );
        }
      } else {
        console.error("Bad request: Missing payment_request");
      }
    });
  } catch (error) {
    console.error("Webhook processing error:", error.message);
  }
});

export default router;
