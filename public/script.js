// public/script.js

// Sample cart items (You can dynamically populate this from your database or frontend)
const cartItems = [
    { id: 1, name: "Product 1", price: 1000, quantity: 2 }, // Price in cents, $10.00
    { id: 2, name: "Product 2", price: 1500, quantity: 1 }, // Price in cents, $15.00
  ];
  
  // Display cart items
  const cartItemsList = document.getElementById("cart-items");
  cartItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${(item.price / 100).toFixed(2)} x ${item.quantity}`;
    cartItemsList.appendChild(li);
  });
  
  // Initialize Stripe
  const stripe = Stripe('pk_test_51QTSb2LPa32ZluPp57bSF7ObgsE3CMMCcM1eSbcuMBDrhRuZV6uYL8EqqpLLiGwIAbEg8crJEYfXBDyBM5fZM5Q600fBMTS2Rt'); // Replace with your Stripe public key
  
  // Handle the payment process when the user clicks "Pay Now"
  document.getElementById("pay-button").addEventListener("click", async () => {
    try {
      // Send cart items to the backend to create a PaymentIntent
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });
  
      const { clientSecret, amount } = await response.json();
  
      // Create a payment method with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement, // Stripe element (card input field) that will be created next
          billing_details: {
            name: 'Test User', // You can replace this with actual user data
          },
        },
      });
  
      if (error) {
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        alert(`Payment successful! Amount paid: $${(amount / 100).toFixed(2)}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('There was an error processing your payment. Please try again later.');
    }
  });

  
  const elements = stripe.elements();

// Create a Stripe card Element
const cardElement = elements.create('card');
cardElement.mount('#card-element'); // Mount it to the DOM (make sure to add an element for this in the HTML)

  