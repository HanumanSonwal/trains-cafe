import { Suspense } from "react";
import TrainDetails from "../TrainDetails";
import TrainContent from "../TrainContent";
import { JourneySkeleton } from "@/app/componants/Skeletons";
import { parseTrainSlug } from "@/utils/parseTrainSlug";
import { getWebTrain } from "@/app/lib/siteContent";

// The HTML (header, SEO text) is cached and refreshed every 5 minutes; the live
// journey loads in the browser, with a skeleton in its place until then.
export const revalidate = 300;

const loadContent = (trainNo) => getWebTrain(trainNo).catch(() => null);

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { trainNo, trainName } = parseTrainSlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://trainscafe.in";
  const content = await loadContent(trainNo);

  const title = content?.title || `Order Food in ${trainName} (${trainNo}) Train | TrainsCafe`;
  const description =
    content?.description ||
    `Get IRCTC-approved hygienic food in ${trainName} (${trainNo}) delivered right to your seat. Book meals online with TrainsCafe.`;

  return {
    title,
    description,
    keywords: Array.isArray(content?.keywords) && content.keywords.length
      ? content.keywords.join(", ")
      : `Train food delivery, Order food in train ${trainName}, ${trainNo} IRCTC food booking`,
    alternates: { canonical: `${baseUrl}/trains/${slug}` },
    openGraph: {
      title,
      description: `Order hygienic, fresh food for ${trainName} (${trainNo}) journey. IRCTC e-catering by TrainsCafe.`,
      url: `${baseUrl}/trains/${slug}`,
    },
  };
}

export default async function Page({ params }) {
  const { trainNo, trainName } = parseTrainSlug(params.slug);
  const content = await loadContent(trainNo); // same cached result as the metadata

  return (
    <div className="mx-auto max-w-3xl p-4 pb-24">
      <Suspense fallback={<JourneySkeleton />}>
        <TrainDetails params={params} />
      </Suspense>
      <TrainContent trainNo={trainNo} trainName={trainName} page={content} />
    </div>
  );
}
