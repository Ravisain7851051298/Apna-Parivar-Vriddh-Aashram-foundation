import UsersManagement from "@/components/dashboard/UsersManagement";

export const metadata = {
  title: "User Accounts & Access Control | Apna Parivar Vriddh Aashram Foundation Dashboard",
  description: "Comprehensive management of all registered users, volunteers, members, and administrators.",
};

export default function DashboardUsersPage() {
  return <UsersManagement />;
}
