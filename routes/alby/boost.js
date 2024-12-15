import axios from "axios";
import jwt from "jsonwebtoken";
import fs from "fs";

const { ALBY_JWT } = process.env;

const boost = async (req, res) => {
  try {
    const body = req.body;

    let bodyJson;
    try {
      // Convert the body object to a JSON string with indentation
      console.log(body.map((v) => JSON.parse(v.customRecords["7629169"])));
      bodyJson = JSON.stringify(
        body.map((v) => JSON.parse(v.customRecords["7629169"])),
        null,
        2
      );
      console.log(bodyJson);
      // Append the JSON string to the file
      fs.appendFile("tlv.json", bodyJson + "\n", (err) => {
        if (err) throw err;
        console.log('The "body" was appended to file!');
      });
    } catch (error) {}

    const cookies = req.cookies;

    let alby = cookies.awt ? jwt.verify(cookies.awt, ALBY_JWT) : undefined;

    if (alby && body) {
      let resolve = await axios({
        method: "POST",
        url: "https://api.getalby.com/payments/keysend/multi",
        headers: { Authorization: `Bearer ${alby.access_token}` },
        data: { keysends: body },
      }).catch((error) => {
        console.log("alby boost error: ", error.response.data);
        throw error; // Propagate error up to outer catch block
      });

      res.status(200).json(resolve.data.keysends);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.log("albyauth: " + err);
    res.status(500).json({ message: "Server Error" });
  }
};

export default boost;
