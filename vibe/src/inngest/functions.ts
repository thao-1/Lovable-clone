import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event }) => {
      return { message: `Hello ${event.name || "World"}` };
    }
  );
