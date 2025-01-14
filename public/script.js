// Sample product list with images
const products = [
  { id: 1, name: "Nike Air Force 1'07", price: 1000, image: "./items/NikeAirForce1'07-mainPic.png" }, 
  { id: 2, name: "Razer Kishi for iPhone", price: 1500, image: "./razerpic00.jpg" }, 
  { id: 3, name: "Nike Air Force 1'07", price: 1000, image: "./items/NikeAirForce1'07-mainPic.png" },  // Same image as the first product for demonstration purposes only
  { id: 4, name: "Razer Kishi for iPhone", price: 1500, image: "./Razerpic5.webp" }, 
  { id: 5, name: "Nike Air Force 1'07", price: 1000, image: "./items/NikeAirForce1'07-mainPic.png" }, 
  { id: 6, name: "Razer Kishi for iPhone", price: 1500, image: "./razerpic00.jpg" }, 
  { id: 7, name: "Nike Air Force 1'07", price: 1000, image: "./items/NikeAirForce1'07-mainPic.png" }, 
  { id: 8, name: "Razer Kishi for iPhone", price: 1500, image: "./Razerpic5.webp" } 
];

// Initialize an empty cart (from localStorage if available)
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Display the product list
const productList = document.getElementById("product-list");
products.forEach(product => {
  const li = document.createElement("li");

  // Create and append the product image
  const img = document.createElement("img");
  img.src = product.image; 
  img.alt = product.name; 
  img.style.width = "100px"; 
  img.style.height = "100px"; 

  // Open the modal when image is clicked
  img.addEventListener("click", () => openModal(product.image));

  li.appendChild(img);

  // Display product name and price
  const productInfo = document.createElement("span");
  productInfo.textContent = `${product.name} - $${(product.price / 100).toFixed(2)}`;
  li.appendChild(productInfo);

  // Add input for quantity and "Add to Cart" button for each product
  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.value = 1;
  quantityInput.min = 1; 
  quantityInput.style.marginLeft = "10px"; 
  li.appendChild(quantityInput);

  // Add size selection for the product
  const sizeSelect = document.createElement("select");
  const sizes = ["Small", "Medium", "Large",];
  sizes.forEach(size => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = size;
    sizeSelect.appendChild(option);
  });
  sizeSelect.style.marginLeft = "10px"; 
  li.appendChild(sizeSelect);

  // Add "Add to Cart" button
  const addButton = document.createElement("button");
  addButton.textContent = "Add to Cart";
  addButton.addEventListener("click", () => addToCart(product, quantityInput.value, sizeSelect.value));

  li.appendChild(addButton);
  productList.appendChild(li);
});

// Add product to cart
// Add product to cart
function addToCart(product, quantity, size) {
  const existingProductIndex = cartItems.findIndex(item => item.id === product.id && item.size === size);

  if (existingProductIndex !== -1) {
    cartItems[existingProductIndex].quantity += parseInt(quantity);
  } else {
    cartItems.push({ ...product, quantity: parseInt(quantity), size });
  }

  updateCartDisplay();
  saveCartToLocalStorage();

  // Notify the user that the item has been added to the cart
  notifyUser(`${product.name} (Size: ${size}) has been added to your cart.`);
}

// Function to display a notification message
function notifyUser(message) {
  // Create a notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '10px';
  notification.style.right = '10px';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  notification.style.color = 'white';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.fontSize = '14px';
  notification.style.zIndex = '1000';

  // Append notification to the body
  document.body.appendChild(notification);

  // Automatically hide the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);

}




// Open the modal with the product image
function openModal(imageSrc) {
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");

  // Set the source of the image in the modal
  modalImage.src = imageSrc;

  // Display the modal
  modal.style.display = "block";
}

// Close the modal when the user clicks the close button
const closeModalButton = document.querySelector(".close-btn");
closeModalButton.addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
});

// Close the modal if the user clicks outside of the modal content
window.addEventListener("click", (event) => {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


// Update cart display
function updateCartDisplay() {
  const cartItemsList = document.getElementById("cart-items");
  cartItemsList.innerHTML = ''; // Clear the cart before displaying updated items
  
  cartItems.forEach(item => {
    const li = document.createElement("li");
    
    // Create and append the product image in the cart
    const img = document.createElement("img");
    img.src = item.image; // Image source path
    img.alt = item.name; // Alt text for the image
    img.style.width = "50px"; // Set a fixed width for the cart image (you can adjust it)
    img.style.height = "50px"; // Set a fixed height for the cart image (you can adjust it)
    li.appendChild(img);

    // Add item info (name, size, price, quantity)
    const productInfo = document.createElement("span");
    productInfo.textContent = `${item.name} - Size: ${item.size} - $${(item.price / 100).toFixed(2)} x ${item.quantity}`;
    li.appendChild(productInfo);

    // Create input field to change quantity
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = item.quantity;
    quantityInput.min = 1;
    quantityInput.style.marginLeft = "10px"; // Space between text and the input field
    quantityInput.addEventListener("change", (event) => updateQuantity(item.id, event.target.value));

    li.appendChild(quantityInput);

    // Create a "Remove from Cart" button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeFromCart(item.id));

    li.appendChild(removeButton);
    cartItemsList.appendChild(li);
  });

  // Calculate and display cart total
  const cartTotal = calculateCartTotal();
  const totalDisplay = document.getElementById("cart-total");
  totalDisplay.textContent = `Total: $${(cartTotal / 100).toFixed(2)}`;
}

// Calculate the total price of the items in the cart
function calculateCartTotal() {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update product quantity in cart
function updateQuantity(productId, newQuantity) {
  const productIndex = cartItems.findIndex(item => item.id === productId);
  if (productIndex !== -1) {
    cartItems[productIndex].quantity = parseInt(newQuantity);
    updateCartDisplay();
    saveCartToLocalStorage();
  }
}

// Remove product from cart
function removeFromCart(productId) {
  // Remove the product from the cart array
  cartItems = cartItems.filter(item => item.id !== productId);

  updateCartDisplay();
  saveCartToLocalStorage();
}

// Save cart to local storage
function saveCartToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
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
      // Clear the cart after successful payment
      cartItems = []; // Empty the cart array
      localStorage.removeItem('cartItems'); // Remove the cart data from localStorage
      updateCartDisplay(); // Update the cart display to reflect the changes
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

// Initialize cart display on page load
updateCartDisplay();
