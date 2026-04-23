import { useState, useEffect } from "react";

// ─── helpers ─────────────────────────────────────────────────────────────────
const emptyItem = () => ({ name: "", quantity: 1, price: 0, total: 0 });

const emptyForm = {
  senderStreet: "",
  senderCity: "",
  senderPostCode: "",
  senderCountry: "",
  clientName: "",
  clientEmail: "",
  clientStreet: "",
  clientCity: "",
  clientPostCode: "",
  clientCountry: "",
  invoiceDate: "",
  paymentTerms: "Net 30 Days",
  projectDescription: "",
  items: [emptyItem()],
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Returns YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

function buildForm(invoice) {
  if (!invoice) return { ...emptyForm, items: [emptyItem()] };
  return {
    senderStreet: invoice.senderAddress?.street ?? "",
    senderCity: invoice.senderAddress?.city ?? "",
    senderPostCode: invoice.senderAddress?.postcode ?? "",
    senderCountry: invoice.senderAddress?.country ?? "",
    clientName: invoice.name ?? "",
    clientEmail: invoice.clientEmail ?? "",
    clientStreet: invoice.clientAddress?.street ?? "",
    clientCity: invoice.clientAddress?.city ?? "",
    clientPostCode: invoice.clientAddress?.postcode ?? "",
    clientCountry: invoice.clientAddress?.country ?? "",
    invoiceDate: formatDateForInput(invoice.date) ?? "",
    paymentTerms: invoice.paymentTerms ?? "Net 30 Days",
    projectDescription: invoice.items?.[0]?.name ?? "", // Usually, description is the first item's name if not separate
    items: invoice.items?.length
      ? invoice.items.map((i) => ({ ...i, total: i.quantity * i.price }))
      : [emptyItem()],
  };
}

// ─── tiny shared UI pieces ────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <label className="block text-[11px] font-medium text-[#7E88C3] dark:text-[#888EB0] mb-2">
      {children}
    </label>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border border-[#DFE3FA] dark:border-[#252945] bg-white dark:bg-[#1E2139]
        text-[#0C0E16] dark:text-white rounded-md px-4 py-3.5 text-[12px] font-bold
        outline-none focus:border-[#7C5DFA] transition-colors placeholder:text-[#888EB0] ${className}`}
      {...props}
    />
  );
}

function PaymentSelect({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-[#DFE3FA] dark:border-[#252945] bg-white dark:bg-[#1E2139]
          text-[#0C0E16] dark:text-white rounded-md px-4 py-3.5 text-[12px] font-bold
          outline-none focus:border-[#7C5DFA] appearance-none cursor-pointer transition-colors"
      >
        <option>Net 1 Day</option>
        <option>Net 7 Days</option>
        <option>Net 14 Days</option>
        <option>Net 30 Days</option>
      </select>
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
        width="11"
        height="7"
        viewBox="0 0 11 7"
        fill="none"
      >
        <path
          d="M1 1l4.228 4.228L9.456 1"
          stroke="#7C5DFA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 className="text-[12px] font-bold text-[#7C5DFA] mb-6">{children}</h3>
  );
}

function TrashButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[#888EB0] hover:text-[#EC5757] transition-colors flex justify-center"
    >
      <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor">
        <path
          d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H3.194a1.777
          1.777 0 01-1.777-1.778V3.556h10.166zM8.021 0l.7.889h3.862v1.778H.417V.889h3.862L5.042 0h2.98z"
        />
      </svg>
    </button>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
/**
 * Props:
 *  isOpen    boolean        — controls visibility
 *  onClose   () => void     — called on Discard / Cancel
 *  onSave    (data) => void — called on Save & Send / Save Changes
 *  onDraft   (data) => void — called on Save as Draft (new invoices only)
 *  invoice   object | null  — null = New Invoice, object = Edit mode
 */
export default function InvoiceForm({
  isOpen,
  onClose,
  onSave,
  onDraft,
  invoice = null,
}) {
  const validate = () => {
    const errors = [];
    if (!form.clientName.trim()) errors.push("Client name is required.");
    if (
      !form.clientEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)
    )
      errors.push("Valid client email is required.");
    if (!form.senderStreet.trim()) errors.push("Sender street is required.");
    if (!form.invoiceDate) errors.push("Invoice date is required.");
    if (form.items.length === 0) errors.push("Add at least one item.");
    form.items.forEach((item, i) => {
      if (!item.name.trim()) errors.push(`Item ${i + 1}: name is required.`);
      if (item.quantity < 1)
        errors.push(`Item ${i + 1}: quantity must be at least 1.`);
      if (item.price < 0) errors.push(`Item ${i + 1}: price must be positive.`);
    });
    return errors;
  };

  const [validationErrors, setValidationErrors] = useState([]);

  const isEditMode = !!invoice;
  const [form, setForm] = useState(emptyForm);

  // reset form every time the drawer opens
  useEffect(() => {
    if (isOpen) setForm(buildForm(invoice));
  }, [isOpen, invoice]);

  if (!isOpen) return null;

  // ── field updaters ──────────────────────────────────────────────────────
  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setItemField = (index, key) => (e) => {
    setForm((f) => {
      const items = f.items.map((item, i) => {
        if (i !== index) return item;

        // Convert value to a number if it's quantity or price
        const val =
          key === "quantity" || key === "price"
            ? Number(e.target.value)
            : e.target.value;

        const next = { ...item, [key]: val };

        // Now quantity and price are guaranteed numbers for this math:
        next.total = next.quantity * next.price;
        return next;
      });
      return { ...f, items };
    });
  };

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, emptyItem()] }));
  const removeItem = (i) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  // ── save handlers ───────────────────────────────────────────────────────
  const handleSave = () => {
    const errors = validate();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    onSave?.({ ...form, status: "pending" });
  };
  const handleDraft = () => onDraft?.({ ...form, status: "draft" });

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-y-0 left-0 lg:left-[80px] right-0 z-50 flex">
      {/* overlay */}
      <div
        className="fixed inset-y-0 left-0 lg:left-[80px] right-0 bg-black/50"
        onClick={onClose}
      />

      {/* drawer panel */}
      <div className="relative flex h-full w-full max-w-[719px] flex-col bg-white dark:bg-[#141625] shadow-2xl">
        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 lg:pt-14 pt-[120px] pb-8 md:px-14">
          <h2 className="mb-11 text-[#0C0E16] dark:text-white">
            {isEditMode ? (
              <>
                {" "}
                Edit <span className="text-[#888EB0]">#{invoice.id}</span>{" "}
              </>
            ) : (
              "New Invoice"
            )}
          </h2>

          {/* Bill From */}
          <section className="mb-10">
            <SectionHeading>Bill From</SectionHeading>
            <div className="grid gap-6">
              <Field label="Street Address">
                <Input
                  value={form.senderStreet}
                  onChange={setField("senderStreet")}
                />
              </Field>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <Field label="City">
                  <Input
                    value={form.senderCity}
                    onChange={setField("senderCity")}
                  />
                </Field>
                <Field label="Post Code">
                  <Input
                    value={form.senderPostCode}
                    onChange={setField("senderPostCode")}
                  />
                </Field>
                <div className="col-span-2 md:col-span-1">
                  <Field label="Country">
                    <Input
                      value={form.senderCountry}
                      onChange={setField("senderCountry")}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </section>

          {/* Bill To */}
          <section className="mb-10">
            <SectionHeading>Bill To</SectionHeading>
            <div className="grid gap-6">
              <Field label="Client's Name">
                <Input
                  value={form.clientName}
                  onChange={setField("clientName")}
                />
              </Field>
              <Field label="Client's Email">
                <Input
                  type="email"
                  placeholder="e.g. email@example.com"
                  value={form.clientEmail}
                  onChange={setField("clientEmail")}
                />
              </Field>
              <Field label="Street Address">
                <Input
                  value={form.clientStreet}
                  onChange={setField("clientStreet")}
                />
              </Field>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <Field label="City">
                  <Input
                    value={form.clientCity}
                    onChange={setField("clientCity")}
                  />
                </Field>
                <Field label="Post Code">
                  <Input
                    value={form.clientPostCode}
                    onChange={setField("clientPostCode")}
                  />
                </Field>
                <div className="col-span-2 md:col-span-1">
                  <Field label="Country">
                    <Input
                      value={form.clientCountry}
                      onChange={setField("clientCountry")}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </section>

          {/* Date / Terms / Description */}
          <section className="mb-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Invoice Date">
                <Input
                  type="date"
                  value={form.invoiceDate}
                  onChange={setField("invoiceDate")}
                />
              </Field>
              <Field label="Payment Terms">
                <PaymentSelect
                  value={form.paymentTerms}
                  onChange={setField("paymentTerms")}
                />
              </Field>
            </div>
            <div className="mt-6">
              <Field label="Project Description">
                <Input
                  placeholder="e.g. Graphic Design"
                  value={form.projectDescription}
                  onChange={setField("projectDescription")}
                />
              </Field>
            </div>
          </section>

          {/* Item List */}
          <section>
            <h2 className="mb-6 text-lg font-bold text-[#777F98]">Item List</h2>

            {/* desktop column headers */}
            {form.items.length > 0 && (
              <div className="mb-4 hidden md:grid grid-cols-[1fr_64px_100px_72px_18px] gap-4">
                {["Item Name", "Qty.", "Price", "Total", ""].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-medium text-[#7E88C3]"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}

            {form.items.map((item, i) => (
              <div key={i} className="mb-5">
                {/* mobile */}
                <div className="grid gap-4 md:hidden">
                  <Field label="Item Name">
                    <Input
                      value={item.name}
                      onChange={setItemField(i, "name")}
                    />
                  </Field>
                  <div className="grid grid-cols-[64px_1fr_1fr_18px] items-end gap-4">
                    <Field label="Qty.">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={setItemField(i, "quantity")}
                        className="text-center"
                      />
                    </Field>
                    <Field label="Price">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={setItemField(i, "price")}
                      />
                    </Field>
                    <Field label="Total">
                      <div className="flex h-[48px] items-center text-[12px] font-bold text-[#888EB0]">
                        {Number(item.total).toFixed(2)}
                      </div>
                    </Field>
                    <div className="mb-[14px] self-end">
                      <TrashButton onClick={() => removeItem(i)} />
                    </div>
                  </div>
                </div>

                {/* desktop */}
                <div className="hidden md:grid grid-cols-[1fr_64px_100px_72px_18px] items-center gap-4">
                  <Input value={item.name} onChange={setItemField(i, "name")} />
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={setItemField(i, "quantity")}
                    className="text-center"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={setItemField(i, "price")}
                  />
                  <div className="pl-1 text-[12px] font-bold text-[#888EB0]">
                    {Number(item.total).toFixed(2)}
                  </div>
                  <TrashButton onClick={() => removeItem(i)} />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="mt-2 w-full rounded-full bg-[#F9FAFE] dark:bg-[#252945] py-4
                text-[12px] font-bold text-[#7E88C3] hover:bg-[#DFE3FA] dark:hover:bg-[#2B2C37] transition-colors"
            >
              + Add New Item
            </button>
          </section>
        </div>

        {validationErrors.length > 0 && (
          <div className="px-6 md:px-14 pb-4">
            <p className="text-danger text-[11px] font-bold mb-1">
              — All fields must be added
            </p>
            {validationErrors.map((e, i) => (
              <p key={i} className="text-danger text-[11px]">
                {e}
              </p>
            ))}
          </div>
        )}

        {/* sticky footer */}
        <div
          className="flex items-center justify-between bg-white dark:bg-[#141625]
          px-6 py-5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] dark:shadow-none md:px-14"
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#F9FAFE] dark:bg-[#252945] px-6 py-3 md:py-4
              text-[12px] font-bold text-[#7E88C3] hover:bg-[#DFE3FA] transition-colors"
          >
            {isEditMode ? "Cancel" : "Discard"}
          </button>

          <div className="flex gap-2">
            {!isEditMode && (
              <button
                type="button"
                onClick={handleDraft}
                className="rounded-full bg-[#373B53] dark:bg-[#252945] px-2 md:px-6 py-3 md:py-4
                  text-[12px] font-bold text-[#888EB0] hover:bg-[#0C0E16] dark:hover:bg-[#2B2C37] transition-colors"
              >
                Save as Draft
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-[#7C5DFA] px-2 md:px-6 py-3 md:py-4
                text-[12px] font-bold text-white hover:bg-[#9277FF] transition-colors"
            >
              {isEditMode ? "Save Changes" : "Save & Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
