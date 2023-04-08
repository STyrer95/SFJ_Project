import React from "react";
import * as ReactDOMClient from 'react-dom/client';
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// Container in index.html
const container = document.getElementById("root");

// Create a root.
const root = ReactDOMClient.createRoot(container);

// Render on root
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)