import { LoadingBars } from "@/components/ui/loading-bars";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col items-center gap-2">
        <LoadingBars />
      </div>
    </div>
  );
}