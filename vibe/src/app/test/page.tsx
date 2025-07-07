"use client";

import { useState } from "react";
import { inngest } from "@/inngest/client";

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const triggerFunction = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await inngest.send({
        name: "assistant/code",
        data: { 
          prompt: "Write a simple hello world component in React" 
        },
      });
      
      setResult(`Function triggered successfully! Event ID: ${response.ids[0]}`);
      console.log("Function triggered:", response);
    } catch (error) {
      console.error("Error triggering function:", error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Inngest Function</h1>
      <button
        onClick={triggerFunction}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? "Triggering..." : "Invoke Background Job"}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}