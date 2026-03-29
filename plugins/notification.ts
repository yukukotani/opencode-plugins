import type { Plugin, PluginInput } from "@opencode-ai/plugin";
import type { Session } from "@opencode-ai/sdk/v2";

export const NotificationPlugin: Plugin = async ({
  project,
  client,
  $,
  directory,
  worktree,
}) => {
  return {
    "tool.execute.before": async (input, { args }) => {
      if (input.tool === "question") {
        await notify({
          client,
          $,
          sessionID: input.sessionID,
          body:
            args.questions?.at(0)?.question ?? "The assistant has a question",
        });
      }
    },
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await notify({
          client,
          $,
          sessionID: event.properties.sessionID,
          body: "The task is finished",
        });
      }
    },
  };
};

async function notify({
  client,
  $,
  sessionID,
  body,
}: {
  client: PluginInput["client"];
  $: PluginInput["$"];
  sessionID: string;
  body: string;
}) {
  const session = await getSession(client, sessionID);
  const isChild = await isChildSession(session);
  if (isChild) {
    return;
  }

  const title = session.directory.split("/").pop() || "Unknown";
  await $`cmux notify --title "${title}" --subtitle "${session.title}" --body "${body}"`.nothrow();
  await $`afplay /System/Library/Sounds/Funk.aiff`;
}

async function getSession(client: PluginInput["client"], sessionId: string) {
  const { data: session } = await client.session.get({
    path: { id: sessionId },
  });

  if (!session) {
    throw new Error(`Session with ID ${sessionId} not found`);
  }

  return session;
}

async function isChildSession(session: Session) {
  return session?.parentID != null;
}
