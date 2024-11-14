import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Component to display each menu item with a quantity selector
function MenuItem({ name, description, price, image, quantity, onAdd, onRemove }) {
  return (
    <div className="flex items-center p-4 border-b border-gray-300">
      <img src={image} alt={name} className="w-20 h-20 rounded-md mr-4" />
      <div className="flex-grow">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-gray-600 mb-1">{description}</p>
        <div className="flex items-center border border-gray-300 rounded-lg w-32">
          <button className="text-gray-500 px-4 py-2 border-r border-gray-300" onClick={onRemove} disabled={quantity === 0}>-</button>
          <span className="px-4 py-2">{quantity}</span>
          <button className="text-red-500 px-4 py-2 border-l border-gray-300" onClick={onAdd}>+</button>
        </div>
      </div>
      <div className="ml-auto text-red-600 font-bold text-lg">{price}$</div>
    </div>
  );
}

// Main component to display the complete menu
function Menu() {
  const [menuItems, setMenuItems] = useState([]); // Stores the menu items fetched from the API
  const [quantities, setQuantities] = useState({}); // Stores the quantity of each item
  const navigate = useNavigate();  // Hook for navigation

  // Fetches the menu data from the API when the component mounts
  useEffect(() => {
    fetch('http://localhost:5001/api/menu')
      .then(response => response.json())
      .then(data => {
        setMenuItems(data); // Store menu items
        const initialQuantities = data.reduce((acc, item) => {
          acc[item.id] = 0; // Initialize quantities of each item to 0
          return acc;
        }, {});
        setQuantities(initialQuantities); // Set the initial quantities
      })
      .catch(err => console.error("Error fetching data: ", err));
  }, []);

  // Updates the quantity of a specific item
  const setItemQuantity = (id, quantity) => {
    setQuantities(prev => ({ ...prev, [id]: quantity }));
  };

  // Checks if any item has been added to the cart
  const hasItemsInCart = Object.values(quantities).some(qty => qty > 0);

  // Function to handle checkout and navigate to the cart page
  const handleCheckout = () => {
    const itemsToCheckout = Object.keys(quantities)
      .filter(id => quantities[id] > 0)
      .map(id => ({
        id: parseInt(id),
        quantity: quantities[id],
      }));

    // Sends the selected items to the backend
    fetch("http://localhost:5001/api/cart", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: itemsToCheckout }),
    })
      .then(response => response.json())
      .then(() => {
        navigate('/cart', { state: { cartItems: itemsToCheckout } });  // Navigate to the cart page after adding the items
      })
      .catch(error => console.error('Error:', error));
  };

  // Function to display items by category
  const renderCategory = (categoryName, categoryItems) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2 text-red-500 text-center bg-gray-100 py-4">{categoryName}</h2> {/* Category title */}
      {categoryItems.length > 0 ? (
        categoryItems.map(item => (
          <MenuItem
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={`http://localhost:5001${item.image_url}` || 'https://via.placeholder.com/100'}
            quantity={quantities[item.id]}
            onAdd={() => setItemQuantity(item.id, quantities[item.id] + 1)}
            onRemove={() => setItemQuantity(item.id, quantities[item.id] - 1)}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No items found</p>
      )}
    </div>
  );

  // Filtering items by categories
  const starters = menuItems.filter(item => item.category === "Starters");
  const mainCourses = menuItems.filter(item => item.category === "Main Course");
  const drinks = menuItems.filter(item => item.category === "Drinks");
  const desserts = menuItems.filter(item => item.category === "Desserts");

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-6">Menu</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {renderCategory("Starters", starters)}
        {renderCategory("Main Course", mainCourses)}
        {renderCategory("Drinks", drinks)}
        {renderCategory("Desserts", desserts)}
      </div>

      <div className="h-20"></div>

      {/* Shows the "Go to Cart" button only if items are selected */}
      {hasItemsInCart && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white text-center p-4">
          <button onClick={handleCheckout} className="font-bold text-xl">Go to Cart</button>
        </div>
      )}
    </div>
  );
}

export default Menu;
