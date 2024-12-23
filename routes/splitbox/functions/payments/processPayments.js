import sendKeysend from "./sendKeysend.js";
import sendLNUrl from "./sendLNUrl.js";

export default async function processPayments({ splits, metadata, metaID }) {
  let paymentAttempts = splits.map((recipient) => {
    if (recipient?.["@_type"] === "node") {
      return sendKeysend({ recipient, metadata });
    } else if (recipient?.["@_type"] === "lnaddress") {
      return sendLNUrl({ recipient, metaID });
    } else {
      return Promise.resolve({ status: "skipped", recipient });
    }
  });

  return Promise.all(paymentAttempts);
}
