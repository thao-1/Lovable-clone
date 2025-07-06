import { z } from 'zod';
import { createCallerFactory, createTRPCRouter, publicProcedure } from '@/trpc/init';

// Import the inngest client
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  // Changed from baseProcedure to publicProcedure
  invoke: publicProcedure
    .input(z.object({ 
      name: z.string(),
      text: z.string() 
    }))
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: { email: input.text, name: input.name },
      });
      return {
        ok: "success"
      };
    }),

  createAI: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        aiResponse: `AI response for: ${input.text}`,
      };
    }),
});

// Export the router types
export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
