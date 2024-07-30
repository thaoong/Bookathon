const express = require("express");
const cors = require("cors");
const PayOS = require("@payos/node");

const app = express();
// Keep your PayOS key protected by including it by an env variable
require('dotenv').config();

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static("public"));

app.post("/create-payment-link", async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3030`;
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 5000,
    description: "Thanh toan don hang",
    items: [
      {
        name: "Harry Potter",
        quantity: 1,
        price: 5000,
      },
    ],
    returnUrl: `${YOUR_DOMAIN}/success.html`,
    cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);

    res.redirect(paymentLinkResponse.checkoutUrl);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
});

const port = process.env.PORT || 3030;
app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});