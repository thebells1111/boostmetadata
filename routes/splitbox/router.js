import express from "express";
import { v4 as uuidv4 } from "uuid";
import fetchFeed from "./functions/fetchFeed.js";
import fetchItem from "./functions/fetchItem.js";
import getInvoice from "./functions/getInvoice.js";
import confirmInvoice from "./functions/confirmInvoice.js";
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
        let splits = [];
        const data = await storeMetadata.getByInvoice(invoice);
        const { metadata } = data;
        let destinations;

        if (metadata.feed_guid) {
          const feedResponse = await fetchFeed(metadata.feed_guid);
          const feed = feedResponse.feed;
          let itemResponse;
          if (metadata.item_guid) {
            itemResponse = await fetchItem(
              metadata.feed_guid,
              metadata.item_guid
            );

            destinations =
              itemResponse?.episode?.value?.destinations ||
              feed?.value?.destinations;

            if (destinations) {
              splits = splits.concat(destinations);
            }
          } else {
            splits = [];
          }
          res.json({ feed, itemResponse, splits });
        }
      }
    } else {
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

export default router;
