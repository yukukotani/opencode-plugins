import type { Plugin, PluginInput } from "@opencode-ai/plugin";
import type { Session } from "@opencode-ai/sdk";

export const NotificationPlugin: Plugin = async ({
  project,
  client,
  $,
  directory,
  worktree,
}) => {
  return {
    event: async ({ event }) => {
      // Send notification on session completion
      if (event.type === "session.idle") {
        const session = await getSession(client, event.properties.sessionID);
        const isChild = await isChildSession(session);
        if (isChild) {
          return;
        }

        const title = session.directory.split("/").pop() || "Unknown";
        await $`cmux notify --title "${title}" --subtitle "${session.title}" --body "The task is finished"`.nothrow();
        await $`afplay /System/Library/Sounds/Funk.aiff`;
      }
    },
  };
};

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
