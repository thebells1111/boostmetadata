export default async function processPayments(payment) {
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
