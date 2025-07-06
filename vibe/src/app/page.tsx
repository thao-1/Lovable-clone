// src/app/page.tsx
"use client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";

const Page = () => {
  const invoke = trpc.invoke.useMutation({
    onSuccess: () => {
      toast.success("Background job invoked successfully!");
    },
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ name: "John", text: "john@example.com" })}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {invoke.isPending ? "Sending..." : "Invoke Background Job"}
      </button>
    </div>
  );
};

export default Page;