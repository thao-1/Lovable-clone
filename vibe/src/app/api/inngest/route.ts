import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { codeAssistant } from "../../../inngest/functions";

// Create a serve handler that exposes available functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [codeAssistant],
});