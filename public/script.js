// public/script.js

// Sample product list
const products = [
  { id: 1, name: "Product 1", price: 1000 }, // Price in cents, $10.00
  { id: 2, name: "Product 2", price: 1500 }, // Price in cents, $15.00
  { id: 3, name: "Product 3", price: 2000 }, // Price in cents, $20.00
];

// Initialize an empty cart
let cartItems = [];

// Display the product list
const productList = document.getElementById("product-list");
products.forEach(product => {
  const li = document.createElement("li");
  li.textContent = `${product.name} - $${(product.price / 100).toFixed(2)}`;
  
  // Add "Add to Cart" button for each product
  const addButton = document.createElement("button");
  addButton.textContent = "Add to Cart";
  addButton.addEventListener("click", () => addToCart(product));

  li.appendChild(addButton);
  productList.appendChild(li);
});

// Add product to cart
function addToCart(product) {
  const existingProductIndex = cartItems.findIndex(item => item.id === product.id);

  if (existingProductIndex !== -1) {
    // Update quantity if the product is already in the cart
    cartItems[existingProductIndex].quantity += 1;
  } else {
    // Add new product to the cart
    cartItems.push({ ...product, quantity: 1 });
  }

  updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
  const cartItemsList = document.getElementById("cart-items");
  cartItemsList.innerHTML = ''; // Clear the cart before displaying updated items
  
  cartItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${(item.price / 100).toFixed(2)} x ${item.quantity}`;
    cartItemsList.appendChild(li);
  });
}

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




















