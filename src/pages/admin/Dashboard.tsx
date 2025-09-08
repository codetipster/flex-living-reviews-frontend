import { DashboardLayout } from "@/pages/admin/components/DashboardLayout";
import { DashboardOverview } from "@/pages/admin/components/DashboardOverview";
import { ReviewsTable } from "@/pages/admin/components/ReviewsTable";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardOverview />
        <ReviewsTable />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;