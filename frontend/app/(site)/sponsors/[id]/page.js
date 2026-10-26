import SponsorDetailsClient from "./SponsorDetailsClient";

export async function generateMetadata({ params }) {
  await params;
  return {
    title: `Corporate Sponsor & CSR Partner Details | Apna Parivar Vriddh Aashram Foundation`,
    description: `Official CSR partnership overview, impact milestones, and collaboration details with Apna Parivar Vriddh Aashram Foundation.`,
  };
}

export default async function SponsorDetailsPage({ params }) {
  const resolvedParams = await params;
  return <SponsorDetailsClient sponsorId={resolvedParams?.id} />;
}

