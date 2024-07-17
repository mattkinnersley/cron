import { youtube } from "@googleapis/youtube";
import { Resource } from "sst";
const youtubeClient = youtube({
  version: "v3",
  auth: Resource.GoogleAPIKey.value,
});
export async function handler() {
  console.log("Hello from cron!");
  const channel = await youtubeClient.channels.list({
    part: ["statistics"],
    forHandle: process.env.CHANNEL_HANDLE,
  });
  const stats = channel.data.items?.[0].statistics;
  console.log(stats?.subscriberCount);
}
