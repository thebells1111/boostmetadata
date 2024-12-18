export default async function sendSats(metaData, newToken) {
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
