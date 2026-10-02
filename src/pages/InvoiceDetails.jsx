import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowDown } from "../assets/icons/ArrowDown";
import InvoiceForm from "../components/InvoiceForm";
import DeleteModal from "../components/DeleteModal";
import Status from "../components/Status";

export default function InvoiceDetails({
  invoices,
  onUpdate,
  onDelete,
  onMarkPaid,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoice = invoices.find((inv) => inv.id === id);

  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setShowDeleteModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!invoice)
    return <div className="p-20 text-center">Invoice not found</div>;

  const handleDelete = () => {
    onDelete(invoice.id);
    navigate("/");
  };

  const calculatePaymentDue = (dateString, termsString) => {
    if (!dateString) return "";
    const daysToAdd = parseInt(termsString.split(" ")[1]) || 30;
    const date = new Date(dateString);
    date.setDate(date.getDate() + daysToAdd);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/,/g, "");
  };

  // Shared button classes
  const editBtn =
    "cursor-pointer bg-[#F9FAFE] dark:bg-edit-btn-dark text-secondary dark:text-light-gray px-5 py-3 rounded-full hover:bg-light-gray transition font-bold";
  const deleteBtn =
    "cursor-pointer bg-danger text-white px-5 py-3 rounded-full font-bold hover:bg-danger-light transition";
  const paidBtn =
    "cursor-pointer bg-primary text-white px-5 py-3 rounded-full font-bold hover:bg-primary-light transition";

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark py-8 lg:py-16 px-6 lg:px-0 pb-28 lg:pb-16">
      <div className="max-w-[730px] w-full mx-auto">
        <Link
          to="/"
          className="flex items-center gap-4 mb-8 font-bold dark:text-white"
        >
          <span className="text-primary">
            <ArrowDown className="w-5 h-5 rotate-90" />
          </span>
          <h3>Go back</h3>
        </Link>

        {/* Status bar — desktop shows buttons here, mobile hides them */}
        <div className="bg-white dark:bg-[#1E2139] p-6 rounded-[8px] shadow-sm flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <span className="text-[#858BB2]">Status</span>
            <Status invoice={invoice} />
          </div>

          {/* Desktop buttons only */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => {
                setEditingInvoice(invoice);
                setFormOpen(true);
              }}
              className={editBtn}
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className={deleteBtn}
            >
              Delete
            </button>
            {invoice.status.toLowerCase() === "pending" && (
              <button
                onClick={() => onMarkPaid(invoice.id)}
                className={paidBtn}
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-[#1E2139] p-6 lg:p-12 rounded-lg shadow-sm">
          {/* Top: ID + sender address */}
          <div className="flex flex-col lg:flex-row lg:justify-between mb-8 lg:mb-12 gap-6 lg:gap-0">
            <div>
              <h3 className="dark:text-white">
                <span className="text-secondary dark:text-text-muted">#</span>
                {invoice.id}
              </h3>
              {invoice.items.map((item, i) => (
                <p key={i} className="text-secondary dark:text-light-gray">
                  {item.name}
                </p>
              ))}
            </div>
            <div className="text-left lg:text-right text-secondary dark:text-light-gray">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postcode}</p>
              <p>{invoice.senderAddress.country}</p>
            </div>
          </div>

          {/* Info grid — 2 col on mobile, 3 col on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-8 lg:mb-12">
            {/* Dates */}
            <div className="flex flex-col justify-between gap-6 lg:gap-0">
              <div>
                <p className="text-secondary mb-3 dark:text-light-gray">
                  Invoice Date
                </p>
                <h3 className="dark:text-white">{invoice.date}</h3>
              </div>
              <div>
                <p className="text-secondary mb-3 dark:text-light-gray">
                  Payment Due
                </p>
                <h3 className="dark:text-white">{invoice.paymentDue}</h3>
              </div>
            </div>

            {/* Bill To */}
            <div>
              <p className="text-secondary mb-3 dark:text-light-gray">
                Bill To
              </p>
              <h3 className="dark:text-white mb-2">{invoice.name}</h3>
              <div className="text-secondary dark:text-light-gray">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postcode}</p>
                <p>{invoice.clientAddress.country}</p>
              </div>
            </div>

            {/* Sent To — full width row on mobile */}
            <div className="col-span-2 lg:col-span-1">
              <p className="text-secondary mb-3 dark:text-light-gray">
                Sent to
              </p>
              <h3 className="dark:text-white break-all">
                {invoice.clientEmail}
              </h3>
            </div>
          </div>

          {/* Items table */}
          <div className="bg-[#F9FAFE] dark:bg-border-dark rounded-t-[8px] p-6 lg:p-8">
            {/* Header — hidden on mobile */}
            <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr] text-secondary dark:text-light-gray mb-6">
              <span>Item Name</span>
              <span className="text-center">QTY.</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>

            {invoice.items.map((item, index) => (
              <div key={index} className="mb-6">
                {/* Mobile layout */}
                <div className="flex justify-between items-center lg:hidden">
                  <div>
                    <h3 className="dark:text-white">{item.name}</h3>
                    <p className="text-secondary dark:text-light-gray">
                      {item.quantity} x £{item.price.toFixed(2)}
                    </p>
                  </div>
                  <h3 className="dark:text-white">£{item.total.toFixed(2)}</h3>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr] dark:text-white">
                  <h3>{item.name}</h3>
                  <h3 className="text-center text-secondary dark:text-light-gray">
                    {item.quantity}
                  </h3>
                  <h3 className="text-right text-secondary dark:text-light-gray">
                    £{item.price.toFixed(2)}
                  </h3>
                  <h3 className="text-right">£{item.total.toFixed(2)}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Amount footer */}
          <div className="bg-draft dark:bg-text-main p-6 lg:p-8 rounded-b-[8px] flex items-center justify-between">
            <span className="text-white text-sm">Amount Due</span>
            <h2 className="text-white">£{invoice.amount}</h2>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-[#1E2139] px-6 py-5 flex items-center justify-end gap-2 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => {
            setEditingInvoice(invoice);
            setFormOpen(true);
          }}
          className={editBtn}
        >
          Edit
        </button>
        <button onClick={() => setShowDeleteModal(true)} className={deleteBtn}>
          Delete
        </button>
        {invoice.status.toLowerCase() === "pending" && (
          <button onClick={() => onMarkPaid(invoice.id)} className={paidBtn}>
            Mark as Paid
          </button>
        )}
      </div>

      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <InvoiceForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        invoice={editingInvoice}
        onSave={(formData) => {
          const formatDateForData = (dateString) => {
            if (!dateString) return "";
            return new Date(dateString)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/,/g, "");
          };
          const updatedInvoice = {
            ...invoice,
            name: formData.clientName,
            clientEmail: formData.clientEmail,
            date: formatDateForData(formData.invoiceDate),
            paymentDue: calculatePaymentDue(
              formData.invoiceDate,
              formData.paymentTerms,
            ),
            paymentTerms: formData.paymentTerms,
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
              .reduce((acc, item) => acc + item.total, 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 }),
          };
          onUpdate(updatedInvoice);
          setFormOpen(false);
        }}
        onDraft={() => setFormOpen(false)}
      />
    </div>
  );
}
