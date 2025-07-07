import { EventSchemas, Inngest } from "inngest";
import { z } from "zod";

// Define your event schemas
const schemas = new EventSchemas().fromZod({
  "test/hello.world": {
    data: z.object({
      name: z.string(),
      value: z.string().optional(),
    }),
  },
  "assistant/code": {
    data: z.object({
      prompt: z.string(),
      files: z.array(z.object({
        path: z.string(),
        content: z.string(),
      })).optional(),
    }),
  },
});

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "vibe",
  schemas,
  eventKey: process.env.INNGEST_EVENT_KEY,
});