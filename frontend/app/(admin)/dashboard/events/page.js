import ContentCollection from "@/components/dashboard/ContentCollection";

export const metadata = {
  title: "Events Management | Apna Parivar Vriddh Aashram Foundation Dashboard",
  description: "Create, edit, and organize foundation elder care drives, medical camps, and community satsang events.",
};

export default function DashboardEventsPage() {
  return <ContentCollection resource="events" />;
}
