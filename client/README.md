# React Node App

This is a full-stack application consisting of a React frontend and a Node.js backend. The application is designed to manage products, allowing users to view, create, update, and delete product entries.

## Client

The client is built using React and is located in the `client` directory. It includes the following key components:

- **Public Directory**: Contains static files such as `index.html` and `favicon.ico`.
- **src Directory**: Contains the main application code, including components and styles.
  - `components/App.js`: The main React component that renders the application.
  - `index.js`: The entry point for the React application.
  - `styles.css`: The CSS styles for the application.

### Getting Started with the Client

1. Navigate to the `client` directory:
   ```
   cd client
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The client will be available at `http://localhost:3000`.

## Server

The server is built using Node.js and Express, located in the `server` directory. It provides a RESTful API for managing products.

### Getting Started with the Server

1. Navigate to the `server` directory:
   ```
   cd server
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

The server will be available at `http://localhost:5000`.

## Project Structure

```
react-node-app
├── client
│   ├── public
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src
│   │   ├── components
│   │   │   └── App.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── package.json
│   └── README.md
├── server
│   ├── controllers
│   │   └── products.js
│   ├── models
│   │   └── Product.js
│   ├── routes
│   │   └── products.js
│   ├── app.js
│   ├── package.json
│   └── README.md
└── README.md
```

## License

This project is licensed under the MIT License.