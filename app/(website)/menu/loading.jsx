import { MenuSkeleton } from "@/app/componants/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl bg-white p-4">
      <MenuSkeleton />
    </div>
  );
}
