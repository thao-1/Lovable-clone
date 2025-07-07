import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter";
import { openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";

import { PROMPT } from "@/prompt";
import { inngest } from "./client";

// Helper to extract last assistant message text
function lastAssistantTextMessageContent(result: any) {
  if (!result || !result.messages) return null;
  const messages = result.messages;
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role === "assistant" && typeof message.content === "string") {
      return message.content;
    }
  }
  return null;
}

// Helper: create the code agent (extract agent creation outside main handler)
const createCodeAgent = (sandboxId: string) => {
  return createAgent({
    name: "code-agent",
    description: "An expert coding agent",
    system: PROMPT,
    model: openai({
      model: "gpt-4o",
      defaultParameters: { temperature: 0.1 },
    }),
    tools: [
      createTool({
        name: "terminal",
        description: "Use the terminal to run commands",
        parameters: z.object({ command: z.string() }),
        handler: async ({ command }) => {
          const sandbox = await Sandbox.connect(sandboxId);
          const process = await sandbox.process.start(command);
          const result = await process.wait();
          return result.stdout || result.stderr;
        },
      }),
      createTool({
        name: "createOrUpdateFiles",
        description: "Create or update files in the sandbox",
        parameters: z.object({
          files: z.array(
            z.object({
              path: z.string(),
              content: z.string(),
            })
          ),
        }),
        handler: async ({ files }) => {
          const sandbox = await Sandbox.connect(sandboxId);
          await Promise.all(
            files.map((file) => sandbox.filesystem.write(file.path, file.content))
          );
          return `Created/updated ${files.length} files`;
        },
      }),
    ],
    lifecycle: {
      onResponse: async ({ result, network }) => {
        const lastAssistantMessageText = lastAssistantTextMessageContent(result);
        if (lastAssistantMessageText && network) {
          if (lastAssistantMessageText.includes("<task_summary>")) {
            network.state.data.summary = lastAssistantMessageText;
          }
        }
        return result;
      },
    },
  });
};

// Helper async function: run the agent network
async function runAgentNetwork(
  sandboxId: string,
  prompt: string
) {
  const agent = createCodeAgent(sandboxId);
  const network = createNetwork({
    name: "coding-agent-network",
    agents: [agent],
    maxIter: 15,
  });
  return await network.run(prompt);
}

// Helper async function: start dev server inside sandbox and wait a bit
async function startDevServer(sandbox: Awaited<ReturnType<typeof Sandbox.create>>) {
  const process = await sandbox.process.start("npm run dev");
  // Wait 5 seconds for server to start — adjust as needed
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return process;
}

export const codeAssistant = inngest.createFunction(
  { id: "code-assistant" },
  { event: "assistant/code" },
  async ({ event, step }) => {
    // 1. Create sandbox and get sandboxId
    const sandbox = await step.run("create-sandbox", async () => {
      return await Sandbox.create("vibe-nextjs-thao");
    });

    try {
      // 2. Run agent network to process prompt
      const result = await step.run("run-agent-network", async () => {
        return await runAgentNetwork(sandbox.sandboxId, event.data.prompt);
      });

      // 3. Start dev server in sandbox
      await step.run("start-dev-server", async () => {
        return await startDevServer(sandbox);
      });

      // 4. Get sandbox URL on port 3000
      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const connected = await Sandbox.connect(sandbox.sandboxId);
        const host = await connected.getHost(3000);
        return `https://${host}`;
      });

      return {
        success: true,
        sandboxUrl,
        result: result.output,
        files: result.state?.data?.files || [],
        summary: result.state?.data?.summary || null,
      };
    } catch (error) {
      console.error("Code assistant error:", error);
      throw error;
    } finally {
      try {
        await sandbox.close();
      } catch (err) {
        console.warn("Failed to cleanup sandbox:", err);
      }
    }
  }
);

export const testHello = inngest.createFunction(
  { id: "test-hello" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log("Test function triggered!", event.data);

    // 1. Create sandbox and get sandboxId
    const sandboxId = await step.run("create-sandbox", async () => {
      const sandboxInstance = await Sandbox.create("vibe-nextjs-thao");
      return sandboxInstance.sandboxId;
    });

    // 2. Connect and create calculator file
    await step.run("create-calculator-file", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Calculator</title></head>
        <body>
          <h1>Simple Calculator</h1>
          <input id="a" type="number"> +
          <input id="b" type="number">
          <button onclick="calc()">=</button>
          <span id="result"></span>
          <script>
            function calc() {
              const a = parseFloat(document.getElementById('a').value);
              const b = parseFloat(document.getElementById('b').value);
              document.getElementById('result').innerText = a + b;
            }
          </script>
        </body>
        </html>
      `;
      await sandbox.filesystem.write("index.html", html);
    });

    // 3. Start server in sandbox
    await step.run("start-server", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const process = await sandbox.process.start("npx serve -l 3000");
      await new Promise((r) => setTimeout(r, 3000)); // Wait for server to start
    });

    // 4. Get sandbox URL
    const sandboxUrl = await step.run("get-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const host = await sandbox.getHost(3000);
      return `https://${host}`;
    });

    // 5. Return result
    const result = await step.run("return-result", async () => {
      return {
        message: `Here is your live calculator, ${event.data.name}!`,
        sandboxUrl,
      };
    });

    // 6. Cleanup sandbox (optional)
    await step.run("cleanup-sandbox", async () => {
      try {
        const sandbox = await Sandbox.connect(sandboxId);
        await sandbox.close();
      } catch (err) {
        console.warn("Sandbox cleanup failed:", err);
      }
    });

    return result;
  }
);
