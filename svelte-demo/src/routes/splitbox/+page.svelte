<script>
  import tlv from "./tlv.js";
  async function makePayment() {
    let res = await fetch(
      "http://localhost:3000/splitbox/invoice?address=steven@getalby.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tlv),
      }
    );
    let invoice = await res.json();
    console.log(invoice);
  }

  async function simulatePaid() {
    let res = await fetch("http://localhost:3000/splitbox/webhook-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_request:
          "lnbc1u1pnkqk8tdqvw3jhxapqd9jqnp4qddd9j25ufjqqjvxmgkefx0pwvh9za0pmnhjg57fy8rvmnp4xm5aspp55fyuttw0rnx0v0dnae89qng7yvd2y37j4up0we5epfplsssk9nuqsp5m4h7yuc03l0u0u5jh7rsxxla997sdv4753dhwxfheq5mzdu0r97q9qyysgqcqpcxqyz5vqk3fe6c3gm0k5qr3ytwan5dk5zzy2m73t7tzmw606xkzsutjzs3xjtv54ukl4wgvjg4rdra09ld4d8vatl6n67ukwezxaps8qk0nxqcgp66e7kl",
        preimage:
          "e4836a9fe393d55f02400387235cc1f635e4379b94c4c4026c8b3ced81138300",
      }),
    });

    let data = await res.json();
    console.log(data);
  }
</script>

<main>
  <button on:click={makePayment}>Pay</button>
  <button on:click={simulatePaid}>Paid</button>
</main>

<style>
</style>
