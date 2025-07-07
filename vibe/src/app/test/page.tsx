// src/app/test/page.tsx
"use client";

import { useState } from "react";
import { inngest } from "../../inngest/client";

export default function TestPage() {
  const triggerFunction = async () => {
    await inngest.send({
      name: "assistant/code",
      data: { prompt: "Write a simple hello world component in React" },
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Inngest Function</h1>
      <button
        onClick={triggerFunction}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Invoke Background Job
      </button>
    </div>
  );
}