# Virtual Menu - CS50
#### Video Demo:  https://youtu.be/XDQRKiQTss8
#### Description:

## Overview
Virtual Menu is a system designed to streamline restaurant operations, simplifying the ordering process and menu organization. Customers can place orders directly on the Menu page without needing to log in, while restaurant staff can access the Management page to view, manage, and track these orders efficiently. The Management page is secured and requires login, ensuring that only authorized staff can access this sensitive area.

## File Descriptions

- **app.py**: The main backend file that initializes the Flask application. It sets up API endpoints to handle data related to orders and menu items, enabling seamless communication between the server and the client interface. Additionally, `app.py` implements protected routes to ensure only authenticated users can access administrative functionalities, such as viewing order history and managing the menu.

- **frontend/**: Contains all React pages and components for both customer-facing and management interfaces. This directory includes all necessary React components and routes for the system.

- **App.js**: The central file in the React frontend, which organizes routes and components, managing navigation between pages like the Menu and the Order Management section. It also defines the application structure, providing an intuitive user experience for both customers and restaurant staff.

## SQLAlchemy

- **ORM (Object-Relational Mapping)**: SQLAlchemy maps database tables to Python classes and rows to objects, simplifying data handling.
- **Syntax Simplification**: Replaces SQL commands with Python functions and methods, making the code more intuitive and easier to maintain.
- **Support for Complex Projects**: Organizes and scales data management, particularly useful for projects with extensive data or related tables.

## Tailwind CSS

The project uses Tailwind CSS to style the interface, providing a modern and responsive design. Tailwind CSS makes it easy to create custom styles and keeps CSS code organized. It enables efficient styling directly on components, making the system’s interface more user-friendly and intuitive for both the Menu and Management sections.

## Virtual Environment and requirements.txt

To ensure consistency in the development environment, the project uses a Python virtual environment. This isolates project dependencies, avoiding version conflicts and facilitating the installation of specific packages.

<br>

## How to run the Application

### Unzipping the Project Directory

1. First, inside `project/` unzip the `restaurant/` directory to access the project files:
   ```bash
   unzip restaurant.zip -d restaurant
   ```

<br>

### Virtual Environment Setup

- **Navigate to the `restaurant` directory**:
  ```bash
  cd restaurant
  ```

- **Create a virtual environment**:
  ```bash
  python3 -m venv venv
  ```

<br>

### Activating the Virtual Environment

- **Activate the environment:**:
  ```bash
  source venv/bin/activate
  ```

This step ensures that you are installing packages and running the project in an isolated environment.

<br>

### Installing Dependencies with requirements.txt

The requirements.txt file lists all necessary dependencies to run the project. To install them, run:

- **Install dependiencies:**:
  ```bash
  pip install -r requirements.txt
  ```

This ensures all essential libraries, such as Flask and SQLAlchemy, are installed.

<br>

### Starting the Flask Backend

1. Navigate to the `restaurant/` directory:
  ```bash
  cd project/restaurant
  ```

2. Ensure that your virtual environment is activated:
   ```bash
   source venv/bin/activate
   ```

3. Start the Flask application with
   ```bash
   flask run
   ```
<br>

### Starting the React Frontend

1. Open a new terminal window, navigate to the `restaurant/` directory:
   ```bash
   cd project/restaurant
   ```

2. Ensure that your virtual environment is activated.
   ```bash
   source venv/bin/activate
   ```

3. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

4. Start the React application:
   ```bash
   npm start
   ```

<br>

### Authentication and Page Protection

- **Menu Page**: The Menu interface is publicly accessible without login, allowing any customer to view available items and place orders.
- **Management Page**: The management interface is login-protected, ensuring only authenticated users, such as restaurant staff, can access and manage orders. Authentication is implemented in the backend, safeguarding sensitive information and administrative functionalities.

This route protection structure provides a secure and tailored experience for different user types within the system.



