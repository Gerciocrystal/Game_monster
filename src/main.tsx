import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
