// src/app/test/page.tsx
"use client";

import { inngest } from "@/inngest/client";

export default function TestPage() {
  const triggerFunction = async () => {
    try {
      const result = await inngest.send({
        name: "test/hello.world",
        data: { name: "Test User" },
      });
      console.log("Function triggered:", result);
      alert("Function triggered successfully!");
    } catch (error) {
      console.error("Error triggering function:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Inngest Function</h1>
      <button
        onClick={triggerFunction}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Trigger Hello World
      </button>
    </div>
  );
}