import ContentCollection from "@/components/dashboard/ContentCollection";

export const metadata = {
  title: "Services Management | Apna Parivar Vriddh Aashram Foundation Dashboard",
  description: "Create, edit, organize, and manage foundation elder care services, welfare projects, and relief operations.",
};

export default function DashboardServicesPage() {
  return <ContentCollection resource="services" />;
}
