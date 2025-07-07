// src/app/page.tsx
"use client";

import { useState } from "react";  // Added this import
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [value, setValue] = useState("");
  const invoke = trpc.invoke.useMutation({
    onSuccess: () => {
      toast.success("Background job invoked successfully!");
    },
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your prompt"
        className="mb-4"
      />
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ value: value, name: "Thao" })}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {invoke.isPending ? "Sending..." : "Invoke Background Job"}
      </Button>
    </div>
  );
};

export default Page;