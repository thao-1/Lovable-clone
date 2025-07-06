import { headers } from 'next/headers';

import { appRouter } from '@/trpc/routers/_app';
import { createTRPCContext } from '@/trpc/init';

// This is a React Server Component, which can be async.
const Page = async () => {
  // We can use the `headers` function to get the request headers.
  const heads = await headers();
  const context = createTRPCContext({
    headers: new Headers(heads),
  });

  // Create a caller for the tRPC API.
  const caller = appRouter.createCaller(context);

  // Call the procedure directly from the server.
  const { aiResponse } = await caller.createAI({ text: 'from a Server Component' });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">tRPC Data from Server Component</h1>
      <p className="mt-4 rounded-md bg-gray-100 p-4 font-mono">{aiResponse}</p>
    </main>
  );
};

export default Page;