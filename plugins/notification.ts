import type { Plugin } from "@opencode-ai/plugin";

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
        await $`afplay /System/Library/Sounds/Funk.aiff'`;
      }
    },
  };
};
