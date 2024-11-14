import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // State to track expanded order

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/orders', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          // Redirect to login if unauthorized
          console.error('Unauthorized - Redirecting to login');
          window.location.href = '/login';
        } else if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Toggle order details (expand/collapse)
  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Mark order as complete
  const completeOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/complete`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove completed order from the list
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        console.error('Failed to complete order');
      }
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded shadow-md mt-6">
        <h2 className="text-center text-3xl font-bold mb-6">Orders Management</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-700">No orders found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 text-left text-gray-600">Order ID</th>
                <th className="py-2 text-left text-gray-600">Customer Name</th>
                <th className="py-2 text-left text-gray-600">Table Number</th>
                <th className="py-2 text-left text-gray-600">Status</th>
                <th className="py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-t">
                    <td className="py-2">{order.id}</td>
                    <td className="py-2">{order.customer_name}</td>
                    <td className="py-2">{order.table_number}</td>
                    <td className="py-2">{order.status}</td>
                    <td className="py-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded"
                        onClick={() => toggleDetails(order.id)}
                      >
                        {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan="5" className="bg-gray-100 p-4">
                        <div>
                          <p><strong>Observation:</strong> {order.observation || 'No observation'}</p>
                          <p><strong>Items:</strong></p>
                          <ul>
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <li key={index}>
                                  {item.quantity}x {item.menu_item_name} - ${item.total_price ? item.total_price.toFixed(2) : '0.00'}
                                </li>
                              ))
                            ) : (
                              <li>No items in this order.</li>
                            )}
                          </ul>
                          <p><strong>Total:</strong> ${order.items.reduce((acc, item) => acc + item.total_price, 0).toFixed(2)}</p>
                          <button
                            className="bg-green-500 text-white py-1 px-3 mt-4 rounded"
                            onClick={() => completeOrder(order.id)}
                          >
                            Complete Order
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function History() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // State to track expanded order

  useEffect(() => {
    // Fetch order history from the backend
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/history', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  // Toggle order details (expand/collapse)
  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded shadow-md mt-6">
        <h2 className="text-center text-3xl font-bold mb-6">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-700">No completed orders found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 text-left text-gray-600">Order ID</th>
                <th className="py-2 text-left text-gray-600">Customer Name</th>
                <th className="py-2 text-left text-gray-600">Table Number</th>
                <th className="py-2 text-left text-gray-600">Status</th>
                <th className="py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-t">
                    <td className="py-2">{order.id}</td>
                    <td className="py-2">{order.customer_name}</td>
                    <td className="py-2">{order.table_number}</td>
                    <td className="py-2">{order.status}</td>
                    <td className="py-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded"
                        onClick={() => toggleDetails(order.id)}
                      >
                        {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan="5" className="bg-gray-100 p-4">
                        <div>
                          <p><strong>Observation:</strong> {order.observation || 'No observation'}</p>
                          <p><strong>Items:</strong></p>
                          <ul>
                          {order.items && order.items.length > 0 ? (
                            <>
                              <ul>
                                {order.items.map((item, index) => (
                                  <li key={index}>
                                    {item.quantity}x {item.menu_item_name} - ${item.total_price ? item.total_price.toFixed(2) : '0.00'}
                                  </li>
                                ))}
                              </ul>
                              {/* Cálculo do total */}
                              <p><strong>Total:</strong> ${order.items.reduce((acc, item) => acc + item.total_price, 0).toFixed(2)}</p>
                            </>
                          ) : (
                            <li>No items in this order.</li>
                          )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');  // Stores category ID
  const [categories, setCategories] = useState([]);  // Stores category list
  const [image, setImage] = useState(null);  // Stores selected image

  useEffect(() => {
    // Fetch menu items and categories from the backend
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/menu', {
          method: 'GET',
        });
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/categories', {
          method: 'GET',
        });
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchMenuItems();
    fetchCategories();  // Fetch categories
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Delete menu item
  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/menu/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Menu item deleted successfully');
        setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      } else {
        alert('Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  // Format price input
  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
    if (value.length > 2) {
      value = value.slice(0, value.length - 2) + '.' + value.slice(value.length - 2);
    }
    setPrice(`$${value}`);
  };

  // Submit new menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericPrice = price.replace('$', ''); // Remove dollar sign for backend processing

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', numericPrice);
    formData.append('category', categoryId);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5001/api/menu', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Menu item added successfully');
        setName('');
        setDescription('');
        setPrice('');
        setCategoryId('');
        setImage(null);
        setMenuItems((prevItems) => [...prevItems, data.new_item]);
      } else {
        alert('Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded shadow-md mt-6">
      <h2 className="text-center text-2xl font-bold mb-6">Add New Menu Item</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
        >
          Add Menu Item
        </button>
      </form>

      <h2 className="text-center text-2xl font-bold mb-6">Existing Menu Items</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 text-left text-gray-600">ID</th>
            <th className="py-2 text-left text-gray-600">Name</th>
            <th className="py-2 text-left text-gray-600">Price</th>
            <th className="py-2 text-left text-gray-600">Category</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              <tr className="border-t">
                <td className="py-2"><strong>{item.id}</strong></td>
                <td className="py-2">{item.name}</td>
                <td className="py-2">${item.price}</td>
                <td className="py-2">{item.category}</td>
                <td className="py-2">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr>
                <td colSpan="5" className="py-2">
                  <strong>Description:</strong> {item.description || 'No description available'}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Management() {
  const [activeSection, setActiveSection] = useState('orders'); // State to track active section
  const navigate = useNavigate();  // Hook for navigation

  // Handle user logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/login'); // Redirect to login page
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-5xl p-6">
        {/* Logout button */}
        <div className="text-right w-full p-6 max-w-5xl">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <h2 className="text-center text-4xl font-bold mb-8">Restaurant Management</h2>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`${activeSection === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} py-2 px-4 rounded`}
            onClick={() => setActiveSection('orders')}
          >
            Orders
          </button>
          <button
            className={`${activeSection === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} py-2 px-4 rounded`}
            onClick={() => setActiveSection('history')}
          >
            History
          </button>
          <button
            className={`${activeSection === 'menu' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} py-2 px-4 rounded`}
            onClick={() => setActiveSection('menu')}
          >
            Menu
          </button>
        </div>
        {activeSection === 'orders' ? (
          <Orders />
        ) : activeSection === 'history' ? (
          <History />
        ) : (
          <MenuManagement />
        )}
      </div>
    </div>
  );
}

export default Management;
