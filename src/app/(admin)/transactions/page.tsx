import { Metadata } from "next";
import TransactionsTable from "@/components/tables/TransactionsTable";

export const metadata: Metadata = {
  title: "Transactions | College Agent Dashboard",
  description: "Agent commission transactions based on approved visa students",
};

export default function TransactionsPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Agent Transactions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Commission earnings based on approved visa students (15% of course fees)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <TransactionsTable />
      </div>
    </div>
  );
}