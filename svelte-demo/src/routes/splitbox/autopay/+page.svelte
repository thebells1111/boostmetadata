<script>
  import { onMount } from "svelte";
  import tlv from "./tlv.js";

  let recipient = { lnaddress: "steven@getalby.com", amount: 100 };
  let albyLoginUrl = "";
  let invoice = "";
  let payload = {
    type: "bitcoin-lightning",
    metadata: tlv,
  };

  onMount(() => {
    const albyClientId = "v9yF7pxXjE";
    albyLoginUrl = `https://getalby.com/oauth?client_id=${albyClientId}&response_type=code&redirect_uri=${window.location.href.split("?")[0]}&scope=account:read%20balance:read%20payments:send%20invoices:read`;
    loadAlby();
    console.log("DOM is fully loaded");
  });

  async function getInvoice(payload) {
    try {
      payload.metadata.value_msat_total = recipient.amount * 1000;
      payload = payload;

      let res = await fetch(
        `http://localhost:3000/splitbox/invoice?address=${recipient.lnaddress}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const invoice = await res.json();
      console.log(invoice);
      let payment = await sendSats(invoice);
      console.log(payment);
      handlePaid(payment.info);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendSats(invoice) {
    try {
      const res = await fetch("http://localhost:3000/alby/invoice", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePaid(paymentInfo) {
    console.log(paymentInfo);
    let res = await fetch("http://localhost:3000/splitbox/webhook-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentInfo),
    });

    let data = await res.json();
    console.log(data);
  }

  async function loadAlby() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      const redirect_uri = "http://localhost:5173/splitbox/autopay";
      try {
        const res = await fetch(
          `http://localhost:3000/alby/auth5173?code=${code}&redirect_uri=${redirect_uri}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("http://localhost:3000/alby/refresh5173", {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
      } catch (err) {}
    }
  }

  function updatePayload(e) {
    payload.metadata.value_msat_total = e.target.value * 1000;
    payload = payload;
  }
</script>

<main>
  <h1>Split Box Autopay Demo</h1>
  <h2>
    Log in with <a id="alby-login" href={albyLoginUrl}>Alby</a>
  </h2>

  <div class="recipient">
    <label for="control-lnaddress">Lightning Address:</label>
    <input
      id="control-lnaddress"
      type="text"
      bind:value={recipient.lnaddress}
      placeholder="Enter Lightning Address"
      required
    />

    <label for="boost-amount">Amount (sats):</label>
    <input
      id="boost-amount"
      type="number"
      bind:value={recipient.amount}
      placeholder="Enter Amount in sats"
      on:input={updatePayload}
      required
    />
  </div>
  <button type="button" on:click={getInvoice.bind(this, payload)}
    >Get Invoice</button
  >

  <h2>Simulated Payload to The Split Box</h2>
  <p>{JSON.stringify(payload, null, 2)}</p>
</main>

<style>
  .recipient {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    margin-bottom: 1rem;
  }

  button {
    margin-top: 1rem;
  }

  p {
    white-space: pre-wrap;
  }
</style>
