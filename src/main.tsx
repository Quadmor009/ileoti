import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ScrollToTop } from "./components/ScrollToTop";
import "./index.css";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#80011D",
            },
            components: {
              Modal: {
                contentBg: "#ffffff",
                headerBg: "#ffffff",
                footerBg: "#ffffff",
                titleColor: "rgba(0,0,0,0.88)",
              },
            },
          }}
        >
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
