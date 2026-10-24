import CoordinatorManagement from "@/components/dashboard/CoordinatorManagement";

export const metadata = {
  title: "Coordinators Wing | Apna Parivar Vriddh Aashram Foundation Dashboard",
  description: "Manage regional coordinators, view enrolled members, promote existing users, and issue appointment letters.",
};

export default function DashboardCoordinatorsPage() {
  return <CoordinatorManagement />;
}
