import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { codeAssistant, testHello } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    codeAssistant,
    testHello,
  ],
  streaming: false, // Add this to prevent streaming issues
});