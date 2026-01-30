import { FormSkeleton } from "@/components/ui/dashboard-skeletons";
import { NavHeader } from "@/components/dashboard/nav-header";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <FormSkeleton />
      </main>
    </div>
  );
}
