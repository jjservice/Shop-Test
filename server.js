// server.js
// server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware for JSON parsing

// Serve the index page (cart page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to create a Payment Intent, with cart items
app.post('/create-payment-intent', async (req, res) => {
  const { cartItems } = req.body;

  // Calculate total amount from cart items
  const amount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0); // Amount in cents

  try {
    // Create a PaymentIntent with the total amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
