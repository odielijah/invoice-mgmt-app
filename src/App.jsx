import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import { useState, useEffect } from "react";
import { invoices as initialData } from "./data/invoices";

const STORAGE_KEY = "invoice-app-data";

function loadInvoices() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  } catch {
    return initialData;
  }
}

export default function App() {
  const [invoices, setInvoices] = useState(loadInvoices);

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Persist invoices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (newInvoice) =>
    setInvoices((prev) => [newInvoice, ...prev]);

  const updateInvoice = (updated) =>
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updated.id ? updated : inv)),
    );

  const deleteInvoice = (id) =>
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));

  const markAsPaid = (id) =>
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "Paid" } : inv)),
    );

  return (
    <BrowserRouter>
      <div className="flex flex-col lg:flex-row bg-bg-light dark:bg-bg-dark transition-colors duration-300">
        <Sidebar isDark={isDark} toggleTheme={() => setIsDark((d) => !d)} />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<Invoices invoices={invoices} onAdd={addInvoice} />}
            />
            <Route
              path="/invoice/:id"
              element={
                <InvoiceDetails
                  invoices={invoices}
                  onUpdate={updateInvoice}
                  onDelete={deleteInvoice}
                  onMarkPaid={markAsPaid}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
