import axios from "axios";
import jwt from "jsonwebtoken";

const invoice = async (req, res) => {
  const { ALBY_JWT } = process.env;

  try {
    const { invoice, id } = req.body;

    const cookies = req.cookies;

    let alby = cookies.awt ? jwt.verify(cookies.awt, ALBY_JWT) : undefined;

    if (alby && invoice) {
      const paymentRes = await axios.post(
        "https://api.getalby.com/payments/bolt11",
        { invoice },
        {
          headers: { Authorization: `Bearer ${alby.access_token}` },
        }
      );

      res.json({
        success: true,
        info: paymentRes.data,
        id,
      });
    } else {
      res.json([]);
    }
  } catch (err) {
    console.log("alby lnurlp: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

export default invoice;
