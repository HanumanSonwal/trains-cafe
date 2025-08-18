import TrainDetails from "../TrainDetails";
import { parseTrainSlug } from "@/utils/parseTrainSlug";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { trainNo, trainName } = parseTrainSlug(slug);

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://trainscafe.in";

  return {
    title: `Order Food in ${trainName} (${trainNo}) Train | TrainsCafe`,
    description: `Get IRCTC-approved hygienic food in ${trainName} (${trainNo}) delivered right to your seat. Book meals online with TrainsCafe.`,
    keywords: `Train food delivery, Order food in train ${trainName}, ${trainNo} IRCTC food booking`,
    openGraph: {
      title: `Order Food in ${trainName} (${trainNo}) Train | TrainsCafe`,
      description: `Order hygienic, fresh food for ${trainName} (${trainNo}) journey. IRCTC e-catering by TrainsCafe.`,
      url: `${baseUrl}/trains/${slug}`,
    },
  };
}

export default function Page({ params }) {
  return <TrainDetails params={params} />;
}
