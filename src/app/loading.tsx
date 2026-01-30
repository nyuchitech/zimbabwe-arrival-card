import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zim-green/10 to-zim-yellow/10">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-zim-green rounded-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
