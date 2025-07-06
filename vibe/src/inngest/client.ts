import { EventSchemas, Inngest } from "inngest";
import { z } from "zod";

const schemas = new EventSchemas().fromZod({
  "test/hello.world": {
    data: z.object({
      name: z.string(),
    }),
  },
});

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "vibe",
  schemas,
});