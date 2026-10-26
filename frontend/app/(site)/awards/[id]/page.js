import AwardDetailsClient from "./AwardDetailsClient";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  return {
    title: `Organization Award Details | Apna Parivar Vriddh Aashram Foundation`,
    description: `Detailed citation, conferring authority, and ceremony background of the award presented to Apna Parivar Vriddh Aashram Foundation.`,
  };
}

export default async function AwardDetailsPage({ params }) {
  await params; // Ensure params are resolved in Next.js 15+
  return <AwardDetailsClient />;
}
