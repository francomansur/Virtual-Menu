import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useMemo(() => location.state?.cartItems || [], [location.state?.cartItems]); // Memorizes cartItems to avoid re-renders

  const [itemsWithDetails, setItemsWithDetails] = useState([]);

  // States for form inputs
  const [name, setName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [observation, setObservation] = useState('');

  // Fetch item details from the menu
  useEffect(() => {
    if (cartItems.length > 0) {
      fetch('http://localhost:5001/api/menu')
        .then(response => response.json())
        .then(menuData => {
          const itemsWithPrices = cartItems.map(cartItem => {
            const itemDetails = menuData.find(menuItem => menuItem.id === cartItem.id);
            return {
              ...cartItem,
              name: itemDetails?.name || '',
              price: itemDetails?.price || 0,
              image_url: itemDetails?.image_url || '',
            };
          });
          setItemsWithDetails(itemsWithPrices);
        })
        .catch(error => console.error("Error fetching menu data:", error));
    }
  }, [cartItems]);

  // Handles increment of item quantity
  const handleAdd = (id) => {
    const updatedItems = itemsWithDetails.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setItemsWithDetails(updatedItems);
  };

  // Handles decrement of item quantity
  const handleRemove = (id) => {
    const updatedItems = itemsWithDetails.map(item =>
      item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setItemsWithDetails(updatedItems);
  };

  // Calculates total price
  const totalPrice = itemsWithDetails.length > 0
    ? itemsWithDetails.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  // Handles the checkout process and navigation to success page
  const handleCheckout = () => {
    const itemsToCheckout = itemsWithDetails.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    fetch("http://localhost:5001/api/orders", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: name,
        table_number: tableNumber,
        observation: observation,
        items: itemsToCheckout
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Order created successfully', data);
      // Redirect to the success page
      navigate('/success', {
        state: {
          orderSummary: {
            name,
            tableNumber,
            observation,
            items: itemsWithDetails
          }
        }
      });
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center">Your Cart</h1>

      {/* Container for form and cart items */}
      <div className="max-w-4xl mx-auto">

        {/* Form and Items */}
        <div className="bg-white rounded-lg p-4 mb-4" style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', scrollBehavior: 'smooth' }}>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Table Number Input */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="tableNumber">Table Number</label>
            <input
              type="text"
              id="tableNumber"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter your table number"
            />
          </div>

          {/* Observation Input */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2" htmlFor="observation">Observation</label>
            <textarea
              id="observation"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Add any observations for your order"
            />
          </div>

          {/* Cart Items List */}
          {itemsWithDetails.length > 0 ? (
            itemsWithDetails.map(item => (
              <div key={item.id} className="flex items-center p-4 border-b border-gray-300">
                <img src={`http://localhost:5001${item.image_url}`} alt={item.name} className="w-20 h-20 rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <div className="flex items-center border border-gray-300 rounded-lg w-32">
                    <button
                      className="text-gray-500 px-4 py-2 border-r border-gray-300 focus:outline-none"
                      onClick={() => handleRemove(item.id)}
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{item.quantity}</span>
                    <button
                      className="text-red-500 px-4 py-2 border-l border-gray-300 focus:outline-none"
                      onClick={() => handleAdd(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="ml-auto text-red-600 font-bold text-lg">{(item.price * item.quantity).toFixed(2)}$</div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Fixed Div for Total Price and Checkout Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-between items-center p-4 max-w-4xl mx-auto border-t border-gray-300">
          <div className="text-xl font-bold pl-4">{totalPrice.toFixed(2)}$</div>
          <button onClick={handleCheckout} className="w-1/2 bg-red-500 text-white font-bold py-2 px-6 mx-0 rounded-lg">
            Finalize Order
          </button>
        </div>

      </div> {/* End of max-width container */}
    </div>
  );
}

export default Cart;
