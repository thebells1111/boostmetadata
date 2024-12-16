import express from "express";
import jwt from "jsonwebtoken";

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
router.get("/", async (req, res) => {
  try {
    const newToken = generateToken();
    let metaData = {
      boostagram: "Boost",
      id: "test id",
      recipients: [
        {
          lnaddress: "sjb@strike.me",
          amount: 100,
        },
      ],
    };

    sendSats(metaData, newToken);
    res.json({ message: "Token created successfully", token: newToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
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
