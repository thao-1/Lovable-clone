// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { helloWorld } from "../../../inngest/functions";

// This will automatically handle all HTTP methods
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});