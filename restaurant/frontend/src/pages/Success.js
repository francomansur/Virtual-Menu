import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderSummary } = location.state || {};

  // If no order is found, redirect back to the menu
  if (!orderSummary) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold">No order found!</h1>
        <button
          onClick={() => navigate('/menu')}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg"
        >
          Go back to Menu
        </button>
      </div>
    );
  }

  // Calculate the total price of the order
  const totalPrice = orderSummary.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-4xl font-bold text-green-500 mb-6">Order Successful!</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <p><strong>Name:</strong> {orderSummary.name}</p>
        <p><strong>Table Number:</strong> {orderSummary.tableNumber}</p>
        <p><strong>Observation:</strong> {orderSummary.observation || 'No observations'}</p>
        <h3 className="text-xl font-semibold mt-4">Items:</h3>
        <ul>
          {orderSummary.items.map((item, index) => (
            <li key={index} className="mt-2">
              {item.quantity}x {item.name} (${item.price}) - ${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mt-4">Total: ${totalPrice.toFixed(2)}</h3> {/* Displays the total price */}

        <button
          onClick={() => navigate('/menu')}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
}

export default Success;
