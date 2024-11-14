
# Virtual Menu - CS50
#### Video Demo: https://youtu.be/XDQRKiQTss8
#### Description:

## Overview
Virtual Menu is a system designed to streamline restaurant operations by simplifying the ordering process and menu organization. Customers can place orders directly on the Menu page without needing to log in, while restaurant staff can access the Management page to view, manage, and track these orders efficiently. The Management page is secured and requires login, ensuring only authorized staff can access this area.

---

## How to Run the Application

### Cloning the Repository

1. Copy the repository URL from GitHub.

2. Clone the repository locally using the following command:
   ```bash
   git clone <repository-url>
   ```

3. Navigate to the `Virtual-Menu` folder:
   ```bash
   cd virtual-menu
   ```

4. Navigate to the `restaurant` folder:
   ```bash
   cd restaurant
   ```

---

### Setting Up the Virtual Environment and Running Flask

1. **Create a virtual environment**:
   - Mac/Linux:
     ```bash
     python3 -m venv venv
     ```
   - Windows:
     ```bash
     python -m venv venv
     ```

2. **Activate the virtual environment**:
   - Mac/Linux:
     ```bash
     source venv/bin/activate
     ```
   - Windows:
     ```bash
     venv\Scriptsctivate
     ```

3. **Install project dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask server**:
   ```bash
   flask run --host=127.0.0.1 --port=5001
   ```

---

### Setting Up and Running the Frontend

1. **Open a new terminal** and ensure the Flask backend is running.

2. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

3. **Ensure [Node.js](https://nodejs.org/) is installed**:
   - Check by running:
     ```bash
     node -v
     npm -v
     ```

4. **Configure React to run on 127.0.0.1**:
   - Create a `.env` file in the `frontend` directory.
   - Add the following line to the `.env` file:
     ```env
     HOST=127.0.0.1
     ```

5. **Install React dependencies and start the server**:
   ```bash
   npm install
   npm start
   ```

---

### Troubleshooting

- **Permission Errors during `npm start`**:
  If you encounter permission errors, run the following commands:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm start
  ```

---

## Notes
- Ensure both the backend (Flask) and frontend (React) servers are running simultaneously for the application to work correctly.
- By configuring the `.env` file, React will always run on `127.0.0.1`.
