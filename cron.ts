import { youtube } from "@googleapis/youtube";
import { Resource } from "sst";
const youtubeClient = youtube({
  version: "v3",
  auth: Resource.GoogleAPIKey.value,
});
import { Knock } from "@knocklabs/node";
const knock = new Knock(Resource.KnockAPIKey.value);

export async function handler() {
  const channel = await youtubeClient.channels.list({
    part: ["statistics"],
    forHandle: process.env.CHANNEL_HANDLE,
  });
  const stats = channel.data.items?.[0].statistics;

  if (stats) {
    const res = await knock.workflows.trigger("cron", {
      data: {
        channel_handle: process.env.CHANNEL_HANDLE,
        sub_count: stats?.subscriberCount,
      },
      actor: "user-1",
      recipients: [
        {
          id: "user-1",
          channel_data: {
            APNS_CHANNEL_ID: {
              tokens: ["apns-push-token"],
            },
          },
        },
      ],
    });

    console.log(res);
  }
}
