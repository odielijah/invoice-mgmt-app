import NoInvoicesIllustration from "/illustration-empty.svg";

export default function NoInvoices() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <img
        src={NoInvoicesIllustration}
        alt="Lady Holding Megaphone Vector"
        className="w-full h-auto object-cover max-w-[240px] mb-10"
      />
      <div className="flex items-center flex-col text-center">
        <h2 className="dark:text-text-dark mb-4">
          There is nothing here
        </h2>
        <p className="text-text-muted dark:text-light-gray max-w-[193px]">
          Create an invoice by clicking the{" "}
          <span className="font-bold">New Invoice</span> button and get started
        </p>
      </div>
    </div>
  );
}
