import axios from "axios";
import clone from "just-clone";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.ALBY_ACCESS_TOKEN) {
  dotenv.config();
}

const { ALBY_ACCESS_TOKEN } = process.env;

export default function sendKeysend({ recipient, metadata }) {
  let record = {
    destination: recipient["@_address"],
    amount: recipient.amount,
  };

  const tlv = clone(metadata);

  tlv.name = recipient["@_name"];
  tlv.value_msat = recipient.amount * 1000;

  let customRecords = {};
  if (tlv) {
    customRecords[7629169] = JSON.stringify(tlv);
  }
  if (recipient["@_customKey"]) {
    customRecords[recipient["@_customKey"]] = recipient["@_customValue"];
  }

  if (Object.keys(customRecords).length > 0) {
    record.custom_records = customRecords;
  }

  return new Promise(async (resolve, reject) => {
    try {
      // Throwing an error for testing purposes
      // throw new Error("Intentional test error");

      let paymentData;
      if (recipient.amount) {
        const paymentRes = await axios.post(
          "https://api.getalby.com/payments/keysend",
          record,
          {
            headers: { Authorization: `Bearer ${ALBY_ACCESS_TOKEN}` },
          }
        );

        paymentData = paymentRes.data;
      } else {
        paymentData = { amount: 0, status: "no sats sent, amount too low" };
      }
      resolve({
        success: true,
        recipient: recipient,
        paymentData,
      });
    } catch (error) {
      console.log("Keysend Payment Error:", error.message || error);
      let err = error.message || error;
      resolve({ success: false, recipient, record, err });
    }
  });
}
