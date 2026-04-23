import { Link } from "react-router-dom";
import { ArrowRight } from "../assets/icons/ArrowRight";
import Status from "./Status";

export default function InvoiceItem({ invoice }) {
  return (
    <Link to={`/invoice/${invoice.id}`}>
      <div
        className="bg-white dark:bg-sidebar-dark p-6 rounded-[8px] shadow-sm shadow-[#48549F1A] 
                      border border-transparent hover:border-primary transition cursor-pointer"
      >
        {/* Mobile layout */}
        <div className="flex flex-col gap-6 min-[715px]:hidden">
          {/* Row 1: ID + Name */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[#0C0E1E] dark:text-white">
              <span className="text-secondary">#</span>
              {invoice.id}
            </h3>
            <span className="text-[#858BB2] dark:text-light-gray">
              {invoice.name}
            </span>
          </div>

          {/* Row 2: Due + Amount | Status + Arrow */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <span className="text-[#858BB2] dark:text-light-gray">
                Due {invoice.date}
              </span>
              <h3 className="text-text-main dark:text-text-dark">
                £ {invoice.amount}
              </h3>
            </div>
            <Status invoice={invoice} />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden min-[715px]:flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h3 className="font-bold text-[#0C0E1E] dark:text-white">
              <span className="text-secondary">#</span>
              {invoice.id}
            </h3>
            <span className="text-[#858BB2] dark:text-light-gray">
              Due {invoice.date}
            </span>
            <span className="text-[#858BB2] dark:text-text-dark">
              {invoice.name}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <h3 className="text-text-main dark:text-text-dark flex gap-2 items-center">
              £ <span>{invoice.amount}</span>
            </h3>
            <Status invoice={invoice} />
            <span className="text-[#7C5DFA] font-bold">
              <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
