import React from "react";
import { useState, useRef, useEffect } from "react";
import InvoiceItem from "../components/InvoiceItem";
import InvoiceForm from "../components/InvoiceForm";
import { Plus } from "../assets/icons/Plus";
import { ArrowDown } from "../assets/icons/ArrowDown";
import NoInvoices from "../components/NoInvoices";

const ALL_STATUSES = ["Draft", "Pending", "Paid"];

export default function Invoices({ invoices, onAdd }) {
  const [formOpen, setFormOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const filterRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const filteredInvoices =
    selectedStatuses.length === 0
      ? invoices
      : invoices.filter((inv) => selectedStatuses.includes(inv.status));

  const generateId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const rand = (n) => Math.floor(Math.random() * n);
    return `${letters[rand(26)]}${letters[rand(26)]}${Math.floor(1000 + rand(9000))}`;
  };

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-bg-dark overflow-x-hidden">
      <div className="flex-1 max-w-[730px] mx-auto pt-16 px-6 lg:px-0">
        {/* Header */}
        <header className="flex justify-between items-center gap-4 mb-16">
          <div>
            <h1 className="text-text-main dark:text-text-dark">
              Invoices
            </h1>
            <p className="text-text-muted hidden md:block dark:text-light-gray text-sm">
              {filteredInvoices.length === 0
                ? "No invoices"
                : `There are ${filteredInvoices.length} total invoices`}
            </p>
            <p className="text-text-muted md:hidden block dark:text-light-gray text-sm">
              {filteredInvoices.length === 0
                ? "No invoices"
                : `${filteredInvoices.length} invoices`}
            </p>
          </div>

          <h3 className="flex items-center gap-2 md:gap-10">
            {/* Filter dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="cursor-pointer flex items-center gap-2 text-text-main dark:text-text-dark font-bold text-[15px]"
              >
                {/* Figma: "Filter" on mobile, "Filter by status" on Tablet/Desktop */}
                <span className="hidden md:inline">Filter by status</span>
                <span className="md:hidden">Filter</span>

                <span className="text-primary">
                  <ArrowDown
                    className={`w-5 h-5 transition-transform ${filterOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              {filterOpen && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1E2139] rounded-[8px] shadow-2xl p-6 w-[192px] z-50 flex flex-col gap-4">
                  {ALL_STATUSES.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-4 cursor-pointer font-bold text-text-main dark:text-text-dark hover:text-primary transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 accent-primary rounded cursor-pointer"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* New Invoice Button */}
            <button
              onClick={() => setFormOpen(true)}
              className="cursor-pointer bg-primary hover:bg-primary-light text-white p-1.5 md:p-2 pr-4 rounded-full flex items-center gap-2 md:gap-4 font-bold transition text-[15px]"
            >
              <span className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4" strokeWidth={4} />
              </span>
              {/* Figma: "New" on mobile, "New Invoice" on Tablet/Desktop */}
              <span className="hidden md:inline">New Invoice</span>
              <span className="md:hidden">New</span>
            </button>
          </h3>
        </header>

        {/* List */}
        <div className="flex flex-col gap-4">
          {filteredInvoices.length === 0 ? (
            <NoInvoices />
          ) : (
            filteredInvoices.map((invoice) => (
              <InvoiceItem key={invoice.id} invoice={invoice} />
            ))
          )}
        </div>
      </div>

      <InvoiceForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        invoice={null}
        onSave={(formData) => {
          const fmt = (d) =>
            d
              ? new Date(d)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/,/g, "")
              : "";
          const daysFromTerms = (t) => parseInt(t?.split(" ")[1]) || 30;
          const paymentDue = (dateStr, terms) => {
            const d = new Date(dateStr);
            d.setDate(d.getDate() + daysFromTerms(terms));
            return fmt(d);
          };
          onAdd({
            id: generateId(),
            status: "Pending",
            name: formData.clientName,
            clientEmail: formData.clientEmail,
            date: fmt(formData.invoiceDate),
            paymentDue: paymentDue(formData.invoiceDate, formData.paymentTerms),
            paymentTerms: formData.paymentTerms,
            description: formData.projectDescription,
            senderAddress: {
              street: formData.senderStreet,
              city: formData.senderCity,
              postcode: formData.senderPostCode,
              country: formData.senderCountry,
            },
            clientAddress: {
              street: formData.clientStreet,
              city: formData.clientCity,
              postcode: formData.clientPostCode,
              country: formData.clientCountry,
            },
            items: formData.items,
            amount: formData.items
              .reduce((a, i) => a + i.total, 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 }),
          });
          setFormOpen(false);
        }}
        onDraft={(formData) => {
          const fmt = (d) =>
            d
              ? new Date(d)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/,/g, "")
              : "";
          onAdd({
            id: generateId(),
            status: "Draft",
            name: formData.clientName || "—",
            clientEmail: formData.clientEmail || "",
            date: fmt(formData.invoiceDate),
            paymentDue: "—",
            paymentTerms: formData.paymentTerms,
            description: formData.projectDescription,
            senderAddress: {
              street: formData.senderStreet,
              city: formData.senderCity,
              postcode: formData.senderPostCode,
              country: formData.senderCountry,
            },
            clientAddress: {
              street: formData.clientStreet,
              city: formData.clientCity,
              postcode: formData.clientPostCode,
              country: formData.clientCountry,
            },
            items: formData.items,
            amount: formData.items
              .reduce((a, i) => a + i.total, 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 }),
          });
          setFormOpen(false);
        }}
      />
    </div>
  );
}
