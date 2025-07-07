// src/app/test/page.tsx
"use client";

import { useState } from "react";
import { inngest } from "../../inngest/client";

export default function TestPage() {
  const [output, setOutput] = useState<string | null>(null);
  const [sandboxUrl, setSandboxUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const triggerFunction = async () => {
    setIsLoading(true);
    setOutput(null);
    setSandboxUrl(null);

    try {
      const result = await inngest.send({
        name: "test/hello.world",
        data: { name: "Test User" },
      });
      // Assuming the function returns the output and sandboxUrl
      // You might need to poll for the result if the function is long-running
      // For now, we'll assume a direct response for simplicity
      // This part needs to be adapted based on how you get the function's result
      console.log("Function triggered:", result);
      alert("Function triggered successfully! Check the console for the result.");
    } catch (error) {
      console.error("Error triggering function:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Inngest Function</h1>
      <button
        onClick={triggerFunction}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? "Triggering..." : "Trigger Hello World"}
      </button>
      {output && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Output:</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2">{output}</pre>
        </div>
      )}
      {sandboxUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Sandbox URL:</h2>
          <a
            href={sandboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {sandboxUrl}
          </a>
        </div>
      )}
    </div>
  );
}