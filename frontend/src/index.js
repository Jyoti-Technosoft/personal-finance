import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store";

<ToastContainer />;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
        style={{
          marginTop: "3.5%",
          color: "darkgreen",
          fontWeight: "bold",
        }}
      />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
