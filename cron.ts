import { youtube } from "@googleapis/youtube";
import { Resource } from "sst";
const youtubeClient = youtube({
  version: "v3",
  auth: Resource.GoogleAPIKey.value,
});
import { sendEmail } from "./email";
import { Stat } from "./dynamo";

export async function handler() {
  if (!process.env.CHANNEL_HANDLE || !process.env.TO_ADDRESS) {
    return null;
  }
  const channel = await youtubeClient.channels.list({
    part: ["statistics"],
    forHandle: process.env.CHANNEL_HANDLE,
  });
  const stats = channel.data.items?.[0].statistics;

  if (stats && stats.subscriberCount) {
    const statName = "subscribers";
    const platform = "youtube";
    const { data: getStatData } = await Stat.get({
      handle: process.env.CHANNEL_HANDLE,
      platform,
      statName,
    });

    console.log({ getStatData });

    await Stat.upsert({
      handle: process.env.CHANNEL_HANDLE,
      platform,
      statName,
      statCount: stats.subscriberCount,
    });
    if (getStatData) {
      const numberFormat = new Intl.NumberFormat("en-UK");

      const subCount = Number(stats.subscriberCount);
      const lastSubCount = Number(getStatData.statCount);
      const currentMilestone = Math.floor(subCount / 100);
      const lastMilestone = Math.floor(lastSubCount / 100);

      console.log({ subCount, lastSubCount, currentMilestone, lastMilestone });

      if (currentMilestone > lastMilestone) {
        console.log(`Sending email to ${process.env.TO_ADDRESS}`);
        await sendEmail({
          to: Resource.Email.sender,
          from: {
            name: "Matt Kinnersley",
            address: Resource.Email.sender,
          },
          subject: `@${process.env.CHANNEL_HANDLE} stats`,
          body: {
            html: `
          <h1>@${process.env.CHANNEL_HANDLE} subscribers</h1>
          <ul>
            <li>Subscribers: ${numberFormat.format(subCount)}</li>
          </ul>
        `,
            text: `
          @${process.env.CHANNEL_HANDLE} subscribers
          Subscribers: ${numberFormat.format(subCount)}
        `,
          },
        });
      }
    }
  }
}
