import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import "./index.css";
import ContextProviders from "./context";
import ErrorBoundary from "./components/ErrorBoundary";
const queryClient = new QueryClient();
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
  <BrowserRouter>
    <ContextProviders>
      <App />
    </ContextProviders>
  </BrowserRouter>
  </ErrorBoundary>
  </QueryClientProvider>
);
