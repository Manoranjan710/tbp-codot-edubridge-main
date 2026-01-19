import { Metadata } from "next";
import FinanceOverview from "@/components/finance/FinanceOverview";

export const metadata: Metadata = {
  title: "Finance Overview | College Agent Dashboard",
  description: "Financial overview and analytics from college perspective",
};

export default function FinanceOverviewPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Finance Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Financial analytics and revenue insights from college perspective
        </p>
      </div>

      <FinanceOverview />
    </div>
  );
}