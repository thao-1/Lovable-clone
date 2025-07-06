import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape }) => shape,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;