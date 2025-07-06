import { z } from 'zod';
import { createCallerFactory, createTRPCRouter, publicProcedure } from '@/trpc/init';

export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
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

// export type definition of API
export type AppRouter = typeof appRouter;
