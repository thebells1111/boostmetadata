<script>
  import { onMount } from "svelte";

  const albyClientId = "Jwi7oDyndT";

  let recipients = [{ lnaddress: "sjb@strike.me", amount: 100 }];
  let boostagram = "Boost";
  let albyLoginUrl = "";

  async function handleDonation() {
    if (!recipients.length) {
      alert("Please add at least one valid recipient.");
      return;
    }

    const payload = {
      type: "bitcoin-lightning",
      metadata: {
        message: boostagram.trim(),
      },
    };

    try {
      const response = await fetch("/payment-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);
      console.log(recipients);

      await sendSats({ recipients, id: responseData.id });
    } catch (error) {
      console.error("Error sending metadata:", error);
    }
  }

  function addRecipient() {
    recipients = [...recipients, { lnaddress: "", amount: "" }];
  }

  async function loadAlby() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      const redirect_uri = url.origin;
      try {
        const res = await fetch(
          `/alby/auth?code=${code}&redirect_uri=${redirect_uri}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log(data);
        window.history.replaceState(null, null, url.origin);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("/alby/refresh", {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function sendSats(metaData) {
    try {
      const res = await fetch("/alby/lnurlp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metaData),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  onMount(() => {
    albyLoginUrl = `https://getalby.com/oauth?client_id=${albyClientId}&response_type=code&redirect_uri=${window.location.href.split("?")[0]}&scope=account:read%20balance:read%20payments:send%20invoices:read`;
    loadAlby();
    console.log("DOM is fully loaded");
  });
</script>

<main>
  <h1>Alby API Demo</h1>
  <h2>
    Log in with <a id="alby-login" href={albyLoginUrl}>Alby</a>
  </h2>

  <form>
    {#each recipients as recipient, i}
      <div class="recipient">
        <label for={`lnaddress_${i}`}>Lightning Address:</label>
        <input
          id={`lnaddress_${i}`}
          type="text"
          bind:value={recipient.lnaddress}
          placeholder="Enter Lightning Address"
          required
        />

        <label for={`amount_${i}`}>Amount (sats):</label>
        <input
          id={`amount_${i}`}
          type="number"
          bind:value={recipient.amount}
          placeholder="Enter Amount in sats"
          required
        />
      </div>
    {/each}

    <button type="button" on:click={addRecipient}>Add Recipient</button>

    <br /><br />
    <label for="boostagram">Boostagram:</label>
    <textarea
      id="boostagram"
      bind:value={boostagram}
      style="display: block; height: 200px; width: 400px"
      placeholder="Boostagram Message"
    ></textarea>

    <br />
    <button type="button" on:click={handleDonation}>Send Donation</button>
  </form>
</main>

<style>
  .recipient {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input,
  textarea {
    width: 100%;
    margin-bottom: 1rem;
  }

  button {
    margin-top: 1rem;
  }
</style>
