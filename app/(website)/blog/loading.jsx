import { CardGridSkeleton } from "@/app/componants/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl p-4">
      <CardGridSkeleton count={4} />
    </div>
  );
}
