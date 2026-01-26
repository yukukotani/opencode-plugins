import type { Plugin, PluginInput } from "@opencode-ai/plugin";

export const NotificationPlugin: Plugin = async ({
  project,
  client,
  $,
  directory,
  worktree,
}) => {
  console.log("NotificationPlugin initialized!");
  return {
    event: async ({ event }) => {
      // Send notification on session completion
      if (event.type === "session.idle") {
        const isChild = await isChildSession(
          client,
          event.properties.sessionID,
        );
        if (isChild) {
          return;
        }

        await $`afplay /System/Library/Sounds/Funk.aiff'`;
      }
    },
  };
};

async function isChildSession(
  client: PluginInput["client"],
  sessionId: string,
) {
  const { data: session } = await client.session.get({
    path: { id: sessionId },
  });
  return session?.parentID !== null;
}
