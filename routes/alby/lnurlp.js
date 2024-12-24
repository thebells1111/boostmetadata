import axios from "axios";
import jwt from "jsonwebtoken";

const lnurlp = async (req, res) => {
  let pendingPayments = [];
  const { ALBY_JWT } = process.env;

  try {
    const body = req.body;

    const cookies = req.cookies;

    let alby = cookies.awt ? jwt.verify(cookies.awt, ALBY_JWT) : undefined;

    console.log(body);

    if (alby && body) {
      pendingPayments = pendingPayments.concat(
        body.recipients.map((v) => {
          v.metaID = body.id;
          v.alby = alby;
          return v;
        })
      );

      processAllPayments(pendingPayments, alby);

      res.json({ success: "payments processing" });
    } else {
      res.json([]);
    }
  } catch (err) {
    console.log("alby lnurlp: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

async function processPayments(payment, alby) {
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

    return {
      success: true,
      payment: paymentRes.data,
      lnaddress: payment.lnaddress,
    };
  } catch (error) {
    console.log("Payment Process Error:", error.message || error);
    return { success: false };
  }
}

async function processAllPayments(pendingPayments, alby) {
  const results = await Promise.all(
    pendingPayments.map((payment) => processPayments(payment, alby))
  );

  console.log("All payments processed:", results);
  return results;
}

export default lnurlp;
