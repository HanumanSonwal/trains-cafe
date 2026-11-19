import { JourneySkeleton } from "@/app/componants/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <JourneySkeleton />
    </div>
  );
}
