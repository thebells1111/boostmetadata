import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import invoices from "./invoices.js";
import tlv from "./tlv.js";

import inMemoryStore from "../../stores/inMemoryStore.js";

const storeMetadata = inMemoryStore;

const router = express.Router();

// Utility function for token generation
function generateToken() {
  if (!process.env.ALBY_ACCESS_TOKEN || !process.env.ALBY_JWT) {
    throw new Error("Missing environment variables");
  }
  return jwt.sign(
    { access_token: process.env.ALBY_ACCESS_TOKEN },
    process.env.ALBY_JWT,
    { expiresIn: "10d" }
  );
}

// POST route to create a token
router.post("/", (req, res) => {
  try {
    const newToken = generateToken();
    res.json({ message: "Token created successfully", token: newToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// GET route to fetch a new token
router.get("/tlv", async (req, res) => {
  // process TLV from the POST, if there's a feedGuid, then do the rest.

  if (tlv.feed_guid) {
    let accountID = req.query.id;
    //fetch accountData based on accountID

    const account = {
      name: "Steven B.",
      address: "steven@getalby.com",
      allowedGuids: ["6dfbd8e4-f9f3-5ea1-98a1-574134999b3b"],
    };

    //check to see if tlv has a feed_guid that's allowed to send sats. Prevents storing undesired data.
    if (account.allowedGuids.find((v) => v === tlv.feed_guid)) {
      try {
        const metaID = uuidv4();
        const invoice = await getInvoice(
          account.address,
          tlv.value_msat_total,
          metaID
        );
        const newMetadata = {
          id: metaID,
          type: "bitcoin-lightning",
          invoice,
          metadata: tlv,
        };

        storeMetadata.add(newMetadata);

        // sendSats(metaData, newToken);
        res.json(newMetadata);
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

router.get("/webhook", async (req, res) => {
  // process TLV from the POST, if there's a feedGuid, then do the rest.

  if (tlv.feed_guid) {
    let accountID = req.query.id;
    //fetch accountData based on accountID

    const account = {
      name: "dude",
      allowedGuids: ["6dfbd8e4-f9f3-5ea1-98a1-574134999b3b"],
    };

    if (account.allowedGuids.find((v) => v === tlv.feed_guid)) {
      try {
        const metaID = uuidv4();
        const newMetadata = {
          id: metaID,
          type: "bitcoin-lightning",
          metadata: tlv,
        };

        storeMetadata.add(newMetadata);
        const allMetadata = await storeMetadata.getAll();

        // sendSats(metaData, newToken);
        res.json({
          data: allMetadata,
        });
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

export default router;

async function sendSats(metaData, newToken) {
  const res = await fetch("http://localhost:3000/alby/lnurlp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `awt=${newToken}`, // Attach the newToken as a cookie
    },
    body: JSON.stringify(metaData),
  });

  if (!res.ok) {
    console.error("Error sending sats:", await res.text());
    throw new Error(`Failed to send sats: ${res.status}`);
  }

  const data = await res.json();
  console.log("Response from /alby/lnurlp:", data);
  return data;
}

async function getInvoice(address, amount, metaID) {
  const [name, server] = address.split("@");
  const paymentUrl = `https://${server}/.well-known/lnurlp/${name}`;

  try {
    const res = await fetch(paymentUrl);
    const data = await res.json();

    if (!data.callback) {
      throw new Error("Callback URL missing in LNURLP response");
    }

    const invoiceRes = await fetch(
      `${data.callback}?amount=${amount}&comment=${metaID}`
    );
    const invoiceData = await invoiceRes.json();
    return invoiceData.pr;
  } catch (error) {
    return { success: false };
  }
}

async function processPayments(payment, alby_token) {
  console.log(payment);
  const [name, server] = payment.lnaddress.split("@");
  const paymentUrl = `https://${server}/.well-known/lnurlp/${name}`;

  try {
    const res = await fetch(paymentUrl);
    const data = await res.json();

    if (!data.callback) {
      throw new Error("Callback URL missing in LNURLP response");
    }

    const invoiceRes = await fetch(
      `${data.callback}?amount=${payment.amount * 1000}&comment=${
        payment.metaID
      }`
    );
    const invoiceData = await invoiceRes.json();
    const invoice = invoiceData.pr;

    console.log(invoice);

    const paymentRes = await axios.post(
      "https://api.getalby.com/payments/bolt11",
      { invoice },
      {
        headers: { Authorization: `Bearer ${alby.access_token}` },
      }
    );

    console.log(paymentRes.data);
    return { success: true };
  } catch (error) {
    console.log("Payment Process Error:", error.message || error);
    return { success: false };
  }
}
