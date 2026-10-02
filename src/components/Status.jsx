export default function Status({ invoice }) {
  const statusStyles = {
    Paid: "bg-paid-bg text-paid",
    Pending: "bg-pending-bg text-pending",
    Draft: "bg-draft-bg text-draft",
  };

  const dotStyles = {
    Paid: "bg-paid",
    Pending: "bg-pending",
    Draft: "bg-draft",
  };
  return (
    <div
      className={`w-28 py-3 rounded-[6px] flex items-center justify-center font-bold text-sm ${statusStyles[invoice.status]}`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 ${dotStyles[invoice.status]}`}
      ></span>
      {invoice.status}
    </div>
  );
}
